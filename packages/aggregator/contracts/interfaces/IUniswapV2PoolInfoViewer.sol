//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.7;

interface IUniswapV2PoolInfoViewer {
  struct UniswapV2PoolInfo {
    uint256 totalSupply;
    uint256[] tokenBalances;
    address pool;
    address[] tokenList;
    uint64[] fees;
    uint8 decimals;
    string name;
    string symbol;
  }

  function getPoolInfo(address factoryAddress, address pool) external view returns (UniswapV2PoolInfo memory);
}
