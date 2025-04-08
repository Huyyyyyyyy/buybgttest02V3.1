import {
  Box,
  Button,
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
    },
    walletFunctions: {
      setOrderType,
      setBeraPrice,
      setAmountByPercentage,
      createOrder,
      setSelectedVault,
      getBeraPrice,
      setSelectedPercentage,
    },
  } = useContext(WalletContext);

  useEffect(() => {
    getBeraPrice();
  }, [loadingContractStatus]);

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
                  value={amountToBuy}
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
                <Typography variant="body2">Honey to pay (≥ 10.00)</Typography>
              </Box>
              <Button
                variant="contained"
                color="success"
                onClick={createOrder}
                fullWidth
                disabled={buyStatus === "Success" ? false : true}
                sx={{
                  py: 1.5,
                  fontWeight: "bold",
                  borderRadius: "20px",
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
              {/* <FormControl fullWidth sx={{ mb: 2 }}>
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
              </FormControl> */}

              {/* <Box
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
                  BERA Price:{" "}
                  {beraPrice ? `$${parseFloat(beraPrice).toFixed(2)}` : "N/A"}
                </Typography>
              </Box> */}

              {/* <Box
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
              </Box> */}

              {/* <Box
                sx={{
                  mb: 2,
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Typography variant="body2">BGT in vault (≥0.01)</Typography>
              </Box> */}

              {/* <Box
                sx={{
                  mb: 2,
                  display: "flex",
                  justifyContent: "space-between",
                }}
              ></Box> */}

              {/* <Button
                variant="contained"
                color="success"
                onClick={createOrder}
                fullWidth
                disabled={sellStatus === "Success" ? false : true}
                sx={{
                  py: 1.5,
                  fontWeight: "bold",
                  borderRadius: "20px",
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
              </Button> */}
            </>
          )
        ) : orderType === "Buy Orders" ? (
          <>
            {/* <TableContainer component={Paper}>
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
            <TablePagination
              style={{ backgroundColor: "white" }}
              component="div"
              count={totalPersonalBuy}
              page={pagePersonalBuy}
              onPageChange={handleChangePagePersonalBuy}
              rowsPerPage={rowsPerPagePersonalBuy}
              onRowsPerPageChange={handleChangeRowsPerPagePersonalBuy}
              rowsPerPageOptions={[5, 10, 25, 50]}
            /> */}
          </>
        ) : (
          <>
            {/* <TableContainer component={Paper}>
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
            <TablePagination
              style={{ backgroundColor: "white" }}
              component="div"
              count={totalPersonalSell}
              page={pagePersonalSell}
              onPageChange={handleChangePagePersonalSell}
              rowsPerPage={rowsPerPagePersonalSell}
              onRowsPerPageChange={handleChangeRowsPerPagePersonalSell}
              rowsPerPageOptions={[5, 10, 25, 50, 100]}
            /> */}
          </>
        )}
      </Box>
    </Container>
  );
};

export default PersonalOrders;
