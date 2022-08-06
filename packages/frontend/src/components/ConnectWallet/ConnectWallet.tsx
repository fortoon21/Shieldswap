import { Box, Button } from "@chakra-ui/react";
import React from "react";
import { useConnect } from "wagmi";

import { injectedConnector } from "../../lib/wagmi";

export const ConnectWallet: React.FC = () => {
  const { connect } = useConnect();

  return (
    <Box>
      <Button
        width="full"
        onClick={() => connect({ connector: injectedConnector })}
      >
        Metamask
      </Button>
    </Box>
  );
};
