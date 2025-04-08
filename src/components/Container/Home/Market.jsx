import { Container, Box } from "@mui/material";
import OrdersMarket from "./OrdersMarket";
import PersonalOrders from "./PersonalOrders";

const Market = () => {
  return (
    <Container
      sx={{
        maxWidth: { xs: "98%", md: "90%", lg: "90%" },
        marginTop: "20%",
        marginBottom: "5%",
        color: "black",
        alignItems: "center",
        padding: "0 !important",
      }}
    >
      <Box sx={{ display: { xs: "grid", md: "grid", lg: "flex" } }}>
        <Box sx={{ flex: 2 }}>
          <OrdersMarket />
        </Box>
        <Box sx={{ flex: 1 }}>
          <PersonalOrders />
        </Box>
      </Box>
    </Container>
  );
};

export default Market;
