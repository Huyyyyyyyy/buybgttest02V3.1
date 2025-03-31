import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import {
  Box,
  Container,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import {
  allOrderList,
  allOrderListAccount,
  allVaultsList,
} from "../src/apis/comon";

// Địa chỉ hợp đồng và ABI (giữ nguyên)
const CONTRACT_ADDRESS = "0x5f8a463334E29635Bdaca9c01B76313395462430";
const HONEY_TOKEN_ADDRESS = "0xFCBD14DC51f0A4d49d5E53C2E0950e0bC26d0Dce";

import CONTRACT_ABI from "../src/ct.json";
import HONEY_ABI from "../src/honey_ct.json";
import VAULT_ABI from "../src/vault_abi.json";

export default function BGTMarketApp() {
  const [account, setAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [price, setPrice] = useState("");
  const [premiumRate, setPremiumRate] = useState("10");
  const [selectedVault, setSelectedVault] = useState("");
  const [orderType, setOrderType] = useState("Buy");
  const [status, setStatus] = useState("");
  const [beraBalance, setBeraBalance] = useState("");
  const [honeyBalance, setHoneyBalance] = useState("");
  const [beraPrice, setBeraPrice] = useState("");
  const [activeTab, setActiveTab] = useState("Buy");
  const [signer, setSigner] = useState(null);

  //order list
  const [orders, setOrders] = useState([]);
  const [buyOrdersAccount, setBuyOrdersAccount] = useState([]);
  const [sellOrdersAccount, setSellOrdersAccount] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [total, setTotal] = useState(0);
  const [rewardVaults, setRewardVaults] = useState([]);

  // const rewardVaults = [
  //   {
  //     name: "WBERA | HONEY",
  //     address: "0xc2baa8443cda8ebe51a640905a8e6bc4e1f9872c",
  //     icon: "https://res.cloudinary.com/duv0g402y/image/upload/v1738378469/reward-vaults/icons/soy9mfpovb1odtby9p02.png",
  //     bgtBalance: "0",
  //   },
  //   {
  //     name: "BYUSD | HONEY",
  //     address: "0x6649bc987a7c0fb0199c523de1b1b330cd0457a8",
  //     icon: "https://res.cloudinary.com/duv0g402y/image/upload/v1738733620/reward-vaults/icons/c2q60zif1cetllqip0a6.png",
  //     bgtBalance: "0",
  //   },
  //   {
  //     name: "WBTC | WBERA",
  //     address: "0x086f82fa0ca310cc835a9db4f53697687ef149c7",
  //     icon: "https://res.cloudinary.com/duv0g402y/image/upload/v1738378469/reward-vaults/icons/xqepqh4lifyybbt27f20.png",
  //     bgtBalance: "0",
  //   },
  //   {
  //     name: "WETH | WBERA",
  //     address: "0x17376ad6167a5592fbeaa42e6068c132474a513d",
  //     icon: "https://res.cloudinary.com/duv0g402y/image/upload/v1738733618/reward-vaults/icons/cmiqewcekww0ckhqoe9d.png",
  //     bgtBalance: "0",
  //   },
  //   {
  //     name: "USDC.e | HONEY",
  //     address: "0xf99be47baf0c22b7eb5eac42c8d91b9942dc7e84",
  //     icon: "https://res.cloudinary.com/duv0g402y/image/upload/v1738378469/reward-vaults/icons/oqmqj7c4707nobigirw5.png",
  //     bgtBalance: "0",
  //   },
  //   {
  //     name: "Olympus - OHM | HONEY",
  //     address: "0x815596fa7c4d983d1ca5304e5b48978424c1b448",
  //     icon: "https://res.cloudinary.com/duv0g402y/image/upload/v1742844655/reward-vaults/icons/fzhm2cubp35ezzfa1uhq.png",
  //     bgtBalance: "0",
  //   },
  //   {
  //     name: "NAV - NAV | BERA",
  //     address: "0x66eb42c499372e897929efbf6026821b0a148119",
  //     icon: "https://res.cloudinary.com/duv0g402y/image/upload/v1742842382/reward-vaults/icons/314c3712-9449-4bcb-8923-da054c96a2f4.png",
  //     bgtBalance: "0",
  //   },
  //   {
  //     name: "Infrared - WBERA-iBGT",
  //     address: "0x3be1be98efaca8c1eb786cbf38234c84b5052eeb",
  //     icon: "https://res.cloudinary.com/duv0g402y/image/upload/v1742841457/reward-vaults/icons/decd0d82-b563-4f82-b9da-8b2f9e9a8101.png",
  //     bgtBalance: "0",
  //   },
  //   {
  //     name: "Infrared - WBERA-iBERA",
  //     address: "0xa2c5adb20a446fa71a1762002e3c9b4dd37dbaf4",
  //     icon: "https://res.cloudinary.com/duv0g402y/image/upload/v1742841457/reward-vaults/icons/decd0d82-b563-4f82-b9da-8b2f9e9a8101.png",
  //     bgtBalance: "0",
  //   },
  //   {
  //     name: "Infrared - WBERA | iBERA",
  //     address: "0x92af7d5fcdef44c3df168ecfdcd03dea1807af28",
  //     icon: "https://res.cloudinary.com/duv0g402y/image/upload/v1742841457/reward-vaults/icons/decd0d82-b563-4f82-b9da-8b2f9e9a8101.png",
  //     bgtBalance: "0",
  //   },
  //   {
  //     name: "Ramen - RAMEN | BERA",
  //     address: "0x6b23e121c6a13c959d69493ea5ca015a5847596a",
  //     icon: "https://res.cloudinary.com/duv0g402y/image/upload/v1742842357/reward-vaults/icons/16da1375-0e9f-4c7c-9034-0a8184bdbe57.png",
  //     bgtBalance: "0",
  //   },
  //   {
  //     name: "BM - WBERA | BM",
  //     address: "0x193ff57dc9efa1dec154946c10332ba31c8e72b2",
  //     icon: "https://res.cloudinary.com/duv0g402y/image/upload/v1742838273/Ecosystem/hbt1hvsanbb0mgddvnjb.png",
  //     bgtBalance: "0",
  //   },
  //   {
  //     name: "Kodiak - WBERA | HONEY",
  //     address: "0x45325df4a6a6ebd268f4693474aaaa1f3f0ce8ca",
  //     icon: "https://res.cloudinary.com/duv0g402y/image/upload/v1742841699/reward-vaults/icons/81d1ee15-aead-4395-be9b-cf9e52a704f0.png",
  //     bgtBalance: "0",
  //   },
  //   {
  //     name: "Beraplug - PLUG | WBERA",
  //     address: "0xa6cab22b1b64532af6779d7227983d1be1bd317e",
  //     icon: "https://res.cloudinary.com/duv0g402y/image/upload/v1742842694/reward-vaults/icons/2b72ffe3-0566-4188-aeb0-516c87b504c9.png",
  //     bgtBalance: "0",
  //   },
  //   {
  //     name: "Stride - stBGT | BERA",
  //     address: "0xcf77d23cfc561e34e3b6137c736ea5cb395bcda0",
  //     icon: "https://res.cloudinary.com/duv0g402y/image/upload/v1742841479/reward-vaults/icons/1c01b24a-0ff1-41c0-b16d-5b4fd5cd1958.png",
  //     bgtBalance: "0",
  //   },
  //   {
  //     name: "Yeet - YEET | WBERA",
  //     address: "0x0710abffb1a54211a5e88d18bf9854cba86d0819",
  //     icon: "https://res.cloudinary.com/duv0g402y/image/upload/v1742841518/reward-vaults/icons/840ba0be-550d-40d1-a04e-24f78afae1ea.png",
  //     bgtBalance: "0",
  //   },
  //   {
  //     name: "Kodiak - WBTC | WBERA",
  //     address: "0xeec2ad7bb37374229860265e644f4e2693b23fdd",
  //     icon: "https://res.cloudinary.com/duv0g402y/image/upload/v1742841699/reward-vaults/icons/81d1ee15-aead-4395-be9b-cf9e52a704f0.png",
  //     bgtBalance: "0",
  //   },
  //   {
  //     name: "Kodiak - WETH | WBERA",
  //     address: "0xfb657cd154e661ddf3e229529d92545640b19292",
  //     icon: "https://res.cloudinary.com/duv0g402y/image/upload/v1742841699/reward-vaults/icons/81d1ee15-aead-4395-be9b-cf9e52a704f0.png",
  //     bgtBalance: "0",
  //   },
  //   {
  //     name: "HPOS10I - WBERA | BITCOIN",
  //     address: "0x524fc4f013d66e9fed424e58c5ada7d5b139761d",
  //     icon: "https://res.cloudinary.com/duv0g402y/image/upload/v1742838273/Ecosystem/i4paodhr59anubt8rvlj.png",
  //     bgtBalance: "0",
  //   },
  //   {
  //     name: "Beradrome - hiBERO | HONEY",
  //     address: "0x63233c055847ed2526d9275a6cd1d01caafc09f0",
  //     icon: "https://res.cloudinary.com/duv0g402y/image/upload/v1742841609/reward-vaults/icons/544876aa-568f-4f78-b318-b16d02e23bd6.png",
  //     bgtBalance: "0",
  //   },
  //   {
  //     name: "BeraPaw - WBERA | LBGT",
  //     address: "0xe8ed00b1b142e8d84ef773c4fccaa18682d5a401",
  //     icon: "https://res.cloudinary.com/duv0g402y/image/upload/v1742841502/reward-vaults/icons/92c4c740-339b-46ff-ae37-5b8a74010819.png",
  //     bgtBalance: "0",
  //   },
  //   {
  //     name: "NOME - USDbr | HONEY",
  //     address: "0x31a484f7e09513ae9f481eaf8eeea76153184c44",
  //     icon: "https://res.cloudinary.com/duv0g402y/image/upload/v1742838273/Ecosystem/ksxg4louivbp0bjpzlus.png",
  //     bgtBalance: "0",
  //   },
  //   {
  //     name: "SolvProtocol - SolvBTC | WBTC",
  //     address: "0x11fadf69a02340a676b4bd2a27ffd952094fae99",
  //     icon: "https://res.cloudinary.com/duv0g402y/image/upload/v1742842438/reward-vaults/icons/c1ee4ab9-d1cf-4850-a9a4-c73d13749afd.png",
  //     bgtBalance: "0",
  //   },
  //   {
  //     name: "Dinero - STONE | beraETH",
  //     address: "0x19ecf480652a7de3a60dd7fd7012daed6c79e3e9",
  //     icon: "https://res.cloudinary.com/duv0g402y/image/upload/v1742838274/Ecosystem/xhwgcvjmurj009s7csvt.png",
  //     bgtBalance: "0",
  //   },
  //   {
  //     name: "Reservoir rUSD | HONEY",
  //     address: "0x34852c863d266100f573d4d1fd1d0cfe20602da0",
  //     icon: "https://res.cloudinary.com/duv0g402y/image/upload/v1742841539/reward-vaults/icons/76d98bae-608c-4e57-95eb-f8691a8d2cee.png",
  //     bgtBalance: "0",
  //   },
  //   {
  //     name: "StakeStone - WETH | STONE",
  //     address: "0xcd1982b07adfa787a88dc1157b9fa3221d25fcaf",
  //     icon: "https://res.cloudinary.com/duv0g402y/image/upload/v1742842397/reward-vaults/icons/06281214-e6a0-4f83-87af-9d227b2bdede.png",
  //     bgtBalance: "0",
  //   },
  //   {
  //     name: "Bulla - BERA | iBGT",
  //     address: "0xb4c32fd71c89f0195a8ac0c3fa9ebf2b4774bd26",
  //     icon: "https://res.cloudinary.com/duv0g402y/image/upload/v1742842241/reward-vaults/icons/1dd1de90-7d16-412b-8682-41d573d64d0a.png",
  //     bgtBalance: "0",
  //   },
  //   {
  //     name: "Dinero - WETH | beraETH",
  //     address: "0xedd27ce3793d655e3d15e29e297f4848de1ef092",
  //     icon: "https://res.cloudinary.com/duv0g402y/image/upload/v1742838274/Ecosystem/xhwgcvjmurj009s7csvt.png",
  //     bgtBalance: "0",
  //   },
  //   {
  //     name: "Smilee - WBERA | wgBERA",
  //     address: "0x1fe3c13b009ecfce196e480180db5f8990fff5fe",
  //     icon: "https://raw.githubusercontent.com/berachain/metadata/refs/heads/main/src/assets/tokens/0x567f32E86BE3e3963CdBc1887b5043B701f113d9.png",
  //     bgtBalance: "0",
  //   },
  //   {
  //     name: "Holdstation - HOLD | WBERA",
  //     address: "0x4551c0e216f59cc081b6610637668b770ffdf843",
  //     icon: "https://res.cloudinary.com/duv0g402y/image/upload/v1742841925/reward-vaults/icons/eb96868a-b293-4b4a-9fff-06218e831812.png",
  //     bgtBalance: "0",
  //   },
  //   {
  //     name: "", // Tên trống, bạn có thể cần cập nhật
  //     address: "0xde9d49a63fbb7c7d211b26a7d0dabdf8e0d4b4fe",
  //     icon: "", // Icon trống, bạn có thể cần cập nhật
  //     bgtBalance: "0",
  //   },
  //   {
  //     name: "Bedrock - WBTC | uniBTC",
  //     address: "0x8ee2627aff73e285f1a83b6e8bb7e9945f404a1b",
  //     icon: "https://res.cloudinary.com/duv0g402y/image/upload/v1742842539/reward-vaults/icons/df7a2ce9-3ff4-4c7c-9645-c9df78fd8a78.png",
  //     bgtBalance: "0",
  //   },
  //   {
  //     name: "Smilee - NECT | wgBERA",
  //     address: "0x4974ee5f484a3c05f181aeb380cd7c411dd79c0e",
  //     icon: "https://raw.githubusercontent.com/berachain/metadata/refs/heads/main/src/assets/tokens/0xE416C064946112c1626D6700D1081a750B1B1Dd7.png",
  //     bgtBalance: "0",
  //   },
  //   {
  //     name: "Stride - stBGT | WBERA",
  //     address: "0xe06e0d35aa771929df26d77f2ba3d6bc0235a811",
  //     icon: "https://res.cloudinary.com/duv0g402y/image/upload/v1742841479/reward-vaults/icons/1c01b24a-0ff1-41c0-b16d-5b4fd5cd1958.png",
  //     bgtBalance: "0",
  //   },
  //   {
  //     name: "SolvProtocol - SolvBTC.BBN | SolvBTC",
  //     address: "0x3fc5cb0290c82680afe9ef8cdde5468d74c85705",
  //     icon: "https://res.cloudinary.com/duv0g402y/image/upload/v1742842438/reward-vaults/icons/c1ee4ab9-d1cf-4850-a9a4-c73d13749afd.png",
  //     bgtBalance: "0",
  //   },
  //   {
  //     name: "Renzo - ezETH | wETH",
  //     address: "0xaa9c3d4ac242ab6eb9790861e1b4d6fbd6619cf4",
  //     icon: "https://res.cloudinary.com/duv0g402y/image/upload/v1742838273/Ecosystem/yqimvlhemawtveif7cbz.png",
  //     bgtBalance: "0",
  //   },
  //   {
  //     name: "Bulla - BERA | HONEY",
  //     address: "0x2ee022f42564a6b23231155850acf185da298509",
  //     icon: "https://res.cloudinary.com/duv0g402y/image/upload/v1742842241/reward-vaults/icons/1dd1de90-7d16-412b-8682-41d573d64d0a.png",
  //     bgtBalance: "0",
  //   },
  //   {
  //     name: "Beramonium - BERA | BERAMO",
  //     address: "0x4796039d56892a324585d77a76059b1cd2b9d02a",
  //     icon: "https://res.cloudinary.com/duv0g402y/image/upload/v1742838273/Ecosystem/xw3dv15b4lzrlntdlkj1.png",
  //     bgtBalance: "0",
  //   },
  //   {
  //     name: "Dinero - DINERO | WBERA",
  //     address: "0xcb522875373c5db79f4b0816b381b4461d07b1af",
  //     icon: "https://res.cloudinary.com/duv0g402y/image/upload/v1742838274/Ecosystem/xhwgcvjmurj009s7csvt.png",
  //     bgtBalance: "0",
  //   },
  //   {
  //     name: "Dinero - WETH | beraETH",
  //     address: "0x1932d24df32ec4cfdeca7824f36fd06c1458434c",
  //     icon: "https://res.cloudinary.com/duv0g402y/image/upload/v1742838274/Ecosystem/xhwgcvjmurj009s7csvt.png",
  //     bgtBalance: "0",
  //   },
  //   {
  //     name: "Avalon Labs - USDa | sUSDa",
  //     address: "0xc196d595dece185ea39f8e1c3ce07a274ac31985",
  //     icon: "https://res.cloudinary.com/duv0g402y/image/upload/v1742838273/Ecosystem/rg1yb9jyfthwpg4prrln.avif",
  //     bgtBalance: "0",
  //   },
  // ];
  const percentagePresets = [10, 50, 100, 1000];
  const [vaultsWithBalance, setVaultsWithBalance] = useState(rewardVaults);

  const fetchBgtBalances = async (signer) => {
    try {
      const updatedVaults = await Promise.all(
        rewardVaults.map(async (vault) => {
          const vaultContract = new ethers.Contract(
            vault.reward_vault,
            VAULT_ABI,
            signer
          );
          let bgtBalance;
          try {
            bgtBalance = await vaultContract.earned(account);
            bgtBalance = ethers.formatUnits(bgtBalance, 18);
          } catch (err) {
            // console.error(
            //   `Error fetching BGT earned for vault ${vault.name}:`,
            //   err
            // );
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
      setStatus("Lỗi khi lấy số dư BGT của các vault.");
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
        address: account,
        page: pageNumber,
        size: pageSize,
        state: -1,
        type: 1,
      };
      const response = await allOrderListAccount(params);
      setBuyOrdersAccount(response.list);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const fetchAccountSellOrders = async (pageNumber, pageSize) => {
    try {
      const params = {
        address: account,
        page: pageNumber,
        size: pageSize,
        state: -1,
        type: 2,
      };
      const response = await allOrderListAccount(params);
      console.log(response);
      setSellOrdersAccount(response.list);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const fetchVaults = async () => {
    try {
      const response = await allVaultsList();
      setRewardVaults(response.data);
    } catch (error) {
      console.error("Error fetching vaults:", error);
    }
  };

  useEffect(() => {
    fetchBgtBalances(signer);
  }, [rewardVaults]);

  useEffect(() => {
    if (account !== "") {
      loadBalance(signer);
      fetchOrders(page, rowsPerPage);
      fetchAccountBuyOrders(page, rowsPerPage);
      fetchAccountSellOrders(page, rowsPerPage);
    }
  }, [page, rowsPerPage, activeTab, account]);
  const displayedOrders = orders;
  const displayBuyOrdersAccount = buyOrdersAccount;
  const displaySellOrdersAccount = sellOrdersAccount;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        throw new Error("Vui lòng cài MetaMask.");
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      //bera- chainid
      const decimalChainId = 80094;
      const hexChainId = "0x" + decimalChainId.toString(16);
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: hexChainId }],
      });
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      setAccount(address);
      setSigner(signer);

      const balance = await provider.getBalance(address);
      setBeraBalance(ethers.formatUnits(balance, 18));

      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        signer
      );
      await getBeraPrice(contract);
      await fetchVaults();
    } catch (err) {
      console.error("Connect wallet error:", err);
      setStatus(`Lỗi khi kết nối ví: ${err.message}`);
    }
  };

  const loadBalance = async (signer) => {
    try {
      const honey = new ethers.Contract(HONEY_TOKEN_ADDRESS, HONEY_ABI, signer);
      const honeyBal = await honey.balanceOf(account);
      setHoneyBalance(ethers.formatUnits(honeyBal.toString(), 18));
    } catch (err) {
      console.error("Load balance error:", err);
      setStatus("Lỗi khi tải số dư HONEY.");
    }
  };

  const getContract = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
    } catch (err) {
      console.error("Get contract error:", err);
      throw new Error("Không thể khởi tạo hợp đồng.");
    }
  };

  const getBeraPrice = async (contract) => {
    try {
      const price = await contract.getBeraPrice();
      const rs = ethers.formatUnits(price[0].toString(), 8);
      setBeraPrice(rs);
      setPrice(rs);
    } catch (err) {
      console.error("Get Bera price error:", err);
      setStatus("Lỗi khi lấy giá BERA.");
    }
  };

  const checkHoneyAllowance = async (signer, amountIn) => {
    try {
      const honey = new ethers.Contract(HONEY_TOKEN_ADDRESS, HONEY_ABI, signer);
      const allowance = await honey.allowance(
        await signer.getAddress(),
        CONTRACT_ADDRESS
      );
      return allowance.gte(amountIn);
    } catch (err) {
      console.error("Check allowance error:", err);
      return false;
    }
  };

  // Hàm tính số lượng HONEY dựa trên phần trăm số dư
  const setAmountByPercentage = (percentage) => {
    if (!honeyBalance) return;
    const amountToSet = (parseFloat(honeyBalance) * percentage) / 100;
    setAmount(amountToSet.toFixed(2));
  };

  const createOrder = async () => {
    try {
      const requiredChainId = "0x138de";
      const currentChain = await window.ethereum.request({
        method: "eth_chainId",
      });
      if (currentChain !== requiredChainId) {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: requiredChainId }],
        });
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        signer
      );

      if (orderType === "Buy") {
        if (!amount || !price || isNaN(amount) || isNaN(price)) {
          setStatus("Vui lòng nhập đúng số lượng và giá.");
          return;
        }

        await getBeraPrice(contract);
        const amountIn = ethers.parseUnits(amount, 18);
        const priceIn = ethers.parseUnits(price, 18);
        const nodeId = BigInt(2);

        const honey = new ethers.Contract(
          HONEY_TOKEN_ADDRESS,
          HONEY_ABI,
          signer
        );
        const hasEnoughAllowance = await checkHoneyAllowance(signer, amountIn);
        if (!hasEnoughAllowance) {
          setStatus(
            "Đang yêu cầu cấp quyền HONEY... Vui lòng xác nhận trên MetaMask."
          );
          const approveTx = await honey.approve(CONTRACT_ADDRESS, amountIn);
          await approveTx.wait();
          setStatus("Đã cấp quyền HONEY!");
        }

        const tx = await contract.openBuyBgtOrder(priceIn, amountIn, nodeId, {
          gasLimit: 500000,
        });
        setStatus("Gửi giao dịch mua... Vui lòng xác nhận trên MetaMask.");
        const receipt = await tx.wait();
        setStatus("Tạo lệnh mua thành công!");
      } else if (orderType === "Sell") {
        if (!premiumRate || !selectedVault || isNaN(premiumRate)) {
          setStatus("Vui lòng nhập premium rate và chọn vault.");
          return;
        }

        const premiumRateIn = (+premiumRate * 10000) / 100 + 10000;
        const nodeId = BigInt(2);
        const rewardVault = selectedVault; // Sử dụng selectedVault thay vì REWARD_VAULT_ADDRESS

        const rewardVaultContract = new ethers.Contract(
          rewardVault, // Thay đổi từ REWARD_VAULT_ADDRESS thành rewardVault
          REWARD_VAULT_ABI,
          signer
        );
        setStatus(
          "Đang cấp quyền operator... Vui lòng xác nhận trên MetaMask."
        );
        const operatorTx = await rewardVaultContract.setOperator(
          CONTRACT_ADDRESS
        );
        await operatorTx.wait();
        setStatus("Đã cấp quyền operator!");

        const tx = await contract.openSellBgtOrder(
          rewardVault, // Thay đổi từ REWARD_VAULT_ADDRESS thành rewardVault
          BigInt(premiumRateIn),
          nodeId,
          {
            gasLimit: 500000,
          }
        );
        setStatus("Gửi giao dịch bán... Vui lòng xác nhận trên MetaMask.");
        const receipt = await tx.wait();
        setStatus("Tạo lệnh bán thành công!");
      } else if (orderType === "Sell") {
        if (!premiumRate || !selectedVault || isNaN(premiumRate)) {
          setStatus("Vui lòng nhập premium rate và chọn vault.");
          return;
        }

        const premiumRateIn = (+premiumRate * 10000) / 100 + 10000;
        const nodeId = BigInt(2);
        const rewardVault = selectedVault;

        const rewardVaultContract = new ethers.Contract(
          REWARD_VAULT_ADDRESS,
          REWARD_VAULT_ABI,
          signer
        );
        setStatus(
          "Đang cấp quyền operator... Vui lòng xác nhận trên MetaMask."
        );
        const operatorTx = await rewardVaultContract.setOperator(
          CONTRACT_ADDRESS
        );
        await operatorTx.wait();
        setStatus("Đã cấp quyền operator!");

        const tx = await contract.openSellBgtOrder(
          REWARD_VAULT_ADDRESS,
          BigInt(premiumRateIn),
          nodeId,
          {
            gasLimit: 500000,
          }
        );
        setStatus("Gửi giao dịch bán... Vui lòng xác nhận trên MetaMask.");
        const receipt = await tx.wait();
        setStatus("Tạo lệnh bán thành công!");
      }
    } catch (error) {
      console.error("Create order failed:", error);
      if (error.code === "ACTION_REJECTED" || error.code === 4001) {
        setStatus("Giao dịch bị từ chối: Bạn đã hủy giao dịch trên MetaMask.");
      } else if (error.code === "CALL_EXCEPTION" && error.data) {
        const iface = new ethers.Interface(CONTRACT_ABI);
        try {
          const decoded = iface.parseError(error.data);
          setStatus(`Giao dịch bị từ chối: ${decoded.name} ${decoded.args}`);
        } catch (decodeErr) {
          setStatus("Giao dịch bị revert nhưng không rõ nguyên nhân.");
        }
      } else {
        setStatus(`Lỗi: ${error.message}`);
      }
    }
  };

  const fillSellOrder = async (orderId, amount) => {
    try {
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        signer
      );

      const honey = new ethers.Contract(HONEY_TOKEN_ADDRESS, HONEY_ABI, signer);
      const approveTx = await honey.approve(
        CONTRACT_ADDRESS,
        ethers.parseUnits("9999999", 18)
      );
      await approveTx.wait();

      const fillTx = await contract.fillSellBgtOrder(
        BigInt(orderId),
        BigInt(2),
        {
          gasLimit: 500000,
        }
      );

      console.log(fillTx);
    } catch (err) {
      console.error("Fill order error:", err);
      setStatus("Lỗi khi khớp lệnh");
    }
  };

  const fillBuyOrder = async (orderId, vault) => {
    try {
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        signer
      );

      const fillTx = await contract.fillBuyBgtOrder(
        BigInt(orderId),
        vault,
        BigInt(2),
        {
          gasLimit: 500000,
        }
      );
    } catch (err) {
      console.error("Fill order error:", err);
      setStatus("Lỗi khi khớp lệnh");
    }
  };

  // Và cập nhật hàm closeOrder để xử lý cả hai loại lệnh:
  const closeOrder = async (orderId, orderType) => {
    try {
      const contract = await getContract();
      const id = BigInt(orderId);
      let tx;

      if (orderType === "Buy") {
        tx = await contract.closeBuyBgtOrder(id);
      } else if (orderType === "Sell") {
        tx = await contract.closeSellBgtOrder(id);
      }

      setStatus("Đang hủy lệnh...");
      await tx.wait();
      setStatus(`Đã hủy lệnh ${orderType === "Buy" ? "mua" : "bán"}!`);
    } catch (err) {
      console.error("Close order error:", err);
      setStatus(`Lỗi khi hủy lệnh ${orderType === "Buy" ? "mua" : "bán"}`);
    }
  };
  return (
    <Box
      sx={{
        minHeight: "110vh",
        width: "100%",
        backgroundImage: "url('../src/assets/bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        position: "relative",
        p: 4,
        display: "flex",
        gap: 4,
      }}
    >
      <img
        src="/src/assets/iconnetwork.png"
        alt="iconnetwork"
        style={{
          position: "absolute",
          top: "58px",
          right: "430px",
          width: "60px",
          height: "60px",
          objectFit: "cover",
        }}
      ></img>

      <img
        src="/src/assets/icongreen.png"
        alt="icongreen"
        style={{
          width: "12px",
          height: "12px",
          position: "absolute",
          top: "59px",
          right: "433px",
        }}
      />

      <Button
        variant="outlined"
        onClick={connectWallet}
        sx={{
          backgroundColor: "#FFEA00",
          border: "1.5px solid black",
          color: "#000000",
          fontWeight: "bold",
          fontSize: "13px",
          position: "absolute",
          top: "55px",
          right: "210px",
          zIndex: 10,
          borderRadius: "200px",
          fontFamily: "Itim, cursive",
          padding: "10px 18px",

          "&:hover": {
            backgroundColor: "#FFEA00",
            border: "1px solid black",
          },
        }}
      >
        <img
          src="/src/assets/iconwallet.png" // Đường dẫn đến icon ví trong thư mục src/assets
          alt="wallet icon"
          style={{ width: "40px", height: "40px", marginRight: "10px" }}
        />

        {account
          ? ` ${account.slice(0, 6)}...${account.slice(38, 42)}`
          : "Connect Wallet"}
      </Button>

      <Button
        variant="text"
        sx={{
          color: "#fff",
          fontSize: "40px",
          width: "98px",
          height: "18px",
          textShadow: `
        -1px -1px 0 black,
        1px -1px 0 black,
        -1px 1px 0 black,
        1px 1px 0 black
       `,
          position: "absolute",
          top: "76px",
          left: "389px",
          fontFamily: "Itim, cursive",
          fontWeight: "400",
          textTransform: "none",
          "& span.label::after": {
            content: '"   "',
            display: "block",
            margin: "4px auto 0 auto",
            width: "130px",
            height: "5px",
            backgroundColor: "#FFEA00",
            borderRadius: "4px",
            border: "1px solid black",
            position: "absolute",
            top: "26px",
          },
        }}
      >
        <span className="label">Market</span>
      </Button>

      <img
        src="/src/assets/TTT.png"
        alt="logo"
        style={{
          width: "100px",
          height: "100px",
          position: "absolute",
          top: "5%",
          left: "9%",
        }}
      />

      {/* button about */}
      <Button
        variant="text"
        onClick={() => {
          window.open("https://tienthuattoan.com/");
        }}
        sx={{
          color: "#fff",
          fontSize: "40px",
          width: "250px",
          height: "18px",
          textShadow: `
        -1px -1px 0 black,
        1px -1px 0 black,
        -1px 1px 0 black,
        1px 1px 0 black
       `,
          position: "absolute",
          top: "76px",
          left: "600px",
          fontFamily: "Itim, cursive",
          fontWeight: "400",
          textTransform: "none",
          padding: 0,
          minWidth: "unset",
        }}
      >
        <span className="label-1">About TTT</span>
      </Button>

      {/* button Delegate for TTT */}
      <Button
        variant="text"
        onClick={() => {
          window.open(
            "https://hub.berachain.com/validators/0x89884fc95abcb82736d768fc8ad4fdf4cb2112496974ae05440d835d0e93216643ae212b365fb6d9d2501d76d0925ef3/"
          );
        }}
        sx={{
          color: "#fff",
          fontSize: "40px",
          width: "400px",
          height: "18px",
          textShadow: `
        -1px -1px 0 black,
        1px -1px 0 black,
        -1px 1px 0 black,
        1px 1px 0 black
       `,
          position: "absolute",
          top: "76px",
          right: "700px",
          fontFamily: "Itim, cursive",
          fontWeight: "400",
          textTransform: "none",
          padding: 0,
          minWidth: "unset",
        }}
      >
        <span className="label-1">Delegate for TTT</span>
      </Button>

      {/* Form Tạo Lệnh (Đã chỉnh sửa giao diện phần Mua BGT) */}

      <Container
        sx={{
          width: "1500px",
          bgcolor: "white",
          opacity: "0.8",
          borderRadius: "20px",
          p: 4,
          boxShadow: "0 8px 30px rgba(0,0,0,0.1)",
          mt: 21,
          color: "black",
        }}
      >
        <Typography
          variant="h5"
          fontWeight="bold"
          gutterBottom
          textAlign="center"
        >
          Thị Trường BGT
        </Typography>

        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          centered
          sx={{ mb: 3 }}
        >
          <Tab label="Mua BGT" value="Buy" />
          <Tab label="Bán BGT" value="Sell" />
        </Tabs>

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 500 }} aria-label="order table">
            <TableHead>
              {activeTab === "Buy" ? (
                <TableRow>
                  <TableCell>BGT Amount</TableCell>
                  <TableCell>Premium</TableCell>
                  <TableCell>Estimated to pay</TableCell>
                  <TableCell>Address</TableCell>
                  <TableCell>Hash</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              ) : (
                <TableRow>
                  <TableCell>BGT Price</TableCell>
                  <TableCell>BGT Amount</TableCell>
                  <TableCell>Paid</TableCell>
                  <TableCell>Address</TableCell>
                  <TableCell>Hash</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              )}
            </TableHead>
            <TableBody>
              {account === "" || displayedOrders === null ? (
                <TableRow>
                  <TableCell>
                    <span style={{ fontSize: "20px" }}>
                      Please connect your wallet
                    </span>
                  </TableCell>
                </TableRow>
              ) : (
                displayedOrders.map((order, index) =>
                  activeTab === "Buy" ? (
                    <TableRow key={order.order_id || index}>
                      <TableCell>
                        {+order.unclaimed_bgt < 0.01
                          ? "<0.01"
                          : +order.unclaimed_bgt == 0
                          ? "0.00"
                          : (+order.unclaimed_bgt).toFixed(3)}
                      </TableCell>
                      <TableCell>{(order.markup - 10000) / 100}%</TableCell>
                      <TableCell>
                        {(
                          beraPrice *
                          +order.unclaimed_bgt *
                          (1 + (order.markup - 10000) / 100 / 100)
                        ).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        {order.address.slice(0, 6)}...{order.address.slice(-4)}
                      </TableCell>
                      <TableCell>
                        {order.evm_tx_hash.slice(0, 6)}...
                        {order.evm_tx_hash.slice(-4)}
                      </TableCell>
                      <TableCell>
                        {(
                          (Math.floor(Date.now() / 1000) - order.time) /
                          86400
                        ).toFixed(0)}{" "}
                        days ago
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color={activeTab === "Buy" ? "success" : "error"}
                          onClick={
                            activeTab === "Buy"
                              ? () =>
                                  fillSellOrder(order.order_id, order.amount)
                              : () =>
                                  fillBuyOrder(
                                    order.order_id,
                                    "0xc2baa8443cda8ebe51a640905a8e6bc4e1f9872c"
                                  )
                          }
                          sx={{ borderRadius: "12px" }}
                        >
                          {activeTab === "Buy" ? "Buy" : "Sell"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ) : (
                    <TableRow key={order.order_id || index}>
                      <TableCell>${(+order.price).toFixed(2)}</TableCell>
                      <TableCell>
                        {(+order.filled_bgt_amount).toFixed(2)}/
                        {(+order.bgt_amount).toFixed(2)}
                      </TableCell>
                      <TableCell>{(+order.amount).toFixed(2)}</TableCell>
                      <TableCell>
                        {order.address.slice(0, 6)}...{order.address.slice(-4)}
                      </TableCell>
                      <TableCell>
                        {order.evm_tx_hash.slice(0, 6)}...
                        {order.evm_tx_hash.slice(-4)}
                      </TableCell>
                      <TableCell>
                        {(
                          (Math.floor(Date.now() / 1000) - order.time) /
                          86400
                        ).toFixed(0)}{" "}
                        days ago
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color={activeTab === "Buy" ? "success" : "error"}
                          onClick={
                            activeTab === "Buy"
                              ? () =>
                                  fillSellOrder(order.order_id, order.amount)
                              : () =>
                                  fillBuyOrder(
                                    order.order_id,
                                    "0xc2baa8443cda8ebe51a640905a8e6bc4e1f9872c"
                                  )
                          }
                          sx={{ borderRadius: "12px" }}
                        >
                          {activeTab === "Buy" ? "Buy" : "Sell"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                )
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={total}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Container>

      {/* Form Tạo Lệnh (Đã chỉnh sửa giao diện phần Mua BGT) */}
      <Container
        sx={{
          width: "400px",
          bgcolor: "black",
          opacity: "0.8",
          borderRadius: "50px",
          p: 4,
          boxShadow: "0 8px 30px rgba(0,0,0,0.1)",
          mt: 21,
          ml: 8,
          color: "#fff",
        }}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          gutterBottom
          textAlign="center"
          sx={{ fontFamily: "'Itim', cursive" }}
        >
          Create Order
        </Typography>

        {account && (
          <Box sx={{ mb: 3 }}>
            {/* số dư bera trong ví */}
            <Typography
              variant="subtitle1"
              sx={{
                fontFamily: "'Itim', cursive",
                display: "flex",
                alignItems: "center",
              }}
            >
              <img
                src="/src/assets/iconbera.png"
                alt="BERA"
                style={{ width: 25, height: 25, marginRight: 8 }}
              />
              BERA: {parseFloat(beraBalance).toFixed(2)}
            </Typography>
          </Box>
        )}

        <Box sx={{ mb: 3 }}>
          <ToggleButtonGroup
            value={orderType}
            exclusive
            onChange={(event, newValue) => {
              if (newValue !== null) setOrderType(newValue);
            }}
            fullWidth
            sx={{
              mb: 2,
              fontFamily: "Itim, cursive",
              borderRadius: "999px",
              backgroundColor: "rgba(0,0,0,0.6)",
              padding: "4px",
              "& .MuiToggleButton-root": {
                flex: 1,
                fontWeight: "bold",
                fontSize: "1rem",
                color: "#fff",
                border: "none",
                borderRadius: "999px",
                textTransform: "none",
                fontFamily: "Itim, cursive",
                transition: "all 0.05s",
                "&.Mui-selected": {
                  backgroundColor: "#FFEA00",
                  color: "black",
                  borderRadius: "999px",
                },
                // "&:hover": {
                //   backgroundColor: "#FFEA00",
                //   color: "black", mua máy mới
                // },
              },
            }}
          >
            <ToggleButton value="Buy">Buy BGT</ToggleButton>
            <ToggleButton value="Sell">Sell BGT</ToggleButton>
            <ToggleButton value="Buy Orders">Buy Orders</ToggleButton>
            <ToggleButton value="Sell Orders">Sell Orders</ToggleButton>
          </ToggleButtonGroup>

          {orderType === "Buy" ? (
            account === "" ? (
              <>
                <Box>
                  <Typography
                    variant="body1"
                    sx={{
                      mb: 1,
                      fontFamily: "Itim, cursive",
                      fontWeight: "bold",
                      fontSize: "1.1rem",
                    }}
                  >
                    Please connect your wallet
                  </Typography>
                </Box>
              </>
            ) : (
              <>
                <Box
                  sx={{
                    mb: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Box sx={{ width: "50%" }}>
                    <Typography
                      variant="body1"
                      sx={{
                        mb: 1,
                        fontFamily: "Itim, cursive",
                        fontWeight: "bold",
                        fontSize: "1.1rem",
                      }}
                    >
                      BGT Price ($)
                    </Typography>

                    <TextField
                      variant="outlined"
                      fullWidth
                      placeholder="$"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      sx={{
                        borderRadius: "12px",
                        backgroundColor: "#f5f5f5",
                        fontFamily: "Itim, cursive",
                        "& input": {
                          fontFamily: "Itim, cursive",
                          fontWeight: "bold",
                          fontSize: "1rem",
                        },
                      }}
                    />
                  </Box>
                  <Box sx={{ textAlign: "right" }}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontFamily: "'Itim', cursive",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <img
                        src="/src/assets/iconbera.png"
                        alt="BERA Price"
                        style={{ width: 23, height: 23, marginRight: 8 }}
                      />
                      BERA Price:{" "}
                      {beraPrice
                        ? `${parseFloat(beraPrice).toFixed(2)}$`
                        : "N/A"}
                    </Typography>
                  </Box>
                </Box>

                <Box
                  sx={{
                    mb: 2,
                    display: "flex",
                    gap: 1,
                    justifyContent: "center",
                  }}
                >
                  {percentagePresets.map((percentage) => (
                    <Button
                      key={percentage}
                      variant="outlined"
                      onClick={() => setAmountByPercentage(percentage)}
                      sx={{
                        borderRadius: "12px",
                        minWidth: "60px",
                        fontSize: "1rem", // Điều chỉnh kích thước chữ
                        fontFamily: "'Itim', cursive", // Thay đổi phông chữ
                        color: "#fff", // Màu chữ
                        borderColor: "#fff", // Màu viền
                        "&:hover": {
                          backgroundColor: "#ffca28", // Màu nền khi hover
                          color: "#ffca28", // Màu chữ khi hover
                          borderColor: "#ffca28", // Màu viền khi hover
                        },
                      }}
                    >
                      {percentage}%
                    </Button>
                  ))}
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography
                    variant="body1"
                    sx={{
                      mb: 1,
                      fontFamily: "Itim, cursive", // Phông chữ cho label
                      fontWeight: "700", // Đậm chữ
                      color: "fff", // Màu chữ tối
                    }}
                  >
                    Buying Amount ($HONEY)
                  </Typography>
                  <TextField
                    variant="outlined"
                    fullWidth
                    sx={{
                      borderRadius: "12px",
                      backgroundColor: "#f5f5f5", // Nền mờ như yêu cầu
                      "& .MuiInputBase-input": {
                        fontFamily: "Itim, cursive", // Phông chữ cho input
                        fontWeight: "700", // Đậm chữ nhập vào
                        color: "#333", // Màu chữ tối
                      },
                      "& .MuiOutlinedInput-notchedOutline": {
                        border: "none", // Không viền
                      },
                    }}
                    value={amount} // Số lượng BGT
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </Box>

                <Box
                  sx={{
                    mb: 2,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{ fontFamily: "'Itim', cursive", marginRight: 1 }}
                  >
                    Balance:
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <img
                      src="/src/assets/honey.png"
                      alt="Honey"
                      style={{ width: 20, height: 20, marginRight: 4 }} // Giảm khoảng cách giữa icon và giá trị
                    />
                    <Typography
                      variant="body2"
                      sx={{ fontFamily: "'Itim', cursive" }}
                    >
                      {parseFloat(honeyBalance).toFixed(2)}
                    </Typography>
                  </Box>
                </Box>
                <Button
                  variant="contained"
                  color="success"
                  onClick={createOrder}
                  fullWidth
                  sx={{
                    py: 1.5,
                    fontWeight: "bold",
                    borderRadius: "20px",
                    boxShadow: "0 4px 12px rgba(0, 128, 0, 0.3)",
                    fontFamily: "'Itim', cursive",
                    fontSize: "1.2rem", // Kích thước chữ
                    backgroundColor: "#14ED00", // Màu nền của nút
                    "&:hover": {
                      backgroundColor: "#12C900", // Màu khi hover (có thể điều chỉnh)
                    },
                  }}
                >
                  Buy
                </Button>
              </>
            )
          ) : orderType === "Sell" ? (
            account === "" ? (
              <>
                <Box>
                  <Typography
                    variant="body1"
                    sx={{
                      mb: 1,
                      fontFamily: "Itim, cursive",
                      fontWeight: "bold",
                      fontSize: "1.1rem",
                    }}
                  >
                    Please connect your wallet
                  </Typography>
                </Box>
              </>
            ) : (
              <>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel id="vault-label">Reward Vault</InputLabel>
                  <Select
                    labelId="vault-label"
                    value={selectedVault}
                    label="Reward Vault"
                    onChange={(e) => setSelectedVault(e.target.value)}
                    sx={{
                      borderRadius: "12px",
                      backgroundColor: "#f5f5f5",
                    }}
                  >
                    <MenuItem value="">
                      <em>Chọn Vault</em>
                    </MenuItem>
                    {vaultsWithBalance.map((vault) =>
                      vault.name !== "" && vault.icon !== "" ? (
                        <MenuItem
                          key={vault.reward_vault}
                          value={vault.reward_vault}
                          disabled={parseFloat(vault.bgtBalance) <= 0}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              width: "100%",
                            }}
                          >
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <img
                                src={vault.icon}
                                alt={vault.name}
                                style={{
                                  width: "20px",
                                  height: "20px",
                                  marginRight: "8px",
                                }}
                              />
                              {vault.name}
                            </Box>
                            <Typography
                              variant="body2"
                              sx={{ color: "text.secondary" }}
                            >
                              {vault.bgtBalance} BGT
                            </Typography>
                          </Box>
                        </MenuItem>
                      ) : null
                    )}
                  </Select>
                </FormControl>

                <Box
                  sx={{
                    mb: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <TextField
                    label="BGT Premium Rate (%)"
                    variant="outlined"
                    sx={{
                      width: "50%",
                      borderRadius: "12px",
                      backgroundColor: "#f5f5f5",
                    }}
                    value={premiumRate}
                    onChange={(e) => setPremiumRate(e.target.value)}
                    // placeholder="ví dụ: 10 cho 110%"
                  />
                  {/* giá bera sell */}
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: "'Itim', cursive",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <img
                      src="/src/assets/iconbera.png"
                      alt="BERA Price"
                      style={{ width: 23, height: 23, marginRight: 8 }}
                    />
                    BERA Price:{" "}
                    {beraPrice ? `${parseFloat(beraPrice).toFixed(2)}$` : "N/A"}
                  </Typography>
                </Box>
                {/* phần trăm sell */}
                <Box
                  sx={{
                    mb: 2,
                    display: "flex",
                    gap: 1,
                    justifyContent: "center",
                  }}
                >
                  {percentagePresets.map((rate) => (
                    <Button
                      key={rate}
                      variant={
                        premiumRate === rate.toString()
                          ? "contained"
                          : "outlined"
                      }
                      onClick={() => setPremiumRate(rate.toString())}
                      sx={{
                        borderRadius: "12px",
                        minWidth: "60px",
                        fontSize: "1rem", // Điều chỉnh kích thước chữ
                        fontFamily: "'Itim', cursive", // Thay đổi phông chữ
                        backgroundColor:
                          premiumRate === rate.toString()
                            ? "#ffca28"
                            : "transparent", // Màu nền của nút khi được chọn
                        color:
                          premiumRate === rate.toString() ? "black" : "inherit", // Màu chữ khi được chọn
                        borderColor: "#fff", // Màu viền
                        "&:hover": {
                          backgroundColor: "#ffca28", // Màu nền khi hover (giống màu chọn)
                          color: "#000", // Màu chữ khi hover
                        },
                      }}
                    >
                      {rate}%
                    </Button>
                  ))}
                </Box>

                <Box
                  sx={{
                    mb: 2,
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography variant="body2">BGT chưa nhận (≥0.01)</Typography>
                  <Typography variant="body2">0 🐻</Typography>
                </Box>
                <Box
                  sx={{
                    mb: 2,
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography variant="body2">Ước tính nhận được</Typography>
                  <Typography variant="body2">0 🐻</Typography>
                </Box>
                {/* nút bán sell */}
                <Button
                  variant="contained"
                  color="success"
                  onClick={createOrder}
                  fullWidth
                  sx={{
                    py: 1.5,
                    fontWeight: "bold",
                    borderRadius: "20px",
                    boxShadow: "0 4px 12px rgba(0, 128, 0, 0.3)",
                    fontFamily: "'Itim', cursive",
                    fontSize: "1.2rem", // Kích thước chữ
                    backgroundColor: "#FF0000", // Màu nền của nút
                    "&:hover": {
                      backgroundColor: "#FF3333", // Màu khi hover (có thể điều chỉnh)
                    },
                  }}
                >
                  Sell
                </Button>
              </>
            )
          ) : orderType === "Buy Orders" ? (
            <TableContainer component={Paper}>
              {account === "" ? (
                <Table sx={{ minWidth: 200 }} aria-label="order table">
                  <TableBody>
                    <TableRow>
                      <TableCell>Please connect your wallet</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              ) : buyOrdersAccount === null ? (
                <Table sx={{ minWidth: 200 }} aria-label="order table">
                  <TableBody>
                    <TableRow>
                      <TableCell>No order</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              ) : (
                <Table sx={{ maxWidth: 200 }} aria-label="order table">
                  <TableHead>
                    <TableRow>
                      <TableCell>BGT Price</TableCell>
                      <TableCell>BGT Amount</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {displayBuyOrdersAccount.map((order, index) => (
                      <TableRow key={order.order_id || index}>
                        <TableCell>{order.price}</TableCell>
                        <TableCell>
                          {(+order.filled_bgt_amount).toFixed(2)}/
                          {(+order.bgt_amount).toFixed(2)}
                        </TableCell>
                        <TableCell style={{ color: "green" }}>Buy</TableCell>
                        <TableCell>
                          <Button
                            variant="contained"
                            color={order.state === 1 ? "success" : "gray"}
                            disabled={order.state === 1 ? false : true}
                            onClick={() => closeOrder(order.order_id, "Buy")}
                            sx={{ borderRadius: "12px" }}
                          >
                            {order.state === 1 ? "Close" : "Closed"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </TableContainer>
          ) : (
            <TableContainer component={Paper}>
              {account === "" ? (
                <Table sx={{ minWidth: 200 }} aria-label="order table">
                  <TableBody>
                    <TableRow>
                      <TableCell>Please connect your wallet</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              ) : sellOrdersAccount === null ? (
                <Table sx={{ minWidth: 200 }} aria-label="order table">
                  <TableBody>
                    <TableRow>
                      <TableCell>No order</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              ) : (
                <Table sx={{ maxWidth: 100 }} aria-label="order table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Premium</TableCell>
                      <TableCell>Sold Amount</TableCell>
                      <TableCell>Profit</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {displaySellOrdersAccount.map((order, index) => (
                      <TableRow key={order.order_id || index}>
                        <TableCell>{(order.markup - 10000) / 100}%</TableCell>
                        <TableCell>
                          {+order.unclaimed_bgt < 0.01
                            ? "<0.01"
                            : +order.unclaimed_bgt == 0
                            ? "0.00"
                            : (+order.unclaimed_bgt).toFixed(3)}
                        </TableCell>
                        <TableCell>
                          {(
                            beraPrice *
                            +order.unclaimed_bgt *
                            (1 + (order.markup - 10000) / 100 / 100)
                          ).toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="contained"
                            color={order.state === 1 ? "success" : "gray"}
                            disabled={order.state === 1 ? false : true}
                            onClick={() => closeOrder(order.order_id, "Sell")}
                            sx={{ borderRadius: "12px" }}
                          >
                            {order.state === 1 ? "Close" : "Closed"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </TableContainer>
          )}
        </Box>
        {status && (
          <Typography variant="body2" color="text.secondary" textAlign="center">
            {status}
          </Typography>
        )}
      </Container>
    </Box>
  );
}
