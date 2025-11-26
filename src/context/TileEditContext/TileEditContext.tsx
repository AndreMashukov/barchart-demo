import React, { createContext, useContext, useEffect, ReactNode } from "react";
import { useBaseReducer } from "../../hooks/useBaseReducer";

const STORAGE_KEY = "dashboard-tile-configuration";

// Each composite slot can contain either:
// - An array of 4 Type1 tile IDs (quadrants: [TL, TR, BL, BR])
// - A single Type2 tile ID (string)
export type CompositeSlotContent = [string | null, string | null, string | null, string | null] | string | null;

export interface TileEditState {
  editMode: boolean;
  row1CompositeSlots: CompositeSlotContent[];
  row2CompositeSlots: CompositeSlotContent[];
}

interface TileEditContextValue {
  state: TileEditState;
  toggleEditMode: () => void;
  addTileToQuadrant: (tileId: string, row: 1 | 2, compositeSlotIndex: number, quadrant: number) => void;
  addTileToCenter: (tileId: string, row: 1 | 2, compositeSlotIndex: number) => void;
  removeTileFromQuadrant: (row: 1 | 2, compositeSlotIndex: number, quadrant: number) => void;
  removeEntireCompositeSlot: (row: 1 | 2, compositeSlotIndex: number) => void;
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
          row1CompositeSlots: parsed.row1CompositeSlots || parsed.row1Tiles || [null, null],
          row2CompositeSlots: parsed.row2CompositeSlots || parsed.row2Tiles || [null, null],
        };
      } catch (e) {
        console.error("Failed to parse stored tile configuration:", e);
      }
    }
  }

  // Default state: 2 empty composite slots per row
  return {
    editMode: false,
    row1CompositeSlots: [null, null],
    row2CompositeSlots: [null, null],
  };
};

export const TileEditProvider: React.FC<TileEditProviderProps> = ({ children }) => {
  const initialState = getInitialState();
  const { state, actions } = useBaseReducer<TileEditState>({
    initialState,
  });

  // Persist to localStorage whenever composite slot configuration changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      const toStore = {
        row1CompositeSlots: state.row1CompositeSlots,
        row2CompositeSlots: state.row2CompositeSlots,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
    }
  }, [state.row1CompositeSlots, state.row2CompositeSlots]);

  const toggleEditMode = () => {
    actions.setEditMode(!state.editMode);
  };

  const addTileToQuadrant = (tileId: string, row: 1 | 2, compositeSlotIndex: number, quadrant: number) => {
    const compositeSlots = row === 1 ? [...state.row1CompositeSlots] : [...state.row2CompositeSlots];
    const currentCompositeSlot = compositeSlots[compositeSlotIndex];
    
    // Initialize quadrants array if composite slot is empty or has a Type2 tile
    let quadrants: [string | null, string | null, string | null, string | null];
    if (Array.isArray(currentCompositeSlot)) {
      quadrants = [...currentCompositeSlot] as [string | null, string | null, string | null, string | null];
    } else {
      quadrants = [null, null, null, null];
    }
    
    quadrants[quadrant] = tileId;
    compositeSlots[compositeSlotIndex] = quadrants;
    
    if (row === 1) {
      actions.setRow1CompositeSlots(compositeSlots);
    } else {
      actions.setRow2CompositeSlots(compositeSlots);
    }
  };

  const addTileToCenter = (tileId: string, row: 1 | 2, compositeSlotIndex: number) => {
    const compositeSlots = row === 1 ? [...state.row1CompositeSlots] : [...state.row2CompositeSlots];
    compositeSlots[compositeSlotIndex] = tileId; // Replace entire composite slot with Type2 tile
    
    if (row === 1) {
      actions.setRow1CompositeSlots(compositeSlots);
    } else {
      actions.setRow2CompositeSlots(compositeSlots);
    }
  };

  const removeTileFromQuadrant = (row: 1 | 2, compositeSlotIndex: number, quadrant: number) => {
    const compositeSlots = row === 1 ? [...state.row1CompositeSlots] : [...state.row2CompositeSlots];
    const currentCompositeSlot = compositeSlots[compositeSlotIndex];
    
    if (Array.isArray(currentCompositeSlot)) {
      const quadrants = [...currentCompositeSlot] as [string | null, string | null, string | null, string | null];
      quadrants[quadrant] = null;
      
      // If all quadrants are empty, set composite slot to null
      const allEmpty = quadrants.every(q => q === null);
      compositeSlots[compositeSlotIndex] = allEmpty ? null : quadrants;
      
      if (row === 1) {
        actions.setRow1CompositeSlots(compositeSlots);
      } else {
        actions.setRow2CompositeSlots(compositeSlots);
      }
    }
  };

  const removeEntireCompositeSlot = (row: 1 | 2, compositeSlotIndex: number) => {
    const compositeSlots = row === 1 ? [...state.row1CompositeSlots] : [...state.row2CompositeSlots];
    compositeSlots[compositeSlotIndex] = null;
    
    if (row === 1) {
      actions.setRow1CompositeSlots(compositeSlots);
    } else {
      actions.setRow2CompositeSlots(compositeSlots);
    }
  };

  const value: TileEditContextValue = {
    state,
    toggleEditMode,
    addTileToQuadrant,
    addTileToCenter,
    removeTileFromQuadrant,
    removeEntireCompositeSlot,
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
