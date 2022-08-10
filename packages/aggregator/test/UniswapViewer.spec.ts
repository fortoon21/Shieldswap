import fs from "fs";
import { ethers, network } from "hardhat";
import path from "path";

import address from "../address.json";
import { logger } from "../lib/logger";
import { UniswapV2ViewerLib } from "../lib/viewer";
import { deployOrAttach } from "./helper/deploy";
import { getMulticallConfigByNetwork } from "./helper/limit";

describe("UniswapV2Viewer", function () {
  let uniswapV2ViewerLib: UniswapV2ViewerLib;
  describe("QuickSwap", function () {
    let pools: string[];
    let poolInfos: any[];

    this.beforeAll(async function () {
      const { multicallChunkLength, chunckedMulticallConcurrency, limit } = getMulticallConfigByNetwork(network.name);
      const UniswapV2Viewer = await ethers.getContractFactory("UniswapV2Viewer");
      const uniswapV2Viewer = await deployOrAttach(UniswapV2Viewer, address.quickswap.UniswapV2Factory);
      uniswapV2ViewerLib = new UniswapV2ViewerLib(
        ethers.provider,
        uniswapV2Viewer.address,
        multicallChunkLength,
        chunckedMulticallConcurrency,
        limit
      );
      await uniswapV2ViewerLib.init();
    });

    it("getPools", async function () {
      pools = await uniswapV2ViewerLib.getPools();
      logger.log(pools);
      fs.writeFileSync(path.join(__dirname, "../output/quickswap", "pools.json"), JSON.stringify(pools));
    });

    it("getPoolInfosByPools", async function () {
      poolInfos = await uniswapV2ViewerLib.getPoolInfosByPools(pools);
      logger.log(poolInfos);
      fs.writeFileSync(path.join(__dirname, "../output/quickswap", "poolInfos.json"), JSON.stringify(poolInfos));
    });

    it("getTokensByPoolInfos", async function () {
      const tokens = await uniswapV2ViewerLib.getTokensByPoolInfos(poolInfos);
      logger.log(tokens);
      fs.writeFileSync(path.join(__dirname, "../output/quickswap", "tokenInfos.json"), JSON.stringify(poolInfos));
    });
  });
});
