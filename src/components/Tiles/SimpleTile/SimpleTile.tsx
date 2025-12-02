import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import {SxProps, Theme, useTheme} from "@mui/material/styles";
import CardContainer from "../shared/CardContainer/CardContainer";

interface SimpleTileProps {
  count?: number;
  label?: string;
  loading?: boolean;
  color?: string;
  backgroundColor: string;
  clickable?: boolean;
  selected?: boolean;
  error?: boolean;
  onClick?: () => void;
  labelStyle?: SxProps<Theme>;
  countStyle?: SxProps<Theme>;
  width?: string;
  height?: string;
}

const SimpleTile = ({
  count,
  label,
  loading,
  color,
  backgroundColor,
  clickable,
  selected,
  error,
  onClick,
  labelStyle,
  countStyle,
  width = "100%",
  height = "100%",
}: SimpleTileProps) => {
  const theme = useTheme();
  return (
    <CardContainer
      backgroundColor={backgroundColor}
      clickable={clickable}
      onClick={onClick}
      selected={selected}
      error={error}
      contentSx={{
        width,
        height,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "8px",
        "&:last-child": {
          paddingBottom: "8px",
        },
      }}
    >
      <Typography
        variant="h2"
        sx={{
          textAlign: "center",
          marginBottom: 0,
          paddingBottom: 0,
          lineHeight: 1,
          ...countStyle,
        }}
        color={color}
      >
        {loading ? <CircularProgress sx={{color}} /> : count || 0}
      </Typography>
      <Typography
        sx={{
          fontSize: "0.8rem",
          textAlign: "center",
          marginTop: theme.spacing(0.5),
          marginBottom: 0,
          paddingBottom: 0,
          lineHeight: "0.8rem",
          ...(selected && {
            textDecoration: "underline",
            fontWeight: "bold",
          }),
          [theme.breakpoints.up("sm")]: {
            fontSize: "1rem",
            lineHeight: "1rem",
            ...labelStyle,
          },
        }}
        color={color}
      >
        # {label}
      </Typography>
    </CardContainer>
  );
};

export default SimpleTile;
