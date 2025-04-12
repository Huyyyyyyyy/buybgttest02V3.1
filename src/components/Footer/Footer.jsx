import { Box, Container, Typography } from "@mui/material";

const Footer = () => {
  return (
    <footer>
      <Container
        sx={{
          backgroundColor: "rgba(104, 77, 2, 0.8)",
          padding: "5px 10px",
          display: "flex",
          alignItems: "center",
          fontFamily: "Itim, cursive",
          maxWidth: "100% !important",
        }}
      >
        <Box
          sx={{
            width: { xs: "15%", sm: "7%", md: "5%", lg: "5%" },
            display: "flex",
            justifyContent: "center",
            marginRight: "20px",
          }}
        >
          <img
            src="https://dr9rfdtcol2ay.cloudfront.net/assets/TTT.png"
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
          }}
        >
          Trade BGT tokens easily and securely before claim time. Join the
          peer-to-peer (C2C) BGT pre-claim marketplace today.
        </Typography>
      </Container>
    </footer>
  );
};

export default Footer;
