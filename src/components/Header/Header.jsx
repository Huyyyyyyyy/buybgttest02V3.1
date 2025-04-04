import { Container } from "@mui/material";
import Menu from "./Menu";

const Header = () => {
  return (
    <Container
      style={{
        position: "fixed",
        backdropFilter: "blur(10px)",
        backgroundColor: "rgba(104, 77, 2, 0.2)",
      }}
    >
      <Menu></Menu>
    </Container>
  );
};

export default Header;
