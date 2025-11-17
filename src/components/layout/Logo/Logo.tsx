import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import React from "react";

interface LogoProps {
  open: boolean;
  logoImage?: string;
  logoText?: string;
}

const Logo: React.FC<LogoProps> = ({ 
  open, 
  logoImage = "https://via.placeholder.com/150", 
  logoText = "BarChart Demo" 
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: open ? "center" : "center",
        padding: 2,
      }}
    >
      {open && logoImage && (
        <Box
          component="img"
          src={logoImage}
          alt="logo"
          sx={{
            maxWidth: "120px",
            height: "auto",
            marginRight: logoText ? 1 : 0,
          }}
        />
      )}
      {!open && logoImage && (
        <Box
          component="img"
          src={logoImage}
          alt="logo"
          sx={{
            width: "32px",
            height: "32px",
          }}
        />
      )}
      {open && logoText && (
        <Typography variant="h6" sx={{ fontWeight: 600, color: "#fc7b00" }}>
          {logoText}
        </Typography>
      )}
    </Box>
  );
};

export default Logo;