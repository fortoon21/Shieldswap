import { getDefaultProvider } from "ethers";
import { createClient } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";

export const wagmiClient = createClient({
  autoConnect: true,
  provider: getDefaultProvider(),
});

export const injectedConnector = new InjectedConnector();
