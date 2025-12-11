import { indigo, orange, blue, green, purple, teal, pink, red, amber, cyan, lime, brown, grey, blueGrey, deepPurple, deepOrange } from "@mui/material/colors";

export type TileType = "Type1" | "Type2";

export type TileComponentType = "SimpleTile" | "SparklineTileBarCol" | "SparklineTileLineCol";

export type TileDataSource =
  | "totalCharts"
  | "activeUsers"
  | "dataPoints"
  | "uptime"
  | "performanceScore"
  | "revenue"
  | "websiteTraffic"
  | "serverLoad"
  | "memoryUsage"
  | "diskSpace"
  | "networkLatency"
  | "errorRate"
  | "pageViews"
  | "bounceRate"
  | "conversionRate"
  | "customerSatisfaction"
  | "salesGrowth"
  | "marketShare"
  | "productivity"
  | "supportTickets"
  | "apiCalls"
  | "downloads"
  | "subscriptions";

// Base configuration shared by all tiles
interface BaseTileConfig {
  id: string;
  type: TileType;
  component: TileComponentType;
  label: string;
  color: string;
  backgroundColor: string;
  dataSource: TileDataSource;
  editable?: boolean;
}

// Type1 tiles (SimpleTile) - no sparkline data
export interface SimpleTileConfig extends BaseTileConfig {
  type: "Type1";
  component: "SimpleTile";
  dataSource: "totalCharts" | "activeUsers" | "dataPoints" | "uptime" | "serverLoad" | "memoryUsage" | "diskSpace" | "networkLatency" | "errorRate" | "pageViews" | "bounceRate" | "conversionRate" | "customerSatisfaction" | "supportTickets" | "downloads" | "subscriptions";
}

// Type2 tiles with bar sparkline
export interface SparklineBarTileConfig extends BaseTileConfig {
  type: "Type2";
  component: "SparklineTileBarCol";
  dataSource: "performanceScore" | "revenue" | "salesGrowth" | "marketShare" | "productivity" | "apiCalls";
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
  // Type1 Tiles (SimpleTile) - 20 tiles
  {
    id: "tile-total-charts",
    type: "Type1",
    component: "SimpleTile",
    label: "Total Charts",
    color: "white",
    backgroundColor: indigo[900],
    dataSource: "totalCharts",
    editable: true,
  },
  {
    id: "tile-active-users",
    type: "Type1",
    component: "SimpleTile",
    label: "Active Users",
    color: "white",
    backgroundColor: orange[700],
    dataSource: "activeUsers",
    editable: false,
  },
  {
    id: "tile-data-points",
    type: "Type1",
    component: "SimpleTile",
    label: "Data Points",
    color: "white",
    backgroundColor: blue[500],
    dataSource: "dataPoints",
    editable: true,
  },
  {
    id: "tile-uptime",
    type: "Type1",
    component: "SimpleTile",
    label: "Uptime %",
    color: "white",
    backgroundColor: green[600],
    dataSource: "uptime",
    editable: false,
  },
  {
    id: "tile-server-load",
    type: "Type1",
    component: "SimpleTile",
    label: "Server Load",
    color: "white",
    backgroundColor: red[600],
    dataSource: "serverLoad",
    editable: true,
  },
  {
    id: "tile-memory-usage",
    type: "Type1",
    component: "SimpleTile",
    label: "Memory Usage",
    color: "white",
    backgroundColor: amber[700],
    dataSource: "memoryUsage",
    editable: false,
  },
  {
    id: "tile-disk-space",
    type: "Type1",
    component: "SimpleTile",
    label: "Disk Space",
    color: "white",
    backgroundColor: cyan[600],
    dataSource: "diskSpace",
    editable: true,
  },
  {
    id: "tile-network-latency",
    type: "Type1",
    component: "SimpleTile",
    label: "Network Latency",
    color: "white",
    backgroundColor: lime[700],
    dataSource: "networkLatency",
    editable: false,
  },
  {
    id: "tile-error-rate",
    type: "Type1",
    component: "SimpleTile",
    label: "Error Rate",
    color: "white",
    backgroundColor: brown[600],
    dataSource: "errorRate",
    editable: true,
  },
  {
    id: "tile-page-views",
    type: "Type1",
    component: "SimpleTile",
    label: "Page Views",
    color: "white",
    backgroundColor: grey[700],
    dataSource: "pageViews",
    editable: false,
  },
  {
    id: "tile-bounce-rate",
    type: "Type1",
    component: "SimpleTile",
    label: "Bounce Rate",
    color: "white",
    backgroundColor: blueGrey[600],
    dataSource: "bounceRate",
    editable: true,
  },
  {
    id: "tile-conversion-rate",
    type: "Type1",
    component: "SimpleTile",
    label: "Conversion Rate",
    color: "white",
    backgroundColor: deepPurple[600],
    dataSource: "conversionRate",
    editable: false,
  },
  {
    id: "tile-customer-satisfaction",
    type: "Type1",
    component: "SimpleTile",
    label: "Customer Satisfaction",
    color: "white",
    backgroundColor: deepOrange[600],
    dataSource: "customerSatisfaction",
    editable: true,
  },
  {
    id: "tile-support-tickets",
    type: "Type1",
    component: "SimpleTile",
    label: "Support Tickets",
    color: "white",
    backgroundColor: pink[700],
    dataSource: "supportTickets",
    editable: false,
  },
  {
    id: "tile-downloads",
    type: "Type1",
    component: "SimpleTile",
    label: "Downloads",
    color: "white",
    backgroundColor: teal[700],
    dataSource: "downloads",
    editable: true,
  },
  {
    id: "tile-subscriptions",
    type: "Type1",
    component: "SimpleTile",
    label: "Subscriptions",
    color: "white",
    backgroundColor: purple[800],
    dataSource: "subscriptions",
    editable: false,
  },
  {
    id: "tile-total-charts-alt",
    type: "Type1",
    component: "SimpleTile",
    label: "Charts (Alt)",
    color: "white",
    backgroundColor: indigo[700],
    dataSource: "totalCharts",
    editable: true,
  },
  {
    id: "tile-active-users-alt",
    type: "Type1",
    component: "SimpleTile",
    label: "Users (Alt)",
    color: "white",
    backgroundColor: orange[600],
    dataSource: "activeUsers",
    editable: false,
  },
  {
    id: "tile-data-points-alt",
    type: "Type1",
    component: "SimpleTile",
    label: "Data Points (Alt)",
    color: "white",
    backgroundColor: blue[700],
    dataSource: "dataPoints",
    editable: true,
  },
  {
    id: "tile-uptime-alt",
    type: "Type1",
    component: "SimpleTile",
    label: "System Uptime",
    color: "white",
    backgroundColor: green[700],
    dataSource: "uptime",
    editable: false,
  },

