import React from "react";
import Box from "@mui/material/Box";
import TabPanel from "../../../components/TabPanel";
import EmptyTilesState from "../../../components/Tiles/EmptyTilesState";
import ResponsiveGridLayout from "../../../components/layout/ResponsiveGridLayout";
import { useTileEdit } from "../../../context/TileEditContext";

interface TabGeneralProps {
  value: number;
  index: number;
}

const TabGeneral: React.FC<TabGeneralProps> = ({ value, index }) => {
  const { state } = useTileEdit();

  // Get all currently placed tile IDs to exclude from selector
  const placedTileIds = state.layouts.lg.map((item) => item.i);

  // Check if dashboard is empty
  const isEmpty = !state.editMode && placedTileIds.length === 0;

  return (
    <TabPanel value={value} index={index}>
      {isEmpty ? (
        <EmptyTilesState />
      ) : (
        <Box sx={{ height: "100%", position: "relative" }}>
          {/* Add Tile button moved to header */}

          {/* Responsive Grid Layout */}
          <ResponsiveGridLayout />
        </Box>
      )}

      {/* Tile selector modal now rendered in header */}
    </TabPanel>
  );
};

export default TabGeneral;
