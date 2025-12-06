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
const MAX_VISIBLE_ROWS = 10;
const ROW_HEIGHT = 60;
const ROW_MARGIN = 8;
const boundaryPixels = MAX_VISIBLE_ROWS * ROW_HEIGHT + (MAX_VISIBLE_ROWS - 1) * ROW_MARGIN;
const REMOVAL_DELAY_MS = 1000; // 1 second delay before removal
const FADE_OUT_DURATION_MS = 500; // Animation duration

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
  const { state, removeTile, updateLayouts } = useTileEdit();
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
  
  // State variable to track tiles that are being removed (fading out)
  const [tilesRemoving, setTilesRemoving] = useState<Set<string>>(new Set());
  
  // Ref to store timeout IDs for cleanup (stores both delay and removal timeouts)
  interface TimeoutRef {
    delayTimeout: NodeJS.Timeout;
    removalTimeout?: NodeJS.Timeout;
  }
  const removalTimeoutsRef = useRef<Map<string, TimeoutRef>>(new Map());

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

  // Handle automatic removal of tiles exceeding boundary after delay
  useEffect(() => {
    // Clean up any existing timeouts for tiles that no longer exceed boundary
    tilesExceedingBoundary.forEach((tileId) => {
      if (!removalTimeoutsRef.current.has(tileId)) {
        // New tile exceeding boundary - wait 1 second, then start fade animation
        const delayTimeout = setTimeout(() => {
          // Start fade-out animation
          setTilesRemoving((prev) => {
            const newSet = new Set(prev);
            newSet.add(tileId);
            return newSet;
          });

          // Remove tile after fade animation completes
          const removalTimeout = setTimeout(() => {
            removeTile(tileId);
            const timeoutRef = removalTimeoutsRef.current.get(tileId);
            if (timeoutRef) {
              removalTimeoutsRef.current.delete(tileId);
            }
            setTilesRemoving((prev) => {
              const newSet = new Set(prev);
              newSet.delete(tileId);
              return newSet;
            });
          }, FADE_OUT_DURATION_MS);

          // Update the ref to include the removal timeout
          const timeoutRef = removalTimeoutsRef.current.get(tileId);
          if (timeoutRef) {
            timeoutRef.removalTimeout = removalTimeout;
          }
        }, REMOVAL_DELAY_MS);

        // Store the initial delay timeout
        removalTimeoutsRef.current.set(tileId, { delayTimeout });
      }
    });

    // Clean up timeouts for tiles that no longer exceed boundary
    removalTimeoutsRef.current.forEach((timeoutRef, tileId) => {
      if (!tilesExceedingBoundary.has(tileId)) {
        clearTimeout(timeoutRef.delayTimeout);
        if (timeoutRef.removalTimeout) {
          clearTimeout(timeoutRef.removalTimeout);
        }
        removalTimeoutsRef.current.delete(tileId);
        setTilesRemoving((prev) => {
          const newSet = new Set(prev);
          newSet.delete(tileId);
          return newSet;
        });
      }
    });

    // Cleanup function
    return () => {
      removalTimeoutsRef.current.forEach((timeoutRef) => {
        clearTimeout(timeoutRef.delayTimeout);
        if (timeoutRef.removalTimeout) {
          clearTimeout(timeoutRef.removalTimeout);
        }
      });
      removalTimeoutsRef.current.clear();
    };
  }, [tilesExceedingBoundary, removeTile]);

  // Memoize children to prevent unnecessary re-renders
  const children = useMemo(() => {
    return state.layouts.lg.map((item) => {
      // Use state variable to check if tile exceeds boundary
      const exceedsBoundary = tilesExceedingBoundary.has(item.i);
      const isRemoving = tilesRemoving.has(item.i);
      
      return (
        <div
          key={item.i}
          style={{
            height: "100%",
            opacity: isRemoving ? 0 : 1,
            transform: isRemoving ? "scale(0.95)" : "none",
            // Only apply transition when removing, not during drag operations
            transition: isRemoving 
              ? `opacity ${FADE_OUT_DURATION_MS}ms ease-out, transform ${FADE_OUT_DURATION_MS}ms ease-out`
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
  }, [state.layouts.lg, state.editMode, removeTile, tilesExceedingBoundary, tilesRemoving]);

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
    [updateLayouts, validateLayout, validateGridItemConstraints, isSmBreakpoint, state.editMode]
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
