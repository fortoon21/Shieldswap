export const getMulticallConfigByNetwork = (network: string) => {
  return {
    multicallChunkLength: network === "hardhat" ? 1 : 1000,
    chunckedMulticallConcurrency: network === "hardhat" ? 1 : 1,
    limit: network === "hardhat" ? 2 : 0,
  };
};
