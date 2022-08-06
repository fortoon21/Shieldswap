import "../src/styles/globals.css";
import { WagmiConfig } from "wagmi";

import { wagmiClient } from "../src/lib/wagmi";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

export const decorators = [
  (Story) => (
    <WagmiConfig client={wagmiClient}>
      <Story />
    </WagmiConfig>
  ),
];
