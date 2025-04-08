import {
  Container,
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
import { useContext } from "react";
import { WalletContext } from "../../../context/WalletContext";
import OrdersMarket from "./OrdersMarket";

const Market = () => {
  const {
    toggle: { activeTab },
    toggleFunctions: { setActiveTab },
  } = useContext(WalletContext);

  return (
    <Container
      sx={{
        maxWidth: { xs: "98%", md: "90%", lg: "60%" },
        bgcolor: "black",
        opacity: "0.8",
        borderRadius: { xs: "10px", md: "15px", lg: "15px" },
        padding: "10px",
        boxShadow: "0 8px 30px rgba(0,0,0,0.1)",
        marginTop: "7%",
        color: "black",
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
          borderRadius: "999px",
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
      <OrdersMarket></OrdersMarket>
    </Container>
  );
};

export default Market;
