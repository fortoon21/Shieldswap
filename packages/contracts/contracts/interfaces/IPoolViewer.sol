//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.7;

interface IPoolViewer {
    function pools(address factory) external view virtual returns (address[] memory poolAddresses);
}
