import Image from "next/image";
import { Inter } from "next/font/google";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { BiSolidDownArrow } from "react-icons/bi";
import Logo from "../public/Logo.svg";

import React, { useState, useEffect } from "react";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import Web3 from "web3";
import { ApproveToken } from "@/components/Approve";
//import { abi } from "./ABI/abi.json";

const inter = Inter({ subsets: ["latin"] });

const abi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "lockTokens",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_token",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "TokensLocked",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "TokensUnlocked",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_tokenupdate",
        type: "address",
      },
    ],
    name: "Tokenupdate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_resiver",
        type: "address",
      },
    ],
    name: "unlockTokens",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getBalance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "token",
    outputs: [
      {
        internalType: "contract IERC20",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

// Assume you have a function to check the allowance from your contract
async function checkAllowance() {
  // Get user's address from Web3 provider
  const accounts = await window.ethereum.request({ method: "eth_accounts" });
  const userAddress = accounts[0];

  // Contract address and ABI for your USDT token contract
  const usdtContractAddress = "0xF6E83df1a9659E9923E43A85aE6d8F07a2C95b61"; // Replace with your USDT token contract address
  const usdtContractABI = [
    {
      inputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "spender",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "value",
          type: "uint256",
        },
      ],
      name: "Approval",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "previousOwner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "newOwner",
          type: "address",
        },
      ],
      name: "OwnershipTransferred",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "from",
          type: "address",
        },
        { indexed: true, internalType: "address", name: "to", type: "address" },
        {
          indexed: false,
          internalType: "uint256",
          name: "value",
          type: "uint256",
        },
      ],
      name: "Transfer",
      type: "event",
    },
    {
      constant: true,
      inputs: [],
      name: "_decimals",
      outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "_name",
      outputs: [{ internalType: "string", name: "", type: "string" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "_symbol",
      outputs: [{ internalType: "string", name: "", type: "string" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [
        { internalType: "address", name: "owner", type: "address" },
        { internalType: "address", name: "spender", type: "address" },
      ],
      name: "allowance",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { internalType: "address", name: "spender", type: "address" },
        { internalType: "uint256", name: "amount", type: "uint256" },
      ],
      name: "approve",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [{ internalType: "address", name: "account", type: "address" }],
      name: "balanceOf",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }],
      name: "burn",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "decimals",
      outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { internalType: "address", name: "spender", type: "address" },
        { internalType: "uint256", name: "subtractedValue", type: "uint256" },
      ],
      name: "decreaseAllowance",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "getOwner",
      outputs: [{ internalType: "address", name: "", type: "address" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { internalType: "address", name: "spender", type: "address" },
        { internalType: "uint256", name: "addedValue", type: "uint256" },
      ],
      name: "increaseAllowance",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }],
      name: "mint",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "name",
      outputs: [{ internalType: "string", name: "", type: "string" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "owner",
      outputs: [{ internalType: "address", name: "", type: "address" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [],
      name: "renounceOwnership",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "symbol",
      outputs: [{ internalType: "string", name: "", type: "string" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "totalSupply",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { internalType: "address", name: "recipient", type: "address" },
        { internalType: "uint256", name: "amount", type: "uint256" },
      ],
      name: "transfer",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { internalType: "address", name: "sender", type: "address" },
        { internalType: "address", name: "recipient", type: "address" },
        { internalType: "uint256", name: "amount", type: "uint256" },
      ],
      name: "transferFrom",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
      name: "transferOwnership",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
  ]; // Replace with your USDT token contract ABI

  const usdtContractABIs = [
    {
      inputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "spender",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "value",
          type: "uint256",
        },
      ],
      name: "Approval",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "previousOwner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "newOwner",
          type: "address",
        },
      ],
      name: "OwnershipTransferred",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "from",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "value",
          type: "uint256",
        },
      ],
      name: "Transfer",
      type: "event",
    },
    {
      constant: true,
      inputs: [],
      name: "_decimals",
      outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "_name",
      outputs: [{ internalType: "string", name: "", type: "string" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "_symbol",
      outputs: [{ internalType: "string", name: "", type: "string" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [
        { internalType: "address", name: "owner", type: "address" },
        { internalType: "address", name: "spender", type: "address" },
      ],
      name: "allowance",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { internalType: "address", name: "spender", type: "address" },
        { internalType: "uint256", name: "amount", type: "uint256" },
      ],
      name: "approve",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [{ internalType: "address", name: "account", type: "address" }],
      name: "balanceOf",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }],
      name: "burn",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "decimals",
      outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { internalType: "address", name: "spender", type: "address" },
        {
          internalType: "uint256",
          name: "subtractedValue",
          type: "uint256",
        },
      ],
      name: "decreaseAllowance",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "getOwner",
      outputs: [{ internalType: "address", name: "", type: "address" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { internalType: "address", name: "spender", type: "address" },
        { internalType: "uint256", name: "addedValue", type: "uint256" },
      ],
      name: "increaseAllowance",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }],
      name: "mint",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "name",
      outputs: [{ internalType: "string", name: "", type: "string" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "owner",
      outputs: [{ internalType: "address", name: "", type: "address" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [],
      name: "renounceOwnership",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "symbol",
      outputs: [{ internalType: "string", name: "", type: "string" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "totalSupply",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { internalType: "address", name: "recipient", type: "address" },
        { internalType: "uint256", name: "amount", type: "uint256" },
      ],
      name: "transfer",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { internalType: "address", name: "sender", type: "address" },
        { internalType: "address", name: "recipient", type: "address" },
        { internalType: "uint256", name: "amount", type: "uint256" },
      ],
      name: "transferFrom",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
      name: "transferOwnership",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
  ]; // Replace with your USDT token contract ABI

  //const Tokenabi = require("../ABI/tokenABI.json");

  /* // Initialize Web3
  const web3 = new Web3(window.ethereum);

  // Instantiate USDT token contract
  const usdtContract = new web3.eth.Contract(
    usdtContractABI,
    usdtContractAddress
  );

  // Get allowance for your contract from the user's USDT tokens
  const allowance = await usdtContract.methods
    .allowance(userAddress, "0xF6E83df1a9659E9923E43A85aE6d8F07a2C95b61")
    .call();

  return allowance; */
}

export default function Home({ sendDataToParent }) {
  // const Tokenabi = require("../ABI/tokenABI.json");
  const { writeContract, isPending, isSuccess } = useWriteContract();
  const [value, setValue] = useState("");
  const [topname, settopName] = useState("BSC");
  const [downname, setdownName] = useState("ethereum");
  const [connectedNetwork, setConnectedNetwork] = useState(null);

  useEffect(() => {
    const checkNetwork = async () => {
      try {
        if (window.ethereum) {
          // Wait for the Ethereum provider to be connected
          await window.ethereum.enable();

          // Access the chainId property for the chain ID
          const chainId = window.ethereum.chainId;
          setConnectedNetwork(chainId);
        }
      } catch (error) {
        console.error("Error checking network:", error);
      }
    };

    // Initial check on component mount
    checkNetwork();

    // Set up interval to refresh every 1 second
    const intervalId = setInterval(checkNetwork, 1000);

    // Clear interval on component unmount
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array means it only runs on mount and unmount

  console.log("main", connectedNetwork);

  /*const [contractaddress, setcontractaddress] = useState(
    "0x617c5814f9c52e3768FD233088A01cc6dE25c58A"
  );
  const [tokenaddress, settokenaddress] = useState(
    "0xF6E83df1a9659E9923E43A85aE6d8F07a2C95b61"
  );
*/
  //const [isApproved, setIsApproved] = useState(false);

  /*useEffect(() => {
    async function fetchData() {
      const allowance = await checkAllowance();
      setIsApproved(allowance > 0);
    }

    fetchData();
  }, []); */

  const handleswapButtonClick = () => {
    /*setcontractaddress(
      contractaddress == "0x617c5814f9c52e3768FD233088A01cc6dE25c58A"
        ? "0xBD933Db03dA178059079590B50b8e2bbE09313b0"
        : "0x617c5814f9c52e3768FD233088A01cc6dE25c58A"
    );

    settokenaddress(
      tokenaddress === "0xF6E83df1a9659E9923E43A85aE6d8F07a2C95b61"
        ? "0x563574f776D4537767Caf3E93494028F1CfF3368"
        : "0xF6E83df1a9659E9923E43A85aE6d8F07a2C95b61"
    ); */
    // Toggle between 'sai' and 'satya' based on the current state
    settopName(topname === "BSC" ? "ethereum" : "BSC");
    setdownName(downname == "ethereum" ? "BSC" : "ethereum");
  };

  const handleApprove = async () => {
    try {
      await writeContract({
        usdtContractABIs,
        address: "0xF6E83df1a9659E9923E43A85aE6d8F07a2C95b61", // `0x${tokenaddress}`, //tokenAddress,//"0x9b2cbE8Ad90fAB7362C6eC5A4896C7629CAe3D16", //token address
        functionName: "approve",
        args: [
          "0x617c5814f9c52e3768FD233088A01cc6dE25c58A", // contract address

          BigInt(weiAmount),
        ],
        value: 0, //BigInt(valueInWei), // Set the value property to send ETH
      });

      // Handle success if needed
      console.log("Approval successful!");
    } catch (error) {
      // Handle error if needed
      console.error("Error during approval:", error);
    }
  };

  // Calculate the multiplier based on the number of decimals
  const multiplier = 10 ** 18;

  // Multiply the token amount by the multiplier to get the amount in Wei
  const weiAmount = BigInt(value) * BigInt(multiplier);

  const handleClick = async () => {
    /*const recipientsArray = recipientsText
      .split("\n")
      .map((address) => address.trim())
      .filter((address) => address !== ""); */

    //console.log(recipientsArray)
    //console.log("Number of addresses:", recipients.length);

    try {
      const decimals = 18;
      //const valueInWei = Math.round(ethValue * 1e18); // Convert amount to Wei

      await writeContract({
        abi,
        address: "0xBD933Db03dA178059079590B50b8e2bbE09313b0",
        functionName: "lockTokens",
        args: [BigInt(weiAmount)], //[ BigInt(value * 18)],
        value: 0, //BigInt(valueInWei), // Set the value property to send ETH
      });
      //console.log("Number of addresses:", recipients.length);
      //const totalamount =  amount * recipients.length;
      console.log(BigInt(value * 10 ** decimals));

      //console.log(isPending ? "Confirming..." : "Mint");
      console.log(" successful!");
      //await transferform();
    } catch (error) {
      console.error("Error during approval:", error);
    }
  };

  const handleClick2 = async () => {
    /*const recipientsArray = recipientsText
      .split("\n")
      .map((address) => address.trim())
      .filter((address) => address !== ""); */

    //console.log(recipientsArray)
    //console.log("Number of addresses:", recipients.length);

    try {
      const decimals = 18;
      //const valueInWei = Math.round(ethValue * 1e18); // Convert amount to Wei

      await writeContract({
        abi,
        address: "0x617c5814f9c52e3768FD233088A01cc6dE25c58A",
        functionName: "lockTokens",
        args: [BigInt(weiAmount)], //[ BigInt(value * 18)],
        value: 0, //BigInt(valueInWei), // Set the value property to send ETH
      });
      //console.log("Number of addresses:", recipients.length);
      //const totalamount =  amount * recipients.length;
      console.log(BigInt(value * 10 ** decimals));

      //console.log(isPending ? "Confirming..." : "Mint");
      console.log(" successful!");
      //await transferform();
    } catch (error) {
      console.error("Error during approval:", error);
    }
  };

  return (
    <div className="bg-[#17161b] h-screen flex justify-center items-center py-10 px-4">
      <div className="bg-[#252027] rounded-xl p-4 max-w-3xl w-full mx-auto">
        <div className="bg-[#353037] rounded-lg p-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
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
              <ConnectButton />
            </div>
          </div>

          <div className="border rounded p-2 border-[#4d484f] mt-5 flex gap-3">
            <div className="w-32 rounded p-2 bg-[#565158] h-12 flex items-center gap-3 relative">
              <div className="w-7 h-7 rounded-full p-1 bg-[#212325] flex justify-center items-center">
                <img src={Logo} alt="" className="h-4" />
              </div>

              <div className="flex-1">
                <div className="text-[#ebefe9] flex gap-4 cursor-pointer">
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
            {" "}
            <img
              src="data:image/svg+xml;base64,PHN2ZyBpZD0iU3ZnanNTdmcxMDI2IiB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4bWxuczpzdmdqcz0iaHR0cDovL3N2Z2pzLmNvbS9zdmdqcyI+PGRlZnMgaWQ9IlN2Z2pzRGVmczEwMjciPjwvZGVmcz48ZyBpZD0iU3ZnanNHMTAyOCI+PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDMyIDMyIiB2aWV3Qm94PSIwIDAgMzIgMzIiIHdpZHRoPSIyNTYiIGhlaWdodD0iMjU2Ij48cGF0aCBkPSJNMTQgMi4yNTZWMzBjLTIuMjA5IDAtNC0xLjc5MS00LTRWMTNINC43MTRjLS42MzMgMC0uOTQ5LS43NjUtLjUwMi0xLjIxMmw5LjYwNy05LjYwN0MxMy44ODYgMi4xMTQgMTQgMi4xNjIgMTQgMi4yNTZ6TTI3Ljc4OCAyMC4yMTJsLTkuNiA5LjZDMTguMTE4IDI5Ljg4MiAxOCAyOS44MzIgMTggMjkuNzM0VjJjMi4yMDkgMCA0IDEuNzkxIDQgNHYxM2g1LjI4NkMyNy45MTggMTkgMjguMjM1IDE5Ljc2NSAyNy43ODggMjAuMjEyeiIgZmlsbD0iIzM0YTg1MyIgY2xhc3M9ImNvbG9yMDAwIHN2Z1NoYXBlIj48L3BhdGg+PC9zdmc+PC9nPjwvc3ZnPg=="
              alt=""
              className="h-6"
            />
          </button>
        </div>

        <div className="bg-[#353037] rounded-lg p-3 my-5">
          <div className="flex items-center gap-4">
            <img src={Logo} alt="" className="h-6" />

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
                <div className="text-[#ebefe9] flex gap-4 cursor-pointer">
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
          {/* <p className="text-[#78737b] text-base font-medium">
            Will also receive .0003 <span className="text-[#fcfafd]">ETH</span>{" "}
            ($0..49)
          </p> */}
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

          <ApproveToken weiAmount={weiAmount} />

          <button
            className="w-full bg-[#3ab0ff] text-[#efefef] font-medium text-center p-[10px] rounded-xl mt-7"
            onClick={
              connectedNetwork === "0xaa36a7" ? handleClick : handleClick2
            }
          >
            Bridge
          </button>
        </div>
      </div>
    </div>
  );
}

/**        
          <div>
            {!isApproved ? (
               
                <button
                    className="w-full bg-[#2d282f] text-[#555057] font-medium text-center p-[10px] rounded-xl mt-7"
                    onClick={handleClick}
                >
                    Bridge ETH
                </button>
            ) : (
                <button
                    className="w-full bg-[#2d282f] text-[#555057] font-medium text-center p-[10px] rounded-xl mt-7"
                    onClick={handleApprove}
                >
                    Approval
                </button>
            )}
        </div> */
