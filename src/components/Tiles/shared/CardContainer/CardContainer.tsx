import CardContent from "@mui/material/CardContent";
import {SxProps, Theme} from "@mui/material/styles";
import StyledCard from "../StyledCard/StyledCard";

interface CardContainerProps {
  backgroundColor: string;
  clickable?: boolean;
  selected?: boolean;
  error?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  contentSx?: SxProps<Theme>;
}

const CardContainer = ({
  backgroundColor,
  clickable,
  selected,
  error,
  onClick,
  children,
  contentSx,
}: CardContainerProps) => {
  return (
    <StyledCard
      backgroundColor={backgroundColor}
      clickable={clickable}
      onClick={onClick}
      selected={selected}
      error={error}
    >
      <CardContent sx={contentSx}>{children}</CardContent>
    </StyledCard>
  );
};

export default CardContainer;
