import React, { useEffect, useState } from "react";
import { ConnectWallet, useAddress, ChainId } from "@thirdweb-dev/react";
import crowdFundingImageMain from "../assets/CrowdFundingHome.png";
import { Link } from "react-router-dom";
import Card from "./Card";

const HomePage = () => {
  let fetchAddress = useAddress();
  const [chainId, setChainId] = useState("");
  const [address, setAddress] = useState("");
  const acceptedChainId = String(ChainId.Mumbai);

  useEffect(() => {
    setAddress(fetchAddress);
  }, [fetchAddress]);

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
    <>
      <div className=" text-white  flex justify-between items-center">
        <div className="text-5xl font-googleFontAmatic text-red-500  border-b-2 border-b-red-300">
          📣 CROWD FUNDING DAPP{" "}
        </div>
        <div>
          <ConnectWallet
            className=" !bg-green-700"
            theme="dark"
            btnTitle="Connect Wallet"
            modalSize="wide"
          />
        </div>
      </div>

      <div className="mt-28 flex justify-between items-start ">
        <div className="text-red-400 font-light">
          <p className="text-3xl">What is Crowdfunding?</p>
          <p className="text-3xl mt-2">The Clear and Simple</p>
          <p className="text-3xl mt-2">Answer</p>
          <p className="mt-16 text-red-50 text-lg ">
            Crowdfunding is a way to raise funds for a project, business, <br />{" "}
            or cause by collecting small contributions from a large number of{" "}
            <br />
            people, typically via the internet.
          </p>
          {address && chainId == acceptedChainId ? (
            <div className="py-10">
              <Link
                to={"/createCampaignPage"}
                state={{ acceptedChainId: acceptedChainId }}
              >
                <button className="px-3 py-2 font-medium bg-green-500 text-black hover:bg-white rounded-lg">
                  Create Campaign
                </button>
              </Link>
            </div>
          ) : (
            address && (
              <div className="mt-10 italic font-googleFontAmatic text-4xl text-yellow-300">
                <marquee behavior="scroll" direction="Left">
                  {" "}
                  Please Switch to Mumbai Testnet (80001) to Proceed!
                </marquee>
              </div>
            )
          )}
        </div>
        <div className="">
          <img
            loading="lazy"
            className="rounded-lg"
            src={crowdFundingImageMain}
            alt="homepagepic"
            height={500}
            width={500}
          />
        </div>
      </div>
      <div>
        {!address && (
          <div className="italic font-googleFontAmatic text-4xl text-yellow-300">
            <marquee behavior="scroll" direction="Left">
              Please connect your wallet. The Supported chain is 'Polygon
              Mumbai' (80001)!{" "}
            </marquee>
          </div>
        )}
      </div>
      <div>
        {address && chainId == acceptedChainId && (
          <div className="mt-24 text-white">
            <h3 className="text-3xl">All Campaigns:</h3>
            <Card />
          </div>
        )}
      </div>
    </>
  );
};

export default HomePage;
