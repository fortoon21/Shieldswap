// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

import "@openzeppelin/contracts/interfaces/IERC20Metadata.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol";

import "../interfaces/IPoolViewer.sol";
import "../interfaces/ITokenInfoViewer.sol";
import "../interfaces/IUniswapV2PoolInfoViewer.sol";
import "../lib/ConstantLib.sol";
import "../lib/StructLib.sol";
/*
* @dev: for test only
*/
import "hardhat/console.sol";

contract UniswapV2Viewer is IPoolViewer, ITokenInfoViewer, IUniswapV2PoolInfoViewer {
    /*
    * @dev: limit is set in contract level so that we can remove this later very easily
    */
    uint256 private _loopLimit;

    constructor(uint256 loopLimit) {
        _loopLimit = loopLimit;
    }

    function pools(address factory) public view virtual override returns (address[] memory) {
        IUniswapV2Factory uniswapV2Factory = IUniswapV2Factory(factory);
        uint256 pairsLength = _getpairsLength(uniswapV2Factory);
        address[] memory poolAddresses = new address[](pairsLength);
        for (uint256 i = 0; i < pairsLength; i++) {
            poolAddresses[i] = uniswapV2Factory.allPairs(i);
        }
        return poolAddresses;
    }

    function tokenInfo(address token) public view virtual override returns (StructLib.TokenInfo memory) {
        StructLib.TokenInfo memory tokenInfo = StructLib.TokenInfo(
            token,
            IERC20Metadata(token).decimals(),
            IERC20Metadata(token).name(),
            IERC20Metadata(token).symbol()
        );
        return tokenInfo;
    }

    function tokenInfos(address factory) public view override returns (StructLib.TokenInfo[] memory) {
        IUniswapV2Factory uniswapV2Factory = IUniswapV2Factory(factory);
        uint256 pairsLength = _getpairsLength(uniswapV2Factory);
        uint256 tokensLength = pairsLength * 2;
        StructLib.TokenInfo[] memory tokenInfos = new StructLib.TokenInfo[](tokensLength);
        for (uint256 i = 0; i < pairsLength; i++) {
            IUniswapV2Pair uniswapV2Pair = IUniswapV2Pair(uniswapV2Factory.allPairs(i));
            (address token0, address token1) = _getPairsTokens(uniswapV2Pair);
            tokenInfos[i] = tokenInfo(token0);
            tokenInfos[tokensLength - i - 1] = tokenInfo(token1);
        }
        return tokenInfos;
    }  

    function poolInfo(address pool) public view override returns (StructLib.UniswapV2PoolInfo memory) {
        IUniswapV2Pair uniswapV2Pair = IUniswapV2Pair(pool);
        address[] memory tokenList = new address[](2);
        (tokenList[0], tokenList[1]) = _getPairsTokens(uniswapV2Pair);
        uint256[] memory tokenBalances = new uint256[](2);
        (tokenBalances[0], tokenBalances[1], ) = uniswapV2Pair.getReserves();
        uint64[] memory fees = new uint64[](1);
        fees[0] = ConstantLib.FEE;
        StructLib.UniswapV2PoolInfo memory poolInfo = StructLib.UniswapV2PoolInfo({
            totalSupply: uniswapV2Pair.totalSupply(),
            tokenBalances: tokenBalances,
            pool: pool,
            tokenList: tokenList,
            fees: fees,
            decimals: uniswapV2Pair.decimals(),
            name: uniswapV2Pair.name(),
            symbol: uniswapV2Pair.symbol()
        });
        return poolInfo;
    }

    function poolInfos(address factory) public view override returns (StructLib.UniswapV2PoolInfo[] memory) {
        IUniswapV2Factory uniswapV2Factory = IUniswapV2Factory(factory);
        uint256 pairsLength = _getpairsLength(uniswapV2Factory);
        StructLib.UniswapV2PoolInfo[] memory uniswapV2PoolInfos = new StructLib.UniswapV2PoolInfo[](pairsLength);
        for (uint256 i = 0; i < pairsLength; i++) {
            uniswapV2PoolInfos[i] = this.poolInfo(uniswapV2Factory.allPairs(i));
        }
        return (uniswapV2PoolInfos);
    }

    /*
    * @dev: currently there are more than 4474 pools in mumbai, so this process too long time to complete
    */
    function _getpairsLength(IUniswapV2Factory uniswapV2Factory) internal view returns (uint256) {
        /*
        * @dev: this is for test only to skip long loops
        */
        uint256 pairsLength;
        if(_loopLimit > 0){
            pairsLength = _loopLimit;
        } else {
            pairsLength = uniswapV2Factory.allPairsLength();
        }
        return pairsLength;
    }

    function _getPairsTokens(IUniswapV2Pair uniswapV2Pair) internal view returns (address, address) {
        address token0 = uniswapV2Pair.token0();
        address token1 = uniswapV2Pair.token1();
        return (token0, token1);
    }

}
