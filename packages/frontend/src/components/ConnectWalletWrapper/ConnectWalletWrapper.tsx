import { Box, Button, useDisclosure } from "@chakra-ui/react";
import React from "react";

// import { useAccount } from "wagmi";
import { useIsWagmiConnected } from "../../hooks/useIsWagmiConnected";
import { ConnectWallet } from "../ConnectWallet";
import { Modal } from "../Modal";

export interface ConnectWalletWrapperProps {
  children: React.ReactNode;
}

export const ConnectWalletWrapper: React.FC<ConnectWalletWrapperProps> = ({
  children,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isWagmiConnected } = useIsWagmiConnected();

  return (
    <Box>
      {!isWagmiConnected && (
        <Box>
          <Button width="full" onClick={onOpen}>
            Connect Wallet
          </Button>
          <Modal onClose={onClose} isOpen={isOpen}>
            <ConnectWallet />
          </Modal>
        </Box>
      )}
      {isWagmiConnected && <Box>{children}</Box>}
    </Box>
  );
};
