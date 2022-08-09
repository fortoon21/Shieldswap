//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.7;

interface ITokenInfoViewer {
    struct TokenInfo {
        address token;
        uint8 decimals;
        string name;
        string symbol;
    }
    function tokenInfo(address token) external view returns (TokenInfo memory);
}
