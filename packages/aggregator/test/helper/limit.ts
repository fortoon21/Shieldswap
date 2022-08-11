export const getMulticallConfigByNetwork = () => {
  return {
    multicallChunkLength: 1000,
    chunckedMulticallConcurrency: 1,
    limit: 0,
  };
};
