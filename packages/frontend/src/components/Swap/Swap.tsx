import { Box, Divider, Stack, Text, useColorModeValue } from "@chakra-ui/react";
import React from "react";

import { ConnectWalletWrapper } from "../ConnectWalletWrapper";

export const Swap: React.FC = () => {
  return (
    <Box
      boxShadow={useColorModeValue("md", "md-dark")}
      borderRadius="2xl"
      py="8"
    >
      <Stack spacing="4" px="8">
        <Stack spacing="2">
          <Text>You Pay</Text>
          <Text>Selct Token</Text>
        </Stack>
        <Divider />
        <Stack spacing="2">
          <Text>You Receive</Text>
          <Text>Selct Token</Text>
        </Stack>
        <ConnectWalletWrapper>Swap</ConnectWalletWrapper>
      </Stack>
    </Box>
  );
};
