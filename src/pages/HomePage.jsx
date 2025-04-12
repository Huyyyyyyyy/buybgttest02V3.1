import {
  Box,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import Market from "../components/Container/Home/Market";

const HomePage = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        maxWidth: "100%",
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        flexDirection: { xs: "row", md: "row", lg: "column" },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-evenly",
          width: "100%",
        }}
      >
        <Market></Market>
      </Box>
    </Box>
  );
};

export default HomePage;
