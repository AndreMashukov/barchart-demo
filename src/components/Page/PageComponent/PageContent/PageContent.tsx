import React from "react";
import { Box, Container, Typography } from "@mui/material";

interface PageContentProps {
  title?: string;
  children: React.ReactNode;
  hideGreeting?: boolean;
  userName?: string;
}

const PageContent: React.FC<PageContentProps> = ({ 
  title, 
  children, 
  hideGreeting = false,
  userName = "User"
}) => {
  const handleGreeting = () => {
    const currHours = new Date().getHours();
    if (currHours < 12) {
      return "Good Morning";
    }
    if (currHours < 18) {
      return "Good Afternoon";
    }
    return "Good Evening";
  };

  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{
        padding: "10px 0px 0px 0px",
        display: "flex",
        flexDirection: "column",
        flex: 1,
        height: "100%",
      }}
    >
      {!hideGreeting && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "baseline",
            mb: 2,
          }}
        >
          <Box>
            <Typography variant="body1" gutterBottom sx={{ pl: "5px" }}>
              {handleGreeting()}, {userName}
            </Typography>
            {title && (
              <Typography
                variant="h5"
                gutterBottom
                sx={{ fontWeight: "bold", pl: "5px" }}
              >
                {title}
              </Typography>
            )}
          </Box>
          <Box></Box>
        </Box>
      )}

      <Box
        sx={{
          bgcolor: "white",
          padding: "25px",
          borderRadius: "8px",
          boxShadow: 2,
          marginBottom: "15px",
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {children}
      </Box>
    </Container>
  );
};

export default PageContent;