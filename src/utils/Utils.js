import { ethers } from "ethers";

export const getContract = async (contractAddress, contractAbi, signer) => {
  try {
    return new ethers.Contract(contractAddress, contractAbi, signer);
  } catch (err) {
    console.error("Get contract error: ", err);
  }
};

export const formatTime = (time) => {
  const timeDiffInSeconds = Math.floor(Date.now() / 1000) - time;

  if (timeDiffInSeconds < 86400) {
    const hours = Math.floor(timeDiffInSeconds / 3600);
    const minutes = Math.floor((timeDiffInSeconds % 3600) / 60);
    const seconds = timeDiffInSeconds % 60;

    let timeString = "";
    if (hours > 0) timeString += `${hours} hour${hours !== 1 ? "s" : ""} `;
    if (minutes > 0 || hours > 0)
      timeString += `${minutes} min${minutes !== 1 ? "s" : ""} `;
    timeString += `${seconds} sec${seconds !== 1 ? "s" : ""} ago`;

    return timeString;
  }

  return `${(timeDiffInSeconds / 86400).toFixed(0)} day${
    (timeDiffInSeconds / 86400).toFixed(0) !== "1" ? "s" : ""
  } ago`;
};

export const formatAddress = (address) => {
  const rs = `${address.slice(0, 5)}...${address.slice(-3)}`;
  return rs;
};

export const formatBgtAmount = (amount) => {
  let rs = "";
  if (amount < 0.01) {
    rs = "<0.01";
  } else if (amount == 0) {
    rs = "0.00";
  } else {
    rs = `${(+amount).toFixed(3)}`;
  }
  return rs;
};

export const formatNormalAmount = (amount) => {
  let rs = "";
  rs = `${(+amount).toFixed(2)}`;
  return rs;
};

export const calculatePremium = (markup) => {
  const rs = `${(markup - 10000) / 100}%`;
  return rs;
};

export const estimatedToPay = (beraPrice, unclaimedBgt, markup) => {
  const rs = beraPrice * unclaimedBgt * (1 + (markup - 10000) / 100 / 100);
  return rs.toFixed(2);
};

export const getAmountByPercentage = (percentage, balance) => {
  const amountToSet = (parseFloat(balance) * percentage) / 100;
  return amountToSet.toFixed(2);
};
