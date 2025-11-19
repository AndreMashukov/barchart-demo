import React from "react";
import Box from "@mui/material/Box";
import AddIcon from "@mui/icons-material/Add";
import Fade from "@mui/material/Fade";
import { TileType } from "../../../config/availableTiles";

interface TilePlaceholderProps {
  type: TileType;
  onClick: () => void;
}

const TilePlaceholder: React.FC<TilePlaceholderProps> = ({ type, onClick }) => {
  return (
    <Fade in={true} timeout={500}>
      <Box
        onClick={onClick}
        sx={{
          width: "100%",
          minHeight: type === "Type1" ? "150px" : "200px",
          height: "100%",
          border: "2px dashed",
          borderColor: "grey.400",
          borderRadius: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          backgroundColor: "grey.50",
          transition: "all 0.3s ease",
          "&:hover": {
            borderColor: "primary.main",
            backgroundColor: "grey.100",
            "& .add-icon": {
              color: "primary.main",
              transform: "scale(1.1)",
            },
          },
        }}
      >
        <AddIcon
          className="add-icon"
          sx={{
            fontSize: 48,
            color: "grey.400",
            transition: "all 0.3s ease",
          }}
        />
      </Box>
    </Fade>
  );
};

export default TilePlaceholder;
