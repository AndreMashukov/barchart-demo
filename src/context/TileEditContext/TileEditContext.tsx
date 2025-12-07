import React, { createContext, useContext, useEffect, ReactNode } from "react";
import { useBaseReducer } from "../../hooks/useBaseReducer";
import { Layout } from "react-grid-layout";

const STORAGE_KEY = "dashboard-tile-configuration";

// Size constraints helper function
export const getSizeConstraints = (isType2: boolean) => {
  // Size restrictions: Type1 = 300px, Type2 = 500px
  // Row height = 60px, so max height = 300px / 60px = 5 rows (Type1), 500px / 60px ≈ 8 rows (Type2)
  return {
    minW: isType2 ? 4 : 2,
    minH: isType2 ? 3 : 2,
    maxW: isType2 ? 8 : 5, // Max width in grid columns (Type2 = ~500px, Type1 = ~300px at 12-column layout)
    maxH: isType2 ? 8 : 5, // Max height in rows (Type2 = 480px, Type1 = 300px)
  };
};

// Validate and fix constraint conflicts
// Ensures: maxH >= minH, maxH >= current height, minH <= current height
const validateConstraints = (
  item: GridItem,
  defaultConstraints: ReturnType<typeof getSizeConstraints>
): GridItem => {
  const minH = item.minH ?? defaultConstraints.minH;
  const maxH = item.maxH ?? defaultConstraints.maxH;
  const currentH = item.h;
  
  let fixed = { ...item };
  let wasFixed = false;
  
  // Rule 1: maxH must be >= minH
  if (maxH < minH) {
    fixed.maxH = Math.max(defaultConstraints.maxH, minH);
    wasFixed = true;
  }
  
  // Rule 2: maxH must be >= current height
  if (fixed.maxH! < currentH) {
    fixed.maxH = Math.max(defaultConstraints.maxH, currentH);
    wasFixed = true;
  }
  
  // Rule 3: minH must be <= maxH (after fixes)
  if (minH > fixed.maxH!) {
    fixed.minH = Math.min(defaultConstraints.minH, fixed.maxH!);
    wasFixed = true;
  }
  
  // Rule 4: Ensure minH <= current height (if current height is valid)
  if (fixed.minH! > currentH) {
    fixed.minH = Math.min(defaultConstraints.minH, currentH);
    wasFixed = true;
  }
  
  if (wasFixed) {
    console.warn(`Fixed invalid constraints for tile ${item.i}`, {
      before: { minH: item.minH, maxH: item.maxH, h: item.h },
      after: { minH: fixed.minH, maxH: fixed.maxH, h: fixed.h }
    });
  }
  
  return fixed;
};

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
  isBounded?: boolean; // if true, item can't be dragged outside the grid container
}

// Layout history entry
export interface LayoutHistoryEntry {
  id: string; // unique identifier for this history entry
  timestamp: number; // when this state was saved
  layouts: {
    lg: GridItem[];
    md: GridItem[];
    sm: GridItem[];
    xs: GridItem[];
  };
  action?: string; // optional description of what action caused this state
  isValid: boolean; // whether this was a successful/valid layout state
}

export interface TileEditState {
  editMode: boolean;
  layouts: {
    lg: GridItem[];
    md: GridItem[];
    sm: GridItem[];
    xs: GridItem[];
  };
  layoutHistory: LayoutHistoryEntry[];
  maxHistorySize: number; // maximum number of history entries to keep
}

interface TileEditContextValue {
  state: TileEditState;
  toggleEditMode: () => void;
  addTile: (tileId: string) => void;
  removeTile: (tileId: string) => void;
  updateLayouts: (layouts: { lg: GridItem[]; md: GridItem[]; sm: GridItem[]; xs: GridItem[] }) => void;
  saveLayoutHistory: (action?: string) => void;
  rollbackToLastValid: () => { success: boolean; layouts?: { lg: GridItem[]; md: GridItem[]; sm: GridItem[]; xs: GridItem[] } };
  clearHistory: () => void;
}

