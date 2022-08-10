import { Box, Button, HStack, Image } from "@chakra-ui/react";
import React from "react";
import { useDisconnect } from "wagmi";

export const Wallet: React.FC = () => {
  const { disconnect } = useDisconnect();

  return (
    <Box>
      <Button
        rounded="2xl"
        width="full"
        fontSize={"sm"}
        variant="outline"
        onClick={() => disconnect()}
        size="lg"
        color="gray.800"
        _hover={{ bg: "blue.50" }}
      >
        Disconnect
      </Button>
    </Box>
  );
};
