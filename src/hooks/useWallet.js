import { ethers } from "ethers";
import {
  BERA_CHAINID,
  HEY_BGT_CONTRACT,
  HEY_BGT_CONTRACT_ADDRESS,
  HONEY_CONTRACT,
  HONEY_CONTRACT_ADDRESS,
  VAULT_CONTRACT,
} from "../const/const";
import { getAmountByPercentage, getContract } from "../utils/Utils";
import { useState } from "react";
import {
  allOrderList,
  allOrderListAccount,
  allVaultsList,
} from "../apis/comon";

export function useWallet() {
  // wallet information
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [address, setAddress] = useState("");

  const [beraBalance, setBeraBalance] = useState(0);
  const [honeyBalance, setHoneyBalance] = useState(0);
  const [beraPrice, setBeraPrice] = useState("");

  const [orders, setOrders] = useState([]);

  const [buyOrdersAccount, setBuyOrdersAccount] = useState([]);
  const [totalPersonalBuy, setTotalPersonalBuy] = useState(0);
  const [pagePersonalBuy, setPagePersonalBuy] = useState(0);
  const [rowsPerPagePersonalBuy, setRowsPerPagePersonalBuy] = useState(5);

  const [sellOrdersAccount, setSellOrdersAccount] = useState([]);
  const [totalPersonalSell, setTotalPersonalSell] = useState(0);
  const [pagePersonalSell, setPagePersonalSell] = useState(0);
  const [rowsPerPagePersonalSell, setRowsPerPagePersonalSell] = useState(5);

  const [rewardVaults, setRewardVaults] = useState([]);
  const [vaultsWithBalance, setVaultsWithBalance] = useState(rewardVaults);
  const [vaultForFill, setVaultForFill] = useState("");

  const [orderType, setOrderType] = useState("Buy");
  const [selectedPercentage, setSelectedPercentage] = useState(null);

  const [amountToBuy, setAmountToBuy] = useState(0);
  const [buyStatus, setBuyStatus] = useState("Success");
  const [selectedVault, setSelectedVault] = useState("");
  const [premiumRate, setPremiumRate] = useState("10");
  const [sellStatus, setSellStatus] = useState("Success");
  //end wallet information

  //pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [total, setTotal] = useState(0);
  //end pagination

  //contract
  const [bgtContract, setBgtContract] = useState(null);
  const [honeyContract, setHoneyContract] = useState(null);
  const [loadingContractStatus, setLoadingContractStatus] = useState(false);
  //end contract

  //toggle
  const [activeTab, setActiveTab] = useState("Buy");
  //end toggle

  //wallet functions
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
      await loadContract(signer);
      await fetchVaults();
    } catch (err) {
      console.error("Connect wallet error:", err);
    }
  };

  const loadAddress = async (signer) => {
    setAddress(await signer.getAddress());
  };

  const loadContract = async (signer) => {
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
      setLoadingContractStatus(true);
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

  const fetchOrders = async (pageNumber, pageSize, type) => {
    try {
      if (activeTab == "Buy") {
        type = 2;
      } else {
        type = 1;
      }
      const params = { page: pageNumber, size: pageSize, state: 1, type: type };
      const response = await allOrderList(params);
      setOrders(response.list);
      setTotal(response.total);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const fetchAccountBuyOrders = async (pageNumber, pageSize) => {
    try {
      const params = {
        address: address,
        page: pageNumber,
        size: pageSize,
        state: -1,
        type: 1,
      };
      const response = await allOrderListAccount(params);
      console.log(response);
      setBuyOrdersAccount(response.list);
      setTotalPersonalBuy(response.total);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const fetchAccountSellOrders = async (pageNumber, pageSize) => {
    try {
      const params = {
        address: address,
        page: pageNumber,
        size: pageSize,
        state: -1,
        type: 2,
      };
      const response = await allOrderListAccount(params);
      console.log(response);
      setSellOrdersAccount(response.list);
      setTotalPersonalSell(response.total);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const fetchVaults = async () => {
    try {
      const response = await allVaultsList();
      console.log(response);
      setRewardVaults(response.data);
    } catch (error) {
      console.error("Error fetching vaults:", error);
    }
  };

  const fetchVaultBalances = async () => {
    try {
      const updatedVaults = await Promise.all(
        rewardVaults.map(async (vault) => {
          const vaultContract = new ethers.Contract(
            vault.reward_vault,
            VAULT_CONTRACT,
            signer
          );
          let bgtBalance;
          try {
            bgtBalance = await vaultContract.earned(address);
            bgtBalance = ethers.formatUnits(bgtBalance, 18);
          } catch (err) {
            bgtBalance = "0";
          }
          return {
            ...vault,
            bgtBalance: (+bgtBalance).toFixed(2),
          };
        })
      );
      setVaultsWithBalance(updatedVaults);
    } catch (err) {
      console.error("Error fetching BGT balances:", err);
    }
  };

  const getBeraPrice = async () => {
    try {
      if (loadingContractStatus) {
        const price = await bgtContract.getBeraPrice();
        const rs = ethers.formatUnits(price[0].toString(), 8);
        setBeraPrice(rs);
      }
    } catch (err) {
      console.error("Get Bera price error:", err);
    }
  };

  const fillSellOrder = async (orderId) => {
    try {
      const approveTx = await honeyContract.approve(
        HEY_BGT_CONTRACT_ADDRESS,
        ethers.parseUnits("9999999", 18)
      );
      await approveTx.wait();

      const fillTx = await bgtContract.fillSellBgtOrder(
        BigInt(orderId),
        BigInt(2),
        {
          gasLimit: 500000,
        }
      );
      console.log(fillTx);
    } catch (err) {
      console.error("Fill order error:", err);
    }
  };

  const fillBuyOrder = async (orderId, vault) => {
    try {
      if (vault === "") {
        console.log("Vault have never been chosen");
        return;
      }
      const fillTx = await bgtContract.fillBuyBgtOrder(
        BigInt(orderId),
        vault,
        BigInt(2),
        {
          gasLimit: 500000,
        }
      );
      console.log(fillTx);
    } catch (err) {
      console.error("Fill order error:", err);
    }
  };

  const setAmountByPercentage = (selectedPercentage) => {
    const am = getAmountByPercentage(selectedPercentage, honeyBalance);
    setAmountToBuy(am);
  };

  const createOrder = async () => {
    try {
      const currentChain = await window.ethereum.request({
        method: "eth_chainId",
      });
      if (currentChain !== BERA_CHAINID) {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: BERA_CHAINID }],
        });
      }

      if (orderType === "Buy") {
        setBuyStatus("Processing");
        if (
          !amountToBuy ||
          !beraPrice ||
          isNaN(amountToBuy) ||
          isNaN(beraPrice)
        ) {
          setBuyStatus("Success");
          return;
        }

        await getBeraPrice(bgtContract);
        const amountIn = ethers.parseUnits(amountToBuy, 18);
        const priceIn = ethers.parseUnits(beraPrice, 18);
        const nodeId = BigInt(2);

        const approveTx = await honeyContract.approve(
          HEY_BGT_CONTRACT_ADDRESS,
          amountIn
        );
        await approveTx.wait();

        const tx = await bgtContract.openBuyBgtOrder(
          priceIn,
          amountIn,
          nodeId,
          {
            gasLimit: 500000,
          }
        );
        const receipt = await tx.wait();
        await fetchAccountBuyOrders(pagePersonalBuy, rowsPerPagePersonalBuy);
        setBuyStatus("Success");
      } else {
        setSellStatus("Processing");
        if (!premiumRate || !selectedVault || isNaN(premiumRate)) {
          setSellStatus("Success");
          return;
        }

        const premiumRateIn = (+premiumRate * 10000) / 100 + 10000;
        const nodeId = BigInt(2);
        const rewardVault = selectedVault;
        const rewardVaultContract = new ethers.Contract(
          rewardVault,
          VAULT_CONTRACT,
          signer
        );

        const operatorTx = await rewardVaultContract.setOperator(
          HEY_BGT_CONTRACT_ADDRESS
        );
        await operatorTx.wait();

        const tx = await bgtContract.openSellBgtOrder(
          rewardVault,
          BigInt(premiumRateIn),
          nodeId,
          {
            gasLimit: 500000,
          }
        );
        const receipt = await tx.wait();
        await fetchAccountSellOrders(pagePersonalBuy, rowsPerPagePersonalBuy);
        setSellStatus("Success");
      }
    } catch (error) {
      console.error("Create order failed:", error);
      if (error.code === "ACTION_REJECTED" || error.code === 4001) {
      } else if (error.code === "CALL_EXCEPTION" && error.data) {
        const iface = new ethers.Interface(HEY_BGT_CONTRACT);
        try {
          const decoded = iface.parseError(error.data);
        } catch (decodeErr) {}
      } else {
      }
      setBuyStatus("Success");
      setSellStatus("Success");
    }
  };

  const closeOrder = async (orderId, orderType) => {
    try {
      const id = BigInt(orderId);
      let tx;

      if (orderType === "Buy") {
        tx = await bgtContract.closeBuyBgtOrder(id);
        await tx.wait();
        await fetchAccountBuyOrders(pagePersonalBuy, rowsPerPagePersonalBuy);
      } else if (orderType === "Sell") {
        tx = await bgtContract.closeSellBgtOrder(id);
        await tx.wait();
        await fetchAccountSellOrders(pagePersonalBuy, rowsPerPagePersonalBuy);
      }
      await tx.wait();
    } catch (err) {
      console.error("Close order error:", err);
    }
  };
  //end wallet functions

  //pagination functions
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangePagePersonalBuy = (event, newPage) => {
    setPagePersonalBuy(newPage);
  };

  const handleChangeRowsPerPagePersonalBuy = (event) => {
    setRowsPerPagePersonalBuy(parseInt(event.target.value, 10));
    setPagePersonalBuy(0);
  };

  const handleChangePagePersonalSell = (event, newPage) => {
    setPagePersonalSell(newPage);
  };

  const handleChangeRowsPerPagePersonalSell = (event) => {
    setRowsPerPagePersonalSell(parseInt(event.target.value, 10));
    setPagePersonalSell(0);
  };

  //end pagination functions

  return {
    walletData: {
      address,
      beraBalance,
      honeyBalance,
      beraPrice,
      orders,
      vaultForFill,
      vaultsWithBalance,
      loadingContractStatus,
      orderType,
      selectedPercentage,
      amountToBuy,
      buyStatus,
      sellStatus,
      selectedVault,
      rewardVaults,
      premiumRate,
      pagePersonalBuy,
      rowsPerPagePersonalBuy,
      pagePersonalSell,
      rowsPerPagePersonalSell,
      buyOrdersAccount,
      sellOrdersAccount,
      totalPersonalBuy,
      totalPersonalSell,
    },
    walletFunctions: {
      connectWallet,
      loadWalletBalance,
      fetchOrders,
      setVaultForFill,
      fetchVaults,
      fetchVaultBalances,
      getBeraPrice,
      setBeraPrice,
      fillSellOrder,
      fillBuyOrder,
      setOrderType,
      setSelectedPercentage,
      setAmountByPercentage,
      createOrder,
      setSelectedVault,
      setVaultsWithBalance,
      setPremiumRate,
      fetchAccountBuyOrders,
      fetchAccountSellOrders,
      handleChangePagePersonalBuy,
      handleChangeRowsPerPagePersonalBuy,
      handleChangePagePersonalSell,
      handleChangeRowsPerPagePersonalSell,
      closeOrder,
      setAmountToBuy,
    },
    paginationData: { page, rowsPerPage, total },
    paginationFunctions: {
      setPage,
      setRowsPerPage,
      handleChangePage,
      handleChangeRowsPerPage,
    },
    toggle: {
      activeTab,
    },
    toggleFunctions: {
      setActiveTab,
    },
  };
}
