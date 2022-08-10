import { ethers, network } from "hardhat";
import path from "path";

import address from "../address.json";
import { exporter } from "../lib/exporter";
import { logger } from "../lib/logger";
import { UniswapV3Viewer } from "../typechain-types";
// import { UniswapVViewerLib } from "../lib/viewer";
import { deployOrAttach } from "./helper/deploy";
import { getMulticallConfigByNetwork } from "./helper/limit";

describe("UniswapV3Viewer", function () {
  // let uniswapV2ViewerLib: UniswapV2ViewerLib;
  describe("Uniswap", function () {
    let pools: string[];
    let poolInfos: any[];

    let uniswapV3Viewer: UniswapV3Viewer;

    this.beforeAll(async function () {
      // const { multicallChunkLength, chunckedMulticallConcurrency, limit } = getMulticallConfigByNetwork(network.name);
      const UniswapV3Viewer = await ethers.getContractFactory("UniswapV3Viewer");
      // uniswapV3Viewer = await deployOrAttach(UniswapV2Viewer, address.uniswap.UniswapV3Factory);
      uniswapV3Viewer = await UniswapV3Viewer.deploy(address.uniswap.UniswapV3Factory);
      // uniswapV2ViewerLib = new UniswapV2ViewerLib(
      //   ethers.provider,
      //   uniswapV2Viewer.address,
      //   multicallChunkLength,
      //   chunckedMulticallConcurrency,
      //   limit
      // );
      // await uniswapV2ViewerLib.init();
    });

    it("getPrice", async function () {
      // pools = await uniswapV2ViewerLib.getPools();
      // logger.log(pools);
      // exporter.export(path.join(__dirname, "../output/quickswap"), "pools.json", JSON.stringify(pools));
      const price = await uniswapV3Viewer.getPrice(
        "0x9c3c9283d3e44854697cd22d3faa240cfb032889",
        "0xa6fa4fb5f76172d178d61b04b0ecd319c5d1c0aa",
        "3000"
      );
      console.log(price);
    });
  });
});
