import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { defineChain } from "viem";

export const zeroGGalileo = defineChain({
  id: 16602,
  name: "0G Galileo Testnet",
  nativeCurrency: { name: "0G", symbol: "0G", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://evmrpc-testnet.0g.ai"] },
  },
  blockExplorers: {
    default: { name: "Chainscan", url: "https://chainscan-galileo.0g.ai" },
  },
  testnet: true,
});

export const wagmiConfig = getDefaultConfig({
  appName: "Mirror®",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? "9e756701aff1bcafe0b756ed6a329cf4",
  chains: [zeroGGalileo],
  ssr: true,
});
