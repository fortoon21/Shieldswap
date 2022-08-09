//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.7;

interface IPoolViewer {
    function getPoolsLength(address factory) external view returns (uint256);
    function getPoolAddressByIndex(address factory, uint256 index) external view returns (address);
}
