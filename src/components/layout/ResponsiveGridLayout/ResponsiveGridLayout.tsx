import React, { useMemo, useCallback } from "react";
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

  // Memoize children to prevent unnecessary re-renders
  const children = useMemo(() => {
    return state.layouts.lg.map((item) => (
      <Box
        key={item.i}
        sx={{
          height: "100%",
          "& > div": {
            height: "100%",
          },
        }}
      >
        <TileRenderer
          tileId={item.i}
          editMode={state.editMode}
          onRemove={() => removeTile(item.i)}
        />
      </Box>
    ));
  }, [state.layouts.lg, state.editMode, removeTile]);

  // Memoize callback to prevent recreation
  const onLayoutChange = useCallback(
    (currentLayout: Layout[], allLayouts: { [key: string]: Layout[] }) => {
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
        }));
      };

      const newLayouts = {
        lg: convertToGridItems(allLayouts.lg || []),
        md: convertToGridItems(allLayouts.md || []),
        sm: convertToGridItems(allLayouts.sm || []),
        xs: convertToGridItems(allLayouts.xs || []),
      };

      updateLayouts(newLayouts);
    },
    [updateLayouts]
  );

  const onBreakpointChange = useCallback((breakpoint: string, cols: number) => {
    console.log("Breakpoint changed:", breakpoint, "Columns:", cols);
  }, []);

  return (
    <ResponsiveGridLayoutWithWidth
      className="layout"
      layouts={state.layouts}
      breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480 }}
      cols={{ lg: 12, md: 10, sm: 6, xs: 4 }}
      rowHeight={60}
      onLayoutChange={onLayoutChange}
      onBreakpointChange={onBreakpointChange}
      isDraggable={state.editMode}
      isResizable={state.editMode}
      compactType="vertical"
      preventCollision={false}
      margin={[8, 8]}
      containerPadding={[0, 0]}
      useCSSTransforms={true}
    >
      {children}
    </ResponsiveGridLayoutWithWidth>
  );
};

export default ResponsiveGridLayout;
