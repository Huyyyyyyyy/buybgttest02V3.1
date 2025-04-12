import React from 'react';
import { ethers } from "ethers";
import { Box, Typography, Button, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
import validatorsData from './data/validators.json'; // Import file JSON


import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";


// ABI của contract BGT
const BGT_ABI = [
  {
    "inputs": [{ "internalType": "address", "name": "account", "type": "address" }],
    "name": "balanceOf",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "bytes", "name": "pubkey", "type": "bytes" }, { "internalType": "uint128", "name": "amount", "type": "uint128" }],
    "name": "queueBoost",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "account", "type": "address" },
      { "internalType": "bytes", "name": "pubkey", "type": "bytes" }
    ],
    "name": "boosted",
    "outputs": [{ "internalType": "uint128", "name": "", "type": "uint128" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "account", "type": "address" }],
    "name": "boosts",
    "outputs": [{ "internalType": "uint128", "name": "", "type": "uint128" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "account", "type": "address" },
      { "internalType": "bytes", "name": "pubkey", "type": "bytes" }
    ],
    "name": "boostedQueue",
    "outputs": [
      { "internalType": "uint32", "name": "blockNumberLast", "type": "uint32" },
      { "internalType": "uint128", "name": "balance", "type": "uint128" }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

const BGT_CONTRACT_ADDRESS = "0x656b95E550C07a9ffe548bd4085c72418Ceb1dba";
const RPC_URL = "https://berachain-rpc.publicnode.com";
const ACTIVATE_BOOST_DELAY = 8191; // Số khối cần chờ để kích hoạt boost
const SECONDS_PER_BLOCK = 2; // Mỗi khối mất 2 giây

const initialState = {
  left: false,
};

export default function DelegatePage() {
  const navigate = useNavigate();
  // const [state, setState] = React.useState(initialState);
  const [account, setAccount] = React.useState(null);
  const [bgtBalance, setBgtBalance] = React.useState(null);
  const [availableToBoost, setAvailableToBoost] = React.useState(null);
  const [status, setStatus] = React.useState("");
  const [bgtPrice, setBgtPrice] = React.useState(null);
  const [selectedValidator, setSelectedValidator] = React.useState("TTT 🇻🇳");
  const [boostAmount, setBoostAmount] = React.useState("");
  const [boostedValidators, setBoostedValidators] = React.useState([]);
  const [showMyBoost, setShowMyBoost] = React.useState(false);
  const [showQueuedBoosts, setShowQueuedBoosts] = React.useState(false);
  const [currentBlock, setCurrentBlock] = React.useState(null);

  
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
  const fetchCurrentBlock = async () => {
    try {
      const provider = new ethers.JsonRpcProvider(RPC_URL);
      const blockNumber = await provider.getBlockNumber();
      setCurrentBlock(blockNumber);
    } catch (err) {
      console.error("Fetch current block error:", err);
      setStatus(`Lỗi khi lấy số khối hiện tại: ${err.message}`);
    }
  };

  const calculateWaitingTime = (blockNumberLast) => {
    if (!currentBlock || !blockNumberLast) return "Đang tính toán...";

    const targetBlock = parseInt(blockNumberLast) + ACTIVATE_BOOST_DELAY;
    const remainingBlocks = targetBlock - currentBlock;

    if (remainingBlocks <= 0) return "Đã hoàn thành";

    const waitingTimeSeconds = remainingBlocks * SECONDS_PER_BLOCK;
    const hours = Math.floor(waitingTimeSeconds / 3600);
    const minutes = Math.floor((waitingTimeSeconds % 3600) / 60);
    const seconds = waitingTimeSeconds % 60;

    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const calculateAvailableToBoost = async (provider, address) => {
    try {
      const bgtContract = new ethers.Contract(BGT_CONTRACT_ADDRESS, BGT_ABI, provider);

      const balance = await bgtContract.balanceOf(address);
      const balanceFormatted = ethers.formatUnits(balance, 18);

      const usedBoost = await bgtContract.boosts(address);
      const usedBoostFormatted = ethers.formatUnits(usedBoost, 18);

      let totalBoostedQueue = 0;
      for (const validator of validatorsData.validators) {
        const boostedQueue = await bgtContract.boostedQueue(address, validator.id);
        const boostedQueueBalance = ethers.formatUnits(boostedQueue.balance, 18);
        totalBoostedQueue += parseFloat(boostedQueueBalance);
      }

      const available = parseFloat(balanceFormatted) - parseFloat(usedBoostFormatted) - totalBoostedQueue;
      setBgtBalance(balanceFormatted);
      setAvailableToBoost(available.toFixed(4));
    } catch (err) {
      console.error("Calculate available to boost error:", err);
      setStatus(`Lỗi khi tính số dư có thể boost: ${err.message}`);
    }
  };

  const checkWalletConnection = async () => {
    try {
      if (!window.ethereum) {
        setStatus("Install MetaMask.");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });

      if (accounts.length > 0) {
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);

        await calculateAvailableToBoost(provider, address);

        // setStatus("Đã kết nối ví thành công!");
      }
    } catch (err) {
      console.error("Check wallet connection error:", err);
      setStatus(` ${err.message}`);
    }
  };

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        throw new Error("Install MetaMask.");
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const decimalChainId = 80094;
      const hexChainId = "0x" + decimalChainId.toString(16);
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: hexChainId }],
      });
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      setAccount(address);

      await calculateAvailableToBoost(provider, address);

      // setStatus("Đã kết nối ví thành công!");
    } catch (err) {
      console.error("Connect wallet error:", err);
      setStatus(`Connect error: ${err.message}`);
    }
  };

  const fetchBoostedValidators = async () => {
    try {
      if (!account) {
        throw new Error("Please connect your wallet");
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const bgtContract = new ethers.Contract(BGT_CONTRACT_ADDRESS, BGT_ABI, provider);
      const boostedList = [];

      for (const validator of validatorsData.validators) {
        const boostedAmount = await bgtContract.boosted(account, validator.id);
        const boostedAmountFormatted = ethers.formatUnits(boostedAmount, 18);
        if (parseFloat(boostedAmountFormatted) > 0) {
          boostedList.push({
            name: validator.name,
            logoURI: validator.logoURI,
            amount: boostedAmountFormatted,
          });
        }
      }

      setBoostedValidators(boostedList);
      setShowMyBoost(true);
    } catch (err) {
      console.error("Fetch boosted validators error:", err);
      setStatus(` ${err.message}`);
    }
  };

  const fetchQueuedBoosts = async () => {
    try {
      if (!account) {
        throw new Error("Please connect your wallet.");
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const bgtContract = new ethers.Contract(BGT_CONTRACT_ADDRESS, BGT_ABI, provider);
      const queuedList = [];

      for (const validator of validatorsData.validators) {
        const queuedBoost = await bgtContract.boostedQueue(account, validator.id);
        const queuedAmountFormatted = ethers.formatUnits(queuedBoost.balance, 18);
        if (parseFloat(queuedAmountFormatted) > 0) {
          queuedList.push({
            name: validator.name,
            logoURI: validator.logoURI,
            amount: queuedAmountFormatted,
            blockNumberLast: queuedBoost.blockNumberLast.toString(),
          });
        }
      }

      setBoostedValidators(queuedList);
      setShowQueuedBoosts(true);
    } catch (err) {
      console.error("Fetch queued boosts error:", err);
      setStatus(` ${err.message}`);
    }
  };

  const queueBoost = async () => {
    try {
      if (!account) {
        throw new Error("Please connect your wallet");
      }
      if (!selectedValidator) {
        throw new Error("ChooseChoose validator.");
      }
      if (!boostAmount || parseFloat(boostAmount) <= 0) {
        throw new Error("Set amount BGT ");
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const bgtContract = new ethers.Contract(BGT_CONTRACT_ADDRESS, BGT_ABI, signer);

      const amountInWei = ethers.parseUnits(boostAmount, 18);
      const pubkey = validatorsData.validators.find(v => v.name === selectedValidator).id;

      const tx = await bgtContract.queueBoost(pubkey, amountInWei);
      setStatus("Loading transaction...");
      await tx.wait();
      setStatus(`queue boost success ${selectedValidator}!`);

      await calculateAvailableToBoost(provider, account);
    } catch (err) {
      console.error("Queue boost error:", err);
      setStatus(` queue boost: ${err.message}`);
    }
  };

  const fetchBgtPrice = async () => {
    setBgtPrice("10.50"); // Thay bằng API thực tế nếu có
  };

  const handleMaxClick = () => {
    if (availableToBoost) {
      setBoostAmount(availableToBoost);
    }
  };

  React.useEffect(() => {
    checkWalletConnection();

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          checkWalletConnection();
        } else {
          setAccount(null);
          setBgtBalance(null);
          setAvailableToBoost(null);
          setStatus("Wallet disconnected");
        }
      });

      window.ethereum.on('disconnect', () => {
        setAccount(null);
        setBgtBalance(null);
        setAvailableToBoost(null);
        setStatus("Wallet disconnected");
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', checkWalletConnection);
        window.ethereum.removeListener('disconnect', () => {});
      }
    };
  }, []);

  React.useEffect(() => {
    if (account) {
      fetchBgtPrice();
      fetchCurrentBlock(); // Lấy số khối hiện tại khi kết nối ví
    }
  }, [account]);

  React.useEffect(() => {
    if (showQueuedBoosts) {
      fetchCurrentBlock(); // Cập nhật số khối hiện tại khi hiển thị queued boosts
    }
  }, [showQueuedBoosts]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        maxWidth: { xs: "100%" },
        display: "flex",
        alignItems:"flex-start",
        justifyContent:"center",
        flexWrap: "wrap",
        gap: 4,
        // flexDirection: { xs: "row", md: "row", lg: "column" },
        pt: { xs: 10, sm: 10, md: 20 }, // Thêm padding-top để đẩy body xuống dưới header
      }}
    >
      {/* Header */}
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
                {["Market", , "Boost (beta) "].map((text) => (
                  // "About TTT"
                  <ListItem key={text} disablePadding>
                    <ListItemButton
                      sx={{
                        backgroundColor: "#ffc000",
                        "&:hover": { backgroundColor: "#ffd700" },
                      }}
                      onClick={() =>
                        text === "Market"
                          ? navigate("/")
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
        onClick={() => navigate("/")} // Giữ nguyên chức năng
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
          "&:hover": {
            background: "none",
            color: "yellow",
          },
        }}
      >
        <span className="label">Market</span>
      </Button>

      {/* <Button
        variant="text"
        onClick={() => window.open("https://tienthuattoan.com/")} // Giữ nguyên chức năng
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
        onClick={() => navigate("/boost")} // Giữ nguyên chức năng
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
          
          minWidth: "unset",
          "&:hover": {
            background: "none",
            color: "yellow",
          },
          borderBottom: "5px solid yellow",
        }}
      >
        <span className="label-1">Boost (beta)</span>
      </Button>
    </Box>

    {/* Connect Wallet Button */}
    <Box
      sx={{
        width: { xs: "30%", sm: "30%", md: "25%", lg: "25%" },
        display: "flex",
        alignItems: "center",
        justifyContent: { md: "flex-end", lg: "space-around" },
      }}
    >
      <Button
        variant="outlined"
        onClick={connectWallet} // Giữ nguyên chức năng
        sx={{
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
            ? `${account.slice(0, 6)}...${account.slice(-4)}`
            : "Connect Wallet"}
        </Box>
      </Button>
    </Box>
  </Box>
</Box>

      {/* Nội dung chính */}
     
        <Box
          sx={{
            
            // maxWidth: { xs: "100%", md: "50%", lg: "60%" },
            bgcolor: "black",
            opacity: "0.8",
            borderRadius: { xs: "15px", sm: "15px" },
            // padding:"10px 150px",
            boxShadow: "0 8px 30px rgba(0,0,0,0.1)",
            
            margin:{xs:"0 12px"},
            mb: 10,
            color: "black",
          }}
        >

          <Box
          sx={{
            padding:{
              xs:"10px 50px",
              sm:"10px 100px",
              md:"10px 130px",
              lg:"10px 150px",
            },
          }}
          >
             {/* Tiêu đề */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              component="img"
              src="https://dr9rfdtcol2ay.cloudfront.net/assets/BGT.png"
              alt="boost icon"
              sx={{ width: 50, height: 50 }}
            />
            <Typography variant="h4" sx={{ color: '#fff', fontFamily: 'Itim, cursive', fontSize: { xs: '24px', sm: '50px' } }}>
              Boost
            </Typography>
          </Box>

          {/* Nút "My Boost", "Boost Validator" và "Queue Boost" */}
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <Button
              variant="contained"
              onClick={() => {
                setShowMyBoost(true);
                setShowQueuedBoosts(false);
                fetchBoostedValidators();
              }}
              sx={{
                backgroundColor: '#FFEA00',
                color: '#000',
                fontFamily: 'Itim, cursive',
                fontWeight: 'bold',
                borderRadius: '20px',
                textTransform: 'none',
                padding: '8px 16px',
                '&:hover': { backgroundColor: '#FFD700' },
              }}
            >
              My Boost
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                setShowMyBoost(false);
                setShowQueuedBoosts(false);
              }}
              sx={{
                borderColor: '#fff',
                color: '#fff',
                fontFamily: 'Itim, cursive',
                fontWeight: 'bold',
                borderRadius: '20px',
                textTransform: 'none',
                padding: '8px 16px',
                '&:hover': { borderColor: '#FFD700', color: '#FFD700' },
              }}
            >
              Boost Validator
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                setShowMyBoost(false);
                setShowQueuedBoosts(true);
                fetchQueuedBoosts();
              }}
              sx={{
                borderColor: '#fff',
                color: '#fff',
                fontFamily: 'Itim, cursive',
                fontWeight: 'bold',
                borderRadius: '20px',
                textTransform: 'none',
                padding: '8px 16px',
                '&:hover': { borderColor: '#FFD700', color: '#FFD700' },
              }}
            >
              Queue Boost
            </Button>
          </Box>

          {status && (
            <Typography sx={{ color: '#fff', mt: 2, fontFamily: 'Itim, cursive' }}>
              {status}
            </Typography>
          )}

          {account && !showMyBoost && !showQueuedBoosts && (
            <>
              {/* Validator */}
              <FormControl fullWidth sx={{ mt: 2 }}>
                <Typography sx={{ color: '#fff', fontFamily: 'Itim, cursive', mb: 1 }}>
                  Validator
                </Typography>
                <Select
                  value={selectedValidator}
                  onChange={(e) => setSelectedValidator(e.target.value)}
                  sx={{
                    borderRadius: '12px',
                    backgroundColor: '#fff',
                    color: '#000',
                    fontFamily: 'Itim, cursive',
                    '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                    '& .MuiSelect-select': { padding: '12px' },
                  }}
                >
                  <MenuItem value="">
                    <em>Choose Validator</em>
                  </MenuItem>
                  {validatorsData.validators.map((validator) => (
                    <MenuItem key={validator.id} value={validator.name}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box
                          component="img"
                          src={validator.logoURI}
                          alt={validator.name}
                          sx={{
                            width: { xs: 20, sm: 25 },
                            height: { xs: 20, sm: 25 },
                            mr: 1,
                            objectFit: 'contain',
                          }}
                        />
                        {validator.name}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Amount */}
              <Box sx={{ width: '100%', mt: 2 }}>
                <Typography sx={{ color: '#fff', fontFamily: 'Itim, cursive', mb: 1 }}>
                  Amount
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <TextField
                    variant="outlined"
                    fullWidth
                    value={boostAmount}
                    onChange={(e) => setBoostAmount(e.target.value)}
                    type="number"
                    placeholder="0.0"
                    sx={{
                      borderRadius: '12px',
                      backgroundColor: '#fff',
                      '& .MuiInputBase-input': {
                        fontFamily: 'Itim, cursive',
                        color: '#000',
                        padding: '12px',
                      },
                      '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                    }}
                  />
                  <Typography sx={{ color: '#fff', fontFamily: 'Itim, cursive' }}>
                    BGT
                  </Typography>
                </Box>
                {availableToBoost && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                    <Typography sx={{ color: '#fff', fontFamily: 'Itim, cursive', fontSize: '14px' }}>
                      Available to boost: {availableToBoost} BGT
                    </Typography>
                    <Typography
                      onClick={handleMaxClick}
                      sx={{
                        color: '#FFEA00',
                        fontFamily: 'Itim, cursive',
                        fontSize: '14px',
                        cursor: 'pointer',
                        '&:hover': { textDecoration: 'underline' },
                      }}
                    >
                      MAX
                    </Typography>
                  </Box>
                )}
              </Box>

              {/* Nút Queue Boost */}
              <Button
                variant="contained"
                onClick={queueBoost}
                fullWidth
                sx={{
                  mt: 3,
                  fontFamily: 'Itim, cursive',
                  fontWeight: 'bold',
                  borderRadius: '12px',
                  backgroundColor: '#FFEA00',
                  color: '#000',
                  padding: '12px',
                  textTransform: 'uppercase',
                  '&:hover': { backgroundColor: '#FFD700' },
                }}
              >
                Queue Boost
              </Button>
            </>
          )}

          {account && showMyBoost && (
            <Box sx={{ width: '100%', mt: 2 }}>
              <Typography sx={{ color: '#fff', fontFamily: 'Itim, cursive', mb: 2 }}>
                My Boosted Validators
              </Typography>
              {boostedValidators.length > 0 ? (
                boostedValidators.map((validator, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      mb: 2,
                      p: 2,
                      backgroundColor: '#3A3A3A',
                      borderRadius: '12px',
                    }}
                  >
                    <Box
                      component="img"
                      src={validator.logoURI}
                      alt={validator.name}
                      sx={{
                        width: { xs: 30, sm: 40 },
                        height: { xs: 30, sm: 40 },
                        objectFit: 'contain',
                      }}
                    />
                    <Box>
                      <Typography sx={{ color: '#fff', fontFamily: 'Itim, cursive' }}>
                        {validator.name}
                      </Typography>
                      <Typography sx={{ color: '#fff', fontFamily: 'Itim, cursive', fontSize: '14px' }}>
                        Boosted: {parseFloat(validator.amount).toFixed(4)} BGT
                      </Typography>
                    </Box>
                  </Box>
                ))
              ) : (
                <Typography sx={{ color: '#fff', fontFamily: 'Itim, cursive' }}>
                  Loading....
                </Typography>
              )}
            </Box>
          )}

          {account && showQueuedBoosts && (
            <Box sx={{ width: '100%', mt: 2 }}>
              <Typography sx={{ color: '#fff', fontFamily: 'Itim, cursive', mb: 2 }}>
                Queued Boosts
              </Typography>
              {boostedValidators.length > 0 ? (
                boostedValidators.map((validator, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      mb: 2,
                      p: 2,
                      backgroundColor: '#3A3A3A',
                      borderRadius: '12px',
                    }}
                  >
                    <Box
                      component="img"
                      src={validator.logoURI}
                      alt={validator.name}
                      sx={{
                        width: { xs: 30, sm: 40 },
                        height: { xs: 30, sm: 40 },
                        objectFit: 'contain',
                      }}
                    />
                    <Box>
                      <Typography sx={{ color: '#fff', fontFamily: 'Itim, cursive' }}>
                        {validator.name}
                      </Typography>
                      <Typography sx={{ color: '#fff', fontFamily: 'Itim, cursive', fontSize: '14px' }}>
                        Queued: {parseFloat(validator.amount).toFixed(4)} BGT
                      </Typography>
                      <Typography sx={{ color: '#fff', fontFamily: 'Itim, cursive', fontSize: '14px' }}>
                        Block Number Last: {validator.blockNumberLast}
                      </Typography>
                      <Typography sx={{ color: '#fff', fontFamily: 'Itim, cursive', fontSize: '14px' }}>
                        Remaining : {calculateWaitingTime(validator.blockNumberLast)}
                      </Typography>
                    </Box>
                  </Box>
                ))
              ) : (
                <Typography sx={{ color: '#fff', fontFamily: 'Itim, cursive' }}>
                  Loading....
                </Typography>
              )}
            </Box>
          )}
          </Box>
         
        </Box>
      
      
    </Box>
  );
}