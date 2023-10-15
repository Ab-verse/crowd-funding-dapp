import React, { useEffect, useState } from "react";
import { contractAddress, abi } from "../utils/utils";
import { ethers } from "ethers";
import { Link } from "react-router-dom";

function Card() {
  const [campaignsData, setCampaignsData] = useState([]);

  const getCampaigns = async () => {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(contractAddress, abi, provider);
      try {
        const fetchCampaigns = await contract.getCampaigns();
        setCampaignsData(fetchCampaigns);
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    getCampaigns();
    
  }, []);

  return (
    <div className="text-white mt-10">
      {campaignsData.length > 0 ? (
        <div className="flex">
          {campaignsData.map((campaign, index) => (
            <div
              key={index}
              className="relative max-w-xs overflow-hidden rounded-2xl shadow-lg h-72 w-52 border border-gray-50 mx-2"
            >
              <img src={campaign.image} alt={`Campaign ${index + 1}`} />
              <div
                className="absolute flex items-end
          bg-gradient-to-t from-black/60 to-transparent"
              >
                <div className="p-4 text-white">
                  <Link
                  to={"/donateCampaignPage"}
                  state={{ campaign: campaign, index: index }}>
                    <h3 className="text-xs font-bold underline">
                      {campaign.title}
                    </h3>
                    <p className="text-xs text-gray-400 py-2">
                      {campaign.description}
                    </p>
                    <h3 className="mt-8 text-xs text-gray-200">
                      {ethers.utils.formatEther(campaign.target)} ETH <br />{" "}
                      <p className="text-xs text-gray-400">Goal</p>{" "}
                    </h3>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        "Loading..."
      )}
    </div>
  );
}

export default Card;
