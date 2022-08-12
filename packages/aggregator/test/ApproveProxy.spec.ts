import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers, network } from "hardhat";

import { Approve, ApproveProxy, MockERC20 } from "../typechain-types";
import { NetworkName } from "../types/network";
import { deployOrAttach } from "./helper/deploy";

describe.skip("ApproveProxy", function () {
  let signer: SignerWithAddress;
  let malicious: SignerWithAddress;
  let owner: SignerWithAddress;
  let proxy: SignerWithAddress;
  let holder: SignerWithAddress;
  let other: SignerWithAddress;
  let approve: Approve;
  let approveProxy: ApproveProxy;
  let mockErc20: MockERC20;

  const tokenAmount = "100";

  describe("Unit Test", function () {
    this.beforeAll(async function () {
      [signer, malicious, owner, proxy, holder, other] = await ethers.getSigners();
      let constructorParam = [] as any;
      if (network.name === "hardhat") {
        const ApproveFactory = await ethers.getContractFactory("Approve");
        approve = await ApproveFactory.deploy();
        constructorParam = [approve.address];
        const MockERC20Factory = await ethers.getContractFactory("MockERC20");
        mockErc20 = await MockERC20Factory.deploy();
        await mockErc20.mint(holder.address, tokenAmount);
      }

      const { contract: deployedApproveProxy, type } = await deployOrAttach(
        network.name as NetworkName,
        "ApproveProxy",
        ...constructorParam
      );
      approveProxy = deployedApproveProxy as ApproveProxy;

      if (type === "created") {
        await approve.init(owner.address, approveProxy.address);
        await approveProxy.init(owner.address, [proxy.address]);
      }
    });

    it("isAllowedProxy", async function () {
      expect(await approveProxy.isAllowedProxy(malicious.address)).to.equal(false);
      expect(await approveProxy.isAllowedProxy(proxy.address)).to.equal(true);
    });

    it("claimTokens", async function () {
      await mockErc20.connect(holder).approve(approve.address, tokenAmount);
      await approveProxy.connect(proxy).claimTokens(mockErc20.address, holder.address, other.address, tokenAmount);
    });
  });
});
