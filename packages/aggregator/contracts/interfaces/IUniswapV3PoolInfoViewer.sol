//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.7;

interface IUniswapV3PoolInfoViewer {
  struct UniswapV3PoolInfo {
    address pool;
    address[] tokenList;
    uint256 blockTimestamp;
    uint160 sqrtPriceX96;
    uint128 liquidity;
    uint24 fee;
    int24 tick;
    uint16 observationIndex;
    uint16 observationCardinality;
    uint16 observationCardinalityNext;
    uint8 feeProtocol;
    bool unlocked;
  }

  function getPoolInfo(address factoryAddress, address pool) external view returns (UniswapV3PoolInfo memory);
}
