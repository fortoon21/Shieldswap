import { network } from "hardhat";

import { RouteProxy } from "../typechain-types";
import { NetworkName } from "../types/network";
import { deployOrAttach } from "./helper/deploy";

describe("RouterProxy", function () {
  let routerProxy: RouteProxy;
  describe("Unit Test", function () {
    this.beforeAll(async function () {
      const { contract: deployedRouteProxy } = await deployOrAttach(network.name as NetworkName, "RouteProxy", []);
      routerProxy = deployedRouteProxy as RouteProxy;
    });
    it.skip("method", async function () {
      console.log("NOT IMPLEMENTED");
    });
  });
});
