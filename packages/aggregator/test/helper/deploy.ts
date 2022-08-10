import { logger } from "../../lib/logger";

export const deployOrAttach = async (factory: any, ...args: any[]) => {
  let contract;

  if (process.env.USE_DEPLOYED_CONTRACT) {
    logger.log("using contract", process.env.USE_DEPLOYED_CONTRACT);
    contract = factory.attach(process.env.USE_DEPLOYED_CONTRACT);
  } else {
    contract = await factory.deploy(...args);
    await contract.deployed();
    logger.log("contract deployed at", contract.address);
  }
  return contract;
};
