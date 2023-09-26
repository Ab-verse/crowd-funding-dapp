import { useEffect } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import Image from "next/image";

// Extracted Content Component
function HomeContent() {
  const account = useAccount();

  // useEffect(() => {
  //   // Use JavaScript to set the background color for the body
  //   document.body.classList.add("bg-blue-950"); // Replace with the Tailwind CSS class for your desired background color
  // }, []);

  // useEffect(() => {
  //   console.log(account);
  // });

  return (
    <div className="text-white mx-12 mt-12 font-sans">
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
      <nav className="flex justify-between items-center pb-8 border-b-4 border-red-200">
        <div className="pl-20 text-5xl text-yellow-200">Crowd Funding DApp</div>
        <div className="mr-20">
          <ConnectButton label="Connect Wallet" />
        </div>
      </nav>
      <main className="px-20 py-12">
        <div className="flex justify-between items-start ">
          <div className="text-red-400">
            <p className="text-4xl">What is Crowdfunding?</p>
            <p className="text-4xl mt-2">The Clear and Simple</p>
            <p className="text-4xl mt-2">Answer</p>
            <p className="mt-16 text-red-50 text-lg ">
              Crowdfunding is a way to raise funds for a project, business, <br /> or
              cause by collecting small contributions from a large number of <br />
              people, typically via the internet.
            </p>
          </div>
          <div className="">
            <Image
              className="rounded-lg"
              src="/CrowdFundingHome.png"
              height={500}
              width={500}
              alt="Crowd Funding Image"
            ></Image>
          </div>
        </div>

      </main>
    </div>
  );
}

export default HomeContent;
