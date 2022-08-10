import { getDefaultProvider } from "ethers";
import { createClient } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";

export const wagmiClient = createClient({
  autoConnect: true,
  provider: getDefaultProvider(),
});

export const walletConnectConnector = new WalletConnectConnector({
  chains: [
    {
      id: 80001,
      name: "polygon-mumbai",
      network: "Polygon Mumbai",
      rpcUrls: { default: "https://polygon-mumbai.g.alchemy.com/v2/vzOwiL7MTT2bjnZozNtemIWyq0zC6oYW" },
    },
  ],
  options: {
    qrcode: true,
  },
});

export const injectedConnector = new InjectedConnector();
