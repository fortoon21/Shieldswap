// SPDX-License-Identifier: MIT
pragma solidity 0.8.15;

import "@openzeppelin/contracts/interfaces/IERC20Metadata.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol";

import "./intf/IUniswapV2PoolInfoViewer.sol";

/*
 * @dev: for test only
 */
import "hardhat/console.sol";

contract UniswapV2Viewer is IUniswapV2PoolInfoViewer {
  /*
   * @TODO: need to check this fee is compartible to our service, since 0.3 is 3000 for uniswap v3, so I guess 300 does not work
   */
  uint64 public constant FEE = 300;

  function getPoolInfo(address factory, address pool) public view override returns (UniswapV2PoolInfo memory) {
    IUniswapV2Factory uniswapV2Factory = IUniswapV2Factory(factory);
    IUniswapV2Pair uniswapV2Pair = IUniswapV2Pair(pool);
    address[] memory tokenList = new address[](2);
    tokenList[0] = uniswapV2Pair.token0();
    tokenList[1] = uniswapV2Pair.token1();
    uint256[] memory tokenBalances = new uint256[](2);
    (tokenBalances[0], tokenBalances[1], ) = uniswapV2Pair.getReserves();
    uint64[] memory fees = new uint64[](1);
    fees[0] = FEE;
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
