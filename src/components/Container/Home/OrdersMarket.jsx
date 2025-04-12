import {
  Box,
  Button,
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
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { useContext, useEffect } from "react";
import { WalletContext } from "../../../context/WalletContext";
import {
  calculatePremium,
  estimatedToPay,
  formatAddress,
  formatBgtAmount,
  formatNormalAmount,
  formatTime,
} from "../../../utils/Utils";

const OrdersMarket = () => {
  const {
    walletData: {
      address,
      orders,
      vaultForFill,
      beraPrice,
      loadingContractStatus,
      vaultsWithBalance,
    },
    walletFunctions: {
      setVaultForFill,
      loadWalletBalance,
      fetchOrders,
      fillBuyOrder,
      fillSellOrder,
    },
    paginationData: { page, rowsPerPage, total },
    paginationFunctions: { handleChangePage, handleChangeRowsPerPage },
    toggle: { activeTab },
    toggleFunctions: { setActiveTab },
  } = useContext(WalletContext);

  //load the orders of market if page of new tab changing
  useEffect(() => {
    if (address !== "") {
      fetchOrders(page, rowsPerPage);
    }
  }, [page, rowsPerPage, activeTab, address]);
  //load the orders of market if page of new tab changing

  //load the balance if contract loaded completely
  useEffect(() => {
    if (loadingContractStatus === true) {
      loadWalletBalance();
    }
  }, [loadingContractStatus]);
  //load the balance if contract loaded completely

  //custom style for common cells
  const cellCrossPlatform = {
    fontFamily: "'Itim', cursive",
    color: "#FFD700",
    fontWeight: "bold",
    border: 0,
    width: "25%",
    fontSize: { xs: "13px", sm: "15px", md: "18px", lg: "18px" },
    textAlign: "center",
    padding: "0",
  };

  const cellNonMobile = {
    fontFamily: "Itim, cursive",
    color: "#FFD700",
    fontWeight: "bold",
    border: 0,
    fontSize: "20px",
    width: "20%",
    display: { xs: "none", sm: "none", md: "table-cell", lg: "table-cell" },
    textAlign: "center",
    padding: "0",
  };

  const cellValueCrossPlatform = {
    fontSize: { xs: "15px", sm: "15px", md: "18px", lg: "16px" },
    fontFamily: "'Itim', cursive",
    textAlign: "center",
    alignItems: "center",
    color: "#fff",
    border: 0,
    padding: 0,
  };

  const cellValueNoneMobile = {
    display: { xs: "none", sm: "none", md: "table-cell", lg: "table-cell" },
    fontFamily: "'Itim', cursive",
    textAlign: "center",
    alignItems: "center",
    color: "#fff",
    border: 0,
    padding: 0,
  };
  //end custom style for common cells

  return (
    <Box
      sx={{
        maxWidth: "100%",
        bgcolor: "black",
        opacity: "0.8",
        borderRadius: { xs: "10px", md: "15px", lg: "15px" },
        boxShadow: "0 8px 30px rgba(0,0,0,0.1)",
        padding: "20px",
        color: "black",
        marginBottom: "15px",
      }}
    >
      <Typography
        variant="h2"
        fontWeight="bold"
        gutterBottom
        textAlign="center"
        sx={{
          fontFamily: "'Itim', cursive",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: { xs: "20px", sm: "40px", md: "60px" },
        }}
      >
        <img
          src="https://dr9rfdtcol2ay.cloudfront.net/assets/BGT.png"
          alt="BGT Icon"
          style={{ width: "10%", marginRight: "10px" }}
        />
        BGT Market
      </Typography>

      <ToggleButtonGroup
        value={activeTab}
        exclusive
        onChange={(event, newValue) => {
          if (newValue != null) {
            setActiveTab(newValue);
          }
        }}
        fullWidth
        sx={{
          mb: 2,
          fontFamily: "Itim, cursive",
          borderRadius: "10px",
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
        <Table
          sx={{ width: "100%", tableLayout: "fixed" }}
          aria-label="order table"
        >
          <TableHead>
            {activeTab === "Buy" && address !== "" ? (
              <TableRow>
                <TableCell sx={cellCrossPlatform}>BGT Amount</TableCell>
                <TableCell sx={cellCrossPlatform}>Premium</TableCell>
                <TableCell sx={cellCrossPlatform}>Est. to pay</TableCell>
                <TableCell sx={cellNonMobile}>Address</TableCell>
                <TableCell sx={cellNonMobile}>Hash</TableCell>
                <TableCell sx={cellNonMobile}>Time</TableCell>
                <TableCell sx={cellCrossPlatform}>Action</TableCell>
              </TableRow>
            ) : activeTab === "Sell" && address !== "" ? (
              <TableRow>
                <TableCell sx={cellCrossPlatform}>BGT Price</TableCell>
                <TableCell sx={cellCrossPlatform}>BGT Amount</TableCell>
                <TableCell sx={cellNonMobile}>Paid</TableCell>
                <TableCell sx={cellNonMobile}>Address</TableCell>
                <TableCell sx={cellNonMobile}>Hash</TableCell>
                <TableCell sx={cellNonMobile}>Time</TableCell>
                <TableCell sx={cellCrossPlatform}>Vault</TableCell>
                <TableCell sx={cellCrossPlatform}>Action</TableCell>
              </TableRow>
            ) : null}
          </TableHead>
          <TableBody>
            {address === "" || orders === null ? (
              <TableRow>
                <TableCell sx={{ border: "none" }}>
                  <Typography
                    sx={{
                      fontSize: "20px",
                      color: "#fff",
                      fontFamily: "'Itim', cursive",
                      textAlign: "center",
                    }}
                  >
                    Please connect your wallet
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order, index) =>
                activeTab === "Buy" ? (
                  <TableRow key={order.order_id || index} sx={{ border: 0 }}>
                    <TableCell sx={cellValueCrossPlatform}>
                      {formatBgtAmount(+order.unclaimed_bgt)}
                      <img
                        src="https://dr9rfdtcol2ay.cloudfront.net/assets/iconBGT.png"
                        alt="icon"
                        style={{
                          width: "20%",
                          verticalAlign: "middle",
                        }}
                      />
                    </TableCell>
                    <TableCell sx={cellValueCrossPlatform}>
                      {calculatePremium(order.markup)}
                    </TableCell>
                    <TableCell sx={cellValueCrossPlatform}>
                      {estimatedToPay(
                        beraPrice,
                        +order.unclaimed_bgt,
                        order.markup
                      )}
                      <img
                        src="https://dr9rfdtcol2ay.cloudfront.net/assets/honey.png"
                        alt="icon"
                        style={{
                          width: "15%",
                          marginLeft: "5px",
                          verticalAlign: "middle",
                        }}
                      />
                    </TableCell>
                    <TableCell sx={cellValueNoneMobile}>
                      {formatAddress(order.address)}
                    </TableCell>
                    <TableCell sx={cellValueNoneMobile}>
                      <a
                        href={`https://berascan.com/tx/${order.evm_tx_hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "#fff", textDecoration: "none" }}
                      >
                        {formatAddress(order.evm_tx_hash)}
                      </a>
                    </TableCell>

                    <TableCell sx={cellValueNoneMobile}>
                      {formatTime(order.time)}
                    </TableCell>
                    <TableCell sx={{ border: "none" }}>
                      <Button
                        variant="contained"
                        color="success"
                        onClick={() =>
                          fillSellOrder(order.order_id, order.amount)
                        }
                        sx={{ borderRadius: "12px", width: "100%" }}
                      >
                        Buy
                      </Button>
                    </TableCell>
                  </TableRow>
                ) : (
                  <TableRow key={order.order_id || index} sx={{ border: 0 }}>
                    <TableCell sx={cellValueCrossPlatform}>
                      ${formatNormalAmount(+order.price)}
                    </TableCell>
                    <TableCell sx={cellValueCrossPlatform}>
                      {formatNormalAmount(+order.filled_bgt_amount)}/
                      {formatNormalAmount(+order.bgt_amount)}
                      <img
                        src="https://dr9rfdtcol2ay.cloudfront.net/assets/iconBGT.png"
                        alt="icon"
                        style={{
                          width: "30%",
                          verticalAlign: "middle",
                        }}
                      />
                    </TableCell>
                    <TableCell sx={cellValueNoneMobile}>
                      {formatNormalAmount(+order.amount)}
                      <img
                        src="https://dr9rfdtcol2ay.cloudfront.net/assets/honey.png"
                        alt="icon"
                        style={{
                          width: 22,
                          height: 22,
                          marginLeft: 7,
                          verticalAlign: "middle",
                        }}
                      />
                    </TableCell>
                    <TableCell sx={cellValueNoneMobile}>
                      {formatAddress(order.address)}
                    </TableCell>
                    <TableCell sx={cellValueNoneMobile}>
                      <a
                        href={`https://berascan.com/tx/${order.evm_tx_hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "#fff", textDecoration: "none" }}
                      >
                        {formatAddress(order.evm_tx_hash)}
                      </a>
                    </TableCell>

                    <TableCell sx={cellValueNoneMobile}>
                      {formatTime(order.time)}
                    </TableCell>
                    <TableCell sx={{ border: 0 }}>
                      <FormControl fullWidth>
                        <InputLabel
                          id={`dropdown-label-${order.order_id}`}
                          sx={{
                            color: "#fff",
                            fontFamily: "'Itim', cursive'",
                          }}
                        >
                          💰
                        </InputLabel>

                        <Select
                          labelId={`dropdown-label-${order.order_id}`}
                          value={vaultForFill}
                          onChange={(e) => setVaultForFill(e.target.value)}
                          label="Choose Vault"
                          sx={{
                            color: "#fff",
                            bgcolor: "rgba(0, 0, 0, 0.1)",
                            fontFamily: "'Itim', cursive'",
                            "& .MuiSvgIcon-root": { color: "#fff" },
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#fff",
                            },
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#fff",
                            },
                            "& .MuiPaper-root": {
                              bgcolor: "rgba(0, 0, 0, 1)",
                            },
                          }}
                          MenuProps={{
                            PaperProps: {
                              sx: {
                                bgcolor: "rgba(0, 0, 0, 1)",
                                "& .MuiMenuItem-root": {
                                  color: "#fff",
                                  bgcolor: "rgba(0, 0, 0, 1)",
                                  "&:hover": { bgcolor: "#333" },
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
                                  bgcolor: "rgba(0, 0, 0, 1)",
                                  color: "#fff",
                                  fontFamily: "'Itim', cursive'",
                                  "&:hover": { bgcolor: "#333" },
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
                                    ({vault.bgtBalance} BGT)
                                  </Typography>
                                </Box>
                              </MenuItem>
                            ) : null
                          )}
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell sx={cellValueCrossPlatform}>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() =>
                          fillBuyOrder(order.order_id, vaultForFill)
                        }
                        sx={{ borderRadius: "12px", width: "100%" }}
                      >
                        Sell
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              )
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {orders.length > 0 ? (
        <TablePagination
          component="div"
          count={total}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50, 100]}
          labelRowsPerPage="Size :"
          labelDisplayedRows={({ from, to, count }) =>
            `${from} to ${to} ( ${count} items )`
          }
          sx={{
            color: "#fff",
            fontFamily: "'Itim', cursive",
            "& .MuiTablePagination-caption": {
              color: "#fff",
              fontFamily: "'Itim', cursive",
            },
            "& .MuiTablePagination-selectLabel": {
              color: "#fff",
              fontFamily: "'Itim', cursive",
            },
            "& .MuiTablePagination-select": {
              color: "#fff",
              fontFamily: "'Itim', cursive",
            },
            "& .MuiTablePagination-actions": {
              color: "#fff",
              fontFamily: "'Itim', cursive",
            },
            "& .MuiTablePagination-displayedRows": {
              color: "#fff",
              fontFamily: "'Itim', cursive",
            },
            textAlign: "center",
          }}
        />
      ) : null}
    </Box>
  );
};

export default OrdersMarket;
