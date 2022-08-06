import { Box, Flex, HStack, Text } from "@chakra-ui/react";
import React from "react";

import { SERVICE_NAME } from "../../lib/app/constants";
import { ConnectWalletWrapper } from "../ConnectWalletWrapper";
import { SearchBox } from "../SearchBox";
import { Wallet } from "../Wallet";

export const Header: React.FC = () => {
  return (
    <Box p="4" as="header">
      <Flex justify="space-between">
        <Text>{SERVICE_NAME}</Text>
        <HStack spacing="4">
          <SearchBox />
          <ConnectWalletWrapper>
            <Wallet />
          </ConnectWalletWrapper>
        </HStack>
      </Flex>
    </Box>
  );
};
