import { Box, Button, Image, SimpleGrid, Stack } from "@chakra-ui/react";
import React from "react";
import { useConnect } from "wagmi";

import { injectedConnector, walletConnectConnector } from "../../lib/wagmi";

export interface ConnectWalletProps {
  callback?: () => void;
}

export const ConnectWallet: React.FC<ConnectWalletProps> = ({ callback }) => {
  const { connect } = useConnect();

  const connectMetamask = () => {
    connect({ connector: injectedConnector });
    if (callback) {
      callback();
    }
  };

  const connectWalletConnect = () => {
    connect({ connector: walletConnectConnector });
    if (callback) {
      callback();
    }
  };

  return (
    <Box>
      <Stack spacing="4">
        <Button
          rounded="2xl"
          width="full"
          fontSize={"sm"}
          variant="outline"
          onClick={connectMetamask}
          size="lg"
          color="gray.800"
          _hover={{ bg: "blue.50" }}
        >
          <Image src="/metamask.webp" alt="metamask" w="4" mr="2" /> Metamask
        </Button>
        <Button
          rounded="2xl"
          size="lg"
          width="full"
          fontSize={"sm"}
          variant="outline"
          onClick={connectWalletConnect}
          disabled={true}
        >
          <Image src="/walletConnect.png" alt="metamask" w="4" mr="2" /> Wallet Connect
        </Button>
      </Stack>
    </Box>
  );
};
