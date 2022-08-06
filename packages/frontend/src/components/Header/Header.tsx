import { Box, Button, Text } from "@chakra-ui/react";
import React from "react";

import { SERVICE_NAME } from "../../lib/constants";

export const Header: React.FC = () => {
  return (
    <Box>
      <Text>{SERVICE_NAME}</Text>
      <Button>Button</Button>
    </Box>
  );
};
