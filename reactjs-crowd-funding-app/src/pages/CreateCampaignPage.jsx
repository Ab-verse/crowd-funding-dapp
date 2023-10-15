import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";
import CreateCampaignForm from "../components/CreateCampaignForm";
import { ConnectWallet, useAddress } from "@thirdweb-dev/react";


function CreateCampaignPage() {
  let fetchAddress = useAddress();
  const [chainId, setChainId] = useState(fetchAddress);
  const [address, setAddress] = useState("");
  const [acceptedChainId, setAcceptedChainId] = useState("");
  const { state } = useLocation();

  useEffect(() => {
    setAddress(fetchAddress);
  }, [fetchAddress]);

  useEffect(() => {
    setAcceptedChainId(state.acceptedChainId);
  }, []);

  // Fetch chain id
  useEffect(() => {
    const fetchChainId = async () => {
      try {
        // Check if window.ethereum is available
        if (window.ethereum) {
          // Request the chain ID from MetaMask
          const network = await window.ethereum.request({
            method: "eth_chainId",
          });

          // Parse the hexadecimal chain ID to a decimal number
          const decimalChainId = parseInt(network, 16);

          setChainId(decimalChainId);
        } else {
          console.error("MetaMask is not available");
        }
      } catch (error) {
        console.error("Error fetching chain ID:", error);
      }
    };

    fetchChainId();
  });

  return (
      <div className="text-white">
        <div className=" flex justify-end items-start">
          <ConnectWallet
            className=" !bg-green-700"
            theme="dark"
            btnTitle="Connect Wallet"
            modalSize="wide"
          />
        </div>
        {address && chainId == acceptedChainId && (
          <div>
            <CreateCampaignForm
              walletAddress={address}
              isConnected={address}
              chainId={chainId}
            />
          </div>
        )}

        <div className="mt-10">
          {!address && (
            <div className="italic font-googleFontAmatic text-4xl text-yellow-300">
              <marquee behavior="scroll" direction="Left">
                Please connect your wallet. The Supported chain is 'Polygon
                Mumbai' (80001)!{" "}
              </marquee>
            </div>
          )}
        </div>
        <div className="mt-10">
          {address && !(chainId == acceptedChainId) && (
            <div className="italic font-googleFontAmatic text-4xl text-yellow-300">
              <marquee behavior="scroll" direction="Left">
                Please Switch to Mumbai Testnet (80001) to Proceed!
              </marquee>
            </div>
          )}
        </div>
      </div>
  );
}

export default CreateCampaignPage;

