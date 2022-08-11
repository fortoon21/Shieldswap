import { ethers, network } from "hardhat";
import path from "path";

import address from "../address.json";
import { exporter } from "../lib/exporter";
import { logger } from "../lib/logger";
import { UniAdapterLib } from "../lib/adapter";
import { deployOrAttach } from "./helper/deploy";

describe("UniAdapter", function () {
  let uniAdapterLib: UniAdapterLib;
  describe("Uni2AMM", function () {
    const factories: string[] = [];
    const wMatics: string[] = [];
    const pool: string = "0x3E32eF2dC5B023d19573655DE6D1427eE3128f0a";
    const fromToken: string = "0x84c51c2e51D4237D6147d9FE77e6c12CAa9d772C";
    const toToken: string = "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889";
    const amountIn: number = 10000000000000000000;
    for (const addr in address) {
      if (addr === "quickswap" || addr === "sushiswap") {
        factories.push(address[addr]["UniswapV2Factory"]);
        wMatics.push(address[addr]["wmatic"]);
      }
    }

    this.beforeAll(async function () {
      const uniAdapter = await deployOrAttach("UniAdapter", factories, wMatics);
      uniAdapterLib = new UniAdapterLib(ethers.provider, uniAdapter.address, factories, wMatics);
    });

    it("factory", async function () {
      const factory = await uniAdapterLib.factory(pool);
      logger.log(factory);
      exporter.export(path.join(__dirname, "../output/v2/quickswap"), "factory.json", JSON.stringify(factory));
    });

    it("getAmountOut", async function () {
      const output = await uniAdapterLib.getAmountOut(fromToken, amountIn, toToken, pool);
      logger.log(output);
      exporter.export(path.join(__dirname, "../output/v2/quickswap"), "getAmountOut.json", JSON.stringify(output));
    });
  });
});
