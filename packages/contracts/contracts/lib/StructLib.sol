//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.7;

library StructLib {
    struct TokenInfo {
        address token;
        uint8 decimals;
        string name;
        string symbol;
    }

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
}