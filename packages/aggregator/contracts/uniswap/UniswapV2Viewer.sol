// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

import "@openzeppelin/contracts/interfaces/IERC20Metadata.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol";

import "../interfaces/IPoolViewer.sol";
import "../interfaces/IUniswapV2PoolInfoViewer.sol";
import "../lib/ConstantLib.sol";

/*
* @dev: for test only
*/
import "hardhat/console.sol";

contract UniswapV2Viewer is IPoolViewer, IUniswapV2PoolInfoViewer {
    function getPoolsLength(address factory) public view override returns (uint256) {
        IUniswapV2Factory uniswapV2Factory = IUniswapV2Factory(factory);
        uint256 pairsLength = uniswapV2Factory.allPairsLength();
        return pairsLength;
    }

    function getPoolAddressByIndex(address factory, uint256 index) public view override returns (address) {
      IUniswapV2Factory uniswapV2Factory = IUniswapV2Factory(factory);
      return uniswapV2Factory.allPairs(index);
    }

    function getPoolInfo(address pool) public view override returns (UniswapV2PoolInfo memory) {
        IUniswapV2Pair uniswapV2Pair = IUniswapV2Pair(pool);
        address[] memory tokenList = new address[](2);
        tokenList[0] = uniswapV2Pair.token0();
        tokenList[1] = uniswapV2Pair.token1();
        uint256[] memory tokenBalances = new uint256[](2);
        (tokenBalances[0], tokenBalances[1], ) = uniswapV2Pair.getReserves();
        uint64[] memory fees = new uint64[](1);
        fees[0] = ConstantLib.FEE;
        UniswapV2PoolInfo memory poolInfo = UniswapV2PoolInfo({
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
}
