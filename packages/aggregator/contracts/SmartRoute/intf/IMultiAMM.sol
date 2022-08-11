// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.15;

library IMultiAMM {
  enum DexType {
    UNI2,
    CURVE,
    BALANCER,
    UNI3
    // DODO,
    // KYBERDMM
    // STABLESWAP,
    // SADDLE
  }

  struct Swap {
    uint8 part;
    uint8 parts;
    uint8 dexType;
    //dexType:
    // 0: uniswapV2
    // 1: curve
    // 2: balancer
    // 3: uniswapV3
    // 4: dodo - proactive
    // 5: Kyber dmm
    // 6: stable swap
    // 7: saddle
    address pool;
    bool isETHIn;
    bytes data;
  }
}
