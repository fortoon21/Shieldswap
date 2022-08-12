import {
  Box,
  Button,
  Divider,
  Flex,
  HStack,
  Icon,
  IconButton,
  Image,
  Input,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { ethers } from "ethers";
import React from "react";
import { AiOutlineDown } from "react-icons/ai";
import { FaCoins } from "react-icons/fa";
import { MdSwapVert } from "react-icons/md";
import { useAccount, useSigner } from "wagmi";

import {
  APPROVE_CONTRACT_ADDRESS,
  PRC_URL,
  QUICKSWAP_FACTORY_ADDRESS,
  ROUTER_CONTRACT_ADDRESS,
  UNI_ADDAPTER_ADDRESS,
} from "../../lib/app/constants";
import { ERC20_ABI } from "../../lib/contracts/ERC20";
import { ROUTE_PROXY_ABI } from "../../lib/contracts/RouteProxy";
import { UNI_ADAPTER_ABI } from "../../lib/contracts/UniAdapter";
import { UNISWAP_V2_FACTORY_ABI } from "../../lib/contracts/UniswapV2Factory";
import { getFromPathFinder } from "../../lib/path-finder";
import { PathFinderInput, PathFinderOutput } from "../../type/path-finder";
import { ConnectWalletWrapper } from "../ConnectWalletWrapper";
import { Modal } from "../Modal";
import { tokens } from "./data";

export interface InnerSwapProps {
  mode: "swap" | "flashloan";
}

interface SelectTokenProps {
  target: "token0" | "token1";
}

export const InnerSwap: React.FC<InnerSwapProps> = ({ mode }) => {
  const [token0Index, setToken0Index] = React.useState(0);
  const [token1Index, setToken1Index] = React.useState(1);

  const { onClose: onToken0ModalClose, onOpen: onToken0ModalOpen, isOpen: isToken0Open } = useDisclosure();
  const { onClose: onToken1ModalClose, onOpen: onToken1ModalOpen, isOpen: isToken1Open } = useDisclosure();

  const [amountIn, setAmountIn] = React.useState("0");
  const [amountOut, setAmountOut] = React.useState("0");

  const [dataFromPathFinder, setDataFromPathFinder] = React.useState<any>();

  const [isLoading, setIsloading] = React.useState(false);

  const { data: signer } = useSigner();
  const { address } = useAccount();

  React.useEffect(() => {
    _handleAmountInChange(amountIn);
  }, [address]);

  const changeDirection = () => {
    console.log("swap");
    setToken0Index(token1Index);
    setToken1Index(token0Index);
  };

  const handleAmountInChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const amountIn = e.target.value;
    _handleAmountInChange(amountIn);
  };

  const _handleAmountInChange = async (amountIn: string) => {
    setAmountIn(amountIn);
    if (amountIn && amountIn !== "0" && signer && address) {
      const tokenInAddr = tokens[token0Index].address;
      const tokenOutAddr = tokens[token1Index].address;
      const amount = ethers.utils.parseEther(amountIn).toString();
      //TODO: change to better handling, now this calls too much pathfinder

      const input = {
        options: {
          tokenInAddr,
          tokenOutAddr,
          from: address,
          amount,
          slippageBps: 100,
          maxEdge: 4,
          maxSplit: 20,
        },
      };

      //TODO: change to better handling, now this calls too much pathfinder
      //TODO: use path finder after deployment
      // const dataFromPathFinder = await getFromPathFinder(input);
      const dataFromPathFinder = await tempPathFinder(input);

      // remove afeter implementation

      setDataFromPathFinder(dataFromPathFinder as any);
      const amountOut = ethers.utils.formatEther(dataFromPathFinder.expectedAmountOut);
      setAmountOut(amountOut);
      return;
    } else {
      setDataFromPathFinder(undefined);
      setAmountOut("0");
    }
  };

  const tempPathFinder = async (input: PathFinderInput) => {
    const provider = new ethers.providers.JsonRpcProvider(PRC_URL);
    const uniAdapter = new ethers.Contract(UNI_ADDAPTER_ADDRESS, UNI_ADAPTER_ABI, provider);
    const quickswap = new ethers.Contract(QUICKSWAP_FACTORY_ADDRESS, UNISWAP_V2_FACTORY_ABI, provider);

    // TODO: update for real token
    input.options.tokenInAddr = "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889";
    input.options.tokenOutAddr = "0x3813e82e6f7098b9583FC0F33a962D02018B6803";

    const pool = await quickswap.getPair(input.options.tokenInAddr, input.options.tokenOutAddr);
    const expectedAmountOut = await uniAdapter.getAmountOut(
      input.options.tokenInAddr,
      input.options.amount,
      input.options.tokenOutAddr,
      pool
    );

    // address fromToken,
    // uint256 amountIn,
    // address toToken,
    // LinearWeightPathInfo memory linearWeightPathInfo,
    // FlashLoanDes[] memory flashDes,
    // uint256 minReturnAmount,
    // uint256 deadLine

    return { expectedAmountOut, pool };
  };

  const swap = async () => {
    if (!signer || !dataFromPathFinder) {
      return;
    }
    try {
      setIsloading(true);
      console.log("token0", tokens[token0Index].symbol);
      console.log("token1", tokens[token1Index].symbol);

      // const tokenInAddress = tokens[token0Index].address;
      // const tokenOutAddress = tokens[token1Index].address;
      const tokenInAddress = "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889";
      const tokenOutddress = "0x3813e82e6f7098b9583FC0F33a962D02018B6803";
      const erc20Address = tokenInAddress;
      const erc20 = new ethers.Contract(erc20Address, ERC20_ABI, signer);
      const allowance = await erc20.allowance(address, APPROVE_CONTRACT_ADDRESS);
      console.log(allowance);
      const wei = ethers.utils.parseEther(amountIn).toString();
      console.log(wei);
      const isApproved = ethers.BigNumber.from(allowance).gte(wei);
      console.log("isApproved", isApproved);
      if (!isApproved) {
        // TODO: make it controlled in button later
        const tx = await erc20.approve(APPROVE_CONTRACT_ADDRESS, wei);
        await tx.wait();
      }

      const routeProxy = new ethers.Contract(ROUTER_CONTRACT_ADDRESS, ROUTE_PROXY_ABI, signer);

      // struct WeightPathInfo {
      //   address fromToken;
      //   uint256 amountIn;
      //   address toToken;
      //   address to;
      //   uint256[] weights;
      //   address[] adapters;
      //   address[] pools;
      // }
      const weightPathInfo = [
        tokenInAddress,
        wei,
        tokenOutddress,
        address,
        [0],
        [UNI_ADDAPTER_ADDRESS],
        [dataFromPathFinder.pool],
      ];
      console.log(routeProxy);
      console.log(tokenInAddress, tokenOutddress, wei, weightPathInfo);
      await routeProxy.singleHopMultiSwap(tokenInAddress, wei, tokenOutddress, weightPathInfo);
      console.log(await routeProxy.owner());
      // const transaction = {
      //   from: address,
      //   to: ROUTER_CONTRACT_ADDRESS,
      //   value: "0",
      //   data: dataFromPathFinder?.metamaskSwapTransaction.data,
      //   gasPrice: "3000000",
      // };

      // await signer.sendTransaction(transaction);
    } catch (e) {
      console.error(e);
      setIsloading(false);
    }
  };

  const SelectToken: React.FC<SelectTokenProps> = ({ target }) => {
    const selfIndex = target === "token0" ? token0Index : token1Index;
    const oppositeIndex = target === "token0" ? token1Index : token0Index;
    const onSet = target === "token0" ? setToken0Index : setToken1Index;
    const onClose = target === "token0" ? onToken0ModalClose : onToken1ModalClose;

    const set = (i: number) => {
      onSet(i);
      onClose();
    };

    return (
      <Flex direction={"column"}>
        {tokens.map((token, i) => {
          return (
            <Button
              variant="ghost"
              size="lg"
              key={token.symbol}
              mx="-6"
              rounded="none"
              _hover={{ bg: "blue.50" }}
              justifyContent="left"
              isActive={i === selfIndex}
              disabled={i === oppositeIndex}
              onClick={() => set(i)}
            >
              <Flex justify={"space-between"} w="160px">
                <Box w="full">
                  <Image src={`/${tokens[i].icon}`} alt="icon" maxW="5" maxH="5" />
                </Box>
                <Text w="full" textAlign={"left"}>
                  {token.symbol}
                </Text>
              </Flex>
            </Button>
          );
        })}
      </Flex>
    );
  };

  return (
    <Stack spacing="4" pt="2">
      <Stack spacing="2">
        <Text fontSize="sm" fontWeight={"bold"} color="gray.800">
          You Pay
        </Text>
        <Flex justify={"space-between"} align="center">
          <Button
            rightIcon={<AiOutlineDown />}
            fontSize="md"
            color="gray.800"
            px="0"
            variant="ghost"
            leftIcon={<Image src={`/${tokens[token0Index].icon}`} alt="icon" maxW="5" maxH="5" />}
            _hover={{ bg: "white" }}
            _active={{ bg: "white" }}
            onClick={onToken0ModalOpen}
          >
            {tokens[token0Index].symbol}
          </Button>
          <Modal isOpen={isToken0Open} onClose={onToken0ModalClose} header="Select Paying Token">
            <SelectToken target="token0" />
          </Modal>
          <Input w="40" h="12" fontSize={"xl"} rounded="2xl" type="number" onChange={handleAmountInChange} />
        </Flex>
      </Stack>
      <Box position="relative" py="4">
        <Divider />
        <Flex position="absolute" w="full" top="0" justify={"center"}>
          <IconButton
            color="gray.800"
            onClick={changeDirection}
            aria-label="swap"
            icon={<MdSwapVert size="24px" />}
            background="white"
            rounded="full"
            size="sm"
            variant={"outline"}
          />
        </Flex>
      </Box>
      <Stack spacing="4">
        <Text fontSize="sm" fontWeight={"bold"} color="gray.800">
          You Receive
        </Text>
        <Flex justify={"space-between"} align="center">
          <Button
            leftIcon={<Image src={`/${tokens[token1Index].icon}`} alt="icon" maxW="5" maxH="5" />}
            rightIcon={<AiOutlineDown />}
            fontSize="md"
            color="gray.800"
            variant="ghost"
            px="0"
            _hover={{ bg: "white" }}
            _active={{ bg: "white" }}
            onClick={onToken1ModalOpen}
          >
            {tokens[token1Index].symbol}
          </Button>
          <Modal isOpen={isToken1Open} onClose={onToken1ModalClose} header="Select Receiving Token">
            <SelectToken target="token1" />
          </Modal>
          <Input w="40" h="12" disabled rounded="2xl" type="number" value={amountOut} />
        </Flex>
      </Stack>
      <ConnectWalletWrapper>
        <Button
          w="full"
          variant="outline"
          rounded="2xl"
          size="lg"
          fontSize="sm"
          color="white"
          backgroundColor={"purple.400"}
          _hover={{ bg: "purple.500" }}
          onClick={swap}
          disabled={!dataFromPathFinder || amountIn === "" || amountIn === "0" || isLoading}
          isLoading={isLoading}
        >
          Swap
        </Button>
      </ConnectWalletWrapper>
    </Stack>
  );
};

export const Swap: React.FC = () => {
  return (
    <Stack spacing="4">
      <Box boxShadow={"base"} borderRadius="2xl" pb="2" backgroundColor={"white"}>
        <Tabs colorScheme="blue">
          <TabList>
            <Tab pb="4" pt="4" px="4" roundedTopLeft={"2xl"} color="gray.800">
              Swap
            </Tab>
            <Tab pb="4" pt="4" px="4" color="gray.800">
              FlashLoan
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <InnerSwap mode="swap" />
            </TabPanel>
            <TabPanel>
              <InnerSwap mode="flashloan" />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
      <HStack boxShadow={"base"} borderRadius="2xl" p="6" spacing="4" backgroundColor={"white"}>
        <Flex backgroundColor={"purple.100"} w="10" h="10" justify={"center"} align="center" rounded="full">
          <Icon as={FaCoins} color="purple.400" />
        </Flex>
        <HStack color="gray.800">
          <Text as="span" fontWeight={"bold"} fontSize="md">
            569.96$
          </Text>
          <Text as="span" color={"gray.600"} fontSize="xs">
            in savings conpared to
          </Text>
          <Image src="/uni.png" alt="uni" h="5" />
        </HStack>
      </HStack>
    </Stack>
  );
};
