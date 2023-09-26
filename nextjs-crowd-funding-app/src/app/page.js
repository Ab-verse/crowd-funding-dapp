"use client";
// Import Statements
import  { useEffect } from "react";
import HomeContent from "./components/HomeContent";
import CreateCampaign from "./components/CreateCampaign";
// require("dotenv").config();



// RainbowKit and Wagmi Integration
import "@rainbow-me/rainbowkit/styles.css";
import {
  getDefaultWallets,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import {
  configureChains,
  createConfig, 
  WagmiConfig,
} from "wagmi";
import { sepolia } from "wagmi/chains";
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from "wagmi/providers/public";

// Configure Chains and Wallets
const { chains, publicClient } = configureChains([sepolia], [
  alchemyProvider({ apiKey: "yhN7F2vQ9rUhr6ATQzuqrZrKO1xY_ejz" }),
  publicProvider(),
]);
const { connectors } = getDefaultWallets({
  appName: "Crowd Funding DApp",
  projectId: "62b52aa7b3d958a83fb25e85e8d98df1",
  chains,
});
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

// Main Page Component
function Page() {
  // Wrap the useAccount hook with WagmiConfig
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider coolMode modalSize="compact" chains={chains}>
        <HomeContent />
        <CreateCampaign />
      </RainbowKitProvider>
    </WagmiConfig>
  );
}


export default Page;