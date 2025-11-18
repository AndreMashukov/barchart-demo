import Typography from "@mui/material/Typography";
import {SxProps, Theme, useTheme} from "@mui/material/styles";

interface TileLabelProps {
  label?: string;
  color?: string;
  selected?: boolean;
  labelStyle?: SxProps<Theme>;
}

const TileLabel = ({label, color, selected, labelStyle}: TileLabelProps) => {
  const theme = useTheme();

  return (
    <Typography
      sx={{
        fontSize: "0.8rem",
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
  );
};

export default TileLabel;
