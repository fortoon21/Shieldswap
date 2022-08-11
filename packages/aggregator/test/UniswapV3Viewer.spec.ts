import { ethers, network } from "hardhat";
import path from "path";

import address from "../address.json";
import { exporter } from "../lib/exporter";
import { logger } from "../lib/logger";
import { UniswapV3ViewerLib } from "../lib/viewer";
import { deployOrAttach } from "./helper/deploy";
import { getMulticallConfigByNetwork } from "./helper/limit";

describe.only("UniswapV3Viewer", function () {
  let uniswapV3ViewerLib: UniswapV3ViewerLib;
  describe("UniswapV3", function () {
    let pools: string[];
    let poolInfos: any[];

    this.beforeAll(async function () {
      const { multicallChunkLength, chunckedMulticallConcurrency, limit } = getMulticallConfigByNetwork(network.name);
      const tokenViewer = await deployOrAttach("TokenViewer");
      const uniswapV3Viewer = await deployOrAttach("UniswapV3Viewer");
      uniswapV3ViewerLib = new UniswapV3ViewerLib(
        ethers.provider,
        address.uniswap.UniswapV3Factory,
        tokenViewer.address,
        uniswapV3Viewer.address,
        multicallChunkLength,
        chunckedMulticallConcurrency,
        limit
      );
      await uniswapV3ViewerLib.init();
    });

    it("getPools", async function () {
      pools = await uniswapV3ViewerLib.getPools();
      logger.log(pools);
      exporter.export(path.join(__dirname, "../output/v3/uniswap"), "pools.json", JSON.stringify(pools));
    });

    it("getPoolInfosByPools", async function () {
      poolInfos = await uniswapV3ViewerLib.getPoolInfosByPools(pools);
      logger.log(poolInfos);
      exporter.export(path.join(__dirname, "../output/v3/uniswap"), "poolInfos.json", JSON.stringify(poolInfos));
    });

    it("getTokensByPoolInfos", async function () {
      const tokens = await uniswapV3ViewerLib.getTokensByPoolInfos(poolInfos);
      logger.log(tokens);
      exporter.export(path.join(__dirname, "../output/v3/uniswap"), "tokenInfos.json", JSON.stringify(poolInfos));
    });
  });
});
