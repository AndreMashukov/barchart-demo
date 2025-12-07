import React, { useMemo, useCallback, useState, useEffect, useRef } from "react";
import GridLayout, { Layout } from "react-grid-layout";
import Box from "@mui/material/Box";
import { useTheme, useMediaQuery } from "@mui/material";
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
const MAX_VISIBLE_ROWS = 12;
const ROW_HEIGHT = 60;
const ROW_MARGIN = 8;
const BOUNDARY_LINE_POSITION = MAX_VISIBLE_ROWS; // Controls which row the boundary line appears at
const boundaryPixels = BOUNDARY_LINE_POSITION * ROW_HEIGHT + (BOUNDARY_LINE_POSITION - 1) * ROW_MARGIN;
const REPOSITIONING_DELAY_MS = 1000; // 1 second delay before repositioning
const FADE_DURATION_MS = 500; // Animation duration for repositioning

interface TileRendererProps {
  tileId: string;
  editMode: boolean;
  onRemove: () => void;
  onEdit?: () => void;
  error?: boolean;
}

const TileRenderer: React.FC<TileRendererProps> = ({ tileId, editMode, onRemove, onEdit, error }) => {
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
    <EditableTileWrapper editMode={editMode} onRemove={onRemove} onEdit={onEdit} editable={config.editable ?? false}>
      {tileContent}
    </EditableTileWrapper>
  );
};

