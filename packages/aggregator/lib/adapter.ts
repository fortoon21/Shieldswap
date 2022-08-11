import { ethers } from "ethers";
import { Contract, Provider } from "ethers-multicall";

import UniAdapterArtifact from "../artifacts/contracts/SmartRoute/adapter/UniAdapter.sol/UniAdapter.json";
import { UniAdapter } from "../typechain-types";
import { logger } from "./logger";

export abstract class AdapterLib {
  provider: ethers.providers.JsonRpcProvider;

  constructor(provider: ethers.providers.JsonRpcProvider) {
    this.provider = provider;
  }
}

export class UniAdapterLib extends AdapterLib {
  adapter: UniAdapter;

  constructor(provider: ethers.providers.JsonRpcProvider, address: string, factories: string[], wMatics: string[]) {
    super(provider);

    this.adapter = new ethers.Contract(address, UniAdapterArtifact.abi, provider) as UniAdapter;
  }

  async factory(pool: string) {
    return await this.adapter.factory(pool);
  }

  async getAmountOut(fromToken: string, amountIn: number, toToken: string, pool: string) {
    return await this.adapter.getAmountOut(fromToken, amountIn, toToken, pool);
  }

  async swapExactIn(fromToken: string, amountIn: number, toToken: string, pool: string, to: string) {
    return await this.adapter.swapExactIn(fromToken, amountIn, toToken, pool, to);
  }
}