const TileEditContext = createContext<TileEditContextValue | undefined>(undefined);

interface TileEditProviderProps {
  children: ReactNode;
}

const getInitialState = (): TileEditState => {
  // Helper to apply size constraints to grid items and validate them
  const applySizeConstraints = (items: GridItem[]): GridItem[] => {
    const { getTileConfigById } = require("../../config/availableTiles");
    
    return items.map(item => {
      const config = getTileConfigById(item.i);
      if (!config) return item;
      
      const isType2 = config.type === "Type2";
      const constraints = getSizeConstraints(isType2);
      
      // Apply default constraints if not set
      const itemWithDefaults = {
        ...item,
        minW: item.minW ?? constraints.minW,
        minH: item.minH ?? constraints.minH,
        maxW: item.maxW ?? constraints.maxW,
        maxH: item.maxH ?? constraints.maxH,
        isBounded: item.isBounded ?? true,
      };
      
      // Validate and fix constraint conflicts
      return validateConstraints(itemWithDefaults, constraints);
    });
  };
  
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
            layouts: {
              lg: applySizeConstraints(parsed.layouts.lg || []),
              md: applySizeConstraints(parsed.layouts.md || []),
              sm: applySizeConstraints(parsed.layouts.sm || []),
              xs: applySizeConstraints(parsed.layouts.xs || []),
            },
            layoutHistory: [], // Reset history on load
            maxHistorySize: 10, // Keep last 10 layout states
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
    layoutHistory: [],
    maxHistorySize: 10,
  };
};

