//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.7;

interface IUniswapV2PoolInfoViewer {
  struct UniswapV2PoolInfo {
    address pool;
    address[] tokenList;
    uint256 price;
    uint64[] protocolFees;
    uint64 fee;
  }

  function getPoolInfo(address pool) external view returns (UniswapV2PoolInfo memory);
}
