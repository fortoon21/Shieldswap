import "@nomicfoundation/hardhat-toolbox";

import { HardhatUserConfig } from "hardhat/config";

// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config();

const accounts = process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [];
const rpc = "https://polygon-mumbai.g.alchemy.com/v2/vzOwiL7MTT2bjnZozNtemIWyq0zC6oYW";

const config: HardhatUserConfig = {
  solidity: "0.8.15",
  networks: {
    hardhat: {
      forking: {
        url: rpc,
      },
      chainId: 80001,
    },
    mumbai: {
      url: rpc,
      accounts,
    },
  },

  mocha: {
    timeout: 100000,
  },
};

export default config;
