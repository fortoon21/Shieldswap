import { network } from "hardhat";

import { Approve } from "../typechain-types";
import { NetworkName } from "../types/network";
import { deployOrAttach } from "./helper/deploy";

describe("Approve", function () {
  let approve: Approve;
  describe("Uni2AMM", function () {
    this.beforeAll(async function () {
      const { contract: deployedRouteProxy } = await deployOrAttach(network.name as NetworkName, "Approve", []);
      approve = deployedRouteProxy as Approve;
    });
  });

  it.skip("method", async function () {
    console.log("NOT IMPLEMENTED");
  });
});
