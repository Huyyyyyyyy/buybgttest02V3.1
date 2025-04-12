import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useNavigate } from 'react-router-dom'; // Thêm import này
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

import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";

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
  const navigate = useNavigate(); // Khai báo navigate

  //status of open buy/sell order
  const [buyStatus, setBuyStatus] = useState("Success");
  const [sellStatus, setSellStatus] = useState("Success");





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
    if (account !== "" && orderType == "Buy Orders") {
      fetchAccountBuyOrders(pagePersonalBuy, rowsPerPagePersonalBuy);
    }
  }, [pagePersonalBuy, rowsPerPagePersonalBuy, account, orderType]);
  const displayBuyOrdersAccount = buyOrdersAccount;

  const handleChangePagePersonalBuy = (event, newPage) => {
    setPagePersonalBuy(newPage);
  };

  const handleChangeRowsPerPagePersonalBuy = (event) => {
    setRowsPerPagePersonalBuy(parseInt(event.target.value, 10));
    setPagePersonalBuy(0);
  };

  useEffect(() => {
    if (account !== "" && orderType == "Sell Orders") {
      fetchAccountSellOrders(pagePersonalSell, rowsPerPagePersonalSell);
    }
  }, [pagePersonalSell, rowsPerPagePersonalSell, account, orderType]);
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
        setBuyStatus("Processing");
        if (!amount || !price || isNaN(amount) || isNaN(price)) {
          setStatus("Vui lòng nhập đúng số lượng và giá.");
          setBuyStatus("Success");
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
        await fetchAccountBuyOrders(pagePersonalBuy, rowsPerPagePersonalBuy);
        setBuyStatus("Success")
      } else {
        setSellStatus("Processing");
        if (!premiumRate || !selectedVault || isNaN(premiumRate)) {
          setStatus("Vui lòng nhập premium rate và chọn vault.");
          setSellStatus("Success");
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
        await fetchAccountSellOrders(pagePersonalBuy, rowsPerPagePersonalBuy);
        setSellStatus("Success");
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
      setBuyStatus("Success");
      setSellStatus("Success");
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
        await tx.wait();
        await fetchAccountBuyOrders(pagePersonalBuy, rowsPerPagePersonalBuy);
      } else if (orderType === "Sell") {
        tx = await contract.closeSellBgtOrder(id);
        await tx.wait();
        await fetchAccountSellOrders(pagePersonalBuy, rowsPerPagePersonalBuy);
      }

      setStatus("Đang hủy lệnh...");
      await tx.wait();
      setStatus(`Đã hủy lệnh ${orderType === "Buy" ? "mua" : "bán"}!`);
    } catch (err) {
      console.error("Close order error:", err);
      setStatus(`Lỗi khi hủy lệnh ${orderType === "Buy" ? "mua" : "bán"}`);
    }
  };


  // Drawer
  const [state, setState] = React.useState({
    left: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  // Hàm để điều hướng khi click vào các mục và mở trang trong tab mới
  const handleClick = (url) => {
    window.open(url, "_blank"); // Mở trang trong tab mới
  };

  // // Menu ở Drawer
  // const list = (anchor) => (
  //   <Box
  //     sx={{
  //       width: anchor === "left" ? 250 : "auto",
  //       backgroundColor: "#ffc000", // Màu vàng cho Box
  //       height: "100%", // Đảm bảo Box chiếm toàn bộ chiều cao
  //       display: "flex", // Sử dụng flex để List chiếm toàn bộ không gian
  //       flexDirection: "column", // Các phần tử xếp dọc
  //     }}
  //     role="presentation"
  //     onClick={toggleDrawer(anchor, false)}
  //     onKeyDown={toggleDrawer(anchor, false)}
  //   >
  //     <List
  //       sx={{
  //         width: "100%", // List chiếm toàn bộ chiều rộng của Box
  //         backgroundColor: "#ffc000", // Đảm bảo List cũng có màu vàng
  //         padding: 0, // Loại bỏ padding mặc định của List để không có khoảng trống
  //       }}
  //     >
  //       {["Market", "About TTT", "Boost for TTT"].map((text, index) => (
  //         <ListItem
  //           key={text}
  //           disablePadding // Loại bỏ padding mặc định của ListItem
  //           sx={{
  //             backgroundColor: "#ffc000", // Đảm bảo mỗi ListItem cũng có màu vàng
  //           }}
  //         >
  //           <ListItemButton
  //             onClick={() =>
  //               handleClick(
  //                 text === "Market"
  //                   ? "https://bgt.zone"
  //                   : text === "About TTT"
  //                     ? "https://tienthuattoan.com/"
  //                     : "https://hub.berachain.com/validators/0x89884fc95abcb82736d768fc8ad4fdf4cb2112496974ae05440d835d0e93216643ae212b365fb6d9d2501d76d0925ef3/"
  //               )
  //             }
  //             sx={{
  //               "&:hover": {
  //                 backgroundColor: "#FFD700", // Màu vàng đậm hơn khi hover
  //               },
  //             }}
  //           >
  //             <ListItemText
  //               primary={text}
  //               primaryTypographyProps={{
  //                 fontFamily: "Itim, cursive",
  //                 fontWeight: "bold",
  //                 color: "#000", // Chữ đen để nổi trên nền vàng
  //               }}
  //             />
  //           </ListItemButton>
  //         </ListItem>
  //       ))}
  //     </List>
  //   </Box>
  // );

  return (
    <Box
      // background ở đây
      sx={{
        minHeight: "100vh",
        maxWidth: { xs: "100%" },

        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 4,
        flexDirection: { xs: "row", md: "row", lg: "column" },
        pt: { xs: 10, sm: 10, md: 20 }, // Thêm padding-top để đẩy body xuống dưới header
      }}
    >

      {/* header */}

      <Box
  sx={{
    maxWidth: "100%",
    position: "fixed",
    backdropFilter: "blur(10px)",
    backgroundColor: "rgba(104, 77, 2, 0.2)",
    zIndex: 99,
    top: 0,
    left: 0,
    right: 0,
  }}
>
  <Box
    sx={{
      display: "flex",
      justifyContent: {
        xs: "space-between",
        sm: "space-between",
        md: "space-between",
      },
      alignItems: "center",
      marginLeft: "auto",
      marginRight: "auto",
      padding: "4px 0",
    }}
  >
    {/* Mobile Menu Icon */}
    <Box
      sx={{
        display: { md: "none", lg: "none" },
        width: { xs: "30%", sm: "30%", lg: "20%" },
        alignItems: "center",
      }}
    >
      {["left"].map((anchor) => (
        <React.Fragment key={anchor}>
          <Button onClick={toggleDrawer(anchor, true)}>
            <MenuIcon
              sx={{
                fontSize: "30px",
                color: "black",
                background: "#FFEA00",
                borderRadius: "10px",
                padding: "6px",
              }}
            />
          </Button>
          <Drawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
          >
            <Box
              sx={{
                width: 250,
                backgroundColor: "#ffc000",
                height: "100%",
              }}
              role="presentation"
              onClick={toggleDrawer(anchor, false)}
              onKeyDown={toggleDrawer(anchor, false)}
            >
              <List>
                {["Market", "Boost (beta)"].map((text) => (
                  // , "About TTT"
                  <ListItem key={text} disablePadding>
                    <ListItemButton
                      sx={{
                        backgroundColor: "#ffc000",
                        "&:hover": { backgroundColor: "#ffd700" },
                      }}
                      onClick={() =>
                        text === "Market"
                          ? handleClick("https://bgt.zone")
                          // : text === "About TTT"
                          // ? handleClick("https://tienthuattoan.com/")
                          : navigate("/boost") // Giữ nguyên chức năng navigate
                      }
                    >
                      <ListItemText
                        primary={text}
                        primaryTypographyProps={{
                          fontFamily: "Itim, cursive",
                          fontSize: "20px",
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Box>
          </Drawer>
        </React.Fragment>
      ))}
    </Box>

    {/* Logo */}
    <Box
      sx={{
        width: { xs: "30%", sm: "30%", md: "15%", lg: "25%" },
        display: "flex",
        justifyContent: "center",
      }}
    >
      <img
        src="https://dr9rfdtcol2ay.cloudfront.net/assets/logomain.png"
        alt="logo"
        style={{
          width: "90px",
          height: "50px",
          userSelect: "none",
          alignItems: "center",
        }}
      />
    </Box>

    {/* Desktop Menu */}
    <Box
      sx={{
        display: { xs: "none", md: "flex", lg: "flex" },
        alignItems: "center",
        justifyContent: "space-between",
        width: { md: "60%", lg: "50%" },
        padding: "0 15px",
      }}
    >
      <Button
        variant="text"
        sx={{
          color: "#fff",
          fontSize: "20px",
          width: "30%",
          textShadow: `
            -1px -1px 0 black,
            1px -1px 0 black,
            -1px 1px 0 black,
            1px 1px 0 black
          `,
          fontFamily: "Itim, cursive",
          fontWeight: "400",
          textTransform: "none",
          display: "flex",
          "&:hover": {
            background: "none",
          },
          borderBottom: "5px solid yellow",
        }}
      >
        <span className="label">Market</span>
      </Button>

      {/* <Button
        variant="text"
        onClick={() => window.open("https://tienthuattoan.com/")}
        sx={{
          color: "#fff",
          fontSize: "20px",
          width: "30%",
          textShadow: `
            -1px -1px 0 black,
            1px -1px 0 black,
            -1px 1px 0 black,
            1px 1px 0 black
          `,
          fontFamily: "Itim, cursive",
          fontWeight: "400",
          textTransform: "none",
          padding: 0,
          minWidth: "unset",
          "&:hover": {
            background: "none",
            color: "yellow",
          },
        }}
      >
        <span className="label-1">About TTT</span>
      </Button> */}

      <Button
        variant="text"
        onClick={() => navigate("/boost")} // Giữ nguyên chức năng navigate
        sx={{
          color: "#fff",
          fontSize: "20px",
          width: "30%",
          textShadow: `
            -1px -1px 0 black,
            1px -1px 0 black,
            -1px 1px 0 black,
            1px 1px 0 black
          `,
          fontFamily: "Itim, cursive",
          fontWeight: "400",
          textTransform: "none",
          padding: 0,
          minWidth: "unset",
          "&:hover": {
            background: "none",
            color: "yellow",
          },
        }}
      >
        <span className="label-1">Boost (beta)</span>
      </Button>
    </Box>

    {/* Connect Wallet Button */}
    <Button
      variant="outlined"
      onClick={connectWallet}
      sx={{
        width: { xs: "30%", sm: "30%", md: "25%", lg: "25%" },
        backgroundColor: "#FFEA00",
        border: "1.5px solid black",
        color: "#000000",
        fontWeight: "bold",
        fontSize: { xs: "9px", sm: "11px", md: "13px" },
        zIndex: 10,
        fontFamily: "Itim, cursive",
        "&:hover": {
          backgroundColor: "#ffc000",
          color: "#000",
          border: "1px solid black",
        },
      }}
    >
      <Box
        component="img"
        src="https://dr9rfdtcol2ay.cloudfront.net/assets/iconwallet.png"
        alt="wallet icon"
        sx={{
          maxWidth: "15%",
          mr: "5px",
        }}
      />
      <Box>
        {account
          ? ` ${account.slice(0, 6)}...${account.slice(38, 42)}`
          : "Connect Wallet"}
      </Box>
    </Button>
  </Box>
</Box>

      {/* Box value  */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" }, // Xếp dọc trên xs
          justifyContent: "space-evenly",
          width: "100%",
          px: { xs: 0, sm: 2 }, // Loại bỏ padding ngang trên xs để sát viền

        }}
      >
        {/* Form hiển thị value */}
        <Container
          sx={{
            maxWidth: { xs: "95%", md: "50%", lg: "60%" },
            bgcolor: "black",
            opacity: "0.8",

            borderRadius: { xs: "15px", sm: "15px" },
            p: 4,
            boxShadow: "0 8px 30px rgba(0,0,0,0.1)",
            mb: 10,
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
              fontSize: { xs: "15px", sm: "40px", md: "60px" },
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
            onChange={(event, newValue) => {
              if (newValue != null) {
                console.log(activeTab);
                setActiveTab(newValue);
              }
            }}
            fullWidth
            sx={{
              mb: 2,
              fontFamily: "Itim, cursive",
              borderRadius: "999px",
              padding: "4px",
              "& .MuiToggleButton-root": {
                flex: 1,
                fontWeight: "bold",
                fontSize: { xs: "0.8rem", sm: "1rem" }, // Giảm fontSize trên xs
                color: "#fff",
                border: "none",
                borderRadius: "15px",
                textTransform: "none",
                fontFamily: "Itim, cursive",
                transition: "all 0.05s",
                "&.Mui-selected": {
                  backgroundColor: "#FFEA00",
                  color: "black",
                  borderRadius: "15px",
                },
                "&:hover": {
                  backgroundColor: "inherit",
                },
                "&.Mui-selected:hover": {
                  backgroundColor: "#FFEA00",
                },
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
                        fontSize: { xs: "12px", sm: "16px", md: "20px" }, // Giảm fontSize trên xs
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
                        fontSize: { xs: "12px", sm: "16px", md: "20px" }, // Giảm fontSize trên xs
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
                        fontSize: { xs: "12px", sm: "16px", md: "20px" }, // Giảm fontSize trên xs
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
                        fontSize: { xs: "12px", sm: "16px", md: "20px" }, // Giảm fontSize trên xs
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
                        fontSize: { xs: "12px", sm: "16px", md: "20px" }, // Giảm fontSize trên xs
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
                        fontSize: { xs: "12px", sm: "16px", md: "20px" }, // Giảm fontSize trên xs
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
                        fontSize: { xs: "12px", sm: "16px", md: "20px" }, // Giảm fontSize trên xs
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
                        fontSize: { xs: "12px", sm: "16px", md: "20px" }, // Giảm fontSize trên xs
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
                        fontSize: { xs: "12px", sm: "16px", md: "20px" }, // Giảm fontSize trên xs
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
                        fontSize: { xs: "12px", sm: "16px", md: "20px" }, // Giảm fontSize trên xs
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
                        fontSize: { xs: "12px", sm: "16px", md: "20px" }, // Giảm fontSize trên xs
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
                        fontSize: { xs: "12px", sm: "16px", md: "20px" }, // Giảm fontSize trên xs
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
                        fontSize: { xs: "12px", sm: "16px", md: "20px" }, // Giảm fontSize trên xs
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
                        fontSize: { xs: "12px", sm: "16px", md: "20px" }, // Giảm fontSize trên xs
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
                        fontSize: { xs: "12px", sm: "16px", md: "20px" }, // Giảm fontSize trên xs
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
                          fontSize: { xs: "16px", sm: "20px", md: "24px" }, // Giảm fontSize trên xs
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
                            fontSize: { xs: "12px", sm: "16px", md: "20px" }, // Giảm fontSize trên xs
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
                            fontSize: { xs: "12px", sm: "16px", md: "20px" }, // Giảm fontSize trên xs
                            border: 0,
                          }}
                        >
                          {(order.markup - 10000) / 100}%
                        </TableCell>
                        <TableCell
                          sx={{
                            color: "#fff",
                            fontFamily: "'Itim', cursive",
                            fontSize: { xs: "12px", sm: "16px", md: "20px" }, // Giảm fontSize trên xs
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
                            fontSize: { xs: "12px", sm: "16px", md: "20px" }, // Giảm fontSize trên xs
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
                            fontSize: { xs: "12px", sm: "16px", md: "20px" }, // Giảm fontSize trên xs
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
                            fontSize: { xs: "12px", sm: "16px", md: "20px" }, // Giảm fontSize trên xs
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
                                timeString += `${hours} hour${hours !== 1 ? "s" : ""
                                  } `;
                              if (minutes > 0 || hours > 0)
                                timeString += `${minutes} min${minutes !== 1 ? "s" : ""
                                  } `;
                              timeString += `${seconds} sec${seconds !== 1 ? "s" : ""
                                } ago`;

                              return timeString;
                            }

                            // Nếu thời gian lớn hơn hoặc bằng 24 giờ, hiển thị số ngày
                            return `${(timeDiffInSeconds / 86400).toFixed(
                              0
                            )} day${(timeDiffInSeconds / 86400).toFixed(0) !== "1"
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
                            sx={{
                              borderRadius: "12px",
                              fontSize: { xs: "0.8rem", sm: "1rem" }, // Giảm fontSize trên xs
                              py: { xs: 0.5, sm: 1 }, // Giảm padding y trên xs
                            }}
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
                            fontSize: { xs: "12px", sm: "16px", md: "20px" }, // Giảm fontSize trên xs
                            border: 0,
                          }}
                        >
                          ${(+order.price).toFixed(2)}
                        </TableCell>
                        <TableCell
                          sx={{
                            color: "#fff",
                            fontFamily: "'Itim', cursive",
                            fontSize: { xs: "12px", sm: "16px", md: "20px" }, // Giảm fontSize trên xs
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
                            fontSize: { xs: "12px", sm: "16px", md: "20px" }, // Giảm fontSize trên xs
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
                            fontSize: { xs: "12px", sm: "16px", md: "20px" }, // Giảm fontSize trên xs
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
                            fontSize: { xs: "12px", sm: "16px", md: "20px" }, // Giảm fontSize trên xs
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
                            fontSize: { xs: "12px", sm: "16px", md: "20px" }, // Giảm fontSize trên xs
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
                                timeString += `${hours} hour${hours !== 1 ? "s" : ""
                                  } `;
                              if (minutes > 0 || hours > 0)
                                timeString += `${minutes} min${minutes !== 1 ? "s" : ""
                                  } `;
                              timeString += `${seconds} sec${seconds !== 1 ? "s" : ""
                                } ago`;

                              return timeString;
                            }

                            // Nếu thời gian lớn hơn hoặc bằng 24 giờ, hiển thị số ngày
                            return `${(timeDiffInSeconds / 86400).toFixed(
                              0
                            )} day${(timeDiffInSeconds / 86400).toFixed(0) !== "1"
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
                                ? () => fillSellOrder(order.order_id, order.amount)
                                : () => fillBuyOrder(order.order_id, vaultForFill)
                            }
                            sx={{
                              borderRadius: "12px",
                              fontSize: { xs: "0.8rem", sm: "1rem" }, // Giảm fontSize trên xs
                              py: { xs: 0.5, sm: 1 }, // Giảm padding y trên xs
                            }}
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
            rowsPerPageOptions={[5, 10, 25, 50, 100, 200]}
            sx={{
              color: "#fff",
              fontFamily: "'Itim', cursive",
              fontSize: { xs: "0.8rem", sm: "1rem" }, // Giảm fontSize trên xs
              "& .MuiTablePagination-caption": {
                color: "#fff",
                fontFamily: "'Itim', cursive",
                fontSize: { xs: "0.8rem", sm: "1rem" }, // Giảm fontSize trên xs
              },
              "& .MuiTablePagination-selectLabel": {
                color: "#fff",
                fontFamily: "'Itim', cursive",
                fontSize: { xs: "0.8rem", sm: "1rem" }, // Giảm fontSize trên xs
              },
              "& .MuiTablePagination-select": {
                color: "#fff",
                fontFamily: "'Itim', cursive",
                fontSize: { xs: "0.8rem", sm: "1rem" }, // Giảm fontSize trên xs
              },
              "& .MuiTablePagination-actions": {
                color: "#fff",
                fontFamily: "'Itim', cursive",
              },
              textAlign: "center",
            }}
          />
        </Container>

        {/* Form Tạo Lệnh (Đã chỉnh sửa giao diện phần Mua BGT) */}
        <Container
          sx={{
            maxWidth: { xs: "95%", sm: "90%", md: "90%", lg: "36%" }, // Full viền trên xs
            height: "100%",
            bgcolor: "black",
            opacity: "0.8",
            borderRadius: { xs: "15px", sm: "15px" }, // Giảm borderRadius trên xs cho gọn
            p: { xs: 2, sm: 4 }, // Giảm padding trên xs để sát viền
            m: { xs: 1, sm: "0 auto" }, // Loại bỏ margin trên xs để sát viền
            boxShadow: "0 8px 30px rgba(0,0,0,0.1)",
            color: "#fff",
          }}
        >
          <Typography
            variant="h4"
            fontWeight="bold"
            gutterBottom
            textAlign="center"
            sx={{
              fontFamily: "'Itim', cursive",
              fontSize: { xs: "18px", sm: "28px", md: "36px" }, // Giảm fontSize trên xs
            }}
          >
            Create Order
          </Typography>

          {account && (
            <Box sx={{ mb: { xs: 1, sm: 3 } }}>
              {/* số dư bera trong ví */}
              <Typography
                variant="subtitle1"
                sx={{
                  fontFamily: "'Itim', cursive",
                  display: "flex",
                  alignItems: "center",
                  fontSize: { xs: "0.8rem", sm: "1rem" }, // Giảm fontSize trên xs
                }}
              >
                <Box
                  component="img"
                  src="https://dr9rfdtcol2ay.cloudfront.net/assets/iconbera.png"
                  alt="BERA"
                  sx={{
                    width: { xs: 18, sm: 23 }, // Giảm kích thước ảnh trên xs
                    height: { xs: 18, sm: 23 },
                    mr: 1, // marginRight trong sx
                  }}
                />
                BERA: {parseFloat(beraBalance).toFixed(2)}
              </Typography>
            </Box>
          )}

          <Box sx={{ mb: { xs: 1, sm: 3 } }}> {/* Giảm margin-bottom trên xs */}
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
                  fontSize: { xs: "0.7rem", sm: "1rem" }, // Giảm fontSize trên xs
                  color: "#fff",
                  border: "none",
                  borderRadius: "15px",
                  textTransform: "none",
                  fontFamily: "Itim, cursive",
                  transition: "all 0.05s",
                  "&.Mui-selected": {
                    backgroundColor: "#FFEA00",
                    color: "black",
                    borderRadius: "15px",
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
                        fontSize: { xs: "0.9rem", sm: "1.1rem" }, // Giảm fontSize trên xs
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
                      mb: { xs: 1, sm: 2 }, // Giảm margin-bottom trên xs
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
                          fontSize: { xs: "0.9rem", sm: "1.1rem" }, // Giảm fontSize trên xs
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
                          borderRadius: { xs: "8px", sm: "12px" }, // Giảm borderRadius trên xs
                          backgroundColor: "#f5f5f5",
                          fontFamily: "Itim, cursive",
                          "& input": {
                            fontFamily: "Itim, cursive",
                            fontWeight: "bold",
                            fontSize: { xs: "0.8rem", sm: "1rem" }, // Giảm fontSize trên xs
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
                          fontSize: { xs: "0.7rem", sm: "0.9rem" }, // Giảm fontSize trên xs
                        }}
                      >
                        <Box
                          component="img"
                          src="https://dr9rfdtcol2ay.cloudfront.net/assets/iconbera.png"
                          alt="BERA Price"
                          sx={{
                            width: { xs: 18, sm: 23 }, // Kích thước mong muốn trên xs và sm
                            height: { xs: 18, sm: 23 },
                            maxWidth: { xs: 18, sm: 23 }, // Giới hạn kích thước tối đa
                            maxHeight: { xs: 18, sm: 23 },
                            objectFit: "contain", // Đảm bảo ảnh không bị méo
                            mr: 1, // marginRight trong sx (tương đương 8px)
                          }}
                        />
                        BERA Price: {beraPrice ? `$${parseFloat(beraPrice).toFixed(2)}` : "N/A"}
                      </Typography>
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      mb: { xs: 1, sm: 2 }, // Giảm margin-bottom trên xs
                      display: "flex",
                      gap: { xs: 0.5, sm: 1 }, // Giảm khoảng cách giữa các nút trên xs
                      justifyContent: "center",
                    }}
                  >
                    {percentagePresets.map((percentage) => (
                      <Button
                        key={percentage}
                        variant={selectedPercentage === percentage ? "contained" : "outlined"}
                        onClick={() => {
                          setSelectedPercentage(percentage);
                          setAmountByPercentage(percentage);
                        }}
                        sx={{
                          borderRadius: { xs: "8px", sm: "12px" }, // Giảm borderRadius trên xs
                          minWidth: { xs: "40px", sm: "60px" }, // Giảm minWidth trên xs
                          fontSize: { xs: "0.7rem", sm: "1rem" }, // Giảm fontSize trên xs
                          fontFamily: "'Itim', cursive",
                          color: selectedPercentage === percentage ? "#000" : "#fff",
                          backgroundColor: selectedPercentage === percentage ? "#ffca28" : "transparent",
                          borderColor: "#fff",
                          "&:hover": {
                            backgroundColor: "#ffca28",
                            color: "#000",
                            borderColor: "#ffca28",
                          },
                        }}
                      >
                        {percentage}%
                      </Button>
                    ))}
                  </Box>

                  <Box sx={{ mb: { xs: 1, sm: 2 } }}> {/* Giảm margin-bottom trên xs */}
                    <Typography
                      variant="body1"
                      sx={{
                        mb: 1,
                        fontFamily: "Itim, cursive",
                        fontWeight: "700",
                        color: "#fff",
                        fontSize: { xs: "0.6rem", sm: "1.1rem" }, // Giảm fontSize trên xs
                      }}
                    >
                      Buying Amount ($HONEY)
                    </Typography>
                    <TextField
                      variant="outlined"
                      fullWidth
                      sx={{
                        borderRadius: { xs: "8px", sm: "12px" }, // Giảm borderRadius trên xs
                        backgroundColor: "#f5f5f5",
                        "& .MuiInputBase-input": {
                          fontFamily: "Itim, cursive",
                          fontWeight: "700",
                          color: "#333",
                          fontSize: { xs: "0.8rem", sm: "1rem" }, // Giảm fontSize trên xs
                        },
                        "& .MuiOutlinedInput-notchedOutline": {
                          border: "none",
                        },
                        "& .MuiFormHelperText-root": {
                          fontFamily: "Itim, cursive",
                          fontWeight: "700",
                          color: "red",
                          fontSize: { xs: "0.7rem", sm: "0.9rem" }, // Giảm fontSize trên xs
                        },
                      }}
                      value={amount}
                      onChange={(e) => {
                        const value = e.target.value;
                        setAmount(value);
                      }}
                      error={amount !== "" && Number(amount) < 10}
                      helperText={
                        amount !== "" && Number(amount) < 10
                          ? "Please enter quantity over 10"
                          : ""
                      }
                      type="number"
                      inputProps={{ min: 10 }}
                    />
                  </Box>
                  <Box
                    sx={{
                      mb: { xs: 1, sm: 2 }, // Giảm margin-bottom trên xs
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        fontFamily: "'Itim', cursive",
                        marginRight: 1,
                        fontSize: { xs: "0.7rem", sm: "0.9rem" }, // Giảm fontSize trên xs
                      }}
                    >
                      Balance:
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Box
                        component="img"
                        src="https://dr9rfdtcol2ay.cloudfront.net/assets/honey.png"
                        alt="Honey"
                        sx={{
                          width: { xs: 16, sm: 20 }, // Giảm kích thước ảnh trên xs
                          height: { xs: 16, sm: 20 },
                          maxWidth: { xs: 16, sm: 20 }, // Giới hạn kích thước tối đa
                          maxHeight: { xs: 16, sm: 20 },
                          objectFit: "contain", // Đảm bảo ảnh không bị méo
                          mr: 0.5, // marginRight trong sx (tương đương 4px)
                        }}
                      />
                      <Typography
                        variant="body2"
                        sx={{
                          fontFamily: "'Itim', cursive",
                          fontSize: { xs: "0.7rem", sm: "0.9rem" }, // Giảm fontSize trên xs
                        }}
                      >
                        {parseFloat(honeyBalance).toFixed(2)}
                      </Typography>
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      mb: { xs: 1, sm: 2 }, // Giảm margin-bottom trên xs
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        fontFamily: "Itim, cursive",
                        fontWeight: "700",
                        fontSize: { xs: "0.8rem", sm: "1.05rem" }, // Giảm fontSize trên xs
                      }}
                    >
                      Honey to pay (≥ 10.00)
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={createOrder}
                    fullWidth
                    disabled={buyStatus === "Success" ? false : true}
                    sx={{
                      py: { xs: 1, sm: 1.5 }, // Giảm padding y trên xs
                      fontWeight: "bold",
                      borderRadius: { xs: "10px", sm: "20px" }, // Giảm borderRadius trên xs
                      boxShadow: "0 4px 12px rgba(0, 128, 0, 0.3)",
                      fontFamily: "'Itim', cursive",
                      fontSize: { xs: "0.9rem", sm: "1.2rem" }, // Giảm fontSize trên xs
                      backgroundColor: "#14ED00",
                      "&:hover": {
                        backgroundColor: "#12C900",
                      },
                      "&.Mui-disabled": {
                        backgroundColor: "#14ED00",
                        opacity: 1,
                        color: "#fff",
                      },
                    }}
                  >
                    {buyStatus === "Success" ? "Buy" : "Processing..."}
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
                        fontSize: { xs: "0.9rem", sm: "1.1rem" }, // Giảm fontSize trên xs
                      }}
                    >
                      Please connect your wallet
                    </Typography>
                  </Box>
                </>
              ) : (
                <>
                  <FormControl fullWidth sx={{ mb: { xs: 1, sm: 2 } }}> {/* Giảm margin-bottom trên xs */}
                    Reward Vault
                    <InputLabel
                      id="vault-label"
                      sx={{ fontSize: { xs: "0.8rem", sm: "1rem" } }} // Giảm fontSize trên xs
                    >

                    </InputLabel>
                    <Select
                      labelId="vault-label"
                      value={selectedVault}
                      label="Reward Vault"
                      onChange={(e) => setSelectedVault(e.target.value)}
                      sx={{
                        borderRadius: { xs: "8px", sm: "12px" }, // Giảm borderRadius trên xs
                        backgroundColor: "#f5f5f5",
                        fontSize: { xs: "0.8rem", sm: "1rem" }, // Giảm fontSize trên xs
                      }}
                    >
                      <MenuItem value="">
                        <em style={{ fontSize: { xs: "0.8rem", sm: "1rem" } }}>Choose Vault</em>
                      </MenuItem>
                      {vaultsWithBalance.map((vault) =>
                        vault.name !== "" && vault.icon !== "" ? (
                          <MenuItem
                            key={vault.reward_vault}
                            value={vault.reward_vault}
                            disabled={parseFloat(vault.bgtBalance) <= 0}
                            sx={{
                              fontSize: { xs: "0.8rem", sm: "1rem" }, // Giảm fontSize cho nội dung chính của MenuItem
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
                              <Box sx={{ display: "flex", alignItems: "center" }}>
                                <Box
                                  component="img"
                                  src={vault.icon}
                                  alt={vault.name}
                                  sx={{
                                    width: { xs: 16, sm: 20 }, // Giảm kích thước ảnh trên xs
                                    height: { xs: 16, sm: 20 },
                                    maxWidth: { xs: 16, sm: 20 }, // Giới hạn kích thước tối đa
                                    maxHeight: { xs: 16, sm: 20 },
                                    objectFit: "contain", // Đảm bảo ảnh không bị méo
                                    mr: 1, // marginRight trong sx (tương đương 8px)
                                  }}
                                />
                                {vault.name}
                              </Box>
                              <Typography
                                variant="body2"
                                sx={{
                                  color: "text.secondary",
                                  fontSize: { xs: "0.7rem", sm: "0.9rem" }, // Giảm fontSize trên xs
                                }}
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
                      mb: { xs: 1, sm: 2 }, // Giảm margin-bottom trên xs
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >




                    <Box sx={{ width: "50%" }}>
                      <Typography
                        variant="body1"
                        sx={{
                          fontFamily: "'Itim', cursive", // Phông chữ Itim
                          fontSize: { xs: "0.9rem", sm: "1.1rem" }, // Kích thước chữ responsive
                          mb: 1, // Margin-bottom để tạo khoảng cách với TextField
                          fontWeight: "bold", // Tùy chọn: làm chữ đậm nếu muốn giống label
                        }}
                      >
                        BGT Premium Rate (%)
                      </Typography>
                      <TextField
                        variant="outlined"
                        sx={{
                          width: "100%", // Đặt width 100% để TextField chiếm hết chiều ngang của Box
                          borderRadius: { xs: "8px", sm: "12px" }, // Giảm borderRadius trên xs
                          backgroundColor: "#f5f5f5",
                          "& .MuiInputBase-input": {
                            fontSize: { xs: "0.8rem", sm: "1rem" }, // Giảm fontSize trên xs
                            fontFamily: "'Itim', cursive'", // Phông chữ Itim cho nội dung nhập
                          },
                        }}
                        value={premiumRate}
                        onChange={(e) => setPremiumRate(e.target.value)}
                      />
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{
                        fontFamily: "'Itim', cursive",
                        display: "flex",
                        alignItems: "center",
                        fontSize: { xs: "0.7rem", sm: "0.9rem" }, // Giảm fontSize trên xs
                      }}
                    >
                      <Box
                        component="img"
                        src="https://dr9rfdtcol2ay.cloudfront.net/assets/iconbera.png"
                        alt="BERA Price"
                        sx={{
                          width: { xs: "18px !important", sm: "23px !important" }, // Thêm !important để ưu tiên
                          height: { xs: "18px !important", sm: "23px !important" },
                          maxWidth: { xs: "18px !important", sm: "23px !important" },
                          maxHeight: { xs: "18px !important", sm: "23px !important" },
                          objectFit: "contain", // Đảm bảo ảnh không bị méo
                          mr: 1, // marginRight trong sx (tương đương 8px)
                        }}
                      />
                      BERA Price: {beraPrice ? `$${parseFloat(beraPrice).toFixed(2)}` : "N/A"}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      mb: { xs: 1, sm: 2 }, // Giảm margin-bottom trên xs
                      display: "flex",
                      gap: { xs: 0.5, sm: 1 }, // Giảm khoảng cách giữa các nút trên xs
                      justifyContent: "center",
                    }}
                  >
                    {percentagePresets.map((rate) => (
                      <Button
                        key={rate}
                        variant={premiumRate === rate.toString() ? "contained" : "outlined"}
                        onClick={() => setPremiumRate(rate.toString())}
                        sx={{
                          borderRadius: { xs: "8px", sm: "12px" }, // Giảm borderRadius trên xs
                          minWidth: { xs: "40px", sm: "60px" }, // Giảm minWidth trên xs
                          fontSize: { xs: "0.7rem", sm: "1rem" }, // Giảm fontSize trên xs
                          fontFamily: "'Itim', cursive",
                          backgroundColor: premiumRate === rate.toString() ? "#ffca28" : "transparent",
                          color: premiumRate === rate.toString() ? "black" : "inherit",
                          borderColor: "#fff",
                          "&:hover": {
                            backgroundColor: "#ffca28",
                            color: "#000",
                          },
                        }}
                      >
                        {rate}%
                      </Button>
                    ))}
                  </Box>

                  <Box
                    sx={{
                      mb: { xs: 1, sm: 2 }, // Giảm margin-bottom trên xs
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        fontFamily: "Itim, cursive",
                        fontWeight: "500",
                        fontSize: { xs: "0.8rem", sm: "1.05rem" }, // Giảm fontSize trên xs
                      }}
                    >
                      BGT in vault (≥0.01)
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      mb: { xs: 1, sm: 2 }, // Giảm margin-bottom trên xs
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
                    disabled={sellStatus === "Success" ? false : true}
                    sx={{
                      py: { xs: 1, sm: 1.5 }, // Giảm padding y trên xs
                      fontWeight: "bold",
                      borderRadius: { xs: "10px", sm: "20px" }, // Giảm borderRadius trên xs
                      boxShadow: "0 4px 12px rgba(0, 128, 0, 0.3)",
                      fontFamily: "'Itim', cursive",
                      fontSize: { xs: "0.9rem", sm: "1.2rem" }, // Giảm fontSize trên xs
                      backgroundColor: "#FF0000",
                      "&:hover": {
                        backgroundColor: "#FF3333",
                      },
                      "&.Mui-disabled": {
                        backgroundColor: "#FF0000",
                        opacity: 1,
                        color: "#fff",
                      },
                    }}
                  >
                    {sellStatus === "Success" ? "Sell" : "Processing..."}
                  </Button>
                </>
              )
            ) : orderType === "Buy Orders" ? (
              <>
                <TableContainer component={Paper}>
                  {account === "" ? (
                    <Table sx={{ minWidth: { xs: 150, sm: 200 } }} aria-label="order table"> {/* Giảm minWidth trên xs */}
                      <TableBody>
                        <TableRow>
                          <TableCell sx={{ fontSize: { xs: "0.8rem", sm: "1rem" } }}> {/* Giảm fontSize trên xs */}
                            Please connect your wallet
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  ) : buyOrdersAccount === null ? (
                    <Table sx={{ minWidth: { xs: 150, sm: 200 } }} aria-label="order table"> {/* Giảm minWidth trên xs */}
                      <TableBody>
                        <TableRow>
                          <TableCell sx={{ fontSize: { xs: "0.8rem", sm: "1rem" } }}> {/* Giảm fontSize trên xs */}
                            No order
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  ) : (
                    <Table sx={{ maxWidth: { xs: 150, sm: 200 } }} aria-label="order table"> {/* Giảm maxWidth trên xs */}
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontSize: { xs: "0.7rem", sm: "0.9rem" } }}>BGT Price</TableCell> {/* Giảm fontSize trên xs */}
                          <TableCell sx={{ fontSize: { xs: "0.7rem", sm: "0.9rem" } }}>BGT Amount</TableCell> {/* Giảm fontSize trên xs */}
                          <TableCell sx={{ fontSize: { xs: "0.7rem", sm: "0.9rem" } }}>Type</TableCell> {/* Giảm fontSize trên xs */}
                          <TableCell sx={{ fontSize: { xs: "0.7rem", sm: "0.9rem" } }}>Action</TableCell> {/* Giảm fontSize trên xs */}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {displayBuyOrdersAccount.map((order, index) => (
                          <TableRow key={order.order_id || index}>
                            <TableCell sx={{ fontSize: { xs: "0.7rem", sm: "0.9rem" } }}>{order.price}</TableCell> {/* Giảm fontSize trên xs */}
                            <TableCell sx={{ fontSize: { xs: "0.7rem", sm: "0.9rem" } }}>
                              {(+order.filled_bgt_amount).toFixed(2)}/{(+order.bgt_amount).toFixed(2)}
                            </TableCell>
                            <TableCell sx={{ color: "green", fontSize: { xs: "0.7rem", sm: "0.9rem" } }}>
                              Buy
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="contained"
                                color={order.state === 1 ? "success" : "gray"}
                                disabled={order.state === 1 ? false : true}
                                onClick={() => closeOrder(order.order_id, "Buy")}
                                sx={{
                                  borderRadius: { xs: "8px", sm: "12px" }, // Giảm borderRadius trên xs
                                  fontSize: { xs: "0.6rem", sm: "0.9rem" }, // Giảm fontSize trên xs
                                  py: { xs: 0.5, sm: 1 }, // Giảm padding y trên xs
                                }}
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
                  rowsPerPageOptions={[5, 10, 25, 50, 100, 200]}
                  sx={{
                    fontSize: { xs: "0.7rem", sm: "0.9rem" }, // Giảm fontSize trên xs
                    "& .MuiTablePagination-selectLabel": {
                      fontSize: { xs: "0.7rem", sm: "0.9rem" }, // Giảm fontSize trên xs
                    },
                    "& .MuiTablePagination-displayedRows": {
                      fontSize: { xs: "0.7rem", sm: "0.9rem" }, // Giảm fontSize trên xs
                    },
                  }}
                />
              </>
            ) : (
              <>
                <TableContainer component={Paper}>
                  {account === "" ? (
                    <Table sx={{ minWidth: { xs: 150, sm: 200 } }} aria-label="order table"> {/* Giảm minWidth trên xs */}
                      <TableBody>
                        <TableRow>
                          <TableCell sx={{ fontSize: { xs: "0.8rem", sm: "1rem" } }}> {/* Giảm fontSize trên xs */}
                            Please connect your wallet
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  ) : sellOrdersAccount === null ? (
                    <Table sx={{ minWidth: { xs: 150, sm: 200 } }} aria-label="order table"> {/* Giảm minWidth trên xs */}
                      <TableBody>
                        <TableRow>
                          <TableCell sx={{ fontSize: { xs: "0.8rem", sm: "1rem" } }}> {/* Giảm fontSize trên xs */}
                            No order
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  ) : (
                    <Table sx={{ maxWidth: { xs: 100, sm: 200 } }} aria-label="order table"> {/* Giảm maxWidth trên xs */}
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontSize: { xs: "0.7rem", sm: "0.9rem" } }}>Premium</TableCell> {/* Giảm fontSize trên xs */}
                          <TableCell sx={{ fontSize: { xs: "0.7rem", sm: "0.9rem" } }}>Sold Amount</TableCell> {/* Giảm fontSize trên xs */}
                          <TableCell sx={{ fontSize: { xs: "0.7rem", sm: "0.9rem" } }}>Profit</TableCell> {/* Giảm fontSize trên xs */}
                          <TableCell sx={{ fontSize: { xs: "0.7rem", sm: "0.9rem" } }}>Action</TableCell> {/* Giảm fontSize trên xs */}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {displaySellOrdersAccount.map((order, index) => (
                          <TableRow key={order.order_id || index}>
                            <TableCell sx={{ fontSize: { xs: "0.7rem", sm: "0.9rem" } }}>
                              {(order.markup - 10000) / 100}%
                            </TableCell>
                            <TableCell sx={{ fontSize: { xs: "0.7rem", sm: "0.9rem" } }}>
                              {+order.unclaimed_bgt < 0.01
                                ? "<0.01"
                                : +order.unclaimed_bgt == 0
                                  ? "0.00"
                                  : (+order.unclaimed_bgt).toFixed(3)}
                            </TableCell>
                            <TableCell sx={{ fontSize: { xs: "0.7rem", sm: "0.9rem" } }}>
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
                                sx={{
                                  borderRadius: { xs: "8px", sm: "12px" }, // Giảm borderRadius trên xs
                                  fontSize: { xs: "0.6rem", sm: "0.9rem" }, // Giảm fontSize trên xs
                                  py: { xs: 0.5, sm: 1 }, // Giảm padding y trên xs
                                }}
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
                  rowsPerPageOptions={[5, 10, 25, 50, 100, 200]}
                  sx={{
                    fontSize: { xs: "0.7rem", sm: "0.9rem" }, // Giảm fontSize trên xs
                    "& .MuiTablePagination-selectLabel": {
                      fontSize: { xs: "0.7rem", sm: "0.9rem" }, // Giảm fontSize trên xs
                    },
                    "& .MuiTablePagination-displayedRows": {
                      fontSize: { xs: "0.7rem", sm: "0.9rem" }, // Giảm fontSize trên xs
                    },
                  }}
                />
              </>
            )}
          </Box>
          {status && (
            <Typography
              variant="body2"
              color="text.secondary"
              textAlign="center"
              sx={{ fontSize: { xs: "0.7rem", sm: "0.9rem" } }} // Giảm fontSize trên xs
            >
              {status}
            </Typography>
          )}
        </Container>
      </Box>

      <footer>
  <Container
    sx={{
      backgroundColor: "rgba(104, 77, 2, 0.8)",
      padding: "5px 10px",
      display: "flex",
      alignItems: "center",
      fontFamily: "Itim, cursive",
      maxWidth: "100% !important",
      position: "fixed",
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 99,
    }}
  >
    <Box
      sx={{
        width: { xs: "10%", sm: "7%", md: "5%", lg: "4%" },
        display: "flex",
        justifyContent: "center",
        marginRight: "20px",
      }}
    >
      <img
        src="https://dr9rfdtcol2ay.cloudfront.net/assets/logomain.png"
        alt="logo"
        style={{
          width: "100%",
          userSelect: "none",
        }}
      />
    </Box>
    <Typography
      sx={{
        fontFamily: "Itim, cursive",
        color: "white",
        width: "80%",
        userSelect: "none",
        fontSize: { xs: "10px", sm: "12px", md: "14px" }, // Giảm kích thước chữ
      }}
    >
      Trade BGT tokens easily and securely before claim time. Join the
      peer-to-peer (C2C) BGT pre-claim marketplace today.
    </Typography>
  </Container>
</footer>
    </Box >

  );
}