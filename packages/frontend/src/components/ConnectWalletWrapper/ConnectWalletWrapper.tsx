import { Box, Button, useDisclosure } from "@chakra-ui/react";
import React from "react";

import { useIsWagmiConnected } from "../../../hooks/useIsWagmiConnected";
import { ConnectWallet } from "../ConnectWallet";
import { Modal } from "../Modal";

export interface ConnectWalletWrapperProps {
  children: React.ReactNode;
}

export const ConnectWalletWrapper: React.FC<ConnectWalletWrapperProps> = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isWagmiConnected } = useIsWagmiConnected();

  return (
    <Box>
      {!isWagmiConnected && (
        <Box>
          <Button
            variant="outline"
            rounded="2xl"
            width="full"
            fontSize={"sm"}
            onClick={onOpen}
            size="lg"
            color="gray.800"
          >
            Connect Wallet
          </Button>
          <Modal onClose={onClose} isOpen={isOpen}>
            <ConnectWallet callback={onClose} />
          </Modal>
        </Box>
      )}
      {isWagmiConnected && <Box>{children}</Box>}
    </Box>
  );
};
