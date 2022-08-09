import { ethers } from "ethers";
import { Contract, Provider } from "ethers-multicall";

import UniswapV2ViewerArtifact from "../artifacts/contracts/uniswap/UniswapV2Viewer.sol/UniswapV2Viewer.json";
import { UniswapV2Viewer } from "../typechain-types";
import { logger } from "./logger";

export class ViewerLib {
  multicallProvider: Provider;
  multicallChunkLength: number;
  chunckedMulticallConcurrency: number;
  limit?: number;

  constructor(
    provider: ethers.providers.JsonRpcProvider,
    multicallChunkLength: number,
    chunckedMulticallConcurrency: number,
    limit?: number
  ) {
    this.multicallProvider = new Provider(provider);
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
  createChunkedMulticall = (length: number, multicallingFunction: any, values: "index" | string[]) => {
    length = this.limit ? this.limit : length;
    const chunkedMulticalls = [];
    let multicalls = [];
    const isCompleted = false;
    let i = 0;
    while (!isCompleted) {
      multicalls.push(multicallingFunction(values === "index" ? i : values[i]));
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
    multicallChunkLength: number,
    chunckedMulticallConcurrency: number,
    limit?: number
  ) {
    super(prvider, multicallChunkLength, chunckedMulticallConcurrency, limit);
    this.contract = new ethers.Contract(address, UniswapV2ViewerArtifact.abi, prvider) as UniswapV2Viewer;
    this.multicallContract = new Contract(address, UniswapV2ViewerArtifact.abi);
  }

  getPools = async () => {
    const poolLength = await this.contract.getPoolsLength();
    const chunkedMulticall = await this.createChunkedMulticall(
      poolLength.toNumber(),
      this.multicallContract.getPoolAddressByIndex,
      "index"
    );
    return await this.processChunkedMulticall(chunkedMulticall);
  };

  getPoolInfosByPools = async (pools: string[]) => {
    const chunkedMulticall = await this.createChunkedMulticall(pools.length, this.multicallContract.getPoolInfo, pools);
    return await this.processChunkedMulticall(chunkedMulticall);
  };

  getTokensByPoolInfos = async (poolInfos: any[]) => {
    const tokenList = poolInfos.map((poolInfo) => poolInfo.tokenList).flat();
    const chunkedMulticall = await this.createChunkedMulticall(
      tokenList.length,
      this.multicallContract.tokenInfo,
      tokenList
    );
    return await this.processChunkedMulticall(chunkedMulticall);
  };
}
