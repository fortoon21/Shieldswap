// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.15;

import {IApproveProxy} from "../ApproveProxy.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IWETH} from "../../intf/IWETH.sol";
import {SafeMath} from "../../lib/SafeMath.sol";
import {Withdrawable} from "../../lib/Withdrawable.sol";
import {UniERC20} from "../../lib/UniERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import {IRouterAdapter} from "../intf/IRouterAdapter.sol";
import {FlashLoanReceiverBaseV2} from "./FlashLoanReceiverBaseV2.sol";
import {ILendingPoolAddressesProviderV2} from "../intf/ILendingPoolAddressesProviderV2.sol";
import {ILendingPoolV2} from "../intf/ILendingPoolV2.sol";

/**
 * @title RouteProxy
 * @author fortoon21
 *
 * @notice Split trading
 * Need to wrap matic address in the following pool convention
 */
contract RouteProxy is FlashLoanReceiverBaseV2, Withdrawable {
    using SafeMath for uint256;
    using UniERC20 for IERC20;

    // ============ Storage ============

    address constant _ETH_ADDRESS_ = 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE;
    address constant _WMATIC_ADDRESS_=0xb685400156cF3CBE8725958DeAA61436727A30c3;
    address public immutable _APPROVE_PROXY_;

    struct PathInfo {
        address fromToken;
        uint256 amountIn;
        address toToken;
        address to;
        address adapter;
        address pool;
    }

    struct WeightPathInfo {
        address fromToken;
        uint256 amountIn;
        address toToken;
        address to;
        uint256[] weights;
        address[] adapters;
        address[] pools;
    }

    struct LinearWeightPathInfo {
        address fromToken;
        uint256 amountIn;
        address toToken;
        address to;
        uint256[] weights;
        WeightPathInfo[][] weightPathInfos;
    }

    struct FlashLoanDes {
        address asset;
        uint256 amountIn;
        PathInfo[] pathInfos;
    }

    // ============ Events ============

    event OrderHistory(
        address fromToken,
        address toToken,
        address sender,
        uint256 fromAmount,
        uint256 returnAmount
    );

    // ============ Modifiers ============

    modifier checkDeadline(uint256 deadLine) {
        require(deadLine >= block.timestamp, "RouteProxy: EXPIRED");
        _;
    }

    fallback() external payable {}

    constructor(address approveProxy, address _addressProvider)
        FlashLoanReceiverBaseV2(_addressProvider)
    {
        _APPROVE_PROXY_ = approveProxy;
    }

    /**
     * @dev This function must be called only be the LENDING_POOL and takes care of repaying
     * active debt positions, migrating collateral and incurring new V2 debt token debt.
     *
     * @param assets The array of flash loaned assets used to repay debts.
     * @param amounts The array of flash loaned asset amounts used to repay debts.
     * @param premiums The array of premiums incurred as additional debts.
     * @param initiator The address that initiated the flash loan, unused.
     * @param params The byte array containing, in this case, the arrays of aTokens and aTokenAmounts.
     */
    function executeOperation(
        address[] calldata assets,
        uint256[] calldata amounts,
        uint256[] calldata premiums,
        address initiator,
        bytes calldata params
    ) external override returns (bool) {
        //
        // This contract now has the funds requested.
        // Your logic goes here.
        //

        for(uint256 i; i<assets.length;i++){
          if(assets[i]==_WMATIC_ADDRESS_){
            IWETH(_WMATIC_ADDRESS_).withdraw(amounts[i]);
          }
        }

        PathInfo[] memory pathInfos = abi.decode(params, (PathInfo[]));
        pathInfos[pathInfos.length - 1].to = address(this);
        _multiHopSingleSwap(pathInfos);
        

        // At the end of your logic above, this contract owes
        // the flashloaned amounts + premiums.
        // Therefore ensure your contract has enough to repay
        // these amounts.

        // Approve the LendingPool contract allowance to *pull* the owed amount
        for (uint256 i = 0; i < assets.length; i++) {
            uint256 amountOwing = amounts[i].add(premiums[i]);
            if(assets[i]==_WMATIC_ADDRESS_){
              IWETH(_WMATIC_ADDRESS_).deposit{value:amountOwing}();
            }
            
            IERC20(assets[i]).approve(address(LENDING_POOL), amountOwing);
        }

        return true;
    }

    function _flashloan(
        address[] memory assets,
        uint256[] memory amounts,
        bytes memory params
    ) internal {
        address receiverAddress = address(this);
        address[] memory _assets=new address [](assets.length);
        for(uint256 i; i<assets.length;i++){
          _assets[i]=assets[i]==address(0)?_WMATIC_ADDRESS_: asset[i];
        }

        address onBehalfOf = address(this);
        uint16 referralCode = 0;

        uint256[] memory modes = new uint256[](assets.length);

        // 0 = no debt (flash), 1 = stable, 2 = variable
        for (uint256 i = 0; i < assets.length; i++) {
            modes[i] = 0;
        }

        LENDING_POOL.flashLoan(
            receiverAddress,
            _assets,
            amounts,
            modes,
            onBehalfOf,
            params,
            referralCode
        );
    }

    /*
     *  Flash multiple assets
     */
    function flashloan(address[] memory assets, uint256[] memory amounts) public onlyOwner {
        _flashloan(assets, amounts, "");
    }

    /*
     *  Flash loan 1000000000000000000 wei (1 ether) worth of `_asset`
     */
    function _flashloan(
        address _asset,
        uint256 amount,
        bytes memory data
    ) internal {
        address[] memory assets = new address[](1);
        assets[0] = _asset;

        uint256[] memory amounts = new uint256[](1);
        amounts[0] = amount;

        _flashloan(assets, amounts, data);
    }

    function _multiHopSingleSwap(PathInfo[] memory pathInfos)
        internal
        returns (uint256[] memory outputs)
    {
        uint256 pathInfoNum = pathInfos.length;
        outputs = _calcMultiHopSingleSwap(pathInfos);
        address from;
        address to;
        for (uint256 i = 1; i < pathInfoNum; i++) {
            // define midtoken address, ETH -> WETH address
            if (pathInfos[i - 1].fromToken == address(0)) {
                _checkDeposit(pathInfos[i - 1].adapter, pathInfos[i - 1].pool, outputs[i - 1]);
            }

            from = pathInfos[i - 1].fromToken == address(0)
                ? _convertToMatic(pathInfos[i - 1].adapter, pathInfos[i - 1].pool)
                : pathInfos[i - 1].fromToken;

            to = pathInfos[i - 1].toToken == address(0)
                ? _convertToMatic(pathInfos[i - 1].adapter, pathInfos[i - 1].pool)
                : pathInfos[i - 1].toToken;

            IERC20(from).transfer(pathInfos[i - 1].pool, outputs[i - 1]);

            IRouterAdapter(pathInfos[i - 1].adapter).swapExactIn(
                from,
                outputs[i - 1],
                to,
                pathInfos[i - 1].pool,
                address(this)
            );
            if (pathInfos[i - 1].toToken == address(0)) {
                _checkWithdraw(pathInfos[i - 1].adapter, pathInfos[i - 1].pool, outputs[i]);
            }
        }

        from = pathInfos[pathInfoNum - 1].fromToken == address(0)
            ? _convertToMatic(pathInfos[pathInfoNum - 1].adapter, pathInfos[pathInfoNum - 1].pool)
            : pathInfos[pathInfoNum - 1].fromToken;
        to = pathInfos[pathInfoNum - 1].toToken == address(0)
            ? _convertToMatic(pathInfos[pathInfoNum - 1].adapter, pathInfos[pathInfoNum - 1].pool)
            : pathInfos[pathInfoNum - 1].toToken;

        if (pathInfos[pathInfoNum - 1].fromToken == address(0)) {
            _checkDeposit(
                pathInfos[pathInfoNum - 1].adapter,
                pathInfos[pathInfoNum - 1].pool,
                outputs[pathInfoNum]
            );
        }

        IERC20(from).transfer(pathInfos[pathInfoNum - 1].pool, outputs[pathInfoNum - 1]);

        IRouterAdapter(pathInfos[pathInfoNum - 1].adapter).swapExactIn(
            from,
            outputs[pathInfoNum - 1],
            to,
            pathInfos[pathInfoNum - 1].pool,
            pathInfos[pathInfoNum - 1].to
        );

        _checkWithdraw(
            pathInfos[pathInfoNum - 1].adapter,
            pathInfos[pathInfoNum - 1].toToken,
            outputs[pathInfoNum]
        );
    }

    function _convertToMatic(address adapter, address pool) internal returns (address) {
        return IRouterAdapter(adapter).getWMatic(IRouterAdapter(adapter).factory(pool));
    }

    function _calcMultiHopSingleSwap(PathInfo[] memory pathInfos)
        internal
        returns (uint256[] memory outputs)
    {
        uint256 pathInfoNum = pathInfos.length;
        outputs = new uint256[](pathInfoNum + 1);
        outputs[0] = pathInfos[0].amountIn;

        uint256 amountIn;

        for (uint256 i = 1; i < pathInfoNum; i++) {
            // define midtoken address, ETH -> WETH address
            require(
                pathInfos[i - 1].toToken == pathInfos[i].fromToken,
                "Not valid multihopSingleSwap Path"
            );
            require(pathInfos[i - 1].fromToken != pathInfos[i - 1].toToken, "from to are the same");
            amountIn = outputs[i - 1];

            outputs[i] = IRouterAdapter(pathInfos[i - 1].adapter).getAmountOut(
                pathInfos[i - 1].fromToken == address(0)
                    ? _convertToMatic(pathInfos[i - 1].adapter, pathInfos[i - 1].pool)
                    : pathInfos[i - 1].fromToken,
                amountIn,
                pathInfos[i - 1].toToken == address(0)
                    ? _convertToMatic(pathInfos[i - 1].adapter, pathInfos[i - 1].pool)
                    : pathInfos[i - 1].toToken,
                pathInfos[i - 1].pool
            );
        }

        require(
            pathInfos[pathInfoNum - 1].fromToken != pathInfos[pathInfoNum - 1].toToken,
            "from to are the same"
        );
        amountIn = outputs[pathInfoNum - 1];

        outputs[pathInfoNum] = IRouterAdapter(pathInfos[pathInfoNum - 1].adapter).getAmountOut(
            pathInfos[pathInfoNum - 1].fromToken == address(0)
                ? _convertToMatic(
                    pathInfos[pathInfoNum - 1].adapter,
                    pathInfos[pathInfoNum - 1].pool
                )
                : pathInfos[pathInfoNum - 1].fromToken,
            amountIn,
            pathInfos[pathInfoNum - 1].toToken == address(0)
                ? _convertToMatic(
                    pathInfos[pathInfoNum - 1].adapter,
                    pathInfos[pathInfoNum - 1].pool
                )
                : pathInfos[pathInfoNum - 1].toToken,
            pathInfos[pathInfoNum - 1].pool
        );
    }

    function _singleHopMultiSwap(WeightPathInfo memory weightPathInfo)
        internal
        returns (uint256 output)
    {
        require(
            weightPathInfo.weights.length == weightPathInfo.adapters.length &&
                weightPathInfo.weights.length == weightPathInfo.pools.length,
            "Invalid input length"
        );
        uint256 totalWeight;
        uint256 poolNum = weightPathInfo.weights.length;
        for (uint256 i; i < poolNum; i++) {
            totalWeight += weightPathInfo.weights[i];
        }

        uint256 rest = weightPathInfo.amountIn;
        address from;
        address to;
        for (uint256 i; i < poolNum; i++) {
            uint256 partAmountIn = i == poolNum - 1
                ? rest
                : weightPathInfo.amountIn.mul(weightPathInfo.weights[i]).div(totalWeight);
            rest = rest.sub(partAmountIn);
            if (weightPathInfo.fromToken == address(0)) {
                _checkDeposit(weightPathInfo.adapters[i], weightPathInfo.pools[i], partAmountIn);
            }
            from = weightPathInfo.fromToken == address(0)
                ? _convertToMatic(weightPathInfo.adapters[i], weightPathInfo.pools[i])
                : weightPathInfo.fromToken;
            IERC20(from).transfer(weightPathInfo.pools[i], partAmountIn);
            to = weightPathInfo.toToken == address(0)
                ? _convertToMatic(weightPathInfo.adapters[i], weightPathInfo.pools[i])
                : weightPathInfo.toToken;
            uint256 _output = IRouterAdapter(weightPathInfo.adapters[i]).swapExactIn(
                from,
                partAmountIn,
                to,
                weightPathInfo.pools[i],
                weightPathInfo.to
            );
            if (weightPathInfo.toToken == address(0)) {
                _checkWithdraw(weightPathInfo.adapters[i], weightPathInfo.pools[i], _output);
            }
            output += _output;
        }
    }

    function _calcSingleHopMultiSwap(WeightPathInfo memory weightPathInfo)
        internal
        returns (uint256 output)
    {
        require(
            weightPathInfo.weights.length == weightPathInfo.adapters.length &&
                weightPathInfo.weights.length == weightPathInfo.pools.length,
            "Invalid input length"
        );

        uint256 totalWeight;
        uint256 poolNum = weightPathInfo.weights.length;
        for (uint256 i; i < poolNum; i++) {
            totalWeight += weightPathInfo.weights[i];
        }

        uint256 rest = weightPathInfo.amountIn;
        for (uint256 i; i < poolNum; i++) {
            uint256 partAmountIn = i == poolNum - 1
                ? rest
                : weightPathInfo.amountIn.mul(weightPathInfo.weights[i]).div(totalWeight);
            rest = rest.sub(partAmountIn);

            output += IRouterAdapter(weightPathInfo.adapters[i]).getAmountOut(
                weightPathInfo.fromToken == address(0)
                    ? _convertToMatic(weightPathInfo.adapters[i], weightPathInfo.pools[i])
                    : weightPathInfo.fromToken,
                partAmountIn,
                weightPathInfo.toToken == address(0)
                    ? _convertToMatic(weightPathInfo.adapters[i], weightPathInfo.pools[i])
                    : weightPathInfo.toToken,
                weightPathInfo.pools[i]
            );
        }
    }

    function _multiHopMultiSwap(WeightPathInfo[] memory weightPathInfos)
        internal
        returns (uint256[] memory outputs)
    {
        outputs = new uint256[](weightPathInfos.length + 1);
        outputs[0] = weightPathInfos[0].amountIn;
        for (uint256 i = 1; i < weightPathInfos.length; i++) {
            require(
                weightPathInfos[i - 1].toToken == weightPathInfos[i].fromToken,
                "Not valid multihop Path"
            );
            if (i != weightPathInfos.length - 1) {
                weightPathInfos[i].to = address(this);
            }
            outputs[i] = _singleHopMultiSwap(weightPathInfos[i - 1]);
            weightPathInfos[i].amountIn = outputs[i];
        }
        outputs[outputs.length - 1] = _singleHopMultiSwap(
            weightPathInfos[weightPathInfos.length - 1]
        );
    }

    function _calcMultiHopMultiSwap(WeightPathInfo[] memory weightPathInfos)
        internal
        returns (uint256[] memory outputs)
    {
        outputs = new uint256[](weightPathInfos.length + 1);
        outputs[0] = weightPathInfos[0].amountIn;
        for (uint256 i = 1; i < weightPathInfos.length; i++) {
            require(
                weightPathInfos[i - 1].toToken == weightPathInfos[i].fromToken,
                "Not valid multihop Path"
            );
            if (i != weightPathInfos.length - 1) {
                weightPathInfos[i].to = address(this);
            }
            outputs[i] = _calcSingleHopMultiSwap(weightPathInfos[i - 1]);
            weightPathInfos[i].amountIn = outputs[i];
        }
        outputs[outputs.length - 1] = _calcSingleHopMultiSwap(
            weightPathInfos[weightPathInfos.length - 1]
        );
    }

    function _linearSplitMultiHopMultiSwap(LinearWeightPathInfo memory linearWeightPathInfo)
        internal
        returns (uint256 output)
    {
        require(
            linearWeightPathInfo.weights.length == linearWeightPathInfo.weightPathInfos.length,
            "Invalid input length"
        );
        uint256 totalWeight;
        uint256 splitNum = linearWeightPathInfo.weights.length;
        for (uint256 i; i < splitNum; i++) {
            totalWeight += linearWeightPathInfo.weights[i];
        }

        uint256 rest = linearWeightPathInfo.amountIn;
        for (uint256 i; i < splitNum; i++) {
            uint256 hopNum = linearWeightPathInfo.weightPathInfos[i].length;
            require(
                linearWeightPathInfo.weightPathInfos[i][hopNum - 1].toToken ==
                    linearWeightPathInfo.toToken,
                "Not valid linear toToken"
            );
            require(
                linearWeightPathInfo.weightPathInfos[i][0].fromToken ==
                    linearWeightPathInfo.fromToken,
                "Not valid linear fromToken"
            );

            uint256 partAmountIn = i == splitNum - 1
                ? rest
                : linearWeightPathInfo.amountIn.mul(linearWeightPathInfo.weights[i]).div(
                    totalWeight
                );
            rest = rest.sub(partAmountIn);
            linearWeightPathInfo.weightPathInfos[i][0].amountIn = partAmountIn;
            uint256[] memory outputs = _multiHopMultiSwap(linearWeightPathInfo.weightPathInfos[i]);
            output += outputs[outputs.length - 1];
        }
    }

    function _calcLinearSplitMultiHopMultiSwap(LinearWeightPathInfo memory linearWeightPathInfo)
        internal
        returns (uint256 output)
    {
        require(
            linearWeightPathInfo.weights.length == linearWeightPathInfo.weightPathInfos.length,
            "Invalid input length"
        );
        uint256 totalWeight;
        uint256 splitNum = linearWeightPathInfo.weights.length;
        for (uint256 i; i < splitNum; i++) {
            totalWeight += linearWeightPathInfo.weights[i];
        }

        uint256 rest = linearWeightPathInfo.amountIn;
        for (uint256 i; i < splitNum; i++) {
            uint256 hopNum = linearWeightPathInfo.weightPathInfos[i].length;
            require(
                linearWeightPathInfo.weightPathInfos[i][hopNum - 1].toToken ==
                    linearWeightPathInfo.toToken,
                "Not valid linear toToken"
            );
            require(
                linearWeightPathInfo.weightPathInfos[i][0].fromToken ==
                    linearWeightPathInfo.fromToken,
                "Not valid linear fromToken"
            );

            uint256 partAmountIn = i == splitNum - 1
                ? rest
                : linearWeightPathInfo.amountIn.mul(linearWeightPathInfo.weights[i]).div(
                    totalWeight
                );
            rest = rest.sub(partAmountIn);
            linearWeightPathInfo.weightPathInfos[i][0].amountIn = partAmountIn;
            uint256[] memory outputs = _calcMultiHopMultiSwap(
                linearWeightPathInfo.weightPathInfos[i]
            );
            output += outputs[outputs.length - 1];
        }
    }

    function multiHopSingleSwap(
        address fromToken,
        uint256 amountIn,
        address toToken,
        PathInfo[] calldata pathInfos
    ) public returns (uint256[] memory outputs) {
        _deposit(msg.sender, fromToken, amountIn);
        require(
            pathInfos[0].fromToken == fromToken &&
                pathInfos[0].amountIn == amountIn &&
                pathInfos[pathInfos.length - 1].toToken == toToken,
            "not same input"
        );
        return _multiHopSingleSwap(pathInfos);
    }

    function singleHopMultiSwap(
        address fromToken,
        uint256 amountIn,
        address toToken,
        WeightPathInfo calldata weightPathInfo
    ) public returns (uint256 output) {
        _deposit(msg.sender, fromToken, amountIn);
        require(
            weightPathInfo.fromToken == fromToken &&
                weightPathInfo.amountIn == amountIn &&
                weightPathInfo.toToken == toToken,
            "not same input"
        );
        return _singleHopMultiSwap(weightPathInfo);
    }

    function multiHopMultiSwap(
        address fromToken,
        uint256 amountIn,
        address toToken,
        WeightPathInfo[] calldata weightPathInfos
    ) public returns (uint256[] memory outputs) {
        _deposit(msg.sender, fromToken, amountIn);
        require(
            weightPathInfos[0].fromToken == fromToken &&
                weightPathInfos[0].amountIn == amountIn &&
                weightPathInfos[weightPathInfos.length - 1].toToken == toToken,
            "not same input"
        );
        return _multiHopMultiSwap(weightPathInfos);
    }

    function linearSplitMultiHopMultiSwap(
        address fromToken,
        uint256 amountIn,
        address toToken,
        LinearWeightPathInfo calldata linearWeightPathInfo
    ) public returns (uint256 output) {
        _deposit(msg.sender, fromToken, amountIn);
        require(
            linearWeightPathInfo.amountIn == amountIn &&
                linearWeightPathInfo.fromToken == fromToken &&
                linearWeightPathInfo.toToken == toToken,
            "not same input"
        );
        output = _linearSplitMultiHopMultiSwap(linearWeightPathInfo);
    }

    // multiswap is weighted swap for multi swap sequence

    /* 
     50%   A->B                B->C
        16% -> sushiswap    50% -> quickswap
        24% -> uniswapV3    50% -> uniswap
        60% -> uniswapV2

     50% A->C
        100% -> uniswapV2 


    calculate cyclic arbitrage
    100%  *->C->A->* if this cycle profits more than premiums of flashloan?
    executes and transfer the profits to trader

    */

    function shieldSwap(
        address fromToken,
        uint256 amountIn,
        address toToken,
        LinearWeightPathInfo memory linearWeightPathInfo,
        FlashLoanDes[] memory flashDes,
        uint256 minReturnAmount,
        uint256 deadLine
    ) external payable checkDeadline(deadLine) returns (uint256 output) {
        require(minReturnAmount > 0, "minReturn should be larger than 0");

        _deposit(msg.sender, fromToken, amountIn);
        
        require(
            linearWeightPathInfo.amountIn == amountIn &&
                linearWeightPathInfo.fromToken == fromToken &&
                linearWeightPathInfo.toToken == toToken,
            "not same input"
        );
        output = _linearSplitMultiHopMultiSwap(linearWeightPathInfo);
        

        for (uint256 i; i < flashDes.length; i++) {
            require(
                flashDes[i].pathInfos[0].amountIn == flashDes[i].amountIn,
                "flashloan amountIn not match"
            );
            require(
                flashDes[i].pathInfos[0].fromToken == flashDes[i].asset &&
                    flashDes[i].asset ==
                    flashDes[i].pathInfos[flashDes[i].pathInfos.length - 1].toToken,
                "flashloan from to assets not match"
            );
            uint256[] memory outputs = _calcMultiHopSingleSwap(flashDes[i].pathInfos);
            if (
                outputs[outputs.length - 1] >
                flashDes[i].amountIn.mul(10000 + LENDING_POOL.FLASHLOAN_PREMIUM_TOTAL()).div(10000)
            ) {
                _flashloan(
                    flashDes[i].asset,
                    flashDes[i].amountIn,
                    abi.encode(flashDes[i].pathInfos)
                );

                if (toToken == flashDes[i].asset) {
                    output += IERC20(flashDes[i].asset).uniBalanceOf(address(this));
                }
                IERC20(flashDes[i].asset).uniTransfer(
                    msg.sender,
                    IERC20(flashDes[i].asset).uniBalanceOf(address(this))
                );
            }
        }

        require(output >= minReturnAmount, "DODORouteProxy: Return amount is not enough");

        emit OrderHistory(fromToken, toToken, msg.sender, amountIn, output);
    }

    function _checkDeposit(
        address adapter,
        address pool,
        uint256 amount
    ) internal {
        address wrapped = IRouterAdapter(adapter).factoryToWMatic(
            IRouterAdapter(adapter).factory(pool)
        );
        if (wrapped == address(0)) {
            revert("No wrapped matic exists:from");
        }
        IWETH(wrapped).deposit{value: amount}();
    }

    function _checkWithdraw(
        address adapter,
        address pool,
        uint256 amount
    ) internal {
        address wrapped = IRouterAdapter(adapter).factoryToWMatic(
            IRouterAdapter(adapter).factory(pool)
        );
        if (wrapped == address(0)) {
            revert("No wrapped matic exists:to");
        }
        IWETH(wrapped).withdraw(amount);
    }

    function _deposit(
        address from,
        address token,
        uint256 amount
    ) internal {
        if (from == address(0)) {
            require(msg.value == amount, "ETH_VALUE_WRONG");
        } else {
            IApproveProxy(_APPROVE_PROXY_).claimTokens(token, from, address(this), amount);
        }
    }
}
