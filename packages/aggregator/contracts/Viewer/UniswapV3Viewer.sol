// SPDX-License-Identifier: MIT
pragma solidity 0.8.15;

import "@uniswap/v3-core/contracts/interfaces/IUniswapV3Factory.sol";
import "@uniswap/v3-core/contracts/interfaces/IUniswapV3Pool.sol";

import "./intf/IUniswapV3PoolInfoViewer.sol";

/*
 * @dev: for test only
 */
import "hardhat/console.sol";

contract UniswapV3Viewer is IUniswapV3PoolInfoViewer {
  function getPoolInfo(address factory, address pool) public view override returns (UniswapV3PoolInfo memory) {
    IUniswapV3Factory uniswapV3Factory = IUniswapV3Factory(factory);
    IUniswapV3Pool uniswapV3Pool = IUniswapV3Pool(pool);
    address[] memory tokenList = new address[](2);
    tokenList[0] = uniswapV3Pool.token0();
    tokenList[1] = uniswapV3Pool.token1();
    (
      uint160 sqrtPriceX96,
      int24 tick,
      uint16 observationIndex,
      uint16 observationCardinality,
      uint16 observationCardinalityNext,
      uint8 feeProtocol,
      bool unlocked
    ) = uniswapV3Pool.slot0();

    UniswapV3PoolInfo memory poolInfo = UniswapV3PoolInfo({
      pool: pool,
      tokenList: tokenList,
      blockTimestamp: block.timestamp,
      sqrtPriceX96: sqrtPriceX96,
      liquidity: uniswapV3Pool.liquidity(),
      fee: uniswapV3Pool.fee(),
      tick: tick,
      observationIndex: observationIndex,
      observationCardinality: observationCardinality,
      observationCardinalityNext: observationCardinalityNext,
      feeProtocol: feeProtocol,
      unlocked: unlocked
    });

    return poolInfo;
  }
}
