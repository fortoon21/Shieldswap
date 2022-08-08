//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.7;

import "../lib/StructLib.sol";

interface ITokenInfoViewer {
    function tokenInfo(address token) external view returns (StructLib.TokenInfo memory);
    function tokenInfos(address factory) external view returns (StructLib.TokenInfo[] memory);
}
