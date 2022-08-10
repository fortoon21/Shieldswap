import { ethers } from "ethers";
import { Contract, Provider } from "ethers-multicall";

import UniswapV2ViewerArtifact from "../artifacts/contracts/implements/UniswapV2Viewer.sol/UniswapV2Viewer.json";
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
    let result = await this.processChunkedMulticall(chunkedMulticall);
    result = result.filter((PoolInfo) => {
      return (
        /*
         * @dev: remove one of token balance is zero
         */
        ethers.BigNumber.from(PoolInfo.tokenBalances[0]).gt(0) && ethers.BigNumber.from(PoolInfo.tokenBalances[0]).gt(1)
      );
    });
    /*
     * @dev: make it object array for export
     */
    result = result.map((v) => {
      return {
        totalSupply: v.totalSupply,
        tokenBalances: v.tokenBalances,
        pool: v.pool,
        tokenList: v.tokenList,
        fees: v.fees,
        decimals: v.decimals,
        name: v.name,
        symbol: v.symbol,
      };
    });
    return result;
  };

  getTokensByPoolInfos = async (poolInfos: any[]) => {
    let tokenList = poolInfos.map((poolInfo) => poolInfo.tokenList).flat();
    tokenList = [...new Set(tokenList)];
    const chunkedMulticall = await this.createChunkedMulticall(
      tokenList.length,
      this.multicallContract.tokenInfo,
      tokenList
    );
    let result = await this.processChunkedMulticall(chunkedMulticall);
    result = result.filter((token) => {
      /*
       * @dev: remove token name and symbol is invalid
       */
      return token.name !== "" && token.string !== "";
    });
    /*
     * @dev: make it object array for export
     */
    result = result.map((v) => {
      return { token: v.token, decimals: v.decimals, name: v.name, symbol: v.symbol };
    });
    return result;
  };
}
