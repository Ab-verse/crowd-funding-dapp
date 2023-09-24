"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import { ConnectButton } from '@rainbow-me/rainbowkit';


// Rainbow kit integration
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { sepolia } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";

const { chains, publicClient } = configureChains([sepolia], [publicProvider()]);
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

function page() {
  // useEffect(() => {
  //   // Use JavaScript to set the background color for the body
  //   document.body.classList.add("bg-blue-950"); // Replace with the Tailwind CSS class for your desired background color
  // }, []);
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider coolMode modalSize="compact" chains={chains}>
        <div className="text-white m-12 ">
          {/* <style jsx global>{`
        body {
          background: ${"red"};
        }
      `}</style> */}

          <style jsx global>{`
            body {
              background: #000000;
            }
          `}</style>
          <nav className="flex justify-between items-center">
            <div className="pl-20">Search Campaigns</div>
            <div>
            <ConnectButton label="Connect Wallet"/>
            </div>
          </nav>
          <main className="p-20">Your Campaigns</main>
        </div>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default page;
