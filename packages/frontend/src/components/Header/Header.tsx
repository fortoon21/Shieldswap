import { Box, Flex, Text } from "@chakra-ui/react";
import React from "react";

import { SERVICE_NAME } from "../../lib/constants";
import { SearchBox } from "../SearchBox";

export const Header: React.FC = () => {
  return (
    <Box p="4" as="header">
      <Flex justify={"space-between"}>
        <Text>{SERVICE_NAME}</Text>
        <SearchBox />
      </Flex>
    </Box>
  );
};
