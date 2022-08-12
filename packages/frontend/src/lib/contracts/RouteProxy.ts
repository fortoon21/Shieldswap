export const ROUTE_PROXY_ABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "approveProxy",
        type: "address",
      },
      {
        internalType: "address",
        name: "_addressProvider",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "_from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "_assetAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "LogWithdraw",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "fromToken",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "toToken",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "fromAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "returnAmount",
        type: "uint256",
      },
    ],
    name: "OrderHistory",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    stateMutability: "payable",
    type: "fallback",
  },
  {
    inputs: [],
    name: "ADDRESSES_PROVIDER",
    outputs: [
      {
        internalType: "contract ILendingPoolAddressesProviderV2",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "LENDING_POOL",
    outputs: [
      {
        internalType: "contract ILendingPoolV2",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "_APPROVE_PROXY_",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "assets",
        type: "address[]",
      },
      {
        internalType: "uint256[]",
        name: "amounts",
        type: "uint256[]",
      },
      {
        internalType: "uint256[]",
        name: "premiums",
        type: "uint256[]",
      },
      {
        internalType: "address",
        name: "initiator",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "params",
        type: "bytes",
      },
    ],
    name: "executeOperation",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "assets",
        type: "address[]",
      },
      {
        internalType: "uint256[]",
        name: "amounts",
        type: "uint256[]",
      },
    ],
    name: "flashloan",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "fromToken",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amountIn",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "toToken",
        type: "address",
      },
      {
        components: [
          {
            internalType: "address",
            name: "fromToken",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "amountIn",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "toToken",
            type: "address",
          },
          {
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            internalType: "uint256[]",
            name: "weights",
            type: "uint256[]",
          },
          {
            components: [
              {
                internalType: "address",
                name: "fromToken",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "amountIn",
                type: "uint256",
              },
              {
                internalType: "address",
                name: "toToken",
                type: "address",
              },
              {
                internalType: "address",
                name: "to",
                type: "address",
              },
              {
                internalType: "uint256[]",
                name: "weights",
                type: "uint256[]",
              },
              {
                internalType: "address[]",
                name: "adapters",
                type: "address[]",
              },
              {
                internalType: "address[]",
                name: "pools",
                type: "address[]",
              },
            ],
            internalType: "struct RouteProxy.WeightPathInfo[][]",
            name: "weightPathInfos",
            type: "tuple[][]",
          },
        ],
        internalType: "struct RouteProxy.LinearWeightPathInfo",
        name: "linearWeightPathInfo",
        type: "tuple",
      },
    ],
    name: "linearSplitMultiHopMultiSwap",
    outputs: [
      {
        internalType: "uint256",
        name: "output",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "fromToken",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amountIn",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "toToken",
        type: "address",
      },
      {
        components: [
          {
            internalType: "address",
            name: "fromToken",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "amountIn",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "toToken",
            type: "address",
          },
          {
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            internalType: "uint256[]",
            name: "weights",
            type: "uint256[]",
          },
          {
            internalType: "address[]",
            name: "adapters",
            type: "address[]",
          },
          {
            internalType: "address[]",
            name: "pools",
            type: "address[]",
          },
        ],
        internalType: "struct RouteProxy.WeightPathInfo[]",
        name: "weightPathInfos",
        type: "tuple[]",
      },
    ],
    name: "multiHopMultiSwap",
    outputs: [
      {
        internalType: "uint256[]",
        name: "outputs",
        type: "uint256[]",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "fromToken",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amountIn",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "toToken",
        type: "address",
      },
      {
        components: [
          {
            internalType: "address",
            name: "fromToken",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "amountIn",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "toToken",
            type: "address",
          },
          {
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            internalType: "address",
            name: "adapter",
            type: "address",
          },
          {
            internalType: "address",
            name: "pool",
            type: "address",
          },
        ],
        internalType: "struct RouteProxy.PathInfo[]",
        name: "pathInfos",
        type: "tuple[]",
      },
    ],
    name: "multiHopSingleSwap",
    outputs: [
      {
        internalType: "uint256[]",
        name: "outputs",
        type: "uint256[]",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "fromToken",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amountIn",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "toToken",
        type: "address",
      },
      {
        components: [
          {
            internalType: "address",
            name: "fromToken",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "amountIn",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "toToken",
            type: "address",
          },
          {
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            internalType: "uint256[]",
            name: "weights",
            type: "uint256[]",
          },
          {
            components: [
              {
                internalType: "address",
                name: "fromToken",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "amountIn",
                type: "uint256",
              },
              {
                internalType: "address",
                name: "toToken",
                type: "address",
              },
              {
                internalType: "address",
                name: "to",
                type: "address",
              },
              {
                internalType: "uint256[]",
                name: "weights",
                type: "uint256[]",
              },
              {
                internalType: "address[]",
                name: "adapters",
                type: "address[]",
              },
              {
                internalType: "address[]",
                name: "pools",
                type: "address[]",
              },
            ],
            internalType: "struct RouteProxy.WeightPathInfo[][]",
            name: "weightPathInfos",
            type: "tuple[][]",
          },
        ],
        internalType: "struct RouteProxy.LinearWeightPathInfo",
        name: "linearWeightPathInfo",
        type: "tuple",
      },
      {
        components: [
          {
            internalType: "address",
            name: "asset",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "amountIn",
            type: "uint256",
          },
          {
            components: [
              {
                internalType: "address",
                name: "fromToken",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "amountIn",
                type: "uint256",
              },
              {
                internalType: "address",
                name: "toToken",
                type: "address",
              },
              {
                internalType: "address",
                name: "to",
                type: "address",
              },
              {
                internalType: "address",
                name: "adapter",
                type: "address",
              },
              {
                internalType: "address",
                name: "pool",
                type: "address",
              },
            ],
            internalType: "struct RouteProxy.PathInfo[]",
            name: "pathInfos",
            type: "tuple[]",
          },
        ],
        internalType: "struct RouteProxy.FlashLoanDes[]",
        name: "flashDes",
        type: "tuple[]",
      },
      {
        internalType: "uint256",
        name: "minReturnAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "deadLine",
        type: "uint256",
      },
    ],
    name: "shieldSwap",
    outputs: [
      {
        internalType: "uint256",
        name: "output",
        type: "uint256",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "fromToken",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amountIn",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "toToken",
        type: "address",
      },
      {
        components: [
          {
            internalType: "address",
            name: "fromToken",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "amountIn",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "toToken",
            type: "address",
          },
          {
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            internalType: "uint256[]",
            name: "weights",
            type: "uint256[]",
          },
          {
            internalType: "address[]",
            name: "adapters",
            type: "address[]",
          },
          {
            internalType: "address[]",
            name: "pools",
            type: "address[]",
          },
        ],
        internalType: "struct RouteProxy.WeightPathInfo",
        name: "weightPathInfo",
        type: "tuple",
      },
    ],
    name: "singleHopMultiSwap",
    outputs: [
      {
        internalType: "uint256",
        name: "output",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_assetAddress",
        type: "address",
      },
    ],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    stateMutability: "payable",
    type: "receive",
  },
];
