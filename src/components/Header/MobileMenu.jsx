import { useContext } from "react";
import { MobileContext } from "../../context/MobileContext";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";

const MobileMenu = (anchor) => {
  const {
    functions: { toggleDrawer, handleClick },
  } = useContext(MobileContext);
  return (
    <Box
      sx={{ minWidth: "100%" }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List sx={{ minWidth: "100%" }}>
        {["Market", "About TTT", "Delegate for TTT"].map((text) => (
          <ListItem key={text} disablePadding>
            <ListItemButton
              onClick={() =>
                handleClick(
                  text === "Market"
                    ? "https://bgt.zone"
                    : text === "About TTT"
                    ? "https://tienthuattoan.com/"
                    : "https://hub.berachain.com/validators/0x89884fc95abcb82736d768fc8ad4fdf4cb2112496974ae05440d835d0e93216643ae212b365fb6d9d2501d76d0925ef3/"
                )
              }
            >
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default MobileMenu;
