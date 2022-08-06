import { Box } from "@chakra-ui/react";
import axios from "axios";
import React from "react";

import { TOKEN_LIST_URI } from "../../lib/app/constants";
import { Token } from "../../type/token";

export const TokenList: React.FC = () => {
  const [tokenList, setTokenList] = React.useState<Token[]>([]);

  React.useEffect(() => {
    axios.get(TOKEN_LIST_URI).then(({ data: { tokens } }) => {
      setTokenList(tokens as Token[]);
    });
  }, []);

  return (
    <Box>
      {tokenList.map((token) => {
        return <Box key={token.address}>{token.address}</Box>;
      })}
    </Box>
  );
};
