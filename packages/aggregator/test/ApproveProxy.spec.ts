import { network } from "hardhat";

import { ApproveProxy } from "../typechain-types";
import { NetworkName } from "../types/network";
import { deployOrAttach } from "./helper/deploy";

describe("ApproveProxy", function () {
  let approveProxy: ApproveProxy;
  describe("Uni2AMM", function () {
    this.beforeAll(async function () {
      const { contract: deployedRouteProxy } = await deployOrAttach(network.name as NetworkName, "RouteProxy", []);
      approveProxy = deployedRouteProxy as ApproveProxy;
    });
  });

  it.skip("method", async function () {
    console.log("NOT IMPLEMENTED");
  });
});
