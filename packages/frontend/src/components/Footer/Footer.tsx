import { Box, ButtonGroup, IconButton, Stack, Text } from "@chakra-ui/react";
import React from "react";

import { SERVICE_NAME } from "../../lib/constants";
import { icons } from "./data";

export const Footer: React.FC = () => {
  return (
    <Box p="4" as="footer">
      <Stack justify="space-between" direction="row" align="center">
        <Text>
          &copy; {new Date().getFullYear()} {SERVICE_NAME}
        </Text>
        <ButtonGroup variant={"ghost"}>
          {icons.map((icon) => (
            <IconButton
              key={icon.key}
              as="a"
              href={icon.href}
              target="_blank"
              aria-label={icon.key}
              icon={icon.icon}
            />
          ))}
        </ButtonGroup>
      </Stack>
    </Box>
  );
};
