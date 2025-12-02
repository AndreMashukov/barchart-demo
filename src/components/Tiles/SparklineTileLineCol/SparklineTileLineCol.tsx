import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import {SxProps, Theme, useTheme} from "@mui/material/styles";
import {Stack} from "@mui/material";
import {SparklineLineChart} from "../../charts/SparklineLineChart/SparklineLineChart";
import CardContainer from "../shared/CardContainer/CardContainer";
import TileLabel from "../shared/TileLabel/TileLabel";

interface SparklineTileLineColProps {
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
  sparklineData: Array<{
    date: string;
    value: number;
  }>;
  sparklineHeight?: number;
  sparklineWidth?: number;
  width?: string;
  height?: string;
}

const SparklineTileLineCol = ({
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
  sparklineData,
  sparklineHeight = 40,
  sparklineWidth = 200,
  width = "100%",
  height = "100%",
}: SparklineTileLineColProps) => {
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
      }}
    >
      <Typography
        variant="h2"
        sx={{
          textAlign: "center",
          marginBottom: theme.spacing(1),
          paddingBottom: 0,
          lineHeight: 1,
          ...countStyle,
        }}
        color={color}
      >
        {loading ? (
          <CircularProgress
            size={48}
            sx={{color, position: "relative", top: 24}}
          />
        ) : (
          count || 0
        )}
      </Typography>

      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        height={sparklineHeight}
        marginBottom={theme.spacing(1)}
      >
        {!loading && (
          <SparklineLineChart
            width={sparklineWidth}
            height={sparklineHeight}
            color={color}
            data={sparklineData}
          />
        )}
        {loading && (
          <div style={{height: sparklineHeight, width: sparklineWidth}} />
        )}
      </Stack>

      <TileLabel
        label={label}
        color={color}
        selected={selected}
        labelStyle={labelStyle}
      />
    </CardContainer>
  );
};

export default SparklineTileLineCol;
