import {
  Box,
  Modal as _Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import React from "react";

export interface ModalProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

export const Modal: React.FC<ModalProps> = ({ children, isOpen, onClose }) => {
  return (
    <Box>
      <_Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent m="4">
          <ModalHeader>
            <ModalCloseButton />
          </ModalHeader>
          <ModalBody p="8">{children}</ModalBody>
        </ModalContent>
      </_Modal>
    </Box>
  );
};
