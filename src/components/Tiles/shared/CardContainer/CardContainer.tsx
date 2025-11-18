import CardContent from "@mui/material/CardContent";
import {SxProps, Theme} from "@mui/material/styles";
import StyledCard from "../StyledCard/StyledCard";

interface CardContainerProps {
  backgroundColor: string;
  clickable?: boolean;
  selected?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  contentSx?: SxProps<Theme>;
}

const CardContainer = ({
  backgroundColor,
  clickable,
  selected,
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
    >
      <CardContent sx={contentSx}>{children}</CardContent>
    </StyledCard>
  );
};

export default CardContainer;
