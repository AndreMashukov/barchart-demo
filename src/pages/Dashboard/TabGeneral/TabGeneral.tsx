import React, { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TabPanel from "../../../components/TabPanel";
import SimpleTile from "../../../components/Tiles/SimpleTile/SimpleTile";
import SparklineTileBarCol from "../../../components/Tiles/SparklineTileBarCol/SparklineTileBarCol";
import SparklineTileLineCol from "../../../components/Tiles/SparklineTileLineCol/SparklineTileLineCol";
import TilePlaceholder from "../../../components/Tiles/TilePlaceholder";
import TileSelectorModal from "../../../components/Tiles/TileSelectorModal";
import EditableTileWrapper from "../../../components/Tiles/EditableTileWrapper";
import EmptyTilesState from "../../../components/Tiles/EmptyTilesState";
import { useTileEdit } from "../../../context/TileEditContext";
import { getTileConfigById, TileType } from "../../../config/availableTiles";
import { useTileData } from "../../../hooks/useTileData";

interface TabGeneralProps {
  value: number;
  index: number;
}

// Component to render a single tile based on its configuration
interface TileRendererProps {
  tileId: string;
  editMode: boolean;
  onRemove: () => void;
}

const TileRenderer: React.FC<TileRendererProps> = ({ tileId, editMode, onRemove }) => {
  const config = getTileConfigById(tileId);
  const { data, loading } = useTileData(config?.dataSource || null);

  if (!config) return null;

  let tileContent = null;

  if (config.component === "SimpleTile") {
    tileContent = (
      <SimpleTile
        count={data?.count}
        label={config.label}
        loading={loading}
        color={config.color}
        backgroundColor={config.backgroundColor}
      />
    );
  } else if (config.component === "SparklineTileBarCol") {
    tileContent = (
      <SparklineTileBarCol
        count={data?.count}
        label={config.label}
        loading={loading}
        color={config.color}
        backgroundColor={config.backgroundColor}
        sparklineData={(data?.sparklineData as number[]) || []}
        sparklineHeight={config.sparklineHeight}
        sparklineWidth={config.sparklineWidth}
        highlightRange={config.highlightRange}
        highlightColor={config.highlightColor}
      />
    );
  } else if (config.component === "SparklineTileLineCol") {
    tileContent = (
      <SparklineTileLineCol
        count={data?.count}
        label={config.label}
        loading={loading}
        color={config.color}
        backgroundColor={config.backgroundColor}
        sparklineData={(data?.sparklineData as Array<{ date: string; value: number }>) || []}
        sparklineHeight={config.sparklineHeight}
        sparklineWidth={config.sparklineWidth}
      />
    );
  }

  return (
    <EditableTileWrapper editMode={editMode} onRemove={onRemove}>
      {tileContent}
    </EditableTileWrapper>
  );
};

const TabGeneral: React.FC<TabGeneralProps> = ({ value, index }) => {
  const { state, addTile, removeTile } = useTileEdit();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{ row: 1 | 2; index: number } | null>(null);

  const handlePlaceholderClick = (row: 1 | 2, slotIndex: number) => {
    setSelectedSlot({ row, index: slotIndex });
    setModalOpen(true);
  };

  const handleTileSelect = (tileId: string) => {
    if (selectedSlot) {
      addTile(tileId, selectedSlot.row, selectedSlot.index);
    }
  };

  const handleRemoveTile = (row: 1 | 2, slotIndex: number) => {
    removeTile(row, slotIndex);
  };

  // Get all currently placed tile IDs to exclude from selector
  const placedTileIds = [...state.row1Tiles, ...state.row2Tiles].filter(
    (id): id is string => id !== null
  );

  // Check if dashboard is empty
  const isEmpty = !state.editMode && placedTileIds.length === 0;

  return (
    <TabPanel value={value} index={index}>
      {isEmpty ? (
        <EmptyTilesState />
      ) : (
        <>
          {/* Row 1: Type1 Tiles (4 slots) */}
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 3,
              mb: 3,
            }}
          >
            {state.row1Tiles.map((tileId, index) => (
              <Box
                key={`row1-${index}`}
                sx={{
                  flex: {
                    xs: "1 1 calc(50% - 12px)",
                    md: "1 1 calc(25% - 18px)",
                  },
                  minWidth: { xs: "calc(50% - 12px)", md: "200px" },
                  minHeight: "150px",
                }}
              >
                {tileId ? (
                  <TileRenderer
                    tileId={tileId}
                    editMode={state.editMode}
                    onRemove={() => handleRemoveTile(1, index)}
                  />
                ) : state.editMode ? (
                  <TilePlaceholder type="Type1" onClick={() => handlePlaceholderClick(1, index)} />
                ) : null}
              </Box>
            ))}
          </Box>

          {/* Row 2: Type2 Tiles (2 slots) */}
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 3,
            }}
          >
            {state.row2Tiles.map((tileId, index) => (
              <Box
                key={`row2-${index}`}
                sx={{
                  flex: {
                    xs: "1 1 100%",
                    md: "1 1 calc(50% - 12px)",
                  },
                  minWidth: { xs: "100%", md: "300px" },
                  minHeight: "200px",
                }}
              >
                {tileId ? (
                  <TileRenderer
                    tileId={tileId}
                    editMode={state.editMode}
                    onRemove={() => handleRemoveTile(2, index)}
                  />
                ) : state.editMode ? (
                  <TilePlaceholder type="Type2" onClick={() => handlePlaceholderClick(2, index)} />
                ) : null}
              </Box>
            ))}
          </Box>
        </>
      )}

      {/* Tile Selector Modal */}
      <TileSelectorModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        tileType={(selectedSlot?.row === 1 ? "Type1" : "Type2") as TileType}
        onSelectTile={handleTileSelect}
        excludedTileIds={placedTileIds}
      />
    </TabPanel>
  );
};

export default TabGeneral;
