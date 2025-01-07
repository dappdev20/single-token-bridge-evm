import Image from "next/image";
import { Inter } from "next/font/google";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { BiSolidDownArrow } from "react-icons/bi";
import Logo from "../public/Logo.svg";
import Swap from "./assets/Swap";

import React, { useState, useEffect } from "react";

export default function Home({ sendDataToParent }) {
  const [value, setValue] = useState("");
  const [topname, settopName] = useState("XRP");
  const [downname, setdownName] = useState("BSC");

  const handleswapButtonClick = () => {

    settopName(topname === "BSC" ? "XRP" : "BSC");
    setdownName(downname == "XRP" ? "BSC" : "XRP");
  };

  const handleConnect = async () => {
    // await client.connect()
    // const fund_result = await client.fundWallet()
    // console.log(fund_result)
  }

  return (
    <div className="bg-[#17161b] h-screen flex justify-center items-center py-10 px-4">
      <div className="bg-[#252027] rounded-xl p-4 max-w-3xl w-full mx-auto">
        <div className="bg-[#353037] rounded-lg p-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4 mt-7">
              <div className="w-10 h-10 rounded-full p-1 bg-[#212325] flex justify-center items-center">
                <img src={Logo} alt="" className="h-7" />
              </div>

              <div>
                <span className="text-[#bab6bc] font-normal text-sm">From</span>
                <div className="text-[#ebefe9] flex gap-4 cursor-pointer">
                  <p>{topname}</p>
                  <BiSolidDownArrow className="text-xs" />
                </div>
              </div>
            </div>

            <div className="text-[#f0e9fc] text-base">
              <button
                className="w-full bg-[#3ab0ff] text-[#efefef] font-medium text-center p-[10px] rounded-xl mt-7"
                onClick={handleConnect}
              >
                Connect Wallet
              </button>
            </div>
          </div>

          <div className="border rounded p-2 border-[#4d484f] mt-5 flex gap-3">
            <div className="w-32 rounded p-2 bg-[#565158] h-12 flex items-center gap-3 relative">
              <div className="w-7 h-7 rounded-full p-1 bg-[#212325] flex justify-center items-center">
                <img src={Logo} alt="" className="h-4" />
              </div>

              <div className="flex-1">
                <div className="text-[#ebefe9] flex gap-4 cursor-pointer items-center">
                  <p>USDT</p>
                  <BiSolidDownArrow className="text-xs" />
                </div>
              </div>
            </div>
            <input
              type="text"
              placeholder="0.00000"
              className="bg-transparent flex-1 outline-none border-none text-base text-[#ebefe9]"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-center items-center">
          <button onClick={handleswapButtonClick}>
            <Swap className="h-10 w-10" />
          </button>
        </div>

        <div className="bg-[#353037] rounded-lg p-3">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full p-1 bg-[#212325] flex justify-center items-center">
              <img src={Logo} alt="" className="h-6" />
            </div>
            <div>
              <span className="text-[#bab6bc] font-normal text-sm">To</span>
              <div className="text-[#ebefe9] flex gap-4 cursor-pointer">
                <p>{downname}</p>
                <BiSolidDownArrow className="text-xs" />
              </div>
            </div>
          </div>

          <div className="border rounded p-2 border-[#4d484f] mt-5 flex gap-3">
            <div className="w-32 rounded p-2 bg-[#565158] h-12 flex items-center gap-3 relative">
              <div className="w-7 h-7 rounded-full p-1 bg-[#212325] flex justify-center items-center">
                <img src={Logo} alt="" className="h-4" />
              </div>

              <div className="flex-1">
                <div className="text-[#ebefe9] flex gap-4 cursor-pointer items-center">
                  <p>USDT</p>
                  <BiSolidDownArrow className="text-xs" />
                </div>
              </div>
            </div>
            <input
              type="text"
              placeholder="0.00000"
              className="bg-transparent flex-1 outline-none border-none text-base text-[#ebefe9]"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 mt-2">
              <p className="text-[#78737b] text-base font-medium">
                Expected Price on
              </p>
              <img src={Logo} alt="" className="h-5" />
              <span className="text-[#fcfafd] text-base font-medium">
                Aribiturm
              </span>
            </div>
            <div>
              <span className="text-[#78737b] text-base font-medium">0.0 </span>
              <span className="text-[#fcfafd] text-base font-medium">USDT</span>
            </div>
          </div>

          <div className="text-[#78737b] text-base font-medium flex justify-between items-center mt-2">
            Slippage
            <span>-</span>
          </div>

          <button
            className="w-full bg-[#3ab0ff] text-[#efefef] font-medium text-center p-[10px] rounded-xl mt-7"
          >
            Bridge
          </button>
        </div>
      </div>
    </div>
  );
}
