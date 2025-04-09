import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";

const CircularPercentage = ({ filled, total }) => {
  filled = 1.2;
  let percentage = total > 0 ? (filled / total) * 100 : 0;
  let circleColor = "";
  if (filled === 0) {
    circleColor = "gray";
  } else {
    circleColor = "lime";
  }

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
      <Box position="relative" display="inline-flex">
        <CircularProgress
          variant="determinate"
          value={percentage}
          size={30}
          sx={{
            color: circleColor,
            border: "1px solid gray",
            borderRadius: "50%",
          }}
        />
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: "absolute",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography
            variant="caption"
            component="div"
            color="textSecondary"
            sx={{
              fontFamily: "'Itim', cursive",
              fontWeight: "bold",
              fontSize: "8px",
            }}
          >
            {`${Math.round(percentage)}%`}
          </Typography>
        </Box>
      </Box>
      <Typography
        variant="body2"
        color="textPrimary"
        sx={{
          fontFamily: "'Itim', cursive",
          fontWeight: "bold",
          fontSize: { xs: "13px", sm: "15px", md: "18px", lg: "18px" },
          textAlign: "center",
        }}
      >
        {(+filled).toFixed(2)}/{(+total).toFixed(2)}
      </Typography>
    </Box>
  );
};

export default CircularPercentage;
