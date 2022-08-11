import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers, network } from "hardhat";

import { Approve, MockERC20 } from "../typechain-types";
import { NetworkName } from "../types/network";
import { deployOrAttach } from "./helper/deploy";

/**
 * @TODO add unit test for owner and proxy management
 */

describe("Approve", function () {
  let signer: SignerWithAddress;
  let malicious: SignerWithAddress;
  let owner: SignerWithAddress;
  let proxy: SignerWithAddress;
  let holder: SignerWithAddress;
  let other: SignerWithAddress;
  let approve: Approve;
  let mockErc20: MockERC20;

  const tokenAmount = "100";
  describe("Uni2AMM", function () {
    this.beforeAll(async function () {
      [signer, malicious, owner, proxy, holder, other] = await ethers.getSigners();
      const constructorParam = [] as any;
      if (network.name === "hardhat") {
        const MockERC20Factory = await ethers.getContractFactory("MockERC20");
        mockErc20 = await MockERC20Factory.deploy();
        await mockErc20.mint(holder.address, tokenAmount);
      }
      const { contract: deployedApprove, type } = await deployOrAttach(
        network.name as NetworkName,
        "Approve",
        constructorParam
      );
      approve = deployedApprove as Approve;
      if (type === "created") {
        await approve.init(owner.address, proxy.address);
      }
    });

    it("getProxy", async function () {
      expect(await approve.getProxy()).to.equal(proxy.address);
    });

    it("claimTokens", async function () {
      await mockErc20.connect(holder).approve(approve.address, tokenAmount);
      await approve.connect(proxy).claimTokens(mockErc20.address, holder.address, other.address, tokenAmount);
    });
  });
});
