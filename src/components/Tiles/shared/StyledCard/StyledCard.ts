import Card from "@mui/material/Card";
import {styled} from "@mui/material/styles";

// Define the props interface for StyledCard
interface StyledCardProps {
  backgroundColor: string;
  clickable?: boolean;
  selected?: boolean;
  error?: boolean;
}

// Create the styled component with TypeScript
const StyledCard = styled(Card)<StyledCardProps>(
  ({theme, backgroundColor, clickable, selected, error}) => ({
    background: backgroundColor,
    borderRadius: theme.spacing(2),
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    ...(selected && {
      transform: "translateY(-5px)",
      boxShadow: `0 10px 20px rgba(0, 0, 0, 0.4)`,
      border: `2px solid ${theme.palette.primary.dark}`,
      background: backgroundColor,
    }),
    ...(error && {
      boxShadow: `0 0 15px ${theme.palette.error.main}80, 0 0 30px ${theme.palette.error.main}40`,
      animation: "pulse 2s ease-in-out infinite",
      "@keyframes pulse": {
        "0%, 100%": {
          boxShadow: `0 0 15px ${theme.palette.error.main}80, 0 0 30px ${theme.palette.error.main}40`,
        },
        "50%": {
          boxShadow: `0 0 25px ${theme.palette.error.main}, 0 0 50px ${theme.palette.error.main}60`,
        },
      },
    }),
    transition: "all 0.3s ease-in-out",
    ...(clickable && {
      cursor: "pointer",
      "&:hover": {
        background: `${backgroundColor}80`,
        transform: "translateY(-5px)",
        boxShadow: `0 10px 20px rgba(0, 0, 0, 0.1)`,
      },
    }),
  })
);

export default StyledCard;
