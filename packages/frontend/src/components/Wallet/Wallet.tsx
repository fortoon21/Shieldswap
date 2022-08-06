import { Box, Button } from "@chakra-ui/react";
import React from "react";
import { useDisconnect } from "wagmi";

export const Wallet: React.FC = () => {
  const { disconnect } = useDisconnect();

  return (
    <Box>
      <Button onClick={() => disconnect()}>Disconnect</Button>
    </Box>
  );
};
