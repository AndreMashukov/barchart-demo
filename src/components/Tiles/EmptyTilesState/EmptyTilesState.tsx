import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import EditIcon from "@mui/icons-material/Edit";
import Fade from "@mui/material/Fade";

const EmptyTilesState: React.FC = () => {
  return (
    <Fade in={true} timeout={800}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          py: 8,
          px: 3,
        }}
      >
        <EditIcon
          sx={{
            fontSize: 64,
            color: "grey.400",
            mb: 2,
          }}
        />
        <Typography variant="h6" color="text.secondary" sx={{ textAlign: "center", mb: 1 }}>
          No tiles configured yet
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center" }}>
          Switch to edit mode to add tiles to your dashboard
        </Typography>
      </Box>
    </Fade>
  );
};

export default EmptyTilesState;
