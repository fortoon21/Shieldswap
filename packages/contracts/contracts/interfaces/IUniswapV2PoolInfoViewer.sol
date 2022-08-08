//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.7;

import "../lib/StructLib.sol";

interface IUniswapV2PoolInfoViewer {
    function poolInfo(address pool) external view returns (StructLib.UniswapV2PoolInfo memory);
    function poolInfos(address pool) external view returns (StructLib.UniswapV2PoolInfo[] memory);
}
