import { Button, Box, Drawer } from "@mui/material";
import { Fragment, useContext } from "react";
import { WalletContext } from "../../context/WalletContext";
import { MobileContext } from "../../context/MobileContext";
import MenuIcon from "@mui/icons-material/Menu";
import MobileMenu from "./MobileMenu";

const Menu = () => {
  const {
    walletFunctions: { connectWallet },
    walletData: { address },
  } = useContext(WalletContext);

  //for mobile menu sidebar
  const {
    data: { drawer },
    functions: { toggleDrawer },
  } = useContext(MobileContext);
  //end of mobile menu sidebar

  return (
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
      <Box
        sx={{
          display: { md: "none", lg: "none" },
          width: { xs: "30%", sm: "30%", lg: "20%" },
          alignItems: "center",
        }}
      >
        {["left"].map((anchor) => (
          <Fragment key={anchor}>
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
              open={drawer[anchor]}
              onClose={toggleDrawer(anchor, false)}
            >
              <MobileMenu anchor={anchor}></MobileMenu>
            </Drawer>
          </Fragment>
        ))}
      </Box>

      <Box
        sx={{
          width: { xs: "30%", sm: "30%", md: "25%", lg: "25%" },
          display: "flex",
          justifyContent: "center",
        }}
      >
        <img
          src="https://dr9rfdtcol2ay.cloudfront.net/assets/TTT.png"
          alt="logo"
          style={{
            width: "60px",
            height: "60px",
            userSelect: "none",
            alignItems: "center",
          }}
        />
      </Box>

      <Box
        sx={{
          display: { xs: "none", md: "flex", lg: "flex" },
          alignItems: "center",
          justifyContent: "space-between",
          width: { md: "50%", lg: "50%" },
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

        <Button
          variant="text"
          onClick={() => {
            window.open("https://tienthuattoan.com/");
          }}
          sx={{
            color: "#fff",
            fontSize: "20px",
            width: "30%",
            textShadow: `-1px -1px 0 black, -1px 0 black, -1px 1px 0 black, 1px 1px 0 black`,
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
        </Button>

        <Button
          variant="text"
          onClick={() => {
            window.open(
              "https://hub.berachain.com/validators/0x89884fc95abcb82736d768fc8ad4fdf4cb2112496974ae05440d835d0e93216643ae212b365fb6d9d2501d76d0925ef3/"
            );
          }}
          sx={{
            color: "#fff",
            fontSize: "20px",
            width: "30%",
            textShadow: `-1px -1px 0 black, 1px -1px 0 black, -1px 1px 0 black, 1px 1px 0 black`,
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
          <span className="label-1">Delegate</span>
        </Button>
      </Box>

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
        <img
          src="https://dr9rfdtcol2ay.cloudfront.net/assets/iconwallet.png"
          alt="wallet icon"
          style={{
            maxWidth: "15%",
            marginRight: "5px",
          }}
        />
        <Box>
          {address
            ? ` ${address.slice(0, 6)}...${address.slice(38, 42)}`
            : "Connect Wallet"}
        </Box>
      </Button>
    </Box>
  );
};

export default Menu;
