import "@nomicfoundation/hardhat-toolbox";

import { HardhatUserConfig } from "hardhat/config";

const config: HardhatUserConfig = {
  solidity: "0.8.7",
  networks: {
    hardhat: {
      forking: {
        url: "https://polygon-mumbai.g.alchemy.com/v2/vzOwiL7MTT2bjnZozNtemIWyq0zC6oYW",
      },
      chainId: 80001,
    },
  },
  mocha: {
    timeout: 100000,
  },
};

export default config;
