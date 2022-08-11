# SHEILE BRIDGE

MEV Resistant Flashloanable DEX Aggregator

## Live Demo

https://2022-eth-seoul-submission.vercel.app/

![the graph diagram](./packages/frontend/public/docs/demo.png)

## Technical Integration

### The graph

#### Diagram

![the graph diagram](./packages/frontend/public/docs/the-graph-usage.png)

#### Used subgraph

https://thegraph.com/hosted-service/subgraph/0xfind/uniswap-v3-mumbai

- Success to integarte uniswap v3 in mumbai
- subgraph for quickswap mumbai and sushiswap mumbai is not available, we can add subgraph for those later

#### How we use The Graph

The graph is used for aggregating pool info. We are aggregating all pool informaion from event, but we can have better performance using The Graph.

#### Line of integration

https://github.com/fortoon21/JK_bridge/blob/c335665a3f99eb632d48bf190a028daea13b4f18/packages/aggregator/lib/viewer.ts#L218-L221

https://github.com/fortoon21/JK_bridge/blob/c335665a3f99eb632d48bf190a028daea13b4f18/packages/aggregator/lib/thegraph.ts#L5-L10

### Polygon

#### Deployed Contracts

TBD

#### How we use Polygon

We are aggregating pool info from quickswap, sushiswap, uniswap V3 deployed in Polygon Mumbai, then provider aggregated swap to user.

We deployed multicall viewer contract and swap contract in Polygon Mumbai.

## Development

### Frontend

```
cd packages/frontend
yarn                    // for the first time
yarn dev
```

### Aggregator

```
cd packages/aggregator
yarn                    // for the first time
yarn test
```
