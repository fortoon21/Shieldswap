import { ethers } from "ethers";
import { Contract, Provider } from "ethers-multicall";

import IUniswapV3FactoryArtifact from "../artifacts/@uniswap/v3-core/contracts/interfaces/IUniswapV3Factory.sol/IUniswapV3Factory.json";
import UniswapV2ViewerArtifact from "../artifacts/contracts/implements/UniswapV2Viewer.sol/UniswapV2Viewer.json";
import UniswapV3ViewerArtifact from "../artifacts/contracts/implements/UniswapV3Viewer.sol/UniswapV3Viewer.json";
import { IUniswapV3Factory, UniswapV2Viewer, UniswapV3Viewer } from "../typechain-types";
import { logger } from "./logger";

export class ViewerLib {
  provider: ethers.providers.JsonRpcProvider;
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
    this.provider = provider;
    this.multicallProvider = new Provider(provider);
    this.multicallChunkLength = multicallChunkLength;
    this.chunckedMulticallConcurrency = chunckedMulticallConcurrency;
    this.limit = limit;
    logger.log("multicallChunkLength", this.multicallChunkLength);
    logger.log("chunckedMulticallConcurrency", this.chunckedMulticallConcurrency);
    logger.log("limit", this.limit);
  }

  async init() {
    await this.multicallProvider.init();
  }

  // TODO: better typing
  createChunkedMulticall(length: number, multicallingFunction: any, values: "index" | string[]) {
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
  }

  async processChunkedMulticall(chunkedMulticalls: any[][]) {
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
  }
}

export class UniswapV2ViewerLib extends ViewerLib {
  viewer: UniswapV2Viewer;
  multicallContract: Contract;

  constructor(
    prvider: ethers.providers.JsonRpcProvider,
    address: string,
    multicallChunkLength: number,
    chunckedMulticallConcurrency: number,
    limit?: number
  ) {
    super(prvider, multicallChunkLength, chunckedMulticallConcurrency, limit);

    this.viewer = new ethers.Contract(address, UniswapV2ViewerArtifact.abi, prvider) as UniswapV2Viewer;
    this.multicallContract = new Contract(address, UniswapV2ViewerArtifact.abi);
  }

  async getPools() {
    const poolLength = await this.viewer.getPoolsLength();
    const chunkedMulticall = await this.createChunkedMulticall(
      poolLength.toNumber(),
      this.multicallContract.getPoolAddressByIndex,
      "index"
    );
    return await this.processChunkedMulticall(chunkedMulticall);
  }

  async getPoolInfosByPools(pools: string[]) {
    if (pools.length === 0) {
      return [];
    }
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
  }

  async getTokensByPoolInfos(poolInfos: any[]) {
    if (poolInfos.length === 0) {
      return [];
    }
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
  }
}

export class UniswapV3ViewerLib extends ViewerLib {
  viewer: UniswapV3Viewer;
  multicallContract: Contract;
  factory: IUniswapV3Factory;

  constructor(
    prvider: ethers.providers.JsonRpcProvider,
    address: string,
    multicallChunkLength: number,
    chunckedMulticallConcurrency: number,
    limit?: number
  ) {
    super(prvider, multicallChunkLength, chunckedMulticallConcurrency, limit);
    this.viewer = new ethers.Contract(address, UniswapV3ViewerArtifact.abi, prvider) as UniswapV3Viewer;
    this.factory = new ethers.Contract(
      "0x0000000000000000000000000000000000000000",
      IUniswapV3FactoryArtifact.abi,
      this.provider
    ) as IUniswapV3Factory;
    this.multicallContract = new Contract(address, UniswapV3ViewerArtifact.abi);
  }

  async init() {
    const uniswapV3FacotyAddress = await this.viewer.uniswapV3Factory();
    this.factory = this.factory.attach(uniswapV3FacotyAddress);
    await super.init();
  }

  async getPools() {
    const blockNumber = await this.provider.getBlockNumber();
    const filter = this.factory.filters.PoolCreated();
    const events = await this.factory.queryFilter(filter, 0, blockNumber);
    const result = events.map((event) => {
      return event.args.pool;
    });
    return result;
  }

  async getPoolInfosByPools(pools: string[]) {
    if (pools.length === 0) {
      return [];
    }
    const chunkedMulticall = await this.createChunkedMulticall(pools.length, this.multicallContract.getPoolInfo, pools);
    let result = await this.processChunkedMulticall(chunkedMulticall);

    result = result.filter((PoolInfo) => {
      return (
        /*
         * @dev: remove one of token liquidity is zero
         */
        ethers.BigNumber.from(PoolInfo.liquidity).gt(0)
      );
    });

    /*
     * @dev: make it object array for export
     */
    result = result.map((v) => {
      return {
        pool: v.pool,
        tokenList: v.tokenList,
        blockTimestamp: v.blockTimestamp,
        sqrtPriceX96: v.sqrtPriceX96,
        liquidity: v.liquidity,
        fee: v.fee,
        tick: v.tick,
        observationIndex: v.observationIndex,
        observationCardinality: v.observationCardinality,
        observationCardinalityNext: v.observationCardinalityNext,
        feeProtocol: v.feeProtocol,
        unlocked: v.unlocked,
      };
    });
    return result;
  }

  async getTokensByPoolInfos(poolInfos: any[]) {
    if (poolInfos.length === 0) {
      return [];
    }
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
  }
}
