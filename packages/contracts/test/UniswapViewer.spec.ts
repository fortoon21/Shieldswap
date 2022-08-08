import { expect } from "chai";
import { ethers } from "hardhat";
import { UniswapV2Viewer } from "../typechain-types";

import address from "../address.json";

const isDiplayResult = true;

describe("UniswapV2Viewer", function () {
  let uniswapV2Viewer: UniswapV2Viewer;
  this.beforeAll(async function () {
    const UniswapV2Viewer = await ethers.getContractFactory("UniswapV2Viewer");
    /*
     * @dev: set loop limit 3 for testing
     */
    uniswapV2Viewer = await UniswapV2Viewer.deploy(3);
  });

  it("pools", async function () {
    const pools = await uniswapV2Viewer.pools(address.quickswapFactory);
    if (isDiplayResult) {
      console.log(pools);
    }
  });

  it("poolInfos", async function () {
    const poolInfos = await uniswapV2Viewer.poolInfos(address.quickswapFactory);
    if (isDiplayResult) {
      console.log(poolInfos);
    }
  });

  it("tokenInfos", async function () {
    const tokenInfos = await uniswapV2Viewer.tokenInfos(
      address.quickswapFactory
    );
    if (isDiplayResult) {
      console.log(tokenInfos);
    }
  });
});
