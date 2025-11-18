import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import {SxProps, Theme} from "@mui/material/styles";
import {Stack} from "@mui/material";
import {SparklineLineChart} from "../../charts/SparklineLineChart/SparklineLineChart";
import CardContainer from "../shared/CardContainer/CardContainer";
import TileLabel from "../shared/TileLabel/TileLabel";

interface SparklineTileLineRowProps {
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
  sparklineData: Array<{
    date: string;
    value: number;
  }>;
  sparklineHeight?: number;
  sparklineWidth?: number;
  width?: string;
  height?: string;
}

const SparklineTileLineRow = ({
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
  sparklineHeight = 80,
  sparklineWidth = 100,
  width = "100%",
  height = "100%",
}: SparklineTileLineRowProps) => {
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
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
      >
        <Stack direction="column" spacing={1}>
          {loading ? (
            <Stack
              direction="column"
              spacing={2}
              alignItems="center"
              sx={{
                position: "relative",
                left: "38%",
              }}
            >
              <CircularProgress size={48} sx={{color}} />
              <TileLabel
                label={label}
                color={color}
                selected={selected}
                labelStyle={labelStyle}
              />
            </Stack>
          ) : (
            <Stack direction="column" spacing={1} alignItems="center">
              <Typography
                variant="h2"
                sx={{
                  lineHeight: 1,
                  ...countStyle,
                }}
                color={color}
              >
                {count || 0}
              </Typography>

              <TileLabel
                label={label}
                color={color}
                selected={selected}
                labelStyle={labelStyle}
              />
            </Stack>
          )}
        </Stack>

        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          height={sparklineHeight}
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
      </Stack>
    </CardContainer>
  );
};

export default SparklineTileLineRow;
