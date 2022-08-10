// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

import "@uniswap/v3-core/contracts/interfaces/IUniswapV3Factory.sol";
import "@uniswap/v3-core/contracts/interfaces/IUniswapV3Pool.sol";

/*
 * @dev: for test only
 */
import "hardhat/console.sol";

contract UniswapV3Viewer {
  IUniswapV3Factory public uniswapV3Factory;

  constructor(address factory) {
    uniswapV3Factory = IUniswapV3Factory(factory);
  }

  function getPrice(
    address tokenIn,
    address tokenOut,
    uint24 fee
  ) external view returns (uint256) {
    IUniswapV3Pool pool = IUniswapV3Pool(uniswapV3Factory.getPool(tokenIn, tokenOut, fee));
    (uint160 sqrtPriceX96, , , , , , ) = pool.slot0();
    uint256 price = (uint256(sqrtPriceX96) * uint256(sqrtPriceX96) * 1e18) >> (96 * 2);
    // return price - price * 1000
    return price;
  }
}
