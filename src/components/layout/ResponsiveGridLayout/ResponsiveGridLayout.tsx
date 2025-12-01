import React, { useMemo, useCallback, useState } from "react";
import { Responsive, WidthProvider, Layout } from "react-grid-layout";
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

const ResponsiveGridLayoutWithWidth = WidthProvider(Responsive);

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

const ResponsiveGridLayout: React.FC = () => {
  const { state, removeTile, updateLayouts } = useTileEdit();
  const [currentBreakpoint, setCurrentBreakpoint] = useState<string>("lg");
  const [currentCols, setCurrentCols] = useState<number>(12);

  const colsMap = { lg: 12, md: 10, sm: 6, xs: 4 };

  // Memoize children to prevent unnecessary re-renders
  const children = useMemo(() => {
    return state.layouts.lg.map((item) => (
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
        />
      </div>
    ));
  }, [state.layouts.lg, state.editMode, removeTile]);

  // Validate and correct layout positions to prevent out-of-bounds tiles
  const validateLayout = useCallback((layout: Layout[]): Layout[] => {
    const maxY = 20; // Maximum allowed Y position
    
    return layout.map(item => {
      const correctedItem = { ...item };
      
      // Horizontal constraints
      if (correctedItem.x < 0) {
        correctedItem.x = 0;
      }
      if (correctedItem.x + correctedItem.w > currentCols) {
        correctedItem.x = Math.max(0, currentCols - correctedItem.w);
      }
      
      // Vertical constraints
      if (correctedItem.y < 0) {
        correctedItem.y = 0;
      }
      if (correctedItem.y > maxY) {
        correctedItem.y = maxY;
      }
      
      // Size constraints
      if (correctedItem.w < 1) correctedItem.w = 1;
      if (correctedItem.h < 1) correctedItem.h = 1;
      if (correctedItem.h > 15) correctedItem.h = 15;
      
      return correctedItem;
    });
  }, [currentCols]);

  // Memoize callback to prevent recreation
  const onLayoutChange = useCallback(
    (currentLayout: Layout[], allLayouts: { [key: string]: Layout[] }) => {
      // Validate and correct all layouts
      const validatedLayouts = {
        lg: validateLayout(allLayouts.lg || []),
        md: validateLayout(allLayouts.md || []),
        sm: validateLayout(allLayouts.sm || []),
        xs: validateLayout(allLayouts.xs || []),
      };

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

      const newLayouts = {
        lg: convertToGridItems(validatedLayouts.lg),
        md: convertToGridItems(validatedLayouts.md),
        sm: convertToGridItems(validatedLayouts.sm),
        xs: convertToGridItems(validatedLayouts.xs),
      };

      updateLayouts(newLayouts);
    },
    [updateLayouts, validateLayout]
  );

  // Constrain movement during drag to provide real-time feedback
  const onDrag = useCallback(
    (layout: Layout[], oldItem: Layout, newItem: Layout, placeholder: Layout, e: MouseEvent, element: HTMLElement) => {
      // Apply real-time constraints during drag
      if (newItem.x < 0) {
        newItem.x = 0;
      }
      if (newItem.x + newItem.w > currentCols) {
        newItem.x = currentCols - newItem.w;
      }
      
      const maxRows = 20;
      if (newItem.y < 0) {
        newItem.y = 0;
      }
      if (newItem.y > maxRows) {
        newItem.y = maxRows;
      }
    },
    [currentCols]
  );

  // Enforce final constraints when drag stops
  const onDragStop = useCallback(
    (layout: Layout[], oldItem: Layout, newItem: Layout, placeholder: Layout, e: MouseEvent, element: HTMLElement) => {
      let needsCorrection = false;
      
      // Constrain horizontal movement to grid bounds
      if (newItem.x < 0) {
        newItem.x = 0;
        needsCorrection = true;
      }
      if (newItem.x + newItem.w > currentCols) {
        newItem.x = currentCols - newItem.w;
        needsCorrection = true;
      }
      
      // Constrain vertical movement to prevent infinite scrolling
      const maxRows = 20;
      if (newItem.y < 0) {
        newItem.y = 0;
        needsCorrection = true;
      }
      if (newItem.y > maxRows) {
        newItem.y = maxRows;
        needsCorrection = true;
      }
      
      if (needsCorrection) {
        console.log(`Correcting tile ${newItem.i} position to [${newItem.x}, ${newItem.y}]`);
        
        // Force immediate layout update with corrected positions
        const correctedLayout = layout.map(item => 
          item.i === newItem.i ? { ...newItem } : item
        );
        
        // This will trigger onLayoutChange with corrected layout
      }
    },
    [currentCols]
  );

  // Constrain resize operations
  const onResizeStop = useCallback(
    (layout: Layout[], oldItem: Layout, newItem: Layout, placeholder: Layout, e: MouseEvent, element: HTMLElement) => {
      let needsCorrection = false;
      
      // Ensure resized tile doesn't exceed grid width
      if (newItem.x + newItem.w > currentCols) {
        newItem.w = currentCols - newItem.x;
        needsCorrection = true;
      }
      
      // Prevent tiles from becoming too small
      if (newItem.w < 1) {
        newItem.w = 1;
        needsCorrection = true;
      }
      if (newItem.h < 1) {
        newItem.h = 1;
        needsCorrection = true;
      }
      
      // Limit maximum height to prevent excessive vertical space
      const maxHeight = 15;
      if (newItem.h > maxHeight) {
        newItem.h = maxHeight;
        needsCorrection = true;
      }
      
      if (needsCorrection) {
        console.log(`Correcting tile ${newItem.i} size to [${newItem.w}x${newItem.h}]`);
      }
    },
    [currentCols]
  );

  const onBreakpointChange = useCallback((breakpoint: string, cols: number) => {
    setCurrentBreakpoint(breakpoint);
    setCurrentCols(cols);
  }, []);

  return (
    <Box 
      sx={{ 
        maxHeight: "80vh", 
        minHeight: "200px",
        overflow: "hidden",
        position: "relative"
      }}
    >
      <ResponsiveGridLayoutWithWidth
        className="layout"
        layouts={state.layouts}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4 }}
        rowHeight={60}
        onLayoutChange={onLayoutChange}
        onBreakpointChange={onBreakpointChange}
        onDrag={onDrag}
        onDragStop={onDragStop}
        onResizeStop={onResizeStop}
        isDraggable={state.editMode}
        isResizable={state.editMode}
        isBounded={true}
        autoSize={true}
        maxRows={20}
        compactType="vertical"
        preventCollision={false}
        margin={[8, 8]}
        containerPadding={[0, 0]}
        useCSSTransforms={true}
        verticalCompact={true}
      >
        {children}
      </ResponsiveGridLayoutWithWidth>
    </Box>
  );
};

export default ResponsiveGridLayout;
