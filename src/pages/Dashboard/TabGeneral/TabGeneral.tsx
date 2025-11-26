import React, { useState } from "react";
import Box from "@mui/material/Box";
import AddIcon from "@mui/icons-material/Add";
import TabPanel from "../../../components/TabPanel";
import SimpleTile from "../../../components/Tiles/SimpleTile/SimpleTile";
import SparklineTileBarCol from "../../../components/Tiles/SparklineTileBarCol/SparklineTileBarCol";
import SparklineTileLineCol from "../../../components/Tiles/SparklineTileLineCol/SparklineTileLineCol";
import Type2Placeholder from "../../../components/Tiles/Type2Placeholder";
import TileSelectorModal from "../../../components/Tiles/TileSelectorModal";
import EditableTileWrapper from "../../../components/Tiles/EditableTileWrapper";
import EmptyTilesState from "../../../components/Tiles/EmptyTilesState";
import { useTileEdit, CompositeSlotContent } from "../../../context/TileEditContext";
import { getTileConfigById } from "../../../config/availableTiles";
import { useTileData } from "../../../hooks/useTileData";

interface TabGeneralProps {
  value: number;
  index: number;
}

// Height constants for tiles and composite slots
const QUADRANT_HEIGHT = 120; // Height of each quadrant tile in pixels
const COMPOSITE_SLOT_HEIGHT = QUADRANT_HEIGHT * 2 + 8; // Total composite slot height: 2 quadrants + gap (248px)

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
  const { state, addTileToQuadrant, addTileToCenter, removeTileFromQuadrant, removeEntireCompositeSlot } = useTileEdit();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCompositeSlot, setSelectedCompositeSlot] = useState<{ 
    row: 1 | 2; 
    compositeSlotIndex: number; 
    quadrant?: number; 
    isCenter?: boolean;
  } | null>(null);

  const handleQuadrantClick = (row: 1 | 2, compositeSlotIndex: number, quadrant: number) => {
    setSelectedCompositeSlot({ row, compositeSlotIndex, quadrant });
    setModalOpen(true);
  };

  const handleCenterClick = (row: 1 | 2, compositeSlotIndex: number) => {
    setSelectedCompositeSlot({ row, compositeSlotIndex, isCenter: true });
    setModalOpen(true);
  };

  const handleTileSelect = (tileId: string) => {
    if (selectedCompositeSlot) {
      if (selectedCompositeSlot.isCenter) {
        addTileToCenter(tileId, selectedCompositeSlot.row, selectedCompositeSlot.compositeSlotIndex);
      } else if (selectedCompositeSlot.quadrant !== undefined) {
        addTileToQuadrant(tileId, selectedCompositeSlot.row, selectedCompositeSlot.compositeSlotIndex, selectedCompositeSlot.quadrant);
      }
    }
  };

  const handleRemoveQuadrantTile = (row: 1 | 2, compositeSlotIndex: number, quadrant: number) => {
    removeTileFromQuadrant(row, compositeSlotIndex, quadrant);
  };

  const handleRemoveCompositeSlot = (row: 1 | 2, compositeSlotIndex: number) => {
    removeEntireCompositeSlot(row, compositeSlotIndex);
  };

  // Get all currently placed tile IDs to exclude from selector
  const placedTileIds: string[] = [];
  [...state.row1CompositeSlots, ...state.row2CompositeSlots].forEach((compositeSlot) => {
    if (typeof compositeSlot === "string") {
      placedTileIds.push(compositeSlot);
    } else if (Array.isArray(compositeSlot)) {
      compositeSlot.forEach((tileId) => {
        if (tileId) placedTileIds.push(tileId);
      });
    }
  });

  // Check if dashboard is empty
  const isEmpty = !state.editMode && placedTileIds.length === 0;

  // Render a composite slot (either quadrants with Type1 tiles or a single Type2 tile)
  const renderCompositeSlot = (compositeSlotContent: CompositeSlotContent, row: 1 | 2, compositeSlotIndex: number) => {
    // Type2 tile (string)
    if (typeof compositeSlotContent === "string") {
      return (
        <TileRenderer
          tileId={compositeSlotContent}
          editMode={state.editMode}
          onRemove={() => handleRemoveCompositeSlot(row, compositeSlotIndex)}
        />
      );
    }

    // Quadrants with Type1 tiles (array)
    if (Array.isArray(compositeSlotContent)) {
      return (
        <Box
          sx={{
            width: "100%",
            height: "100%",
            minHeight: `${COMPOSITE_SLOT_HEIGHT}px`,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gridTemplateRows: "1fr 1fr",
            gap: 1,
          }}
        >
          {compositeSlotContent.map((tileId, quadrant) => (
            tileId ? (
              <TileRenderer
                key={`quadrant-${quadrant}`}
                tileId={tileId}
                editMode={state.editMode}
                onRemove={() => handleRemoveQuadrantTile(row, compositeSlotIndex, quadrant)}
              />
            ) : state.editMode ? (
              <Box
                key={`quadrant-${quadrant}`}
                onClick={() => handleQuadrantClick(row, compositeSlotIndex, quadrant)}
                sx={{
                  border: "1px dashed",
                  borderColor: "grey.300",
                  borderRadius: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  backgroundColor: "grey.50",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    borderColor: "primary.main",
                    backgroundColor: "grey.100",
                    "& .add-icon": {
                      color: "primary.main",
                      transform: "scale(1.2)",
                    },
                  },
                }}
              >
                <AddIcon
                  className="add-icon"
                  sx={{
                    fontSize: 32,
                    color: "grey.400",
                    transition: "all 0.3s ease",
                  }}
                />
              </Box>
            ) : (
              // Empty placeholder in view mode to maintain grid structure
              <Box key={`quadrant-${quadrant}`} />
            )
          ))}
        </Box>
      );
    }

    // Empty composite slot - show Type2Placeholder
    if (state.editMode) {
      return (
        <Type2Placeholder
          onQuadrantClick={(quadrant) => handleQuadrantClick(row, compositeSlotIndex, quadrant)}
          onCenterClick={() => handleCenterClick(row, compositeSlotIndex)}
        />
      );
    }

    return null;
  };

  return (
    <TabPanel value={value} index={index}>
      {isEmpty ? (
        <EmptyTilesState />
      ) : (
        <>
          {/* Row 1: 2 composite slots (Type1 quadrants OR Type2) */}
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 1,
              mb: 3,
            }}
          >
            {state.row1CompositeSlots.map((compositeSlotContent, compositeSlotIndex) => (
              <Box
                key={`row1-composite-slot-${compositeSlotIndex}`}
                sx={{
                  flex: {
                    xs: "1 1 100%",
                    md: "1 1 calc(50% - 4px)",
                  },
                  minWidth: { xs: "100%", md: "300px" },
                  minHeight: `${COMPOSITE_SLOT_HEIGHT}px`,
                }}
              >
                {renderCompositeSlot(compositeSlotContent, 1, compositeSlotIndex)}
              </Box>
            ))}
          </Box>

          {/* Row 2: 2 composite slots (Type2 only) */}
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 1,
            }}
          >
            {state.row2CompositeSlots.map((compositeSlotContent, compositeSlotIndex) => (
              <Box
                key={`row2-composite-slot-${compositeSlotIndex}`}
                sx={{
                  flex: {
                    xs: "1 1 100%",
                    md: "1 1 calc(50% - 4px)",
                  },
                  minWidth: { xs: "100%", md: "300px" },
                  minHeight: `${COMPOSITE_SLOT_HEIGHT}px`,
                }}
              >
                {renderCompositeSlot(compositeSlotContent, 2, compositeSlotIndex)}
              </Box>
            ))}
          </Box>
        </>
      )}

      {/* Tile Selector Modal */}
      <TileSelectorModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        allowedTypes={
          selectedCompositeSlot?.isCenter
            ? ["Type1", "Type2"] // Allow both Type1 and Type2 for center placement
            : selectedCompositeSlot?.quadrant !== undefined
            ? ["Type1"]
            : selectedCompositeSlot?.row === 2
            ? ["Type2"]
            : ["Type1", "Type2"]
        }
        onSelectTile={handleTileSelect}
        excludedTileIds={placedTileIds}
      />
    </TabPanel>
  );
};

export default TabGeneral;
