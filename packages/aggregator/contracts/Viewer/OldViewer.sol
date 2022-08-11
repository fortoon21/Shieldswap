// SPDX-License-Identifier: MIT
pragma solidity 0.8.15;

import "@openzeppelin/contracts/interfaces/IERC20Metadata.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol";

import "./TokenViewer.sol";

/*
 * @dev: for test only
 */
import "hardhat/console.sol";

contract OldViewer is TokenViewer {
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

  IUniswapV2Factory public uniswapV2Factory;

  constructor(address factory) {
    uniswapV2Factory = IUniswapV2Factory(factory);
  }

  function getPoolsLength() public view returns (uint256) {
    uint256 pairsLength = uniswapV2Factory.allPairsLength();
    return pairsLength;
  }

  function getPoolAddressByIndex(uint256 index) public view returns (address) {
    return uniswapV2Factory.allPairs(index);
  }

  function getPoolInfo(address pool) public view returns (UniswapV2PoolInfo memory) {
    IUniswapV2Pair uniswapV2Pair = IUniswapV2Pair(pool);
    address[] memory tokenList = new address[](2);
    tokenList[0] = uniswapV2Pair.token0();
    tokenList[1] = uniswapV2Pair.token1();
    uint256[] memory tokenBalances = new uint256[](2);
    (tokenBalances[0], tokenBalances[1], ) = uniswapV2Pair.getReserves();
    uint64[] memory fees = new uint64[](1);
    fees[0] = 300;
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
