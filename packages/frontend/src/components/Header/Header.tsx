import { Box, Button, Flex, HStack, Icon, Image, Stack, Text, useDisclosure } from "@chakra-ui/react";
import React from "react";
import { AiOutlineCheckCircle, AiOutlineFileProtect } from "react-icons/ai";
import { useNetwork } from "wagmi";

import { SERVICE_NAME } from "../../lib/app/constants";
import { ConnectWalletWrapper } from "../ConnectWalletWrapper";
import { Modal } from "../Modal";
import { Wallet } from "../Wallet";

export const Header: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { chain } = useNetwork();

  const addMumbaiNetwork = async () => {
    if (!window || !window.ethereum) {
      return;
    }
    await window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId: "0x13881",
          chainName: "Polygon MUmbai",
          nativeCurrency: { name: "Matic", symbol: "MATIC", decimals: 18 },
          rpcUrls: ["https://rpc-mumbai.matic.today"],
          blockExplorerUrls: ["https://mumbai.polygonscan.com"],
        },
      ],
    });
  };

  return (
    <Box p="4" as="header">
      <Flex justify="space-between" align="center">
        <HStack>
          <Image src="/logo.png" alt="logo" h="10" />
        </HStack>
        <ConnectWalletWrapper>
          <HStack spacing="2">
            <Button variant="outline" rounded="2xl" fontSize={"sm"} onClick={onOpen} size="lg" p="0">
              <Image src="/polygon.png" alt="polygon" w="4" h="4" />
            </Button>
            <Wallet />
          </HStack>
          <Modal isOpen={isOpen} onClose={onClose}>
            <Stack spacing="6">
              <Text align="center" fontWeight={"bold"} color="gray.800">
                Available on Polygon Mumbai
              </Text>
              {chain && chain.network !== "80001" ? (
                <HStack>
                  <Button
                    variant="outline"
                    rounded="2xl"
                    width="full"
                    fontSize={"sm"}
                    onClick={addMumbaiNetwork}
                    color="gray.800"
                  >
                    Add
                  </Button>
                </HStack>
              ) : (
                <Flex justify={"center"} align="center">
                  <Text align="center" mr="2" fontSize="sm" color="gray.800">
                    Connected
                  </Text>
                  <Icon color="purple.400" as={AiOutlineCheckCircle} />
                </Flex>
              )}
            </Stack>
          </Modal>
        </ConnectWalletWrapper>
      </Flex>
    </Box>
  );
};
