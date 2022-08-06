import "../styles/globals.css";

import { ChakraProvider } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import { WagmiConfig } from "wagmi";

import { wagmiClient } from "../lib/wagmi";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <WagmiConfig client={wagmiClient}>
        <Component {...pageProps} />
      </WagmiConfig>
    </ChakraProvider>
  );
}

export default MyApp;
