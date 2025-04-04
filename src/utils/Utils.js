import { ethers } from "ethers";

export const getContract = async (contractAddress, contractAbi, signer) => {
  try {
    return new ethers.Contract(contractAddress, contractAbi, signer);
  } catch (err) {
    console.error("Get contract error: ", err);
  }
};
