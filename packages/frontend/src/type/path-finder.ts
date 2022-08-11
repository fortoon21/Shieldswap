export interface PathFinderInput {
  options: {
    tokenInAddr: string;
    tokenOutAddr: string;
    from: string;
    amount: string;
    slippageBps: number;
    maxEdge: number;
    maxSplit: number;
  };
}

export interface PathFinderOutput {
  metamaskSwapTransaction: {
    from: string;
    to: string;
    value: string;
    data: string;
    gas: string;
    maxFeePerGas: string;
    maxPriorityFeePerGas: string;
    type: string;
  };
  expectedAmountOut: string;
}
