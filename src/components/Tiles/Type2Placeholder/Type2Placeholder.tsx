import React from "react";
import Box from "@mui/material/Box";
import AddIcon from "@mui/icons-material/Add";
import Fade from "@mui/material/Fade";

interface Type2PlaceholderProps {
  onQuadrantClick: (quadrant: number) => void;
  onCenterClick: () => void;
}

const Type2Placeholder: React.FC<Type2PlaceholderProps> = ({ onQuadrantClick, onCenterClick }) => {
  return (
    <Fade in={true} timeout={500}>
      <Box
        sx={{
          width: "100%",
          minHeight: "200px",
          height: "100%",
          border: "2px dashed",
          borderColor: "grey.400",
          borderRadius: 2,
          backgroundColor: "grey.50",
          position: "relative",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gridTemplateRows: "1fr 1fr",
          gap: 1,
          p: 1,
        }}
      >
        {/* Top-Left Quadrant */}
        <Box
          onClick={(e) => {
            e.stopPropagation();
            onQuadrantClick(0);
          }}
          sx={{
            border: "1px dashed",
            borderColor: "grey.300",
            borderRadius: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "all 0.3s ease",
            "&:hover": {
              borderColor: "primary.main",
              backgroundColor: "grey.100",
              "& .add-icon": {
                color: "primary.main",
                transform: "scale(1.2)",
              },
            },
          }}
        >
          <AddIcon
            className="add-icon"
            sx={{
              fontSize: 32,
              color: "grey.400",
              transition: "all 0.3s ease",
            }}
          />
        </Box>

        {/* Top-Right Quadrant */}
        <Box
          onClick={(e) => {
            e.stopPropagation();
            onQuadrantClick(1);
          }}
          sx={{
            border: "1px dashed",
            borderColor: "grey.300",
            borderRadius: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "all 0.3s ease",
            "&:hover": {
              borderColor: "primary.main",
              backgroundColor: "grey.100",
              "& .add-icon": {
                color: "primary.main",
                transform: "scale(1.2)",
              },
            },
          }}
        >
          <AddIcon
            className="add-icon"
            sx={{
              fontSize: 32,
              color: "grey.400",
              transition: "all 0.3s ease",
            }}
          />
        </Box>

        {/* Bottom-Left Quadrant */}
        <Box
          onClick={(e) => {
            e.stopPropagation();
            onQuadrantClick(2);
          }}
          sx={{
            border: "1px dashed",
            borderColor: "grey.300",
            borderRadius: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "all 0.3s ease",
            "&:hover": {
              borderColor: "primary.main",
              backgroundColor: "grey.100",
              "& .add-icon": {
                color: "primary.main",
                transform: "scale(1.2)",
              },
            },
          }}
        >
          <AddIcon
            className="add-icon"
            sx={{
              fontSize: 32,
              color: "grey.400",
              transition: "all 0.3s ease",
            }}
          />
        </Box>

        {/* Bottom-Right Quadrant */}
        <Box
          onClick={(e) => {
            e.stopPropagation();
            onQuadrantClick(3);
          }}
          sx={{
            border: "1px dashed",
            borderColor: "grey.300",
            borderRadius: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "all 0.3s ease",
            "&:hover": {
              borderColor: "primary.main",
              backgroundColor: "grey.100",
              "& .add-icon": {
                color: "primary.main",
                transform: "scale(1.2)",
              },
            },
          }}
        >
          <AddIcon
            className="add-icon"
            sx={{
              fontSize: 32,
              color: "grey.400",
              transition: "all 0.3s ease",
            }}
          />
        </Box>

        {/* Center Circle for Type2 */}
        <Box
          onClick={(e) => {
            e.stopPropagation();
            onCenterClick();
          }}
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 64,
            height: 64,
            borderRadius: "50%",
            border: "2px solid",
            borderColor: "grey.400",
            backgroundColor: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: 2,
            transition: "all 0.3s ease",
            zIndex: 10,
            "&:hover": {
              borderColor: "primary.main",
              backgroundColor: "primary.light",
              boxShadow: 4,
              transform: "translate(-50%, -50%) scale(1.1)",
              "& .center-icon": {
                color: "primary.main",
              },
            },
          }}
        >
          <AddIcon
            className="center-icon"
            sx={{
              fontSize: 40,
              color: "grey.500",
              transition: "all 0.3s ease",
            }}
          />
        </Box>
      </Box>
    </Fade>
  );
};

export default Type2Placeholder;
