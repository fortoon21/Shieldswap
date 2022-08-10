import { Box, Container, Flex } from "@chakra-ui/react";
import React from "react";

import { Footer } from "../Footer";
import { Header } from "../Header";

export interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Box bgGradient="linear(to-t, blue.50, purple.50)">
      <Flex minHeight={"100vh"} direction={"column"}>
        <Header />
        <Container flex={1} maxWidth="md" px="4" pt="4">
          {children}
        </Container>
        <Footer />
      </Flex>
    </Box>
  );
};
