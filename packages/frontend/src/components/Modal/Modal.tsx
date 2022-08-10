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
        <ModalContent m="4" rounded="2xl">
          <ModalHeader>
            <ModalCloseButton color={"gray.800"} />
          </ModalHeader>
          <ModalBody px="8" pt="4" pb="8">
            {children}
          </ModalBody>
        </ModalContent>
      </_Modal>
    </Box>
  );
};
