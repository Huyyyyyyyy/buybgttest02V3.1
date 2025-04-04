import { Container } from "@mui/material";

const Footer = () => {
  return (
    <footer style={{ backgroundColor: "#161618" }}>
      <Container
        style={{
          backgroundColor: "#161618",
          padding: "10px 50px",
          display: "flex",
          margin: 0,
          width: "100%",
        }}
      >
        <span
          style={{ color: "#A8B1FF", fontWeight: 600, paddingRight: "20px" }}
        >
          TIAui
        </span>
        <span style={{ color: "#FFFFF5DB" }}>
          An interactive learning project from Thinkster. Code & design licensed
          under MIT.
        </span>
      </Container>
    </footer>
  );
};

export default Footer;
