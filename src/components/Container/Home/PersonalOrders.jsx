import {
  Box,
  Button,
  CircularProgress,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { useContext, useEffect } from "react";
import { WalletContext } from "../../../context/WalletContext";
import { formatNormalAmount } from "../../../utils/Utils";
import CircularPercentage from "./Custom";

const PersonalOrders = () => {
  const percentagePresets = [10, 50, 100, 1000];

  const {
    walletData: {
      beraBalance,
      orderType,
      address,
      beraPrice,
      amountToBuy,
      honeyBalance,
      selectedVault,
      selectedPercentage,
      buyStatus,
      sellStatus,
      loadingContractStatus,
      vaultsWithBalance,
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
      setOrderType,
      setBeraPrice,
      setAmountByPercentage,
      createOrder,
      setSelectedVault,
      getBeraPrice,
      setSelectedPercentage,
      fetchVaultBalances,
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
  } = useContext(WalletContext);

  //fecth bera price when established contract instances
  useEffect(() => {
    getBeraPrice();
  }, [loadingContractStatus]);
  //fecth bera price when established contract instances

  //fetch vaults balance when trigger loaded vaults list
  useEffect(() => {
    if (orderType === "Sell") {
      fetchVaultBalances();
    }
  }, [rewardVaults, orderType]);
  //fetch vaults balance when trigger loaded vaults list

  useEffect(() => {
    if (address !== "" && orderType == "Buy Orders") {
      fetchAccountBuyOrders(pagePersonalBuy, rowsPerPagePersonalBuy);
    }
  }, [pagePersonalBuy, rowsPerPagePersonalBuy, address, orderType]);

  useEffect(() => {
    if (address !== "" && orderType == "Sell Orders") {
      fetchAccountSellOrders(pagePersonalSell, rowsPerPagePersonalSell);
    }
  }, [pagePersonalSell, rowsPerPagePersonalSell, address, orderType]);

  //custom style
  const cellCrossPlatform = {
    fontFamily: "'Itim', cursive",
    color: "#222",
    fontWeight: "bold",
    border: 0,
    width: "25%",
    fontSize: { xs: "13px", sm: "15px", md: "18px", lg: "18px" },
    textAlign: "center",
  };
  //end custom style

  return (
    <Container
      sx={{
        maxWidth: "100%",
        bgcolor: "black",
        opacity: "0.8",
        borderRadius: { xs: "10px", md: "15px", lg: "15px" },
        boxShadow: "0 8px 30px rgba(0,0,0,0.1)",
        padding: { xs: "20px" },
        marginLeft: { lg: "10px" },
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

      {address && (
        <Box sx={{ mb: 3 }}>
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
            borderRadius: "10px",
            backgroundColor: "rgba(0,0,0,0.6)",
            padding: "4px",
            "& .MuiToggleButton-root": {
              flex: 1,
              fontWeight: "bold",
              fontSize: "1rem",
              color: "#fff",
              border: "none",
              borderRadius: "10px",
              textTransform: "none",
              fontFamily: "Itim, cursive",
              transition: "all 0.05s",
              "&.Mui-selected": {
                backgroundColor: "#FFEA00",
                color: "black",
                borderRadius: "10px",
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
          address === "" ? (
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
                    value={beraPrice}
                    onChange={(e) => setBeraPrice(e.target.value)}
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
                    BERA Price: {formatNormalAmount(beraPrice)}
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
                    variant={
                      selectedPercentage === percentage
                        ? "contained"
                        : "outlined"
                    }
                    onClick={() => {
                      setSelectedPercentage(percentage);
                      setAmountByPercentage(percentage);
                    }}
                    sx={{
                      borderRadius: "12px",
                      width: "25%",
                      fontSize: "1rem",
                      fontFamily: "'Itim', cursive",
                      color:
                        selectedPercentage === percentage ? "#000" : "#fff",
                      backgroundColor:
                        selectedPercentage === percentage
                          ? "#ffca28"
                          : "transparent",
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

              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="body1"
                  sx={{
                    mb: 1,
                    fontFamily: "Itim, cursive",
                    fontWeight: "700",
                    color: "fff",
                  }}
                >
                  Buying Amount ($HONEY)
                </Typography>
                <TextField
                  variant="outlined"
                  fullWidth
                  sx={{
                    borderRadius: "12px",
                    backgroundColor: "#f5f5f5",
                    "& .MuiInputBase-input": {
                      fontFamily: "Itim, cursive",
                      fontWeight: "700",
                      color: "#333",
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      border: "none",
                    },
                  }}
                  value={amountToBuy}
                  onChange={(e) => setAmountToBuy(e.target.value)}
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
                    style={{ width: 20, height: 20, marginRight: 4 }}
                  />
                  <Typography
                    variant="body2"
                    sx={{ fontFamily: "'Itim', cursive" }}
                  >
                    {formatNormalAmount(honeyBalance)}
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
                <Typography
                  variant="body2"
                  sx={{ fontFamily: "'Itim', cursive" }}
                >
                  Honey to pay (≥ 10.00)
                </Typography>
              </Box>

              <Button
                variant="contained"
                color="success"
                onClick={createOrder}
                fullWidth
                disabled={buyStatus !== "Success" || +amountToBuy < 10 ? true : false}
                sx={{
                  py: 1.5,
                  fontWeight: "bold",
                  borderRadius: "10px",
                  boxShadow: "0 4px 12px rgba(0, 128, 0, 0.3)",
                  fontFamily: "'Itim', cursive",
                  fontSize: "1.2rem",
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
          address === "" ? (
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
              <FormControl
                fullWidth
                sx={{
                  mb: 2,
                  "& .MuiInputLabel-outlined": {
                    fontFamily: "'Itim', cursive",
                    color: "#f5f5f5",
                    "&.Mui-focused": {
                      color: "#f5f5f5",
                    },
                  },
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    "& fieldset": {
                      border: "3px solid #f5f5f5",
                    },
                    "&:hover fieldset": {
                      border: "3px solid #f5f5f5",
                    },
                    "&.Mui-focused fieldset": {
                      border: "3px solid #f5f5f5",
                    },
                  },
                }}
              >
                <InputLabel id="vault-label" sx={cellCrossPlatform}>
                  Reward Vault
                </InputLabel>
                <Select
                  labelId="vault-label"
                  value={selectedVault}
                  label="Reward Vault"
                  onChange={(e) => setSelectedVault(e.target.value)}
                  sx={{
                    borderRadius: "12px",
                    fontFamily: "'Itim', cursive",
                  }}
                >
                  <MenuItem value="">
                    <Typography sx={cellCrossPlatform}>Choose Vault</Typography>
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
                          <Box sx={cellCrossPlatform}>
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
                          <Typography variant="body2" sx={cellCrossPlatform}>
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
                    "& .MuiInputLabel-outlined": {
                      fontFamily: "'Itim', cursive",
                      color: "#f5f5f5",
                      "&.Mui-focused": {
                        color: "#f5f5f5",
                      },
                    },
                    "& .MuiOutlinedInput-root": {
                      color: "white",
                      borderRadius: "12px",
                      "& fieldset": {
                        border: "3px solid #f5f5f5",
                      },
                      "&:hover fieldset": {
                        border: "3px solid #f5f5f5",
                      },
                      "&.Mui-focused fieldset": {
                        border: "3px solid #f5f5f5",
                      },
                    },
                  }}
                  value={premiumRate}
                  onChange={(e) => setPremiumRate(e.target.value)}
                />
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
                  BERA Price: {formatNormalAmount(beraPrice)}
                </Typography>
              </Box>

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
                      premiumRate === rate.toString() ? "contained" : "outlined"
                    }
                    onClick={() => setPremiumRate(rate.toString())}
                    sx={{
                      borderRadius: "12px",
                      width: "25%",
                      fontSize: "1rem",
                      fontFamily: "'Itim', cursive",
                      backgroundColor:
                        premiumRate === rate.toString()
                          ? "#ffca28"
                          : "transparent",
                      color:
                        premiumRate === rate.toString() ? "black" : "inherit",
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
                  mb: 2,
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ fontFamily: "'Itim', cursive" }}
                >
                  BGT in vault ( ≥0.01 )
                </Typography>
              </Box>

              <Button
                variant="contained"
                color="success"
                onClick={createOrder}
                fullWidth
                disabled={sellStatus === "Success" ? false : true}
                sx={{
                  py: 1.5,
                  fontWeight: "bold",
                  borderRadius: "10px",
                  boxShadow: "0 4px 12px rgba(0, 128, 0, 0.3)",
                  fontFamily: "'Itim', cursive",
                  fontSize: "1.2rem",
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
            <TableContainer component={Paper} sx={{ maxHeight: "400px", overflowY: "auto" }}>
              {address === "" ? (
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell sx={cellCrossPlatform}>
                        Please connect your wallet
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              ) : buyOrdersAccount === null ? (
                <Table sx={{ width: "100%" }} aria-label="order table">
                  <TableBody>
                    <TableRow>
                      <TableCell sx={cellCrossPlatform}>No order</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              ) : (
                <Table sx={{ width: "100%" }} aria-label="order table">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={cellCrossPlatform}>BGT Price</TableCell>
                      <TableCell sx={cellCrossPlatform}>BGT Amount</TableCell>
                      <TableCell sx={cellCrossPlatform}>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {buyOrdersAccount.map((order, index) => (
                      <TableRow key={order.order_id || index}>
                        <TableCell sx={cellCrossPlatform}>
                          $ {formatNormalAmount(order.price)}
                        </TableCell>
                        <TableCell sx={cellCrossPlatform}>
                          <CircularPercentage
                            filled={+order.filled_bgt_amount}
                            total={+order.bgt_amount}
                          />
                        </TableCell>
                        <TableCell sx={cellCrossPlatform}>
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
            <TablePagination
              style={{ backgroundColor: "white" }}
              component="div"
              count={totalPersonalBuy}
              page={pagePersonalBuy}
              onPageChange={handleChangePagePersonalBuy}
              rowsPerPage={rowsPerPagePersonalBuy}
              onRowsPerPageChange={handleChangeRowsPerPagePersonalBuy}
              rowsPerPageOptions={[5, 10, 25, 50]}
              labelRowsPerPage="Size :"
              labelDisplayedRows={({ from, to, count }) =>
                `${from} to ${to} ( ${count} items )`
              }
              sx={{
                color: "#222",
                fontFamily: "'Itim', cursive",
                "& .MuiTablePagination-caption": {
                  color: "#222",
                  fontFamily: "'Itim', cursive",
                },
                "& .MuiTablePagination-selectLabel": {
                  color: "#222",
                  fontFamily: "'Itim', cursive",
                },
                "& .MuiTablePagination-select": {
                  color: "#222",
                  fontFamily: "'Itim', cursive",
                },
                "& .MuiTablePagination-actions": {
                  color: "white !important",
                  fontFamily: "'Itim', cursive",
                },
                "& .MuiTablePagination-displayedRows": {
                  color: "#222",
                  fontFamily: "'Itim', cursive",
                },
                "& .MuiTablePagination-actions .MuiSvgIcon-root": {
                  color: "#222",
                },
                textAlign: "center",
              }}
            />
          </>
        ) : (
          <>
            <TableContainer component={Paper} sx={{ maxHeight: "400px", overflowY: "auto" }}>
              {address === "" ? (
                <Table sx={{ width: "100%" }} aria-label="order table">
                  <TableBody>
                    <TableRow>
                      <TableCell sx={cellCrossPlatform}>
                        Please connect your wallet
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              ) : sellOrdersAccount === null ? (
                <Table sx={{ width: "100%" }} aria-label="order table">
                  <TableBody>
                    <TableRow>
                      <TableCell sx={cellCrossPlatform}>No order</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              ) : (
                <Table sx={{ width: "100%" }} aria-label="order table">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={cellCrossPlatform}>Premium</TableCell>
                      <TableCell sx={cellCrossPlatform}>Sold Amount</TableCell>
                      <TableCell sx={cellCrossPlatform}>Profit</TableCell>
                      <TableCell sx={cellCrossPlatform}>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sellOrdersAccount.map((order, index) => (
                      <TableRow key={order.order_id || index}>
                        <TableCell sx={cellCrossPlatform}>{(order.markup - 10000) / 100}%</TableCell>
                        <TableCell sx={cellCrossPlatform}>
                          {+order.unclaimed_bgt < 0.01
                            ? "<0.01"
                            : +order.unclaimed_bgt == 0
                              ? "0.00"
                              : (+order.unclaimed_bgt).toFixed(3)}
                        </TableCell>
                        <TableCell sx={cellCrossPlatform}>
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
            <TablePagination
              style={{ backgroundColor: "white" }}
              component="div"
              count={totalPersonalSell}
              page={pagePersonalSell}
              onPageChange={handleChangePagePersonalSell}
              rowsPerPage={rowsPerPagePersonalSell}
              onRowsPerPageChange={handleChangeRowsPerPagePersonalSell}
              rowsPerPageOptions={[5, 10, 25, 50, 100]}
              labelRowsPerPage="Size :"
              labelDisplayedRows={({ from, to, count }) =>
                `${from} to ${to} ( ${count} items )`
              }
              sx={{
                color: "#222",
                fontFamily: "'Itim', cursive",
                "& .MuiTablePagination-caption": {
                  color: "#222",
                  fontFamily: "'Itim', cursive",
                },
                "& .MuiTablePagination-selectLabel": {
                  color: "#222",
                  fontFamily: "'Itim', cursive",
                },
                "& .MuiTablePagination-select": {
                  color: "#222",
                  fontFamily: "'Itim', cursive",
                },
                "& .MuiTablePagination-actions": {
                  color: "#222",
                  fontFamily: "'Itim', cursive",
                },
                "& .MuiTablePagination-displayedRows": {
                  color: "#222",
                  fontFamily: "'Itim', cursive",
                },
                textAlign: "center",
              }}
            />
          </>
        )}
      </Box>
    </Container>
  );
};

export default PersonalOrders;
