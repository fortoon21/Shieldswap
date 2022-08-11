import "cross-fetch/polyfill";

import { ApolloClient, gql, InMemoryCache } from "@apollo/client";

export const clients = {
  v3: new ApolloClient({
    uri: "https://api.thegraph.com/subgraphs/name/0xfind/uniswap-v3-mumbai",
    cache: new InMemoryCache(),
  }),
};

export const QUERY_POOLS_ID = gql`
  query {
    pools {
      id
    }
  }
`;
