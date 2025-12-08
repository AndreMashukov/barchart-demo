import React from "react";
import ConfigurableGridLayout, { GridLayoutConfig } from "./ConfigurableGridLayout";

// Default boundary configuration matching the original constants
const DEFAULT_CONFIG: GridLayoutConfig = {
  maxVisibleRows: 12,
  rowHeight: 60,
  rowMargin: 8,
  boundaryLinePosition: 12, // Controls which row the boundary line appears at
  repositioningDelayMs: 1000, // 1 second delay before repositioning
};

const ResponsiveGridLayout: React.FC = () => {
  return <ConfigurableGridLayout config={DEFAULT_CONFIG} />;
};

export default ResponsiveGridLayout;