  // Type2 Tiles (Sparkline Tiles) - 10 tiles
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
    editable: false,
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
    editable: false,
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
    editable: false,
  },
  {
    id: "tile-sales-growth",
    type: "Type2",
    component: "SparklineTileBarCol",
    label: "Sales Growth",
    color: "white",
    backgroundColor: green[700],
    dataSource: "salesGrowth",
    sparklineHeight: 40,
    sparklineWidth: 200,
    highlightRange: [5, 8],
    highlightColor: green[300],
    editable: true,
  },
  {
    id: "tile-market-share",
    type: "Type2",
    component: "SparklineTileBarCol",
    label: "Market Share",
    color: "white",
    backgroundColor: blue[700],
    dataSource: "marketShare",
    sparklineHeight: 40,
    sparklineWidth: 200,
    editable: false,
  },
  {
    id: "tile-productivity",
    type: "Type2",
    component: "SparklineTileBarCol",
    label: "Productivity",
    color: "white",
    backgroundColor: orange[700],
    dataSource: "productivity",
    sparklineHeight: 40,
    sparklineWidth: 200,
    highlightRange: [10, 15],
    highlightColor: orange[300],
    editable: true,
  },
  {
    id: "tile-api-calls",
    type: "Type2",
    component: "SparklineTileBarCol",
    label: "API Calls",
    color: "white",
    backgroundColor: red[700],
    dataSource: "apiCalls",
    sparklineHeight: 40,
    sparklineWidth: 200,
    editable: false,
  },
  {
    id: "tile-performance-score-alt",
    type: "Type2",
    component: "SparklineTileBarCol",
    label: "Performance (Alt)",
    color: "white",
    backgroundColor: purple[600],
    dataSource: "performanceScore",
    sparklineHeight: 40,
    sparklineWidth: 200,
    highlightRange: [6, 9],
    highlightColor: purple[200],
    editable: true,
  },
  {
    id: "tile-revenue-alt",
    type: "Type2",
    component: "SparklineTileBarCol",
    label: "Revenue Trends",
    color: "white",
    backgroundColor: teal[700],
    dataSource: "revenue",
    sparklineHeight: 40,
    sparklineWidth: 200,
    editable: false,
  },
  {
    id: "tile-sales-growth-alt",
    type: "Type2",
    component: "SparklineTileBarCol",
    label: "Growth Metrics",
    color: "white",
    backgroundColor: green[600],
    dataSource: "salesGrowth",
    sparklineHeight: 40,
    sparklineWidth: 200,
    highlightRange: [3, 6],
    highlightColor: green[200],
    editable: true,
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
