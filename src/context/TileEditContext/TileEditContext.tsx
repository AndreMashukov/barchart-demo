import React, { createContext, useContext, useEffect, ReactNode } from "react";
import { useBaseReducer } from "../../hooks/useBaseReducer";

const STORAGE_KEY = "dashboard-tile-configuration";

// Each slot can contain either:
// - An array of 4 Type1 tile IDs (quadrants: [TL, TR, BL, BR])
// - A single Type2 tile ID (string)
export type SlotContent = [string | null, string | null, string | null, string | null] | string | null;

export interface TileEditState {
  editMode: boolean;
  row1Tiles: SlotContent[];
  row2Tiles: SlotContent[];
}

interface TileEditContextValue {
  state: TileEditState;
  toggleEditMode: () => void;
  addTileToQuadrant: (tileId: string, row: 1 | 2, slotIndex: number, quadrant: number) => void;
  addTileToCenter: (tileId: string, row: 1 | 2, slotIndex: number) => void;
  removeTileFromQuadrant: (row: 1 | 2, slotIndex: number, quadrant: number) => void;
  removeEntireSlot: (row: 1 | 2, slotIndex: number) => void;
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
        return {
          editMode: false, // Always start in view mode
          row1Tiles: parsed.row1Tiles || [null, null],
          row2Tiles: parsed.row2Tiles || [null, null],
        };
      } catch (e) {
        console.error("Failed to parse stored tile configuration:", e);
      }
    }
  }

  // Default state: 2 empty slots per row
  return {
    editMode: false,
    row1Tiles: [null, null],
    row2Tiles: [null, null],
  };
};

export const TileEditProvider: React.FC<TileEditProviderProps> = ({ children }) => {
  const initialState = getInitialState();
  const { state, actions } = useBaseReducer<TileEditState>({
    initialState,
  });

  // Persist to localStorage whenever tile configuration changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      const toStore = {
        row1Tiles: state.row1Tiles,
        row2Tiles: state.row2Tiles,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
    }
  }, [state.row1Tiles, state.row2Tiles]);

  const toggleEditMode = () => {
    actions.setEditMode(!state.editMode);
  };

  const addTileToQuadrant = (tileId: string, row: 1 | 2, slotIndex: number, quadrant: number) => {
    const tiles = row === 1 ? [...state.row1Tiles] : [...state.row2Tiles];
    const currentSlot = tiles[slotIndex];
    
    // Initialize quadrants array if slot is empty or has a Type2 tile
    let quadrants: [string | null, string | null, string | null, string | null];
    if (Array.isArray(currentSlot)) {
      quadrants = [...currentSlot] as [string | null, string | null, string | null, string | null];
    } else {
      quadrants = [null, null, null, null];
    }
    
    quadrants[quadrant] = tileId;
    tiles[slotIndex] = quadrants;
    
    if (row === 1) {
      actions.setRow1Tiles(tiles);
    } else {
      actions.setRow2Tiles(tiles);
    }
  };

  const addTileToCenter = (tileId: string, row: 1 | 2, slotIndex: number) => {
    const tiles = row === 1 ? [...state.row1Tiles] : [...state.row2Tiles];
    tiles[slotIndex] = tileId; // Replace entire slot with Type2 tile
    
    if (row === 1) {
      actions.setRow1Tiles(tiles);
    } else {
      actions.setRow2Tiles(tiles);
    }
  };

  const removeTileFromQuadrant = (row: 1 | 2, slotIndex: number, quadrant: number) => {
    const tiles = row === 1 ? [...state.row1Tiles] : [...state.row2Tiles];
    const currentSlot = tiles[slotIndex];
    
    if (Array.isArray(currentSlot)) {
      const quadrants = [...currentSlot] as [string | null, string | null, string | null, string | null];
      quadrants[quadrant] = null;
      
      // If all quadrants are empty, set slot to null
      const allEmpty = quadrants.every(q => q === null);
      tiles[slotIndex] = allEmpty ? null : quadrants;
      
      if (row === 1) {
        actions.setRow1Tiles(tiles);
      } else {
        actions.setRow2Tiles(tiles);
      }
    }
  };

  const removeEntireSlot = (row: 1 | 2, slotIndex: number) => {
    const tiles = row === 1 ? [...state.row1Tiles] : [...state.row2Tiles];
    tiles[slotIndex] = null;
    
    if (row === 1) {
      actions.setRow1Tiles(tiles);
    } else {
      actions.setRow2Tiles(tiles);
    }
  };

  const value: TileEditContextValue = {
    state,
    toggleEditMode,
    addTileToQuadrant,
    addTileToCenter,
    removeTileFromQuadrant,
    removeEntireSlot,
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
