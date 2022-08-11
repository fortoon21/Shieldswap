// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.15;

interface IBalancerPool {
  function swapExactAmountIn(
    address,
    uint256,
    address,
    uint256,
    uint256
  ) external returns (uint256, uint256);

  function swapExactAmountOut(
    address,
    uint256,
    address,
    uint256,
    uint256
  ) external returns (uint256, uint256);

  function calcInGivenOut(
    uint256,
    uint256,
    uint256,
    uint256,
    uint256,
    uint256
  ) external pure returns (uint256);

  function calcOutGivenIn(
    uint256,
    uint256,
    uint256,
    uint256,
    uint256,
    uint256
  ) external pure returns (uint256);

  function getDenormalizedWeight(address) external view returns (uint256);

  function getBalance(address) external view returns (uint256);

  function getSwapFee() external view returns (uint256);
}

interface IBalancerRegistry {
  function getBestPoolsWithLimit(
    address,
    address,
    uint256
  ) external view returns (address[] memory);
}
