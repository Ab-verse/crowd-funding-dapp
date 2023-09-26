import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAccount } from "wagmi";

const CreateCampaign = () => {
  const account = useAccount();

  return (
    <>
      <div className=" text-white mx-32">
        {account.isConnected ? (
          <div>
            <Link href="/pages/createCampaign">
              <button className=" font-bold bg-green-500 text-white border border-solid px-2 py-2 rounded-xl hover:bg-transparent hover:text-yellow-200 border-green-600">
                Create Campaign
              </button>
            </Link>
          </div>
        ) : (
          <div className="text-4xl text-yellow-300">
            Please connect your wallet. The Supported chain is 'Sepolia'!{" "}
          </div>
        )}
      </div>
    </>
  );
};

export default CreateCampaign;
