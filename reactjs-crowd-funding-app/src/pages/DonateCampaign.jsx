import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { ConnectWallet, useAddress, ChainId } from "@thirdweb-dev/react";
import { ethers } from "ethers";
import { contractAddress, abi } from "../utils/utils";

function DonateCampaignPage() {
  let fetchAddress = useAddress();
  const [address, setAddress] = useState("");
  const [numBackers, setNumBackers] = useState("");
  const [daysLeftInDays, setDateLeftInDays] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { state } = useLocation();
  const [chainId, setChainId] = useState(fetchAddress);
  const [notificationSuccess, setNotificationSuccess] = useState(false);
  const [notificationFail, setNotificationFail] = useState(false);
  const [formData, setFormData] = useState({
    fund: "",
  });
  const acceptedChainId = String(ChainId.Mumbai);

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

  useEffect(() => {
    setAddress(fetchAddress);
  }, [fetchAddress]);

  useState(() => {
    daysLeft(state.campaign.deadline._hex);
  }, [daysLeftInDays]);

  const fetchBackers = async () => {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(contractAddress, abi, provider);
      try {
        const fetchDonators = await contract.getDonators(state.index);

        // Create a Set from the array to remove duplicates
        const setWithoutDuplicates = new Set(fetchDonators[0]);

        // Convert the Set back to an array
        const arrayWithoutDuplicates = [...setWithoutDuplicates];

        setNumBackers(arrayWithoutDuplicates.length);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const sendTransaction = async (id, value) => {
    if (address) {
      if (chainId == "80001") {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi, signer);

        try {
          setIsLoading(true); // Set loading to true while processing

          const transactionResponse = await contract.donateToCampaign(id, {
            value: ethers.utils.parseEther(value),
          });
          console.log(`Mining ${transactionResponse.hash}`);

          const transactionReceipt = await transactionResponse.wait();
          fetchBackers();
          setNotificationSuccess(true);

          console.log("Status:", transactionReceipt.status);
          console.log("Gas used:", transactionReceipt.gasUsed.toString());
        } catch (error) {
          console.log(error);
          setNotificationFail(true);
        } finally {
          setIsLoading(false); // Set loading back to false after processing
        }
      } else {
        console.log("Switch to Sepolia!");
      }
    } else {
      console.log("Connect your wallet!");
    }
  };

  useState(() => {
    fetchBackers();
  });

  function convertUnixTimestampToDateString(unixTimestamp) {
    const decimalNumber = parseInt(unixTimestamp, 16);
    const readableDate = new Date(decimalNumber);
    // Get the components of the date
    const year = readableDate.getUTCFullYear();
    const month = (readableDate.getUTCMonth() + 1).toString().padStart(2, "0"); // Months are zero-based, so we add 1
    const day = readableDate.getUTCDate().toString().padStart(2, "0");

    // Format the date as a string in "YYYY-MM-DD" format
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
  }

  function daysLeft() {
    const targetDate = convertUnixTimestampToDateString(
      state.campaign.deadline._hex
    );
    // Get the current date
    const currentDate = new Date();

    // Set the expiration date
    const expirationDate = new Date(targetDate);

    // Calculate the difference in milliseconds
    const timeDifference = expirationDate - currentDate;

    // Convert the difference to days
    const daysLeft = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

    setDateLeftInDays(daysLeft);
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await sendTransaction(state.index, formData.fund);

    // Clear the form by resetting the state
    setFormData((prev) => {
      return { ...prev, fund: "" };
    });
  };

  return (
    <>
      <div className="text-white">
        <div className="text-right ">
          <ConnectWallet
            className=" !bg-green-700"
            theme="dark"
            btnTitle="Connect Wallet"
            modalSize="wide"
          />
        </div>
        {notificationSuccess && (
          <div style={{ position: "fixed", top: 0, right: 0, padding: "20px" }}>
            <div
              id="toast-success"
              className="flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800"
              role="alert"
            >
              <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg dark:bg-green-800 dark:text-green-200">
                <svg
                  className="w-5 h-5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                </svg>
                <span className="sr-only">Check icon</span>
              </div>
              <div className="ml-3 text-sm font-normal">
                Transaction Successfull!
              </div>
              <button
                type="button"
                onClick={() => setNotificationSuccess(false)}
                className="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
                data-dismiss-target="#toast-success"
                aria-label="Close"
              >
                <span className="sr-only">Close</span>
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}
        {notificationFail && (
          <div style={{ position: "fixed", top: 0, right: 0, padding: "20px" }}>
            {" "}
            <div
              id="toast-danger"
              className="flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800"
              role="alert"
            >
              <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-red-500 bg-red-100 rounded-lg dark:bg-red-800 dark:text-red-200">
                <svg
                  className="w-5 h-5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z" />
                </svg>
                <span className="sr-only">Error icon</span>
              </div>
              <div className="ml-3 text-sm font-normal">
                Transaction Failed!
              </div>
              <button
                type="button"
                onClick={() => setNotificationFail(false)}
                className="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
                data-dismiss-target="#toast-danger"
                aria-label="Close"
              >
                <span className="sr-only">Close</span>
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
              </button>
            </div>{" "}
          </div>
        )}
        {address && chainId == acceptedChainId ? (
          <div>
            <form
              onSubmit={handleSubmit}
              className="mx-80 my-10  rounded-lg border border-gray-700"
            >
              <div className="">
                <img
                  className=" rounded-t-lg h-80 w-full "
                  loading="lazy"
                  src={state.campaign.image}
                  alt="image"
                />
              </div>
              <div className="py-10 ">
                <div className="pb-10 text-center">
                  <h1 className=" text-2xl">{state.campaign.title}</h1>
                  <p className="text-gray-500 text-base">
                    {state.campaign.description}
                  </p>
                </div>

                <div className="py-2 border border-gray-700">
                  <h1 className="text-lg">Creator 🫅</h1>
                  <p className="text-gray-500 text-sm">
                    {state.campaign.owner}
                  </p>
                </div>

                <div className="py-2 border border-gray-700">
                  <h1 className="text-lg">Total Backers 🫂</h1>
                  <p className="text-gray-500 text-sm">{numBackers}</p>
                </div>

               

                <div className="py-2 border border-gray-700">
                  <h1 className="text-lg">Donate 💁‍♂️</h1>
                  <input
                    type="text"
                    placeholder="0.001 Matic"
                    className="w-1/2 text-base bg-transparent border border-slate-700  placeholder-slate-500 rounded-sm"
                    name="fund"
                    value={formData.fund}
                    onChange={handleChange}
                  />{" "}
                  <br />
                  <button className="mt-2 px-3 py-2 bg-green-600 rounded-lg text-black hover:bg-white text-sm  ">
                    {isLoading ? "Processing..." : "Fund"}
                  </button>
                </div>
                <div className="mt-10 italic font-googleFontAmatic text-4xl text-yellow-300">
                  <marquee behavior="scroll" direction="Left">
                    {" "}
                    {daysLeftInDays > 0 ? (
                      <h1>
                        This Campaign will be closed in {daysLeftInDays} Days
                      </h1>
                    ) : (
                      <h1>This Campaign has been closed!</h1>
                    )}
                  </marquee>
                </div>
              </div>
            </form>
          </div>
        ) : (
          <div className="italic font-googleFontAmatic text-4xl text-yellow-300 mt-48">
            <marquee behavior="scroll" direction="Left">
              Please connect your wallet. The Supported chain is 'Polygon
              Mumbai' (80001)!{" "}
            </marquee>
          </div>
        )}
      </div>
    </>
  );
}

export default DonateCampaignPage;
