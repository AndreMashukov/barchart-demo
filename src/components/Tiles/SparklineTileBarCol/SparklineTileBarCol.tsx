import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import {SxProps, Theme, useTheme} from "@mui/material/styles";
import {Stack} from "@mui/material";
import {SparklineBarChart} from "../../charts/SparklineBarChart/SparklineBarChart";
import CardContainer from "../shared/CardContainer/CardContainer";
import TileLabel from "../shared/TileLabel/TileLabel";

interface SparklineTileBarColProps {
  count?: number;
  label?: string;
  loading?: boolean;
  color?: string;
  backgroundColor: string;
  clickable?: boolean;
  selected?: boolean;
  onClick?: () => void;
  labelStyle?: SxProps<Theme>;
  countStyle?: SxProps<Theme>;
  sparklineData: number[];
  sparklineHeight?: number;
  sparklineWidth?: number;
  highlightRange?: [number, number];
  highlightColor?: string;
  width?: string;
  height?: string;
}

const SparklineTileBarCol = ({
  count,
  label,
  loading,
  color,
  backgroundColor,
  clickable,
  selected,
  onClick,
  labelStyle,
  countStyle,
  sparklineData,
  sparklineHeight = 40,
  sparklineWidth = 200,
  highlightRange,
  highlightColor,
  width = "100%",
  height = "100%",
}: SparklineTileBarColProps) => {
  const theme = useTheme();

  return (
    <CardContainer
      backgroundColor={backgroundColor}
      clickable={clickable}
      onClick={onClick}
      selected={selected}
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
          <SparklineBarChart
            width={sparklineWidth}
            height={sparklineHeight}
            color={color}
            highlightColor={highlightColor}
            data={sparklineData}
            highlightRange={highlightRange}
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

export default SparklineTileBarCol;
