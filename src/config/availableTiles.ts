import { indigo, orange, blue, green, purple, teal, pink } from "@mui/material/colors";

export type TileType = "Type1" | "Type2";

export type TileComponentType = "SimpleTile" | "SparklineTileBarCol" | "SparklineTileLineCol";

export type TileDataSource =
  | "totalCharts"
  | "activeUsers"
  | "dataPoints"
  | "uptime"
  | "performanceScore"
  | "revenue"
  | "websiteTraffic";

// Base configuration shared by all tiles
interface BaseTileConfig {
  id: string;
  type: TileType;
  component: TileComponentType;
  label: string;
  color: string;
  backgroundColor: string;
  dataSource: TileDataSource;
}

// Type1 tiles (SimpleTile) - no sparkline data
export interface SimpleTileConfig extends BaseTileConfig {
  type: "Type1";
  component: "SimpleTile";
  dataSource: "totalCharts" | "activeUsers" | "dataPoints" | "uptime";
}

// Type2 tiles with bar sparkline
export interface SparklineBarTileConfig extends BaseTileConfig {
  type: "Type2";
  component: "SparklineTileBarCol";
  dataSource: "performanceScore" | "revenue";
  sparklineHeight?: number;
  sparklineWidth?: number;
  highlightRange?: [number, number];
  highlightColor?: string;
}

// Type2 tiles with line sparkline
export interface SparklineLineTileConfig extends BaseTileConfig {
  type: "Type2";
  component: "SparklineTileLineCol";
  dataSource: "websiteTraffic";
  sparklineHeight?: number;
  sparklineWidth?: number;
}

export type TileConfig = SimpleTileConfig | SparklineBarTileConfig | SparklineLineTileConfig;

// Available tiles configuration
export const availableTiles: TileConfig[] = [
  // Type1 Tiles (SimpleTile)
  {
    id: "tile-total-charts",
    type: "Type1",
    component: "SimpleTile",
    label: "Total Charts",
    color: "white",
    backgroundColor: indigo[900],
    dataSource: "totalCharts",
  },
  {
    id: "tile-active-users",
    type: "Type1",
    component: "SimpleTile",
    label: "Active Users",
    color: "white",
    backgroundColor: orange[700],
    dataSource: "activeUsers",
  },
  {
    id: "tile-data-points",
    type: "Type1",
    component: "SimpleTile",
    label: "Data Points",
    color: "white",
    backgroundColor: blue[500],
    dataSource: "dataPoints",
  },
  {
    id: "tile-uptime",
    type: "Type1",
    component: "SimpleTile",
    label: "Uptime %",
    color: "white",
    backgroundColor: green[600],
    dataSource: "uptime",
  },

  // Type2 Tiles (Sparkline Tiles)
  {
    id: "tile-performance-score",
    type: "Type2",
    component: "SparklineTileBarCol",
    label: "Performance Score",
    color: "white",
    backgroundColor: purple[700],
    dataSource: "performanceScore",
    sparklineHeight: 40,
    sparklineWidth: 200,
    highlightRange: [8, 11],
    highlightColor: purple[300],
  },
  {
    id: "tile-revenue",
    type: "Type2",
    component: "SparklineTileBarCol",
    label: "Revenue (k)",
    color: "white",
    backgroundColor: teal[600],
    dataSource: "revenue",
    sparklineHeight: 40,
    sparklineWidth: 200,
  },
  {
    id: "tile-website-traffic",
    type: "Type2",
    component: "SparklineTileLineCol",
    label: "Website Traffic",
    color: "white",
    backgroundColor: pink[600],
    dataSource: "websiteTraffic",
    sparklineHeight: 40,
    sparklineWidth: 200,
  },
];

// Helper function to get tile config by ID
export const getTileConfigById = (tileId: string): TileConfig | undefined => {
  return availableTiles.find((tile) => tile.id === tileId);
};

// Helper function to get tiles by type
export const getTilesByType = (type: TileType): TileConfig[] => {
  return availableTiles.filter((tile) => tile.type === type);
};
