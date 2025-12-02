import React, { useMemo, useCallback } from "react";
import GridLayout, { Layout } from "react-grid-layout";
import Box from "@mui/material/Box";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { useTileEdit, GridItem, getSizeConstraints } from "../../../context/TileEditContext";
import { getTileConfigById } from "../../../config/availableTiles";
import SimpleTile from "../../Tiles/SimpleTile/SimpleTile";
import SparklineTileBarCol from "../../Tiles/SparklineTileBarCol/SparklineTileBarCol";
import SparklineTileLineCol from "../../Tiles/SparklineTileLineCol/SparklineTileLineCol";
import EditableTileWrapper from "../../Tiles/EditableTileWrapper";
import { useTileData } from "../../../hooks/useTileData";

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
  const currentCols = 12; // Fixed 12-column layout

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

  // Validate constraints for grid items
  const validateGridItemConstraints = useCallback((items: GridItem[]): GridItem[] => {
    return items.map(item => {
      const config = getTileConfigById(item.i);
      if (!config) return item;
      
      const isType2 = config.type === "Type2";
      const constraints = getSizeConstraints(isType2);
      const minH = item.minH ?? constraints.minH;
      const maxH = item.maxH ?? constraints.maxH;
      
      let fixed = { ...item };
      
      // Fix maxH if it's less than minH
      if (maxH < minH) {
        fixed.maxH = Math.max(constraints.maxH, minH);
      }
      
      // Fix maxH if it's less than current height
      if (fixed.maxH! < item.h) {
        fixed.maxH = Math.max(constraints.maxH, item.h);
      }
      
      // Fix minH if it's greater than maxH (after fixes)
      if (fixed.minH! > fixed.maxH!) {
        fixed.minH = Math.min(constraints.minH, fixed.maxH!);
      }
      
      return fixed;
    });
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

  // Constrain resize operations and validate constraints
  const onResizeStop = useCallback(
    (layout: Layout[], oldItem: Layout, newItem: Layout, placeholder: Layout, e: MouseEvent, element: HTMLElement) => {
      const config = getTileConfigById(newItem.i);
      if (!config) return;
      
      const isType2 = config.type === "Type2";
      const constraints = getSizeConstraints(isType2);
      
      let correctedItem = { ...newItem };
      let needsCorrection = false;
      
      // Ensure resized tile doesn't exceed grid width
      if (correctedItem.x + correctedItem.w > currentCols) {
        correctedItem.w = currentCols - correctedItem.x;
        needsCorrection = true;
      }
      
      // Prevent tiles from becoming too small
      if (correctedItem.w < 1) {
        correctedItem.w = 1;
        needsCorrection = true;
      }
      if (correctedItem.h < 1) {
        correctedItem.h = 1;
        needsCorrection = true;
      }
      
      // Limit maximum height to prevent excessive vertical space
      const maxHeight = 15;
      if (correctedItem.h > maxHeight) {
        correctedItem.h = maxHeight;
        needsCorrection = true;
      }
      
      // Validate constraint relationships
      const minH = correctedItem.minH ?? constraints.minH;
      const maxH = correctedItem.maxH ?? constraints.maxH;
      
      // Fix maxH if it's less than minH
      if (maxH < minH) {
        correctedItem.maxH = Math.max(constraints.maxH, minH);
        needsCorrection = true;
      }
      
      // Fix maxH if it's less than current height
      if (correctedItem.maxH! < correctedItem.h) {
        correctedItem.maxH = Math.max(constraints.maxH, correctedItem.h);
        needsCorrection = true;
      }
      
      // Fix minH if it's greater than maxH (after fixes)
      if (correctedItem.minH! > correctedItem.maxH!) {
        correctedItem.minH = Math.min(constraints.minH, correctedItem.maxH!);
        needsCorrection = true;
      }
      
      if (needsCorrection) {
        console.log(`Correcting tile ${correctedItem.i} size and constraints`, {
          size: `[${correctedItem.w}x${correctedItem.h}]`,
          constraints: { minH: correctedItem.minH, maxH: correctedItem.maxH }
        });
        
        // Update layout with corrected item
        const correctedLayout = layout.map(item =>
          item.i === correctedItem.i ? correctedItem : item
        );
        
        // Trigger layout change with corrected layout
        onLayoutChange(correctedLayout);
      }
    },
    [currentCols, onLayoutChange]
  );

  return (
    <Box 
      sx={{ 
        maxHeight: "80vh", 
        minHeight: "200px",
        overflow: "hidden",
        position: "relative"
      }}
    >
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
        isBounded={true}
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
