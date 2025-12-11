import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

interface BoundaryLineIndicatorProps {
  /** The vertical position in pixels where the boundary line should be displayed */
  topPosition: number;
  /** Optional custom message to display. Defaults to "Boundary - tiles beyond this line will be removed" */
  message?: string;
}

const BoundaryLineIndicator: React.FC<BoundaryLineIndicatorProps> = ({
  topPosition,
  message = "Boundary - tiles beyond this line will be removed",
}) => {
  return (
    <Box
      sx={{
        position: "absolute",
        top: `${topPosition}px`,
        left: 0,
        right: 0,
        height: "2px",
        backgroundColor: "#ff4444",
        zIndex: 1000,
        pointerEvents: "none",
        boxShadow: "0 0 8px rgba(255, 68, 68, 0.6)",
        "&::before": {
          content: '""',
          position: "absolute",
          left: 0,
          right: 0,
          top: "-1px",
          height: "4px",
          background: "linear-gradient(to bottom, transparent, rgba(255, 68, 68, 0.3), transparent)",
        },
      }}
    >
      <Typography
        variant="caption"
        sx={{
          position: "absolute",
          left: 8,
          top: -20,
          color: "#ff4444",
          fontSize: "0.75rem",
          fontWeight: "bold",
          // backgroundColor: "rgba(255, 255, 255, 0.9)",
          padding: "2px 6px",
          borderRadius: "4px",
          whiteSpace: "nowrap",
        }}
      >
        {message}
      </Typography>
    </Box>
  );
};

export default BoundaryLineIndicator;

