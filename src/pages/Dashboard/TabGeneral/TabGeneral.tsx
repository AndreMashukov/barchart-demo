import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import TabPanel from "../../../components/TabPanel";
import TileSelectorModal from "../../../components/Tiles/TileSelectorModal";
import EmptyTilesState from "../../../components/Tiles/EmptyTilesState";
import ResponsiveGridLayout from "../../../components/layout/ResponsiveGridLayout";
import { useTileEdit } from "../../../context/TileEditContext";

interface TabGeneralProps {
  value: number;
  index: number;
}

const TabGeneral: React.FC<TabGeneralProps> = ({ value, index }) => {
  const { state, addTile } = useTileEdit();
  const [modalOpen, setModalOpen] = useState(false);

  const handleAddTileClick = () => {
    setModalOpen(true);
  };

  const handleTileSelect = (tileId: string) => {
    addTile(tileId);
    setModalOpen(false);
  };

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
          {/* Add Tile Button - show in edit mode */}
          {state.editMode && (
            <Box sx={{ mb: 2, display: "flex", justifyContent: "flex-end" }}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddTileClick}
                sx={{ textTransform: "none" }}
              >
                Add Tile
              </Button>
            </Box>
          )}

          {/* Responsive Grid Layout */}
          <ResponsiveGridLayout />
        </Box>
      )}

      {/* Tile Selector Modal */}
      <TileSelectorModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        allowedTypes={["Type1", "Type2"]}
        onSelectTile={handleTileSelect}
        excludedTileIds={placedTileIds}
      />
    </TabPanel>
  );
};

export default TabGeneral;
