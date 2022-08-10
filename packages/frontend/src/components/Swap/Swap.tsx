import {
  Box,
  Button,
  Divider,
  Flex,
  HStack,
  Icon,
  Image,
  Input,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { FaCoins } from "react-icons/fa";

import { ConnectWalletWrapper } from "../ConnectWalletWrapper";

export interface InnerSwapProps {
  mode: "swap" | "flashloan";
}

export const InnerSwap: React.FC<InnerSwapProps> = ({ mode }) => {
  return (
    <Stack spacing="6" pt="2">
      <Stack spacing="2">
        <Text fontSize="sm" fontWeight={"bold"} color="gray.800">
          You Pay
        </Text>
        <Flex justify={"space-between"} align="center">
          <Text fontSize="md" color="gray.800">
            Select Token
          </Text>
          <Input w="40" h="12" fontSize={"xl"} rounded="2xl" />
        </Flex>
      </Stack>
      <Divider />
      <Stack spacing="4">
        <Text fontSize="sm" fontWeight={"bold"} color="gray.800">
          You Receive
        </Text>
        <Flex justify={"space-between"} align="center">
          <Text fontSize="md" color="gray.800">
            Select Token
          </Text>
          <Input w="40" h="12" disabled rounded="2xl" />
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
          {/* <Text as="span" color={"gray.600"} fontSize="xs">
            Protocol
          </Text> */}
        </HStack>
      </HStack>
    </Stack>
  );
};
