import {
  Box,
  Modal as _Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import React from "react";

export interface ModalProps {
  header?: string;
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

export const Modal: React.FC<ModalProps> = ({ header, children, isOpen, onClose }) => {
  return (
    <Box>
      <_Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent m="4" rounded="2xl" maxWidth="md">
          <ModalHeader>
            {header && (
              <Text fontSize="sm" color={"gray.800"}>
                {header}
              </Text>
            )}
            <ModalCloseButton color={"gray.800"} size="sm" />
          </ModalHeader>
          <ModalBody px="6" pt="2" pb="8">
            {children}
          </ModalBody>
        </ModalContent>
      </_Modal>
    </Box>
  );
};
