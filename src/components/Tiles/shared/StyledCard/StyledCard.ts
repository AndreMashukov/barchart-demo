import Card from "@mui/material/Card";
import {styled} from "@mui/material/styles";

// Define the props interface for StyledCard
interface StyledCardProps {
  backgroundColor: string;
  clickable?: boolean;
  selected?: boolean;
}

// Create the styled component with TypeScript
const StyledCard = styled(Card)<StyledCardProps>(
  ({theme, backgroundColor, clickable, selected}) => ({
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
