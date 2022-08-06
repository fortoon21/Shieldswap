import { Box, Center, Container, Flex } from "@chakra-ui/react";
import React from "react";

import { Footer } from "../Footer";
import { Header } from "../Header";

export interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Box>
      <Flex minHeight={"100vh"} direction={"column"}>
        <Header />
        <Container flex={1} maxW={"6xl"} p="12">
          <Center>{children}</Center>
        </Container>
        <Footer />
      </Flex>
    </Box>
  );
};
