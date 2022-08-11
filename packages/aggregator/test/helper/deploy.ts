import { ethers } from "hardhat";

import address from "../../address.json";
import { logger } from "../../lib/logger";

export const deployOrAttach = async (
  contractName: "TokenViewer" | "UniswapV2Viewer" | "UniswapV3Viewer",
  ...args: any[]
) => {
  const factory = await ethers.getContractFactory(contractName);
  let contract;

  const deployed = address.deployed[contractName] || "";
  if (deployed !== "") {
    logger.log(contractName, "using contract", deployed);
    contract = factory.attach(deployed);
  } else {
    contract = await factory.deploy(...args);
    await contract.deployed();
    logger.log(contractName, "contract deployed at", contract.address);
  }
  return contract;
};
