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
  Link,
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

  const [selectedPercentage, setSelectedPercentage] = useState(null);

  //order list
  const [orders, setOrders] = useState([]);
  const [buyOrdersAccount, setBuyOrdersAccount] = useState([]);
  const [sellOrdersAccount, setSellOrdersAccount] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [total, setTotal] = useState(0);
  const [rewardVaults, setRewardVaults] = useState([]);
  const [vaultForFill, setVaultForFill] = useState("");

  const [totalPersonalBuy, setTotalPersonalBuy] = useState(0);
  const [pagePersonalBuy, setPagePersonalBuy] = useState(0);
  const [rowsPerPagePersonalBuy, setRowsPerPagePersonalBuy] = useState(5);

  const [totalPersonalSell, setTotalPersonalSell] = useState(0);
  const [pagePersonalSell, setPagePersonalSell] = useState(0);
  const [rowsPerPagePersonalSell, setRowsPerPagePersonalSell] = useState(5);

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
      setTotalPersonalBuy(response.total);
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
      setTotalPersonalSell(response.total);
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
    }
  }, [page, rowsPerPage, activeTab, account]);
  const displayedOrders = orders;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    if (account !== "") {
      fetchAccountBuyOrders(pagePersonalBuy, rowsPerPagePersonalBuy);
    }
  }, [pagePersonalBuy, rowsPerPagePersonalBuy, account]);
  const displayBuyOrdersAccount = buyOrdersAccount;

  const handleChangePagePersonalBuy = (event, newPage) => {
    setPagePersonalBuy(newPage);
  };

  const handleChangeRowsPerPagePersonalBuy = (event) => {
    setRowsPerPagePersonalBuy(parseInt(event.target.value, 10));
    setPagePersonalBuy(0);
  };

  useEffect(() => {
    if (account !== "") {
      fetchAccountSellOrders(pagePersonalSell, rowsPerPagePersonalSell);
    }
  }, [pagePersonalSell, rowsPerPagePersonalSell, account]);
  const displaySellOrdersAccount = sellOrdersAccount;

  const handleChangePagePersonalSell = (event, newPage) => {
    setPagePersonalSell(newPage);
  };

  const handleChangeRowsPerPagePersonalSell = (event) => {
    setRowsPerPagePersonalSell(parseInt(event.target.value, 10));
    setPagePersonalSell(0);
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

        const approveTx = await honey.approve(CONTRACT_ADDRESS, amountIn);
        await approveTx.wait();
        setStatus("Đã cấp quyền HONEY!");

        const tx = await contract.openBuyBgtOrder(priceIn, amountIn, nodeId, {
          gasLimit: 500000,
        });
        setStatus("Gửi giao dịch mua... Vui lòng xác nhận trên MetaMask.");
        const receipt = await tx.wait();
        setStatus("Tạo lệnh mua thành công!");
      } else {
        if (!premiumRate || !selectedVault || isNaN(premiumRate)) {
          setStatus("Vui lòng nhập premium rate và chọn vault.");
          return;
        }

        const premiumRateIn = (+premiumRate * 10000) / 100 + 10000;
        const nodeId = BigInt(2);
        const rewardVault = selectedVault;
        const rewardVaultContract = new ethers.Contract(
          rewardVault,
          VAULT_ABI,
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
          rewardVault,
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
      if (vault === "") {
        console.log("Vault have never been chosen");
        return
      }
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
      // background ở đây
      sx={{
        minHeight: "100vh",
        maxWidth:{xs:"100%"},
        
        display: "flex",
        alignItems: "center",
        flexWrap:"wrap",
        // justifyContent: { xs: "center", sm: "space-between" },
        gap: 4,
        flexDirection: { xs: "row", md: "row",lg:"column" },
        // overflowX:"hidden",
      }}
    >
    
      {/* header */}
      <Box
        sx={{
          width: "100%",
          maxWidth: { xs: "100%", md: "1700px"},
          display: "flex",
          alignItems: "center",
          marginLeft: "auto",
          marginRight: "auto",
          padding: "30px 0",
        }}
      >
        {/* box logo cty */}
        <Box sx={{ width: "10%" }}>
          <img
            src="https://dr9rfdtcol2ay.cloudfront.net/assets/TTT.png"
            alt="logo"
            style={{
              width: "90px",
              height: "90px",
              // position: "absolute",
              // top: "5%",
              // left: "9%",
            }}
          />
        </Box>

        {/* box button */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            // justifyContent: "space-around",
            width: "70%",
          }}
        >
          {/* Button market */}
          <Button
            variant="text"
            sx={{
              color: "#fff",
              fontSize: "32px",
              width: "30%",
              height: "18px",
              textShadow: `
                  -1px -1px 0 black,
                  1px -1px 0 black,
                  -1px 1px 0 black,
                  1px 1px 0 black
                `,
              // position: "absolute",
              // top: "76px",
              // left: "389px",
              fontFamily: "Itim, cursive",
              fontWeight: "400",
              textTransform: "none",
              "&:hover": {
                background: "none",
              },
              "& span.label::after": {
                content: '"   "',
                display: "block",
                margin: "4px auto 0 auto",
                width: "100px",
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

          {/* Button about */}
          <Button
            variant="text"
            onClick={() => {
              window.open("https://tienthuattoan.com/");
            }}
            sx={{
              color: "#fff",
              fontSize: "32px",
              width: "30%",
              textShadow: `
        -1px -1px 0 black,
        1px -1px 0 black,
        -1px 1px 0 black,
        1px 1px 0 black
       `,
              // position: "absolute",
              // top: "76px",
              // left: "600px",
              fontFamily: "Itim, cursive",
              fontWeight: "400",
              textTransform: "none",
              padding: 0,
              minWidth: "unset",
              "&:hover": {
                background: "none",
              },
            }}
          >
            <span className="label-1">About TTT</span>
          </Button>

          {/* Button Dele */}
          <Button
            variant="text"
            onClick={() => {
              window.open(
                "https://hub.berachain.com/validators/0x89884fc95abcb82736d768fc8ad4fdf4cb2112496974ae05440d835d0e93216643ae212b365fb6d9d2501d76d0925ef3/"
              );
            }}
            sx={{
              color: "#fff",
              fontSize: "32px",
              width: "40%",
              textShadow: `
        -1px -1px 0 black,
        1px -1px 0 black,
        -1px 1px 0 black,
        1px 1px 0 black
       `,
              // position: "absolute",
              // top: "76px",
              // right: "700px",
              fontFamily: "Itim, cursive",
              fontWeight: "400",
              textTransform: "none",
              padding: 0,
              minWidth: "unset",
              "&:hover": {
                background: "none",
              },
            }}
          >
            <span className="label-1">Delegate for TTT</span>
          </Button>
        </Box>

        {/* box connect-wallet */}
        <Box
          sx={{
            width: "20%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-evenly",
          }}
        >
          <Box
            sx={{
              position: "relative",
              paddingTop: "10px",
            }}
          >
            {/* icon bera */}
            <img
              src="https://dr9rfdtcol2ay.cloudfront.net/assets/iconnetwork.png"
              alt="iconnetwork"
              style={{
                // position: "absolute",
                // top: "58px",
                // right: "430px",
                width:{md:"80%",lg:"100%"},
                height: "60px",
                maxWidth:"60px",
                objectFit: "cover",
              }}
            ></img>
            {/* icon green(tích hoạt động) */}
            <img
              src="https://dr9rfdtcol2ay.cloudfront.net/assets/icongreen.png"
              alt="icongreen"
              style={{
                width: "12px",
                height: "12px",
                position: "absolute",
                // top: "",
                right: "0",
              }}
            />
          </Box>
          <Button
            variant="outlined"
            onClick={connectWallet}
            sx={{
              backgroundColor: "#FFEA00",
              border: "1.5px solid black",
              color: "#000000",
              fontWeight: "bold",
              fontSize: { xs: "9px", sm: "11px", md: "13px" },
              // position: "absolute",
              // top: "55px",
              // right: "210px",
              zIndex: 10,
              borderRadius: "200px",
              fontFamily: "Itim, cursive",
              padding: "10px 18px",

              "&:hover": {
                backgroundColor: "#fff",
                color:"#000",
                border: "1px solid black",
              },
            }}
          >
            <img
              src="https://dr9rfdtcol2ay.cloudfront.net/assets/iconwallet.png"
              alt="wallet icon"
              style={{
                width:{ xs: "60%", sm: "80%", md: "100%" },
                maxWidth: "40px",
                // height: "40px",
                marginRight: "10px",
              }}
            />
            {account
              ? ` ${account.slice(0, 6)}...${account.slice(38, 42)}`
              : "Connect Wallet"}
          </Button>
        </Box>
      </Box>

      {/* Box value */}
      <Box
      sx={{
        display:"flex",
        flexWrap:"wrap",
        justifyContent:"space-evenly",
      }}
      >
        {/* Form hiển thị value */}
        <Container
          sx={{
            maxWidth: { xs: "80%", md: "90%",lg:"60%",},
            bgcolor: "black",
            opacity: "0.8",
            borderRadius: "50px",
            p: 4,
            boxShadow: "0 8px 30px rgba(0,0,0,0.1)",
            mb:10,
            color: "black",
          }}
        >
          <Typography
            variant="h2"
            fontWeight="bold"
            gutterBottom
            textAlign="center"
            sx={{
              fontFamily: "'Itim', cursive", // Phông chữ Itim
              color: "#fff", // Màu chữ tối
              display: "flex", // Sắp xếp chữ và ảnh theo hàng ngang
              alignItems: "center", // Canh giữa chữ và ảnh
              justifyContent: "center", // Canh giữa cả ảnh và chữ
              fontSize: { xs: "20px", sm: "40px", md: "60px" },
            }}
          >
            <img
              src="https://dr9rfdtcol2ay.cloudfront.net/assets/BGT.png" // Đường dẫn ảnh từ thư mục public
              alt="BGT Icon"
              style={{ width: 70, height: 70, marginRight: 8 }} // Điều chỉnh kích thước ảnh và khoảng cách
            />
            BGT Market
          </Typography>

          <ToggleButtonGroup
            value={activeTab}
            exclusive
            onChange={(event, newValue) => setActiveTab(newValue)}
            fullWidth
            sx={{
              mb: 3,
              borderRadius: "12px",
              backgroundColor: "black", // Nền input
              "& .MuiToggleButton-root": {
                fontFamily: "Itim, cursive", // Đổi phông chữ
                fontWeight: "700",
                fontSize: { xs: "14px", sm: "16px", md: "20px" },
                color: "#fff",
                border: "none", // Không viền
                borderRadius: "12px", // Bo tròn
                "&.Mui-selected": {
                  backgroundColor: "#FFEA00", // Nền vàng khi chọn
                  color: "black", // Chữ đen khi chọn
                },
                "&.Mui-hover":{
                  
                  color: "#FFF",
                }
              },
            }}
          >
            <ToggleButton value="Buy">Buy BGT</ToggleButton>
            <ToggleButton value="Sell">Sell BGT</ToggleButton>
          </ToggleButtonGroup>

          <TableContainer
            component={Paper}
            sx={{
              bgcolor: "transparent",
              color: "#fff",
              fontFamily: "'Itim', cursive",
            }}
          >
            <Table sx={{ minWidth: 500 }} aria-label="order table">
              {/* TableHead */}
              <TableHead>
                {activeTab === "Buy" ? (
                  <TableRow sx={{ border: 0 }}>
                    <TableCell
                      sx={{
                        fontFamily: "'Itim', cursive",
                        color: "#FFD700",
                        fontWeight: "bold",
                        border: 0,
                        fontSize: "20px",
                      }}
                    >
                      BGT Amount
                    </TableCell>
                    <TableCell
                      sx={{
                        fontFamily: "'Itim', cursive",
                        color: "#FFD700",
                        fontWeight: "bold",
                        border: 0,
                        fontSize: "20px",
                      }}
                    >
                      Premium
                    </TableCell>
                    <TableCell
                      sx={{
                        fontFamily: "'Itim', cursive",
                        color: "#FFD700",
                        fontWeight: "bold",
                        border: 0,
                        fontSize: "20px",
                      }}
                    >
                      Estimated to pay
                    </TableCell>
                    <TableCell
                      sx={{
                        fontFamily: "'Itim', cursive",
                        color: "#FFD700",
                        fontWeight: "bold",
                        border: 0,
                        fontSize: "20px",
                      }}
                    >
                      Address
                    </TableCell>
                    <TableCell
                      sx={{
                        fontFamily: "'Itim', cursive",
                        color: "#FFD700",
                        fontWeight: "bold",
                        border: 0,
                        fontSize: "20px",
                      }}
                    >
                      Hash
                    </TableCell>
                    <TableCell
                      sx={{
                        fontFamily: "'Itim', cursive",
                        color: "#FFD700",
                        fontWeight: "bold",
                        border: 0,
                        fontSize: "20px",
                      }}
                    >
                      Time
                    </TableCell>
                    <TableCell
                      sx={{
                        fontFamily: "'Itim', cursive",
                        color: "#FFD700",
                        fontWeight: "bold",
                        border: 0,
                        fontSize: "20px",
                      }}
                    >
                      Action
                    </TableCell>
                  </TableRow>
                ) : (
                  <TableRow sx={{ border: 0 }}>
                    <TableCell
                      sx={{
                        fontFamily: "'Itim', cursive",
                        color: "#FFD700",
                        fontWeight: "bold",
                        border: 0,
                        fontSize: "20px",
                      }}
                    >
                      BGT Price
                    </TableCell>
                    <TableCell
                      sx={{
                        fontFamily: "'Itim', cursive",
                        color: "#FFD700",
                        fontWeight: "bold",
                        border: 0,
                        fontSize: "20px",
                      }}
                    >
                      BGT Amount
                    </TableCell>
                    <TableCell
                      sx={{
                        fontFamily: "'Itim', cursive",
                        color: "#FFD700",
                        fontWeight: "bold",
                        border: 0,
                        fontSize: "20px",
                      }}
                    >
                      Paid
                    </TableCell>
                    <TableCell
                      sx={{
                        fontFamily: "'Itim', cursive",
                        color: "#FFD700",
                        fontWeight: "bold",
                        border: 0,
                        fontSize: "20px",
                      }}
                    >
                      Address
                    </TableCell>
                    <TableCell
                      sx={{
                        fontFamily: "'Itim', cursive",
                        color: "#FFD700",
                        fontWeight: "bold",
                        border: 0,
                        fontSize: "20px",
                      }}
                    >
                      Hash
                    </TableCell>
                    <TableCell
                      sx={{
                        fontFamily: "'Itim', cursive",
                        color: "#FFD700",
                        fontWeight: "bold",
                        border: 0,
                        fontSize: "20px",
                      }}
                    >
                      Time
                    </TableCell>
                    <TableCell
                      sx={{
                        fontFamily: "'Itim', cursive",
                        color: "#FFD700",
                        fontWeight: "bold",
                        border: 0,
                        fontSize: "20px",
                      }}
                    >
                      Action
                    </TableCell>
                    <TableCell
                      sx={{
                        fontFamily: "'Itim', cursive",
                        color: "#FFD700",
                        fontWeight: "bold",
                        border: 0,
                        fontSize: "20px",
                      }}
                    >
                      Vault
                    </TableCell>
                  </TableRow>
                )}
              </TableHead>
              {/* TableBody */}
              <TableBody>
                {account === "" || displayedOrders === null ? (
                  <TableRow sx={{ border: 0 }}>
                    <TableCell sx={{ border: 0 }}>
                      <span
                        style={{
                          fontSize: "24px",
                          color: "#fff",
                          fontFamily: "'Itim', cursive",
                        }}
                      >
                        Please connect your wallet
                      </span>
                    </TableCell>
                  </TableRow>
                ) : (
                  displayedOrders.map((order, index) =>
                    activeTab === "Buy" ? (
                      <TableRow
                        key={order.order_id || index}
                        sx={{ border: 0 }}
                      >
                        <TableCell
                          sx={{
                            color: "#fff",
                            fontFamily: "'Itim', cursive",
                            fontSize: "20px",
                            border: 0,
                          }}
                        >
                          {+order.unclaimed_bgt < 0.01
                            ? "<0.01"
                            : +order.unclaimed_bgt == 0
                            ? "0.00"
                            : (+order.unclaimed_bgt).toFixed(3)}
                          <img
                            src="https://dr9rfdtcol2ay.cloudfront.net/assets/iconBGT.png" // Thay bằng đường dẫn đúng tới ảnh trong thư mục assets
                            alt="icon"
                            style={{
                              width: 35,
                              height: 30,
                              marginLeft: 7,
                              verticalAlign: "middle",
                            }} // Điều chỉnh kích thước ảnh và khoảng cách
                          />
                        </TableCell>
                        <TableCell
                          sx={{
                            color: "#fff",
                            fontFamily: "'Itim', cursive",
                            fontSize: "20px",
                            border: 0,
                          }}
                        >
                          {(order.markup - 10000) / 100}%
                        </TableCell>
                        <TableCell
                          sx={{
                            color: "#fff",
                            fontFamily: "'Itim', cursive",
                            fontSize: "20px",
                            border: 0,
                          }}
                        >
                          {(
                            beraPrice *
                            +order.unclaimed_bgt *
                            (1 + (order.markup - 10000) / 100 / 100)
                          ).toFixed(2)}
                          <img
                            src="https://dr9rfdtcol2ay.cloudfront.net/assets/honey.png" // Thay bằng đường dẫn đúng tới ảnh trong thư mục assets
                            alt="icon"
                            style={{
                              width: 22,
                              height: 22,
                              marginLeft: 7,
                              verticalAlign: "middle",
                            }} // Điều chỉnh kích thước ảnh và khoảng cách
                          />
                        </TableCell>
                        <TableCell
                          sx={{
                            color: "#fff",
                            fontFamily: "'Itim', cursive",
                            fontSize: "20px",
                            border: 0,
                          }}
                        >
                          {order.address.slice(0, 6)}...
                          {order.address.slice(-4)}
                        </TableCell>
                        <TableCell
                          sx={{
                            color: "#fff",
                            fontFamily: "'Itim', cursive",
                            fontSize: "20px",
                            border: 0,
                          }}
                        >
                          <a
                            href={`https://berascan.com/tx/${order.evm_tx_hash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: "#fff", textDecoration: "none" }}
                          >
                            {order.evm_tx_hash.slice(0, 6)}...
                            {order.evm_tx_hash.slice(-4)}
                          </a>
                        </TableCell>

                        {/* time buy  */}
                        <TableCell
                          sx={{
                            color: "#fff",
                            fontFamily: "'Itim', cursive",
                            fontSize: "20px",
                            border: 0,
                          }}
                        >
                          {(() => {
                            const timeDiffInSeconds =
                              Math.floor(Date.now() / 1000) - order.time; // Khoảng cách thời gian (giây)

                            // Nếu thời gian nhỏ hơn 24 giờ (86400 giây), hiển thị giờ, phút, giây
                            if (timeDiffInSeconds < 86400) {
                              const hours = Math.floor(
                                timeDiffInSeconds / 3600
                              ); // Số giờ
                              const minutes = Math.floor(
                                (timeDiffInSeconds % 3600) / 60
                              ); // Số phút
                              const seconds = timeDiffInSeconds % 60; // Số giây

                              // Tạo chuỗi hiển thị
                              let timeString = "";
                              if (hours > 0)
                                timeString += `${hours} hour${
                                  hours !== 1 ? "s" : ""
                                } `;
                              if (minutes > 0 || hours > 0)
                                timeString += `${minutes} min${
                                  minutes !== 1 ? "s" : ""
                                } `;
                              timeString += `${seconds} sec${
                                seconds !== 1 ? "s" : ""
                              } ago`;

                              return timeString;
                            }

                            // Nếu thời gian lớn hơn hoặc bằng 24 giờ, hiển thị số ngày
                            return `${(timeDiffInSeconds / 86400).toFixed(
                              0
                            )} day${
                              (timeDiffInSeconds / 86400).toFixed(0) !== "1"
                                ? "s"
                                : ""
                            } ago`;
                          })()}
                        </TableCell>
                        <TableCell sx={{ border: 0 }}>
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
                      <TableRow
                        key={order.order_id || index}
                        sx={{ border: 0 }}
                      >
                        <TableCell
                          sx={{
                            color: "#fff",
                            fontFamily: "'Itim', cursive",
                            fontSize: "20px",
                            border: 0,
                          }}
                        >
                          ${(+order.price).toFixed(2)}
                        </TableCell>
                        <TableCell
                          sx={{
                            color: "#fff",
                            fontFamily: "'Itim', cursive",
                            fontSize: "20px",
                            border: 0,
                          }}
                        >
                          {(+order.filled_bgt_amount).toFixed(2)}/
                          {(+order.bgt_amount).toFixed(2)}
                          <img
                            src="https://dr9rfdtcol2ay.cloudfront.net/assets/iconBGT.png" // Thay bằng đường dẫn đúng tới ảnh trong thư mục assets
                            alt="icon"
                            style={{
                              width: 35,
                              height: 30,
                              marginLeft: 7,
                              verticalAlign: "middle",
                            }} // Điều chỉnh kích thước ảnh và khoảng cách
                          />
                        </TableCell>
                        <TableCell
                          sx={{
                            color: "#fff",
                            fontFamily: "'Itim', cursive",
                            fontSize: "20px",
                            border: 0,
                          }}
                        >
                          {(+order.amount).toFixed(2)}
                          <img
                            src="https://dr9rfdtcol2ay.cloudfront.net/assets/honey.png" // Thay bằng đường dẫn đúng tới ảnh trong thư mục assets
                            alt="icon"
                            style={{
                              width: 22,
                              height: 22,
                              marginLeft: 7,
                              verticalAlign: "middle",
                            }} // Điều chỉnh kích thước ảnh và khoảng cách
                          />
                        </TableCell>
                        <TableCell
                          sx={{
                            color: "#fff",
                            fontFamily: "'Itim', cursive",
                            fontSize: "20px",
                            border: 0,
                          }}
                        >
                          {order.address.slice(0, 6)}...
                          {order.address.slice(-4)}
                        </TableCell>
                        <TableCell
                          sx={{
                            color: "#fff",
                            fontFamily: "'Itim', cursive",
                            fontSize: "20px",
                            border: 0,
                          }}
                        >
                          <a
                            href={`https://berascan.com/tx/${order.evm_tx_hash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: "#fff", textDecoration: "none" }}
                          >
                            {order.evm_tx_hash.slice(0, 6)}...
                            {order.evm_tx_hash.slice(-4)}
                          </a>
                        </TableCell>
                        {/* time sell min hours */}
                        <TableCell
                          sx={{
                            color: "#fff",
                            fontFamily: "'Itim', cursive",
                            fontSize: "20px",
                            border: 0,
                          }}
                        >
                          {(() => {
                            const timeDiffInSeconds =
                              Math.floor(Date.now() / 1000) - order.time; // Khoảng cách thời gian (giây)

                            // Nếu thời gian nhỏ hơn 24 giờ (86400 giây), hiển thị giờ, phút, giây
                            if (timeDiffInSeconds < 86400) {
                              const hours = Math.floor(
                                timeDiffInSeconds / 3600
                              ); // Số giờ
                              const minutes = Math.floor(
                                (timeDiffInSeconds % 3600) / 60
                              ); // Số phút
                              const seconds = timeDiffInSeconds % 60; // Số giây

                              // Tạo chuỗi hiển thị
                              let timeString = "";
                              if (hours > 0)
                                timeString += `${hours} hour${
                                  hours !== 1 ? "s" : ""
                                } `;
                              if (minutes > 0 || hours > 0)
                                timeString += `${minutes} min${
                                  minutes !== 1 ? "s" : ""
                                } `;
                              timeString += `${seconds} sec${
                                seconds !== 1 ? "s" : ""
                              } ago`;

                              return timeString;
                            }

                            // Nếu thời gian lớn hơn hoặc bằng 24 giờ, hiển thị số ngày
                            return `${(timeDiffInSeconds / 86400).toFixed(
                              0
                            )} day${
                              (timeDiffInSeconds / 86400).toFixed(0) !== "1"
                                ? "s"
                                : ""
                            } ago`;
                          })()}
                        </TableCell>
                        <TableCell sx={{ border: 0 }}>
                          <Button
                            variant="contained"
                            color={activeTab === "Buy" ? "success" : "error"}
                            onClick={
                              activeTab === "Buy"
                                ? () =>
                                    fillSellOrder(order.order_id, order.amount)
                                : () =>
                                    fillBuyOrder(order.order_id, vaultForFill)
                            }
                            sx={{ borderRadius: "12px" }}
                          >
                            {activeTab === "Buy" ? "Buy" : "Sell"}
                          </Button>
                        </TableCell>
                        <TableCell sx={{ border: 0 }}>
                          <FormControl fullWidth>
                            <InputLabel
                              id={`dropdown-labelило-${order.order_id}`}
                              sx={{
                                color: "#fff",
                                fontFamily: "'Itim', cursive'",
                              }} // Chữ trắng cho nhãn
                            >
                              💰
                            </InputLabel>

                            <Select
                              labelId={`dropdown-label-${order.order_id}`}
                              value={vaultForFill}
                              onChange={(e) => setVaultForFill(e.target.value)}
                              label="Choose Vault"
                              sx={{
                                color: "#fff", // Chữ trắng cho giá trị được chọn
                                bgcolor: "rgba(0, 0, 0, 0.1)", // Nền đen mờ (80% opacity)
                                fontFamily: "'Itim', cursive'", // Phông chữ Itim
                                "& .MuiSvgIcon-root": { color: "#fff" }, // Icon mũi tên trắng
                                "& .MuiOutlinedInput-notchedOutline": {
                                  borderColor: "#fff",
                                }, // Viền trắng
                                "&:hover .MuiOutlinedInput-notchedOutline": {
                                  borderColor: "#fff",
                                }, // Viền trắng khi hover
                                "& .MuiPaper-root": {
                                  bgcolor: "rgba(0, 0, 0, 1)",
                                }, // Đảm bảo dropdown menu full đen
                              }}
                              MenuProps={{
                                PaperProps: {
                                  sx: {
                                    bgcolor: "rgba(0, 0, 0, 1)", // Nền đen đầy đủ cho dropdown
                                    "& .MuiMenuItem-root": {
                                      color: "#fff", // Chữ trắng cho tất cả các mục trong dropdown
                                      bgcolor: "rgba(0, 0, 0, 1)", // Nền đen đầy đủ cho các mục
                                      "&:hover": { bgcolor: "#333" }, // Hiệu ứng hover xám đậm
                                    },
                                  },
                                },
                              }}
                            >
                              <MenuItem
                                value=""
                                sx={{
                                  bgcolor: "rgba(0, 0, 0, 1)",
                                  color: "#fff",
                                }}
                              >
                                <em
                                  style={{
                                    color: "#fff",
                                    fontFamily: "'Itim', cursive'",
                                  }}
                                >
                                  Choose Vault
                                </em>{" "}
                                {/* Chữ trắng cho mục mặc định */}
                              </MenuItem>
                              {vaultsWithBalance.map((vault) =>
                                vault.name !== "" &&
                                vault.icon !== "" &&
                                vault.bgtBalance > 0 ? (
                                  <MenuItem
                                    key={vault.reward_vault}
                                    value={vault.reward_vault}
                                    disabled={parseFloat(vault.bgtBalance) <= 0}
                                    sx={{
                                      bgcolor: "rgba(0, 0, 0, 1)", // Nền đen đầy đủ cho các mục
                                      color: "#fff", // Chữ trắng cho các mục
                                      fontFamily: "'Itim', cursive'", // Phông chữ Itim
                                      "&:hover": { bgcolor: "#333" }, // Hiệu ứng hover xám đậm
                                    }}
                                  >
                                    <Box
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        width: "100%",
                                      }}
                                    >
                                      <Box
                                        sx={{
                                          display: "flex",
                                          alignItems: "center",
                                        }}
                                      >
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
                                        sx={{ color: "#fff" }}
                                      >
                                        {" "}
                                        {/* Chữ trắng cho số dư */}(
                                        {vault.bgtBalance} BGT)
                                      </Typography>
                                    </Box>
                                  </MenuItem>
                                ) : null
                              )}
                            </Select>
                          </FormControl>
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
            rowsPerPageOptions={[5, 10, 25, 50, 100]}
            sx={{
              color: "#fff", // Màu chữ trắng cho tất cả các phần trong TablePagination
              fontFamily: "'Itim', cursive", // Thay đổi phông chữ toàn bộ
              "& .MuiTablePagination-caption": {
                color: "#fff", // Màu chữ cho "Rows per page"
                fontFamily: "'Itim', cursive", // Phông chữ cho phần "Rows per page"
              },
              "& .MuiTablePagination-selectLabel": {
                color: "#fff", // Màu chữ cho nhãn "Rows per page:"
                fontFamily: "'Itim', cursive", // Phông chữ cho nhãn "Rows per page:"
              },
              "& .MuiTablePagination-select": {
                color: "#fff", // Màu chữ cho dropdown chọn số hàng
                fontFamily: "'Itim', cursive", // Phông chữ cho dropdown
              },
              "& .MuiTablePagination-actions": {
                color: "#fff", // Màu chữ cho các nút điều hướng (next, previous)
                fontFamily: "'Itim', cursive", // Phông chữ cho nút điều hướng
              },
              textAlign: "center", // Căn giữa toàn bộ phần TablePagination
            }}
          />
        </Container>

        {/* Form Tạo Lệnh (Đã chỉnh sửa giao diện phần Mua BGT) */}
        <Container
          sx={{
            maxWidth: { xs: "80%", md: "90%",lg:"34%",},
            height:"100%",
            bgcolor: "black",
            opacity: "0.8",
            borderRadius: "50px",
            p: 4,
            // mb:10,
            boxShadow: "0 8px 30px rgba(0,0,0,0.1)",
            // margin: "0 auto",
            // marginTop: { xs: "0", sm: "0", md: "168px" },
            padding: { sm: "60px 20px" },
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
                  src="https://dr9rfdtcol2ay.cloudfront.net/assets/iconbera.png"
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
                          src="https://dr9rfdtcol2ay.cloudfront.net/assets/iconbera.png"
                          alt="BERA Price"
                          style={{ width: 23, height: 23, marginRight: 8 }}
                        />
                        BERA Price:{" "}
                        {beraPrice
                          ? `$${parseFloat(beraPrice).toFixed(2)}`
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
                      variant={selectedPercentage === percentage ? "contained" : "outlined"} // Thay đổi variant dựa trên trạng thái
                      onClick={() => {
                        setSelectedPercentage(percentage); // Cập nhật state khi nhấp
                        setAmountByPercentage(percentage); // Gọi hàm tính toán số lượng
                      }}
                      sx={{
                        borderRadius: "12px",
                        minWidth: "60px",
                        fontSize: "1rem",
                        fontFamily: "'Itim', cursive",
                        color: selectedPercentage === percentage ? "#000" : "#fff", // Màu chữ đen khi chọn, trắng khi không chọn
                        backgroundColor: selectedPercentage === percentage ? "#ffca28" : "transparent", // Màu nền vàng khi chọn
                        borderColor: "#fff", // Viền trắng mặc định
                        "&:hover": {
                          backgroundColor: "#ffca28", // Màu nền khi hover
                          color: "#000", // Màu chữ khi hover
                          borderColor: "#ffca28", // Viền khi hover
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
                        src="https://dr9rfdtcol2ay.cloudfront.net/assets/honey.png"
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
                  <Box
                    sx={{
                      mb: 2,
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography variant="body2">
                    HONEY in walletwallet  (≥10.00)
                    </Typography>
                    {/* <Typography variant="body2">0 🐻</Typography> */}
                  </Box>
                  <Box
                    sx={{
                      mb: 2,
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    {/* <Typography variant="body2">Ước tính nhận được</Typography>
                    <Typography variant="body2">0 🐻</Typography> */}
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
                        <em>Choose Vault</em>
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
                              <Box
                                sx={{ display: "flex", alignItems: "center" }}
                              >
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
                        src="https://dr9rfdtcol2ay.cloudfront.net/assets/iconbera.png"
                        alt="BERA Price"
                        style={{ width: 23, height: 23, marginRight: 8 }}
                      />
                      BERA Price:{" "}
                      {beraPrice
                        ? `$${parseFloat(beraPrice).toFixed(2)}`
                        : "N/A"}
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
                            premiumRate === rate.toString()
                              ? "black"
                              : "inherit", // Màu chữ khi được chọn
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
                    <Typography variant="body2">
                    BGT in vault  (≥0.01)
                    </Typography>
                    {/* <Typography variant="body2">0 🐻</Typography> */}
                  </Box>
                  <Box
                    sx={{
                      mb: 2,
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    {/* <Typography variant="body2">Ước tính nhận được</Typography>
                    <Typography variant="body2">0 🐻</Typography> */}
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
              <>
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
                            <TableCell style={{ color: "green" }}>
                              Buy
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="contained"
                                color={order.state === 1 ? "success" : "gray"}
                                disabled={order.state === 1 ? false : true}
                                onClick={() =>
                                  closeOrder(order.order_id, "Buy")
                                }
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
                <TablePagination
                  style={{ backgroundColor: "white" }}
                  component="div"
                  count={totalPersonalBuy}
                  page={pagePersonalBuy}
                  onPageChange={handleChangePagePersonalBuy}
                  rowsPerPage={rowsPerPagePersonalBuy}
                  onRowsPerPageChange={handleChangeRowsPerPagePersonalBuy}
                  rowsPerPageOptions={[5, 10, 25, 50, 100]}
                />
              </>
            ) : (
              <>
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
                            <TableCell>
                              {(order.markup - 10000) / 100}%
                            </TableCell>
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
                                onClick={() =>
                                  closeOrder(order.order_id, "Sell")
                                }
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
                <TablePagination
                  style={{ backgroundColor: "white" }}
                  component="div"
                  count={totalPersonalSell}
                  page={pagePersonalSell}
                  onPageChange={handleChangePagePersonalSell}
                  rowsPerPage={rowsPerPagePersonalSell}
                  onRowsPerPageChange={handleChangeRowsPerPagePersonalSell}
                  rowsPerPageOptions={[5, 10, 25, 50, 100]}
                />
              </>
            )}
          </Box>
          {status && (
            <Typography
              variant="body2"
              color="text.secondary"
              textAlign="center"
            >
              {status}
            </Typography>
          )}
        </Container>
      </Box>
      
    </Box>
  );



}