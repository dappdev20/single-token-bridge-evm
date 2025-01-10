import Image from "next/image";
import { BiSolidDownArrow } from "react-icons/bi";
import Logo from "../public/Logo.svg";
import Swap from "./assets/Swap";
import React, { useState, useEffect } from "react";
import * as xrpl from 'xrpl';
import { isInstalled, getAddress, sendPayment, addTrustline, setTrustline } from "@gemwallet/api";
import { MAIN_RPC, XRPL_RESERVE_AMOUNT } from "./common/constants";
import * as afx from './common/global';

export const XRPAmount = 100;
export const XRPCashAmount = 800000000;

export const getXrpBalance = async (address) => {
  try {
    const response = await afx.client.request({
      command: 'account_info',
      account: address,
      ledger_index: 'validated'
    });
    const ownerCount = response.result.account_data.OwnerCount;
    const reservedBalance = reserveBaseXRP + (reserveIncXRP * ownerCount);

    const rlt = await afx.client.getXrpBalance(address)
    console.log('balance = ', rlt);
    return rlt - reservedBalance
  } catch (error) {
    console.log("error ===> ", error)
    return -XRPL_RESERVE_AMOUNT
  }
}

export default function Home({ sendDataToParent }) {
  const [value, setValue] = useState("");
  const [topname, settopName] = useState("XRP");
  const [downname, setdownName] = useState("XRPCash");
  const [topAmount, settopAmount] = useState(0);
  const [downAmount, setDownAmount] = useState(0);
  const [walletAddress, setWalletAddress] = useState("");
  const [walletConnected, setWalletConnected] = useState(false);

  const calcSendAmount = (token, deltaAmount) => {
    console.log('delta amount = ', deltaAmount);
    try {
      let result = 0;
      if (deltaAmount === "")
        deltaAmount = 0;
      if (token === "XRP") {
        result = (deltaAmount * XRPCashAmount) / (XRPAmount + deltaAmount);
      } else {
        result = (deltaAmount * XRPAmount) / (XRPCashAmount + deltaAmount);
      }
      console.log('out amount = ', result);
      setDownAmount(Number(result));

    } catch (e) {
      console.log('Out amount error : ', e);
    }
  }

  const handleswapButtonClick = () => {
    settopName(topname === "XRPCash" ? "XRP" : "XRPCash");
    setdownName(downname == "XRP" ? "XRPCash" : "XRP");
  };

  const handleConnect = () => {
    try {
      if (!walletConnected) {
        isInstalled().then((response) => {
          if (response.result.isInstalled) {
            getAddress().then((response) => {
              console.log(`Your address: ${response.result?.address}`);
              setWalletConnected(true);
              setWalletAddress(response.result?.address);
            });
          }
        });
      } else {

      }

    } catch (e) {
      console.log('Wallet Connect error: ', e);
    }
  }

  const oPcreateTrustlineAndSendToken = async (issuerWalletAddress, receiverWalletAddress, tokenCode, supply) => {
    afx.client.connect();
    // Create trust line from hot to cold address --------------------------------
    const trust_set_tx = {
      "TransactionType": "TrustSet",
      "Account": receiverWalletAddress,
      "LimitAmount": {
        "currency": tokenCode,
        "issuer": issuerWalletAddress,
        "value": supply.toString() // Large limit, arbitrarily chosen
      },
      "Flags": xrpl.TrustSetFlags.tfClearNoRipple | xrpl.TrustSetFlags.tfSetNoRipple,
    }

    const ts_prepared = await afx.client.autofill(trust_set_tx)
    const ts_signed = receiverWallet.sign(ts_prepared)
    console.log("Creating trust line from hot address to issuer...")
    const ts_result = await afx.client.submitAndWait(ts_signed.tx_blob)
    const ts_metaInfo = ts_result.result.meta;
    if (ts_metaInfo.TransactionResult == "tesSUCCESS") {
      console.log(`Transaction succeeded: https://xrpscan.com/tx/${ts_signed.hash}`)
    } else {
      throw new Error(`sending transaction: ${ts_result}`)
    }

    const payment = {
      "TransactionType": "Payment",
      Account: issuerWallet.address,
      Destination: receiverWallet.address,
      "Amount": {
        currency: tokenCode,
        issuer: issuerWallet.address,
        value: supply.toString(),
      },
      "DestinationTag": 1,
    }

    const preparedPayment = await afx.client.autofill(payment);
    const signedPayment = issuerWallet.sign(preparedPayment);
    console.log(`Cold to hot - Sending ${supply} ${tokenCode} to ${receiverWallet.address}...`)
    const payment_result = await afx.client.submitAndWait(signedPayment.tx_blob);
    const payment_metainfo = payment_result.result.meta;
    if (payment_metainfo.TransactionResult == "tesSUCCESS") {
      console.log(`Transaction succeeded: https://xrpscan.com/tx/${signedPayment.hash}`)
    } else {
      console.log(payment_result)
      throw new Error(`sending transaction: ${payment_result}`)
    }
  }

  const handleBridge = async () => {
    try {
      if (topname === "XRP") {
        // getAddress().then(async (response) => {
        const payment = {
          amount: Number(topAmount * 10 ** 6).toString(),
          destination: "rHdgdah44dFT6JxsZgid2veeHDMVRwGSj8",
          destinationTag: 12,
        };
        // sendPayment(payment).then(async(response) => {
        //   console.log("Transaction Hash1: ", response.result?.hash);
        const trustline = {
          limitAmount: {
            currency: "5852504300000000000000000000000000000000",
            issuer: "r91KAFkvXkshk1vsqKnPiVvpRqvTbr9GC4",
            value: Number(800000000000).toString(),
          },
          memos: [
            {
              memo: {
                memoType: "4465736372697074696f6e",
                memoData: "54657374206d656d6f",
              },
            },
          ],
          fee: "199",
          flags: xrpl.TrustSetFlags.tfClearNoRipple | xrpl.TrustSetFlags.tfSetNoRipple,
        };

        setTrustline(trustline).then(async (response) => {
          console.log(response.result?.hash);

          //   console.log("Transaction Hash2: ", response.result?.hash);
          let issuerWallet = xrpl.Wallet.fromSeed("sEd7Jsm17dpzwALk6N97jBQHBSE48xZ")
          console.log('isseu wallet = ', issuerWallet.address, walletAddress);
          const payment1 = {
            "TransactionType": "Payment",
            "Account": "rHdgdah44dFT6JxsZgid2veeHDMVRwGSj8",
            "Destination": walletAddress,
            "Amount": {
              "currency": "5852504300000000000000000000000000000000",
              "issuer": "r91KAFkvXkshk1vsqKnPiVvpRqvTbr9GC4",
              "value": Number(downAmount.toFixed(2)).toString(),
            },
            "Memos": undefined,
            "DestinationTag": 12,
            "Flags": 2147483648, // Optional: Allow partial payment
          }
          await afx.client.connect();
          console.log('stat paying...1');
          const preparedPayment = await afx.client.autofill(payment1);
          console.log('stat paying...2');
          const signedPayment = issuerWallet.sign(preparedPayment);
          // console.log(`Cold to hot - Sending ${supply} ${tokenCode} to ${receiverWallet.address}...`)
          const payment_result = await afx.client.submitAndWait(signedPayment.tx_blob);
          const payment_metainfo = payment_result.result.meta;
          if (payment_metainfo.TransactionResult == "tesSUCCESS") {
            console.log(`Transaction succeeded: https://xrpscan.com/tx/${signedPayment.hash}`)
          } else {
            console.log(payment_result)
            throw new Error(`sending transaction: ${payment_result}`)
          }
          await afx.client.disconnect()
        });
        // });
        // });
      }

    } catch (e) {
      console.log('Wallet Connect error: ', e);
    }
  }

  return (
    <div className="bg-[#17161b] h-screen flex justify-center items-center py-10 px-4">
      <div className="bg-[#252027] rounded-xl p-4 max-w-3xl w-full mx-auto">
        <div className="bg-[#353037] rounded-lg p-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              {/* <div className="w-10 h-10 rounded-full p-1 bg-[#212325] flex justify-center items-center">
              <img src={Logo} alt="" className="h-7" />
            </div>

            <div>
              <span className="text-[#bab6bc] font-normal text-sm">From</span>
              <div className="text-[#ebefe9] flex gap-4 cursor-pointer">
                <p>{topname}</p>
                <BiSolidDownArrow className="text-xs" />
              </div>
            </div> */}
            </div>

            <div className="text-[#f0e9fc] text-base">
              <button
                className="w-full bg-[#3ab0ff] text-[#efefef] font-medium text-center p-[10px] rounded-xl max-w-[150px] truncate"
                onClick={handleConnect}
              >
                {walletConnected ? walletAddress : "Connect Wallet"}
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
                  <p>{topname}</p>
                  {/* <BiSolidDownArrow className="text-xs" /> */}
                </div>
              </div>
            </div>
            <input
              type="text"
              placeholder="0.00000"
              className="bg-transparent flex-1 outline-none border-none text-base text-[#ebefe9]"
              onChange={((e) => {
                calcSendAmount(topname === "XRP" ? "XRP" : "XRPCash", e.target.value);
                settopAmount(e.target.value)
              })}
            />
          </div>
        </div>

        <div className="flex justify-center items-center">
          <button onClick={handleswapButtonClick}>
            <Swap className="h-10 w-10" />
          </button>
        </div>

        <div className="bg-[#353037] rounded-lg p-3">
          {/* <div className="flex items-center gap-4">
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
        </div> */}

          <div className="border rounded p-2 border-[#4d484f] mt-5 flex gap-3">
            <div className="w-32 rounded p-2 bg-[#565158] h-12 flex items-center gap-3 relative">
              <div className="w-7 h-7 rounded-full p-1 bg-[#212325] flex justify-center items-center">
                <img src={Logo} alt="" className="h-4" />
              </div>

              <div className="flex-1">
                <div className="text-[#ebefe9] flex gap-4 cursor-pointer items-center">
                  <p>{downname}</p>
                  {/* <BiSolidDownArrow className="text-xs" /> */}
                </div>
              </div>
            </div>
            <input
              type="text"
              placeholder="0.00000"
              className="bg-transparent flex-1 outline-none border-none text-base text-[#ebefe9]"
              value={downAmount}
              readOnly
              onChange={(e) => setValue(e.target.value)}
            />
          </div>
        </div>

        <div>
          <button
            className="w-full bg-[#3ab0ff] text-[#efefef] font-medium text-center p-[10px] rounded-xl mt-7"
            onClick={() => (handleBridge())}
          >
            Bridge
          </button>
        </div>
      </div>
    </div>
  );
}
