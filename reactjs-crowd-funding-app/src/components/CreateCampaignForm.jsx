import React, { useState } from "react";
import { contractAddress, abi } from "../utils/utils";
import { ethers } from "ethers";

function CreateCampaignForm({ walletAddress, isConnected, chainId }) {
  const [inputType, setInputType] = useState("text");
  const [isLoading, setIsLoading] = useState(false);
  const [notificationSuccess, setNotificationSuccess] = useState(false);
  const [notificationFail, setNotificationFail] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    target: "",
    deadline: "",
    image: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);

    // Parse the input date using the Date constructor
    const parsedDate = new Date(formData.deadline);

    // Convert to Unix timestamp (milliseconds since the Unix Epoch)
    const unixTimestampDeadline = parsedDate.getTime();

    console.log(unixTimestampDeadline);

    await createCampaign(
      walletAddress,
      formData.title,
      formData.description,
      ethers.utils.parseEther(formData.target),
      unixTimestampDeadline,
      formData.image
    );

    // Clear the form by resetting the state
    setFormData((prev) => ({
      ...prev,
      title: "",
      description: "",
      target: "",
      deadline: "",
      image: "",
    }));
  };

  const createCampaign = async (
    _owner,
    _title,
    _description,
    _target,
    _deadline,
    _image
  ) => {
    if (isConnected) {
      if (chainId == "80001") {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi, signer);

        try {
          setIsLoading(true); // Set loading to true while processing

          const transactionResponse = await contract.createCampaign(
            _owner,
            _title,
            _description,
            _target,
            _deadline,
            _image
          );
          console.log(`Mining ${transactionResponse.hash}`);

          const transactionReceipt = await transactionResponse.wait();
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

  return (
    <div>
      {notificationSuccess && (
        <div style={{ position: "fixed", top: 0, right: 0, padding: "20px" }}>
          <div
            id="toast-success"
            class="flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800"
            role="alert"
          >
            <div class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg dark:bg-green-800 dark:text-green-200">
              <svg
                class="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
              </svg>
              <span class="sr-only">Check icon</span>
            </div>
            <div class="ml-3 text-sm font-normal">Transaction Successfull!</div>
            <button
              type="button"
              onClick={() => setNotificationSuccess(false)}
              class="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
              data-dismiss-target="#toast-success"
              aria-label="Close"
            >
              <span class="sr-only">Close</span>
              <svg
                class="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
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
            class="flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800"
            role="alert"
          >
            <div class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-red-500 bg-red-100 rounded-lg dark:bg-red-800 dark:text-red-200">
              <svg
                class="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z" />
              </svg>
              <span class="sr-only">Error icon</span>
            </div>
            <div class="ml-3 text-sm font-normal">Transaction Failed!</div>
            <button
              type="button"
              onClick={() => setNotificationFail(false)}
              class="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
              data-dismiss-target="#toast-danger"
              aria-label="Close"
            >
              <span class="sr-only">Close</span>
              <svg
                class="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
            </button>
          </div>{" "}
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className="mx-44 my-10 bg-zinc-900 rounded-lg"
      >
        <div className="pt-6  text-center font-semibold text-2xl rounded-sm  ">
          {" "}
          <span className=" bg-zinc-800 px-4 py-2 rounded-lg">
            Start a Campaign 🚀
          </span>
        </div>
        <div className=" px-28 py-10 text-gray-300">
          <h1 className="py-1">Campaign Title* </h1>{" "}
          <input
            className="bg-transparent border border-slate-600 text-small placeholder-slate-500 rounded-sm"
            type="text"
            placeholder="Write a title"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />
          <div className="py-4">
            <h1 className="py-1">Story* </h1>{" "}
            <textarea
              className="w-full bg-transparent border border-slate-600 text-small placeholder-slate-500 rounded-sm"
              id=""
              cols="50"
              rows="5"
              value={formData.description}
              name="description"
              placeholder="Write your story"
              onChange={handleChange}
            ></textarea>
          </div>
          <div className="flex justify-between items-center py-4">
            <div className="w-full pr-4">
              <h1 className="py-1">Goal*</h1>{" "}
              <input
                className="w-full bg-transparent border border-slate-600 text-small placeholder-slate-500 rounded-sm"
                type="text"
                placeholder="0.50 Matic"
                value={formData.target}
                name="target"
                onChange={handleChange}
              />
            </div>
            <div className=" w-full">
              <h1 className="py-1">End Date*</h1>{" "}
              <input
                className="w-full bg-transparent border border-slate-600 text-small placeholder-slate-500 rounded-sm"
                type={inputType}
                value={formData.deadline}
                placeholder="DD/MM/YYYY"
                onFocus={() => setInputType("date")}
                onBlur={() => setInputType("text")}
                name="deadline"
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="pr-6">
            <h1 className="py-1">Campaign Image*</h1>{" "}
            <input
              className=" w-1/2 bg-transparent border border-slate-600 text-small placeholder-slate-500 rounded-sm"
              type="text"
              value={formData.image}
              placeholder="Place image URL of your nice campaign"
              name="image"
              onChange={handleChange}
            />
          </div>
          <div className="pt-10 text-center">
            <button type="submit">
              {" "}
              <span className="py-2 px-4 bg-green-500 hover:bg-white text-black font-semibold rounded-lg">
                {isLoading ? "Processing..." : "Submit new campaign"}
              </span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default CreateCampaignForm;
