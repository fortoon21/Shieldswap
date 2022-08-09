import { ethers } from "hardhat";

import address from "../address.json";
import { logger } from "../lib/utils/logger";
import { UniswapV2ViewerLib } from "../lib/viewer";

describe("UniswapV2Viewer", function () {
  let uniswapV2ViewerLib: UniswapV2ViewerLib;
  describe("QuickSwap", function () {
    this.beforeAll(async function () {
      const UniswapV2Viewer = await ethers.getContractFactory("UniswapV2Viewer");
      const uniswapV2Viewer = await UniswapV2Viewer.deploy();
      uniswapV2ViewerLib = new UniswapV2ViewerLib(
        ethers.provider,
        uniswapV2Viewer.address,
        address.quickswap.UniswapV2Factory,
        2,
        2,
        8
      );
      await uniswapV2ViewerLib.init();
    });

    it("getPools", async function () {
      const pools = await uniswapV2ViewerLib.getPools();
      logger.log(pools);
    });
  });
});
