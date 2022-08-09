export const getMulticallConfigByNetwork = (network: string) => {
  return {
    multicallChunkLength: network === "hardhat" ? 2 : 2500,
    chunckedMulticallConcurrency: network === "hardhat" ? 2 : 1,
    limit: network === "hardhat" ? 8 : 10,
  };
};
