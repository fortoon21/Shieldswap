// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

import "@uniswap/v3-core/contracts/interfaces/IUniswapV3Factory.sol";
import "@uniswap/v3-core/contracts/interfaces/IUniswapV3Pool.sol";

import "../interfaces/IUniswapV3PoolInfoViewer.sol";
import "./TokenViewer.sol";

/*
 * @dev: for test only
 */
import "hardhat/console.sol";

contract UniswapV3Viewer is TokenViewer, IUniswapV3PoolInfoViewer {
  IUniswapV3Factory public uniswapV3Factory;

  constructor(address factory) {
    uniswapV3Factory = IUniswapV3Factory(factory);
  }

  function getPoolInfo(address pool) public view override returns (UniswapV3PoolInfo memory) {
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
