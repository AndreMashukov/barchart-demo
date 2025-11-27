import React, { createContext, useContext, useEffect, ReactNode } from "react";
import { useBaseReducer } from "../../hooks/useBaseReducer";
import { Layout } from "react-grid-layout";

const STORAGE_KEY = "dashboard-tile-configuration";

// Grid item represents a single tile in the dashboard
export interface GridItem extends Layout {
  i: string; // tile ID
  x: number; // grid column position
  y: number; // grid row position  
  w: number; // width in grid units
  h: number; // height in grid units
  minW?: number;
  maxW?: number;
  minH?: number;
  maxH?: number;
  static?: boolean; // if true, item can't be dragged or resized
}

export interface TileEditState {
  editMode: boolean;
  layouts: {
    lg: GridItem[];
    md: GridItem[];
    sm: GridItem[];
    xs: GridItem[];
  };
}

interface TileEditContextValue {
  state: TileEditState;
  toggleEditMode: () => void;
  addTile: (tileId: string) => void;
  removeTile: (tileId: string) => void;
  updateLayouts: (layouts: { lg: GridItem[]; md: GridItem[]; sm: GridItem[]; xs: GridItem[] }) => void;
}

const TileEditContext = createContext<TileEditContextValue | undefined>(undefined);

interface TileEditProviderProps {
  children: ReactNode;
}

const getInitialState = (): TileEditState => {
  // Try to load from localStorage
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // If new format exists, use it
        if (parsed.layouts) {
          return {
            editMode: false,
            layouts: parsed.layouts,
          };
        }
      } catch (e) {
        console.error("Failed to parse stored tile configuration:", e);
      }
    }
  }

  // Default state: empty grid
  return {
    editMode: false,
    layouts: {
      lg: [],
      md: [],
      sm: [],
      xs: [],
    },
  };
};

export const TileEditProvider: React.FC<TileEditProviderProps> = ({ children }) => {
  const initialState = getInitialState();
  const { state, actions } = useBaseReducer<TileEditState>({
    initialState,
  });

  // Persist to localStorage whenever layouts change
  useEffect(() => {
    if (typeof window !== "undefined") {
      const toStore = {
        layouts: state.layouts,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
    }
  }, [state.layouts]);

  const toggleEditMode = () => {
    actions.setEditMode(!state.editMode);
  };

  const addTile = (tileId: string) => {
    const { getTileConfigById } = require("../../config/availableTiles");
    const config = getTileConfigById(tileId);
    if (!config) return;

    // Determine tile dimensions based on type
    const isType2 = config.type === "Type2";
    const w = isType2 ? 6 : 3; // Type2 = half width, Type1 = quarter width
    const h = isType2 ? 4 : 2; // Type2 = 4 rows, Type1 = 2 rows

    // Find next available position
    const lgLayout = [...state.layouts.lg];
    let x = 0;
    let y = 0;

    // Simple algorithm: find first available spot
    if (lgLayout.length > 0) {
      const maxY = Math.max(...lgLayout.map(item => item.y + item.h));
      y = maxY;
    }

    const newItem: GridItem = {
      i: tileId,
      x,
      y,
      w,
      h,
      minW: isType2 ? 4 : 2,
      minH: isType2 ? 3 : 2,
    };

    // Add to all breakpoints with appropriate sizing
    const newLayouts = {
      lg: [...state.layouts.lg, newItem],
      md: [...state.layouts.md, { ...newItem, w: isType2 ? 5 : 3 }],
      sm: [...state.layouts.sm, { ...newItem, w: 6, x: 0 }], // Full width on small screens
      xs: [...state.layouts.xs, { ...newItem, w: 4, x: 0 }], // Full width on mobile
    };

    actions.setLayouts(newLayouts);
  };

  const removeTile = (tileId: string) => {
    const newLayouts = {
      lg: state.layouts.lg.filter(item => item.i !== tileId),
      md: state.layouts.md.filter(item => item.i !== tileId),
      sm: state.layouts.sm.filter(item => item.i !== tileId),
      xs: state.layouts.xs.filter(item => item.i !== tileId),
    };
    actions.setLayouts(newLayouts);
  };

  const updateLayouts = (layouts: { lg: GridItem[]; md: GridItem[]; sm: GridItem[]; xs: GridItem[] }) => {
    actions.setLayouts(layouts);
  };

  const value: TileEditContextValue = {
    state,
    toggleEditMode,
    addTile,
    removeTile,
    updateLayouts,
  };

  return <TileEditContext.Provider value={value}>{children}</TileEditContext.Provider>;
};

export const useTileEdit = (): TileEditContextValue => {
  const context = useContext(TileEditContext);
  if (context === undefined) {
    throw new Error("useTileEdit must be used within a TileEditProvider");
  }
  return context;
};
