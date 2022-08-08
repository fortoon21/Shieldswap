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

    function pools(address factory) external view virtual override returns (address[] memory) {
        IUniswapV2Factory uniswapV2Factory = IUniswapV2Factory(factory);
        uint256 pairsLength = _getpairsLength(uniswapV2Factory);
        address[] memory poolAddresses = new address[](pairsLength);
        for (uint256 i = 0; i < pairsLength; i++) {
            poolAddresses[i] = uniswapV2Factory.allPairs(i);
        }
        return poolAddresses;
    }

    function tokenInfo(address token) external view virtual override returns (StructLib.TokenInfo memory) {
        StructLib.TokenInfo memory tokenInfo = StructLib.TokenInfo(
            token,
            IERC20Metadata(token).decimals(),
            IERC20Metadata(token).name(),
            IERC20Metadata(token).symbol()
        );
        return tokenInfo;
    }

    function tokenInfos(address factory) external view override returns (StructLib.TokenInfo[] memory) {
        IUniswapV2Factory uniswapV2Factory = IUniswapV2Factory(factory);
        uint256 pairsLength = _getpairsLength(uniswapV2Factory);
        uint256 tokenNum;
        address[] memory keys = new address[](pairsLength * 2);
        uint16[] memory flags = new uint16[](pairsLength * 2);
        StructLib.TokenInfo[] memory tokenInfo = new StructLib.TokenInfo[](pairsLength * 2);
        for (uint256 i = 0; i < pairsLength; i++) {
            IUniswapV2Pair uniswapV2Pair = IUniswapV2Pair(uniswapV2Factory.allPairs(i));
            address token0 = uniswapV2Pair.token0();
            address token1 = uniswapV2Pair.token1();
            if (token0 != address(0)) {
                uint16 flag;
                for (uint256 j; j < i * 2; j++) {
                    if (keys[j] == token0) {
                        flag = flag + flags[j];
                    }
                    if (flag == 1) break;
                }
                if (flag == 0) {
                    keys[i * 2] = token0;
                    flags[i * 2] = 1;
                    tokenInfo[i * 2] = this.tokenInfo(token0);
                    tokenNum = tokenNum + 1;
                }
            }
            if (token1 != address(0)) {
                uint16 flag;
                for (uint256 j; j < i * 2; j++) {
                    if (keys[j] == token1) {
                        flag = flag + flags[j];
                    }
                    if (flag == 1) break;
                }

                if (flag == 0) {
                    keys[i * 2 + 1] = token1;
                    flags[i * 2 + 1] = 1;
                    tokenInfo[i * 2 + 1] = this.tokenInfo(token1);
                    tokenNum = tokenNum + 1;
                }
            }
        }

        StructLib.TokenInfo[] memory Tokens = new StructLib.TokenInfo[](tokenNum);

        uint256 idx;
        for (uint256 i; idx < tokenNum; i++) {
            if (flags[i] == 1) {
                Tokens[idx] = tokenInfo[i];
                idx = idx + 1;
            }
        }
        return Tokens;
    }  

    function poolInfo(address pool) external view override returns (StructLib.UniswapV2PoolInfo memory) {
        IUniswapV2Pair uniswapV2Pair = IUniswapV2Pair(pool);
        address[] memory tokenList = new address[](2);
        (tokenList[0], tokenList[1]) = _getPairsTokens(uniswapV2Pair);
        uint256[] memory tokenBalances = new uint256[](2);
        (uint112 token0Balance, uint112 token1Balance, ) = uniswapV2Pair.getReserves();
        tokenBalances[0] = uint256(token0Balance);
        tokenBalances[1] = uint256(token1Balance);
        uint64[] memory fees = new uint64[](1);
        fees[0] = ConstantLib.fee;
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

    function poolInfos(address factory) external view override returns (StructLib.UniswapV2PoolInfo[] memory) {
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
