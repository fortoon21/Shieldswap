import { ethers } from "ethers";
import { Contract, Provider } from "ethers-multicall";

import UniswapV2ViewerArtifact from "../artifacts/contracts/uniswap/UniswapV2Viewer.sol/UniswapV2Viewer.json";
import { UniswapV2Viewer } from "../typechain-types";
import { logger } from "./utils/logger";

export class ViewerLib {
  multicallProvider: Provider;
  factory: string;
  multicallChunkLength: number;
  chunckedMulticallConcurrency: number;
  limit?: number;

  constructor(
    provider: ethers.providers.JsonRpcProvider,
    factory: string,
    multicallChunkLength: number,
    chunckedMulticallConcurrency: number,
    limit?: number
  ) {
    this.multicallProvider = new Provider(provider);
    this.factory = factory;
    this.multicallChunkLength = multicallChunkLength;
    this.chunckedMulticallConcurrency = chunckedMulticallConcurrency;
    this.limit = limit;
    logger.log("multicallChunkLength", this.multicallChunkLength);
    logger.log("chunckedMulticallConcurrency", this.chunckedMulticallConcurrency);
    logger.log("limit", this.limit);
  }

  init = async () => {
    await this.multicallProvider.init();
  };

  // TODO: better typing
  createChunkedMulticall = (length: number, multicallingFunction: any, ...args: any) => {
    const chunkedMulticalls = [];
    let multicalls = [];
    const isCompleted = false;
    let i = 0;
    while (!isCompleted) {
      multicalls.push(multicallingFunction(...args, i));
      i++;
      if (i % this.multicallChunkLength === 0 || i === length) {
        chunkedMulticalls.push(multicalls);
        multicalls = [];
        if (i === length) {
          break;
        }
      }
    }
    return chunkedMulticalls;
  };

  processChunkedMulticall = async (chunkedMulticalls: any[][]) => {
    let result: any[] = [];
    let index = 0;
    while (chunkedMulticalls.length) {
      logger.log("processing multicall at", index);
      const resolved = await Promise.all(
        chunkedMulticalls
          .splice(0, this.chunckedMulticallConcurrency)
          .map((multicalls) => this.multicallProvider.all(multicalls))
      );
      result = result.concat(...resolved);
      index++;
    }
    return result;
  };
}

export class UniswapV2ViewerLib extends ViewerLib {
  contract: UniswapV2Viewer;
  multicallContract: Contract;

  constructor(
    prvider: ethers.providers.JsonRpcProvider,
    address: string,
    factory: string,
    multicallChunkLength: number,
    chunckedMulticallConcurrency: number,
    limit?: number
  ) {
    super(prvider, factory, multicallChunkLength, chunckedMulticallConcurrency, limit);
    this.contract = new ethers.Contract(address, UniswapV2ViewerArtifact.abi, prvider) as UniswapV2Viewer;
    this.multicallContract = new Contract(address, UniswapV2ViewerArtifact.abi);
  }

  getPools = async () => {
    const poolLength = await this.contract.getPoolsLength(this.factory);
    const chunkedMulticall = await this.createChunkedMulticall(
      this.limit || poolLength.toNumber(),
      this.multicallContract.getPoolAddressByIndex,
      this.factory
    );
    return await this.processChunkedMulticall(chunkedMulticall);
  };
}
