// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.15;

interface IUniV3 {
  function swap(
    address recipient,
    bool zeroForOne,
    int256 amountSpecified,
    uint160 sqrtPriceLimitX96,
    bytes calldata data
  ) external returns (int256 amount0, int256 amount1);
}