const ResponsiveGridLayout: React.FC = () => {
  const { state, removeTile, updateLayouts, saveLayoutHistory, rollbackToLastValid } = useTileEdit();
  const theme = useTheme();
  const isSmBreakpoint = useMediaQuery(theme.breakpoints.down("sm")); // Below 600px
  const currentCols = 12; // Fixed 12-column layout

  // Track window width for responsive layout
  const [windowWidth, setWindowWidth] = useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );

  // Update window width on resize
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // State variable to track tiles that cross or exceed the boundary
  const [tilesExceedingBoundary, setTilesExceedingBoundary] = useState<Set<string>>(new Set());
  
  // State variable to track tiles that are being repositioned (fading out)
  const [tilesRepositioning, setTilesRepositioning] = useState<Set<string>>(new Set());
  
  // Ref to store timeout IDs for cleanup (stores both delay and repositioning timeouts)
  interface TimeoutRef {
    delayTimeout: NodeJS.Timeout;
    repositioningTimeout?: NodeJS.Timeout;
  }
  const repositioningTimeoutsRef = useRef<Map<string, TimeoutRef>>(new Map());

  // Helper function to check if a tile exceeds the boundary
  const tileExceedsBoundary = useCallback((tile: Layout | GridItem): boolean => {
    const tileBottomRow = tile.y + tile.h;
    return tileBottomRow > MAX_VISIBLE_ROWS;
  }, []);

  // Helper function to find available space for a tile
  const findAvailableSpace = useCallback((tileToPlace: Layout | GridItem, currentLayout: Layout[]): { x: number; y: number; w: number; h: number } | null => {
    const minTileWidth = Math.max(tileToPlace.minW || 2, 2); // Minimum width of 2
    const minTileHeight = Math.max(tileToPlace.minH || 1, 1); // Minimum height of 1
    
    // Create a grid to track occupied spaces
    const grid: boolean[][] = Array(MAX_VISIBLE_ROWS).fill(null).map(() => Array(12).fill(false));
    
    // Mark occupied spaces
    currentLayout.forEach(item => {
      if (item.i !== tileToPlace.i) { // Don't consider the tile we're trying to place
        for (let row = item.y; row < item.y + item.h && row < MAX_VISIBLE_ROWS; row++) {
          for (let col = item.x; col < item.x + item.w && col < 12; col++) {
            grid[row][col] = true;
          }
        }
      }
    });
    
    // Try to find space starting from top-left, prioritizing minimal size
    for (let y = 0; y <= MAX_VISIBLE_ROWS - minTileHeight; y++) {
      for (let x = 0; x <= 12 - minTileWidth; x++) {
        // Check if we can fit the minimal size here
        let canFit = true;
        for (let row = y; row < y + minTileHeight && canFit; row++) {
          for (let col = x; col < x + minTileWidth && canFit; col++) {
            if (grid[row][col]) {
              canFit = false;
            }
          }
        }
        
        if (canFit) {
          // Try to find the maximum size we can fit at this position
          let maxWidth = minTileWidth;
          let maxHeight = minTileHeight;
          
          // Expand width
          for (let w = minTileWidth + 1; w <= 12 - x; w++) {
            let canExpandWidth = true;
            for (let row = y; row < y + minTileHeight && canExpandWidth; row++) {
              if (grid[row][x + w - 1]) {
                canExpandWidth = false;
              }
            }
            if (canExpandWidth) {
              maxWidth = w;
            } else {
              break;
            }
          }
          
          // Expand height
          for (let h = minTileHeight + 1; h <= MAX_VISIBLE_ROWS - y; h++) {
            let canExpandHeight = true;
            for (let col = x; col < x + maxWidth && canExpandHeight; col++) {
              if (grid[y + h - 1][col]) {
                canExpandHeight = false;
              }
            }
            if (canExpandHeight) {
              maxHeight = h;
            } else {
              break;
            }
          }
          
          return {
            x,
            y,
            w: Math.min(maxWidth, tileToPlace.maxW || 12),
            h: Math.min(maxHeight, tileToPlace.maxH || MAX_VISIBLE_ROWS)
          };
        }
      }
    }
    
    return null; // No available space found
  }, []);

  // Helper function to handle tiles that exceed boundary - no repositioning, just rollback/remove
  const handleTileExceedingBoundary = useCallback((tileId: string) => {
    console.warn(`Tile ${tileId} exceeds boundary. Rolling back to last valid layout.`);
    
    // Attempt to rollback to last valid layout state
    const rollbackResult = rollbackToLastValid();
    
    if (!rollbackResult.success) {
      console.error(`Failed to rollback layout for tile ${tileId}. No valid history available. Removing tile.`);
      removeTile(tileId);
      return;
    }
    
    // Check the restored layout for tiles still beyond boundary
    if (rollbackResult.layouts) {
      const tilesStillBeyondBoundary = rollbackResult.layouts.lg.filter(item => {
        const tileBottomRow = item.y + item.h;
        return tileBottomRow > MAX_VISIBLE_ROWS;
      });
      
      if (tilesStillBeyondBoundary.length > 0) {
        console.warn(`Layout still invalid after rollback. Removing ${tilesStillBeyondBoundary.length} tiles beyond boundary.`);
        
        // Remove all tiles that are still beyond the boundary
        tilesStillBeyondBoundary.forEach(tile => {
          console.log(`Removing tile ${tile.i} - position (${tile.x}, ${tile.y}) with size (${tile.w}x${tile.h}) extends beyond boundary (bottom row: ${tile.y + tile.h})`);
          removeTile(tile.i);
        });
      }
    }
  }, [rollbackToLastValid, removeTile]);

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

  // Handle automatic repositioning of tiles exceeding boundary after delay
  useEffect(() => {
    // Set up repositioning timeouts for tiles that exceed boundary
    tilesExceedingBoundary.forEach((tileId) => {
      if (!repositioningTimeoutsRef.current.has(tileId)) {
        // New tile exceeding boundary - wait 1 second, then start fade animation
        const delayTimeout = setTimeout(() => {
          // Start fade-out animation
          setTilesRepositioning((prev) => {
            const newSet = new Set(prev);
            newSet.add(tileId);
            return newSet;
          });

          // Handle tile after fade animation completes
          const repositioningTimeout = setTimeout(() => {
            handleTileExceedingBoundary(tileId);
            const timeoutRef = repositioningTimeoutsRef.current.get(tileId);
            if (timeoutRef) {
              repositioningTimeoutsRef.current.delete(tileId);
            }
            setTilesRepositioning((prev) => {
              const newSet = new Set(prev);
              newSet.delete(tileId);
              return newSet;
            });
          }, FADE_DURATION_MS);

          // Update the ref to include the repositioning timeout
          const timeoutRef = repositioningTimeoutsRef.current.get(tileId);
          if (timeoutRef) {
            timeoutRef.repositioningTimeout = repositioningTimeout;
          }
        }, REPOSITIONING_DELAY_MS);

        // Store the initial delay timeout
        repositioningTimeoutsRef.current.set(tileId, { delayTimeout });
      }
    });

    // Clean up timeouts for tiles that no longer exceed boundary
    repositioningTimeoutsRef.current.forEach((timeoutRef, tileId) => {
      if (!tilesExceedingBoundary.has(tileId)) {
        clearTimeout(timeoutRef.delayTimeout);
        if (timeoutRef.repositioningTimeout) {
          clearTimeout(timeoutRef.repositioningTimeout);
        }
        repositioningTimeoutsRef.current.delete(tileId);
        setTilesRepositioning((prev) => {
          const newSet = new Set(prev);
          newSet.delete(tileId);
          return newSet;
        });
      }
    });

    // Cleanup function
    return () => {
      repositioningTimeoutsRef.current.forEach((timeoutRef) => {
        clearTimeout(timeoutRef.delayTimeout);
        if (timeoutRef.repositioningTimeout) {
          clearTimeout(timeoutRef.repositioningTimeout);
        }
      });
      repositioningTimeoutsRef.current.clear();
    };
  }, [tilesExceedingBoundary, handleTileExceedingBoundary]);

  // Memoize children to prevent unnecessary re-renders
  const children = useMemo(() => {
    return state.layouts.lg.map((item) => {
      // Use state variable to check if tile exceeds boundary
      const exceedsBoundary = tilesExceedingBoundary.has(item.i);
      const isRepositioning = tilesRepositioning.has(item.i);
      
      return (
        <div
          key={item.i}
          style={{
            height: "100%",
            opacity: isRepositioning ? 0.5 : 1,
            transform: isRepositioning ? "scale(0.98)" : "none",
            // Only apply transition when repositioning, not during drag operations
            transition: isRepositioning 
              ? `opacity ${FADE_DURATION_MS}ms ease-out, transform ${FADE_DURATION_MS}ms ease-out`
              : "none",
          }}
        >
          <TileRenderer
            tileId={item.i}
            editMode={state.editMode}
            onRemove={() => removeTile(item.i)}
            onEdit={() => {
              // TODO: Implement tile editing functionality
              console.log("Edit tile:", item.i);
            }}
            error={exceedsBoundary}
          />
        </div>
      );
    });
  }, [state.layouts.lg, state.editMode, removeTile, tilesExceedingBoundary, tilesRepositioning]);

  // No validation - return layout as-is
  const validateLayout = useCallback((layout: Layout[]): Layout[] => {
    return layout;
  }, []);

  // No constraint validation - return items as-is
  const validateGridItemConstraints = useCallback((items: GridItem[]): GridItem[] => {
    return items;
  }, []);

  // Generate vertical stacked layout for sm breakpoint in view mode
  const smViewLayout = useMemo(() => {
    if (!isSmBreakpoint || state.editMode) {
      return null; // Only generate for sm breakpoint in view mode
    }

    // Stack all tiles vertically with equal width (full width = 12 columns)
    let currentY = 0;
    return state.layouts.lg.map((item) => {
      const stackedItem = {
        ...item,
        x: 0,
        y: currentY,
        w: 12, // Full width
        h: item.h, // Keep original height
      };
      currentY += item.h; // Move next tile below this one
      return stackedItem;
    });
  }, [isSmBreakpoint, state.editMode, state.layouts.lg]);

  // Memoize callback to prevent recreation
  const onLayoutChange = useCallback(
    (currentLayout: Layout[]) => {
      // Don't save layout changes when in sm view mode (to preserve localStorage)
      if (isSmBreakpoint && !state.editMode) {
        return;
      }

      // Save current layout to history before applying changes (only if in edit mode)
      if (state.editMode) {
        saveLayoutHistory("User layout change");
      }

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
    [updateLayouts, validateLayout, validateGridItemConstraints, isSmBreakpoint, state.editMode, saveLayoutHistory]
  );

  // Prevent tiles from being dragged beyond the boundary
  const onDrag = useCallback(
    (layout: Layout[], oldItem: Layout, newItem: Layout, placeholder: Layout, e: MouseEvent, element: HTMLElement) => {
      // Save history before first drag if not already saved (using a ref to track if we've saved for this drag session)
      // This ensures we only save once per drag operation, not on every drag move
      
      // Check if the new position would cause the tile to exceed the boundary
      const tileBottomRow = newItem.y + newItem.h;
      if (tileBottomRow > MAX_VISIBLE_ROWS) {
        // Constrain the y position to keep the tile within boundary
        const maxAllowedY = MAX_VISIBLE_ROWS - newItem.h;
        newItem.y = Math.max(0, maxAllowedY); // Ensure y is not negative
        placeholder.y = newItem.y; // Update placeholder to match
      }
    },
    []
  );

  // Save history before starting drag operations
  const onDragStart = useCallback(
    (layout: Layout[], oldItem: Layout, newItem: Layout, placeholder: Layout, e: MouseEvent, element: HTMLElement) => {
      if (state.editMode) {
        saveLayoutHistory(`Before dragging tile: ${oldItem.i}`);
      }
    },
    [state.editMode, saveLayoutHistory]
  );

  // Validate drag operations to ensure they don't exceed boundary
  const onDragStop = useCallback(
    (layout: Layout[], oldItem: Layout, newItem: Layout, placeholder: Layout, e: MouseEvent, element: HTMLElement) => {
      // Double-check that the final item doesn't exceed boundary
      const tileBottomRow = newItem.y + newItem.h;
      if (tileBottomRow > MAX_VISIBLE_ROWS) {
        // Revert to maximum allowed position
        const maxAllowedY = MAX_VISIBLE_ROWS - newItem.h;
        newItem.y = Math.max(0, maxAllowedY);
      }
    },
    []
  );

  // Prevent tiles from being resized beyond the boundary
  const onResize = useCallback(
    (layout: Layout[], oldItem: Layout, newItem: Layout, placeholder: Layout, e: MouseEvent, element: HTMLElement) => {
      // Check if the new item would exceed the boundary
      const tileBottomRow = newItem.y + newItem.h;
      if (tileBottomRow > MAX_VISIBLE_ROWS) {
        // Constrain the height to stay within boundary
        const maxAllowedHeight = MAX_VISIBLE_ROWS - newItem.y;
        newItem.h = Math.max(1, maxAllowedHeight); // Ensure minimum height of 1
        placeholder.h = newItem.h; // Update placeholder to match
      }
    },
    []
  );

  // Save history before starting resize operations
  const onResizeStart = useCallback(
    (layout: Layout[], oldItem: Layout, newItem: Layout, placeholder: Layout, e: MouseEvent, element: HTMLElement) => {
      if (state.editMode) {
        saveLayoutHistory(`Before resizing tile: ${oldItem.i}`);
      }
    },
    [state.editMode, saveLayoutHistory]
  );

  // Validate resize operations to ensure they don't exceed boundary
  const onResizeStop = useCallback(
    (layout: Layout[], oldItem: Layout, newItem: Layout, placeholder: Layout, e: MouseEvent, element: HTMLElement) => {
      // Double-check that the final item doesn't exceed boundary
      const tileBottomRow = newItem.y + newItem.h;
      if (tileBottomRow > MAX_VISIBLE_ROWS) {
        // Revert to maximum allowed height
        const maxAllowedHeight = MAX_VISIBLE_ROWS - newItem.y;
        newItem.h = Math.max(1, maxAllowedHeight);
      }
    },
    []
  );

  // Determine which layout to use: sm view mode layout or regular layout
  const activeLayout = useMemo(() => {
    if (smViewLayout) {
      return smViewLayout;
    }
    return state.layouts.lg;
  }, [smViewLayout, state.layouts.lg]);

  // Determine if we should use responsive width for sm breakpoint
  const gridWidth = useMemo(() => {
    if (isSmBreakpoint && !state.editMode) {
      // Use tracked window width for sm breakpoint in view mode
      return windowWidth;
    }
    return 1200; // Fixed width for larger screens
  }, [isSmBreakpoint, state.editMode, windowWidth]);

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
        layout={activeLayout}
        cols={12}
        rowHeight={60}
        width={gridWidth}
        onLayoutChange={onLayoutChange}
        onDragStart={onDragStart}
        onDrag={onDrag}
        onDragStop={onDragStop}
        onResizeStart={onResizeStart}
        onResize={onResize}
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
