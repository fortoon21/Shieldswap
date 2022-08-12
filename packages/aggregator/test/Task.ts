import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers, network } from "hardhat";

import address from "../address.json";
import { Approve, MockERC20 } from "../typechain-types";
import { NetworkName } from "../types/network";
import { deployOrAttach } from "./helper/deploy";

/**
 * @TODO this is task to deploy, move this to task or script
 */

describe.skip("Task", function () {
  describe.skip("Deploy", function () {
    it.skip("QUickSwap Viewer", async function () {
      //UPDATE CONTRACT NAME
      const name = "OldViewer";
      const factory = await ethers.getContractFactory(name);
      const deployed = await factory.deploy(address.quickswap.UniswapV2Factory);
      console.log("QUickSwap Viewer", deployed.address);
    });

    it.skip("Sushiswap Viewer", async function () {
      const name = "OldViewer";
      const factory = await ethers.getContractFactory(name);
      const deployed = await factory.deploy(address.sushiswap.UniswapV2Factory);
      console.log("Sushiswap Viewer", deployed.address);
    });

    it.skip("Token Viewer", async function () {
      //UPDATE CONTRACT NAME
      const name = "TokenViewer";
      const factory = await ethers.getContractFactory(name);

      const deployed = await factory.deploy();
      console.log("Token Viewer", deployed.address);
    });

    it.skip("UniswapV2Viewer", async function () {
      //UPDATE CONTRACT NAME
      const name = "UniswapV2Viewer";
      const factory = await ethers.getContractFactory(name);
      const deployed = await factory.deploy();
      console.log("UniswapV2Viewer", deployed.address);
    });

    it.skip("UniswapV3Viewer", async function () {
      //UPDATE CONTRACT NAME
      const name = "UniswapV3Viewer";
      const factory = await ethers.getContractFactory(name);
      const deployed = await factory.deploy();
      console.log("UniswapV3Viewer", deployed.address);
    });
  });
});
