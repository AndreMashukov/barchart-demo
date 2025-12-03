import React, { useMemo, useCallback, useState, useEffect } from "react";
import GridLayout, { Layout } from "react-grid-layout";
import Box from "@mui/material/Box";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { useTileEdit, GridItem } from "../../../context/TileEditContext";
import { getTileConfigById } from "../../../config/availableTiles";
import SimpleTile from "../../Tiles/SimpleTile/SimpleTile";
import SparklineTileBarCol from "../../Tiles/SparklineTileBarCol/SparklineTileBarCol";
import SparklineTileLineCol from "../../Tiles/SparklineTileLineCol/SparklineTileLineCol";
import EditableTileWrapper from "../../Tiles/EditableTileWrapper";
import { useTileData } from "../../../hooks/useTileData";
import BoundaryLineIndicator from "./BoundaryLineIndicator";

// Boundary configuration
const MAX_VISIBLE_ROWS = 10;
const ROW_HEIGHT = 60;
const ROW_MARGIN = 8;
const boundaryPixels = MAX_VISIBLE_ROWS * ROW_HEIGHT + (MAX_VISIBLE_ROWS - 1) * ROW_MARGIN;

interface TileRendererProps {
  tileId: string;
  editMode: boolean;
  onRemove: () => void;
  error?: boolean;
}

const TileRenderer: React.FC<TileRendererProps> = ({ tileId, editMode, onRemove, error }) => {
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
        error={error}
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
        error={error}
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
        error={error}
      />
    );
  }

  return (
    <EditableTileWrapper editMode={editMode} onRemove={onRemove}>
      {tileContent}
    </EditableTileWrapper>
  );
};

const ResponsiveGridLayout: React.FC = () => {
  const { state, removeTile, updateLayouts } = useTileEdit();
  const currentCols = 12; // Fixed 12-column layout

  // State variable to track tiles that cross or exceed the boundary
  const [tilesExceedingBoundary, setTilesExceedingBoundary] = useState<Set<string>>(new Set());

  // Helper function to check if a tile exceeds the boundary
  const tileExceedsBoundary = useCallback((tile: Layout | GridItem): boolean => {
    const tileBottomRow = tile.y + tile.h;
    return tileBottomRow > MAX_VISIBLE_ROWS;
  }, []);

  // Update state when layout changes to track tiles exceeding boundary
  useEffect(() => {
    const exceedingTiles = new Set<string>();
    
    state.layouts.lg.forEach((item) => {
      if (tileExceedsBoundary(item)) {
        exceedingTiles.add(item.i);
      }
    });
    
    setTilesExceedingBoundary(exceedingTiles);
  }, [state.layouts.lg, tileExceedsBoundary]);

  // Memoize children to prevent unnecessary re-renders
  const children = useMemo(() => {
    return state.layouts.lg.map((item) => {
      // Use state variable to check if tile exceeds boundary
      const exceedsBoundary = tilesExceedingBoundary.has(item.i);
      return (
        <div
          key={item.i}
          style={{
            height: "100%"
          }}
        >
          <TileRenderer
            tileId={item.i}
            editMode={state.editMode}
            onRemove={() => removeTile(item.i)}
            error={exceedsBoundary}
          />
        </div>
      );
    });
  }, [state.layouts.lg, state.editMode, removeTile, tilesExceedingBoundary]);

  // No validation - return layout as-is
  const validateLayout = useCallback((layout: Layout[]): Layout[] => {
    return layout;
  }, []);

  // No constraint validation - return items as-is
  const validateGridItemConstraints = useCallback((items: GridItem[]): GridItem[] => {
    return items;
  }, []);

  // Memoize callback to prevent recreation
  const onLayoutChange = useCallback(
    (currentLayout: Layout[]) => {
      // Validate and correct layout
      const validatedLayout = validateLayout(currentLayout);

      // Convert Layout[] to GridItem[]
      const convertToGridItems = (layouts: Layout[]): GridItem[] => {
        return layouts.map((layout) => ({
          i: layout.i,
          x: layout.x,
          y: layout.y,
          w: layout.w,
          h: layout.h,
          minW: layout.minW,
          maxW: layout.maxW,
          minH: layout.minH,
          maxH: layout.maxH,
          static: layout.static,
          isBounded: true,
        }));
      };

      // Only update lg layout, copy to other breakpoints to maintain consistency
      let lgGridItems = convertToGridItems(validatedLayout);
      
      // Validate constraints before saving
      lgGridItems = validateGridItemConstraints(lgGridItems);
      
      const newLayouts = {
        lg: lgGridItems,
        md: lgGridItems,
        sm: lgGridItems,
        xs: lgGridItems,
      };

      updateLayouts(newLayouts);
    },
    [updateLayouts, validateLayout, validateGridItemConstraints]
  );

  // No constraints during drag
  const onDrag = useCallback(
    (layout: Layout[], oldItem: Layout, newItem: Layout, placeholder: Layout, e: MouseEvent, element: HTMLElement) => {
      // No restrictions applied
    },
    []
  );

  // No constraints when drag stops
  const onDragStop = useCallback(
    (layout: Layout[], oldItem: Layout, newItem: Layout, placeholder: Layout, e: MouseEvent, element: HTMLElement) => {
      // No restrictions applied
    },
    []
  );

  // No constraints on resize operations
  const onResizeStop = useCallback(
    (layout: Layout[], oldItem: Layout, newItem: Layout, placeholder: Layout, e: MouseEvent, element: HTMLElement) => {
      // No restrictions applied
    },
    []
  );

  return (
    <Box 
      sx={{ 
        maxHeight: "80vh", 
        minHeight: state.editMode ? `${boundaryPixels + 50}px` : "200px", // Ensure container is tall enough to show boundary line
        overflow: state.editMode ? "auto" : "hidden", // Allow scrolling in edit mode to see boundary line
        position: "relative"
      }}
    >
      {state.editMode && (
        <BoundaryLineIndicator 
          key="boundary-line-indicator"
          topPosition={boundaryPixels} 
        />
      )}
      <GridLayout
        className="layout"
        layout={state.layouts.lg}
        cols={12}
        rowHeight={60}
        width={1200} // Fixed width to prevent responsiveness
        onLayoutChange={onLayoutChange}
        onDrag={onDrag}
        onDragStop={onDragStop}
        onResizeStop={onResizeStop}
        isDraggable={state.editMode}
        isResizable={state.editMode}
        isBounded={false}
        autoSize={true}
        compactType="vertical"
        preventCollision={false}
        margin={[8, 8]}
        containerPadding={[0, 0]}
        useCSSTransforms={true}
        verticalCompact={true}
      >
        {children}
      </GridLayout>
    </Box>
  );
};

export default ResponsiveGridLayout;