export const TileEditProvider: React.FC<TileEditProviderProps> = ({ children }) => {
  const initialState = getInitialState();
  const { state, actions } = useBaseReducer<TileEditState>({
    initialState,
  });

  // Create initial history entry on first load
  useEffect(() => {
    if (state.layoutHistory.length === 0) {
      const initialHistoryEntry: LayoutHistoryEntry = {
        id: `history_initial_${Date.now()}`,
        timestamp: Date.now(),
        layouts: {
          lg: [...state.layouts.lg],
          md: [...state.layouts.md],
          sm: [...state.layouts.sm],
          xs: [...state.layouts.xs],
        },
        action: "Initial layout state",
        isValid: true,
      };
      actions.setLayoutHistory([initialHistoryEntry]);
    }
  }, []); // Only run once on mount

  // Persist to localStorage whenever layouts change
  useEffect(() => {
    if (typeof window !== "undefined") {
      const toStore = {
        layouts: state.layouts,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
    }
  }, [state.layouts]);

  // Save initial layout to history when component mounts
  useEffect(() => {
    // Only save initial history if we don't have any history yet and have some layout
    if (state.layoutHistory.length === 0 && state.layouts.lg.length > 0) {
      const initialHistoryEntry: LayoutHistoryEntry = {
        id: `initial_${Date.now()}`,
        timestamp: Date.now(),
        layouts: {
          lg: [...state.layouts.lg],
          md: [...state.layouts.md],
          sm: [...state.layouts.sm],
          xs: [...state.layouts.xs],
        },
        action: "Initial layout loaded",
        isValid: true,
      };
      actions.setLayoutHistory([initialHistoryEntry]);
    }
  }, [state.layouts.lg.length, state.layoutHistory.length, state.layouts, actions]);

  const toggleEditMode = () => {
    actions.setEditMode(!state.editMode);
  };

  const addTile = (tileId: string) => {
    // Save current state to history before making changes
    const historyEntry: LayoutHistoryEntry = {
      id: `history_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      layouts: {
        lg: [...state.layouts.lg],
        md: [...state.layouts.md],
        sm: [...state.layouts.sm],
        xs: [...state.layouts.xs],
      },
      action: `Before adding tile: ${tileId}`,
      isValid: true,
    };

    let newHistory = [...state.layoutHistory, historyEntry];
    if (newHistory.length > state.maxHistorySize) {
      newHistory = newHistory.slice(-state.maxHistorySize);
    }
    actions.setLayoutHistory(newHistory);

    const { getTileConfigById } = require("../../config/availableTiles");
    const config = getTileConfigById(tileId);
    if (!config) return;

    // Determine tile dimensions based on type - use minimal size
    const isType2 = config.type === "Type2";
    const constraints = getSizeConstraints(isType2);
    const w = constraints.minW; // Use minimal width
    const h = constraints.minH; // Use minimal height

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
      isBounded: true,
      ...constraints,
    };

    // Add to all breakpoints with minimal sizing
    const newLayouts = {
      lg: [...state.layouts.lg, newItem],
      md: [...state.layouts.md, { ...newItem, w: constraints.minW, maxW: isType2 ? 7 : 4 }],
      sm: [...state.layouts.sm, { ...newItem, w: Math.min(constraints.minW, 6), x: 0, maxW: 6 }], // Respect minimal width on small screens
      xs: [...state.layouts.xs, { ...newItem, w: Math.min(constraints.minW, 4), x: 0, maxW: 4 }], // Respect minimal width on mobile
    };

    actions.setLayouts(newLayouts);
  };

  const removeTile = (tileId: string) => {
    // Save current state to history before making changes
    const historyEntry: LayoutHistoryEntry = {
      id: `history_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      layouts: {
        lg: [...state.layouts.lg],
        md: [...state.layouts.md],
        sm: [...state.layouts.sm],
        xs: [...state.layouts.xs],
      },
      action: `Before removing tile: ${tileId}`,
      isValid: true,
    };

    let newHistory = [...state.layoutHistory, historyEntry];
    if (newHistory.length > state.maxHistorySize) {
      newHistory = newHistory.slice(-state.maxHistorySize);
    }
    actions.setLayoutHistory(newHistory);

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

  const saveLayoutHistory = (action?: string) => {
    const historyEntry: LayoutHistoryEntry = {
      id: `history_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      layouts: {
        lg: [...state.layouts.lg],
        md: [...state.layouts.md],
        sm: [...state.layouts.sm],
        xs: [...state.layouts.xs],
      },
      action: action || "Layout change",
      isValid: true, // Default to valid, can be marked invalid later
    };

    let newHistory = [...state.layoutHistory, historyEntry];
    
    // Keep only the last maxHistorySize entries
    if (newHistory.length > state.maxHistorySize) {
      newHistory = newHistory.slice(-state.maxHistorySize);
    }

    actions.setLayoutHistory(newHistory);
  };

  const rollbackToLastValid = (): { success: boolean; layouts?: { lg: GridItem[]; md: GridItem[]; sm: GridItem[]; xs: GridItem[] } } => {
    // Find the last valid layout state in history
    const validHistoryEntries = state.layoutHistory.filter(entry => entry.isValid);
    
    if (validHistoryEntries.length === 0) {
      console.warn("No valid layout history available for rollback");
      return { success: false };
    }

    const lastValidEntry = validHistoryEntries[validHistoryEntries.length - 1];
    
    // Restore the last valid layout
    actions.setLayouts(lastValidEntry.layouts);
    
    // Remove any history entries after this valid one to prevent confusion
    const rollbackIndex = state.layoutHistory.findIndex(entry => entry.id === lastValidEntry.id);
    if (rollbackIndex !== -1) {
      const cleanedHistory = state.layoutHistory.slice(0, rollbackIndex + 1);
      actions.setLayoutHistory(cleanedHistory);
    }

    console.log(`Rolled back to layout state: ${lastValidEntry.action} (${new Date(lastValidEntry.timestamp).toLocaleTimeString()})`);
    return { success: true, layouts: lastValidEntry.layouts };
  };

  const clearHistory = () => {
    actions.setLayoutHistory([]);
  };

  const value: TileEditContextValue = {
    state,
    toggleEditMode,
    addTile,
    removeTile,
    updateLayouts,
    saveLayoutHistory,
    rollbackToLastValid,
    clearHistory,
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
