import { DeployFunction } from "hardhat-deploy/types";

import address from "../address.json";

const func: DeployFunction = async function ({ ethers, getNamedAccounts, deployments }) {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const { address: approveAddress } = await deploy("Approve", {
    from: deployer,
    args: [],
    log: process.env.IS_LOG_ENABLED === "true",
  });

  const { address: approveProxyAddress } = await deploy("ApproveProxy", {
    from: deployer,
    args: [approveAddress],
    log: process.env.IS_LOG_ENABLED === "true",
  });

  const factories = Object.entries(address).filter(([key]) => {
    return key === "quickswap" || key === "sushiswap";
  });

  const factoryAddresses = factories.map(([, value]: any) => {
    return value.UniswapV2Factory;
  });

  const wmaticAddresses = factories.map(([, value]: any) => {
    return value.wmatic;
  });

  await deploy("UniAdapter", {
    from: deployer,
    args: [factoryAddresses, wmaticAddresses],
    log: process.env.IS_LOG_ENABLED === "true",
  });

  const { address: routeProxyAddress } = await deploy("RouteProxy", {
    from: deployer,
    args: [approveProxyAddress, address.aave.LendingPoolAddressesProvider],
    log: process.env.IS_LOG_ENABLED === "true",
  });

  const ApproveFactory = await ethers.getContractFactory("Approve");
  const approve = ApproveFactory.attach(approveAddress);
  await approve.deployed();
  await approve.init(deployer, approveProxyAddress);
  const ApproveProxyFactory = await ethers.getContractFactory("ApproveProxy");
  const approveProxy = ApproveProxyFactory.attach(approveProxyAddress);
  await approveProxy.deployed();
  await approveProxy.init(deployer, [routeProxyAddress]);
};

export default func;
