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

  const {
    data: { drawer },
    functions: { toggleDrawer },
  } = useContext(MobileContext);
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
        padding: "5px 0",
      }}
    >
      <Box sx={{ display: { md: "flex", lg: "none" }, width: { md: "15%" } }}>
        {["left"].map((anchor) => (
          <Fragment key={anchor}>
            <Button onClick={toggleDrawer(anchor, true)}>
              <MenuIcon
                sx={{
                  fontSize: "30px",
                  color: "black",
                  background: "#FFEA00",
                  borderRadius: "10px",
                  padding: "15px",
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
          width: { md: "20%", lg: "10%" },
          display: "flex",
          justifyContent: "center",
        }}
      >
        <img
          src="https://dr9rfdtcol2ay.cloudfront.net/assets/TTT.png"
          alt="logo"
          style={{
            width: "90px",
            height: "90px",
            userSelect: "none",
          }}
        />
      </Box>
      <Box
        sx={{
          display: { xs: "none", md: "none", lg: "flex" },
          alignItems: "center",
          justifyContent: "space-between",
          width: { md: "60%", lg: "70%" },
        }}
      >
        <Button
          variant="text"
          sx={{
            color: "#fff",
            fontSize: { sm: "28px", md: "32px" },
            width: "30%",
            height: "18px",
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

        <Button
          variant="text"
          onClick={() => {
            window.open("https://tienthuattoan.com/");
          }}
          sx={{
            color: "#fff",
            fontSize: "32px",
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
            fontSize: "32px",
            width: "40%",
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
          <span className="label-1">Delegate for TTT</span>
        </Button>
      </Box>

      <Box
        sx={{
          width: { md: "30%", lg: "20%" },
          display: "flex",
          alignItems: "center",
          justifyContent: { md: "flex-end", lg: "space-around" },
        }}
      >
        <Box
          sx={{
            position: "relative",
            paddingTop: "10px",
            display: {
              xs: "none",
              sm: "none",
              md: "none",
              lg: "none",
              xl: "flex",
            },
          }}
        >
          <img
            src="https://dr9rfdtcol2ay.cloudfront.net/assets/iconnetwork.png"
            alt="iconnetwork"
            style={{
              width: { md: "80%", lg: "100%" },
              height: "60px",
              maxWidth: "60px",
              objectFit: "cover",
            }}
          ></img>
          <img
            src="https://dr9rfdtcol2ay.cloudfront.net/assets/icongreen.png"
            alt="icongreen"
            style={{
              width: "12px",
              height: "12px",
              position: "absolute",
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
            zIndex: 10,
            borderRadius: "200px",
            fontFamily: "Itim, cursive",
            padding: "10px 18px",

            "&:hover": {
              backgroundColor: "#fff",
              color: "#000",
              border: "1px solid black",
            },
          }}
        >
          <img
            src="https://dr9rfdtcol2ay.cloudfront.net/assets/iconwallet.png"
            alt="wallet icon"
            style={{
              width: { xs: "60%", sm: "80%", md: "100%" },
              maxWidth: "40px",
              marginRight: "10px",
            }}
          />
          <Box sx={{}}>
            {address
              ? ` ${address.slice(0, 6)}...${address.slice(38, 42)}`
              : "Connect Wallet"}
          </Box>
        </Button>
      </Box>
    </Box>
  );
};

export default Menu;
