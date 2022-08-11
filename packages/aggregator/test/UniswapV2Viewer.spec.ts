import { ethers, network } from "hardhat";
import path from "path";

import address from "../address.json";
import { exporter } from "../lib/exporter";
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
      const tokenViewer = await deployOrAttach("TokenViewer");
      const uniswapV2Viewer = await deployOrAttach("UniswapV2Viewer");
      uniswapV2ViewerLib = new UniswapV2ViewerLib(
        ethers.provider,
        address.quickswap.UniswapV2Factory,
        tokenViewer.address,
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
      exporter.export(path.join(__dirname, "../output/v2/quickswap"), "pools.json", JSON.stringify(pools));
    });

    it("getPoolInfosByPools", async function () {
      poolInfos = await uniswapV2ViewerLib.getPoolInfosByPools(pools);
      logger.log(poolInfos);
      exporter.export(path.join(__dirname, "../output/v2/quickswap"), "poolInfos.json", JSON.stringify(poolInfos));
    });

    it("getTokensByPoolInfos", async function () {
      const tokens = await uniswapV2ViewerLib.getTokensByPoolInfos(poolInfos);
      logger.log(tokens);
      exporter.export(path.join(__dirname, "../output/v2/quickswap"), "tokenInfos.json", JSON.stringify(poolInfos));
    });
  });

  describe("Sushiswap", function () {
    let pools: string[];
    let poolInfos: any[];

    this.beforeAll(async function () {
      const { multicallChunkLength, chunckedMulticallConcurrency, limit } = getMulticallConfigByNetwork(network.name);
      const tokenViewer = await deployOrAttach("TokenViewer");
      const uniswapV2Viewer = await deployOrAttach("UniswapV2Viewer");
      uniswapV2ViewerLib = new UniswapV2ViewerLib(
        ethers.provider,
        address.sushiswap.UniswapV2Factory,
        tokenViewer.address,
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
      exporter.export(path.join(__dirname, "../output/v2/sushiswap"), "pools.json", JSON.stringify(pools));
    });

    it("getPoolInfosByPools", async function () {
      poolInfos = await uniswapV2ViewerLib.getPoolInfosByPools(pools);
      logger.log(poolInfos);
      exporter.export(path.join(__dirname, "../output/v2/sushiswap"), "poolInfos.json", JSON.stringify(poolInfos));
    });

    it("getTokensByPoolInfos", async function () {
      const tokens = await uniswapV2ViewerLib.getTokensByPoolInfos(poolInfos);
      logger.log(tokens);
      exporter.export(path.join(__dirname, "../output/v2/sushiswap"), "tokenInfos.json", JSON.stringify(poolInfos));
    });
  });
});
