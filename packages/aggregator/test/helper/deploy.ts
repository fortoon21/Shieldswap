import { ethers } from "hardhat";

import address from "../../address.json";
import { logger } from "../../lib/logger";

export const deployOrAttach = async (
  networkName: "hardhat" | "mumbai",
  contractName: "TokenViewer" | "UniswapV2Viewer" | "UniswapV3Viewer" | "Approve" | "UniAdapter" | "RouteProxy",
  ...args: any[]
) => {
  const factory = await ethers.getContractFactory(contractName);
  let contract;

  const deployed = address.deployed[contractName] || "";
  let type = "";
  if (networkName === "mumbai" && deployed !== "") {
    contract = factory.attach(deployed);
    type = "existed";
    logger.log(contractName, "using contract", deployed);
  } else {
    contract = await factory.deploy(...args);
    await contract.deployed();
    type = "created";
    logger.log(contractName, "contract deployed at", contract.address);
  }
  return { type, contract };
};
