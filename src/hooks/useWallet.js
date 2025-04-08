import { ethers } from "ethers";
import {
  BERA_CHAINID,
  HEY_BGT_CONTRACT,
  HEY_BGT_CONTRACT_ADDRESS,
  HONEY_CONTRACT,
  HONEY_CONTRACT_ADDRESS,
} from "../const/const";
import { getContract } from "../utils/Utils";
import { useState } from "react";

export function useWallet() {
  // wallet information
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [address, setAddress] = useState("");

  const [beraBalance, setBeraBalance] = useState(0);
  const [honeyBalance, setHoneyBalance] = useState(0);
  //end wallet information

  //contract
  const [bgtContract, setBgtContract] = useState(null);
  const [honeyContract, setHoneyContract] = useState(null);
  //end contract

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        throw new Error("Please install Metamask Wallet");
      }
      const provider = new ethers.BrowserProvider(window.ethereum);
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: BERA_CHAINID }],
      });
      const signer = await provider.getSigner();
      setProvider(provider);
      setSigner(signer);
      await loadAddress(signer);
    } catch (err) {
      console.error("Connect wallet error:", err);
    }
  };

  const loadAddress = async (signer) => {
    setAddress(await signer.getAddress());
  };

  const loadContract = async () => {
    try {
      if (signer === null) {
        console.log("Signer not establish");
        return;
      }
      const heyBgtContract = await getContract(
        HEY_BGT_CONTRACT_ADDRESS,
        HEY_BGT_CONTRACT,
        signer
      );
      const honeyContract = await getContract(
        HONEY_CONTRACT_ADDRESS,
        HONEY_CONTRACT,
        signer
      );
      setBgtContract(heyBgtContract);
      setHoneyContract(honeyContract);
    } catch (e) {
      console.log(`Load contract err : ${e}`);
    }
  };

  const loadWalletBalance = async () => {
    try {
      const beraBalance = await provider.getBalance(address);
      setBeraBalance(+ethers.formatUnits(beraBalance.toString(), 18));
      const honeyBalance = await honeyContract.balanceOf(address);
      setHoneyBalance(+ethers.formatUnits(honeyBalance.toString(), 18));
    } catch (err) {
      console.error("Load balance error: ", err);
    }
  };

  return {
    walletData: {
      address,
      beraBalance,
      honeyBalance,
    },
    walletFunctions: {
      connectWallet,
      loadContract,
      loadWalletBalance,
    },
  };
}
