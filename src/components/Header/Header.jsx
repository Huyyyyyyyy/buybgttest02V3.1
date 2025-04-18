import { Container } from "@mui/material";
import Menu from "./Menu";

const Header = () => {
  return (
    <Container
      style={{
        maxWidth: "100%",
        position: "fixed",
        backdropFilter: "blur(10px)",
        backgroundColor: "rgba(104, 77, 2, 0.2)",
        zIndex: 99,
      }}
    >
      <Menu></Menu>
    </Container>
  );
};

export default Header;
