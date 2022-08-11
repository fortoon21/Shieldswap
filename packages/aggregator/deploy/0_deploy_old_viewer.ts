import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async function ({ getNamedAccounts, deployments }) {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  // the following will only deploy "GenericMetaTxProcessor" if the contract was never deployed or if the code changed since last deployment
  // await deploy("GenericMetaTxProcessor", {
  //   from: deployer,
  //   gasLimit: 4000000,
  //   args: [],
  // });
  console.log(deploy);
  console.log(deployer);
};

export default func;
