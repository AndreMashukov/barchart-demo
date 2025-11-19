import React, { createContext, useContext, useEffect, ReactNode } from "react";
import { useBaseReducer } from "../../hooks/useBaseReducer";

const STORAGE_KEY = "dashboard-tile-configuration";

export interface TileEditState {
  editMode: boolean;
  row1Tiles: (string | null)[];
  row2Tiles: (string | null)[];
}

interface TileEditContextValue {
  state: TileEditState;
  toggleEditMode: () => void;
  addTile: (tileId: string, row: 1 | 2, index: number) => void;
  removeTile: (row: 1 | 2, index: number) => void;
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
          row1Tiles: parsed.row1Tiles || [null, null, null, null],
          row2Tiles: parsed.row2Tiles || [null, null],
        };
      } catch (e) {
        console.error("Failed to parse stored tile configuration:", e);
      }
    }
  }

  // Default state: empty placeholders
  return {
    editMode: false,
    row1Tiles: [null, null, null, null],
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

  const addTile = (tileId: string, row: 1 | 2, index: number) => {
    if (row === 1) {
      const newRow1 = [...state.row1Tiles];
      newRow1[index] = tileId;
      actions.setRow1Tiles(newRow1);
    } else {
      const newRow2 = [...state.row2Tiles];
      newRow2[index] = tileId;
      actions.setRow2Tiles(newRow2);
    }
  };

  const removeTile = (row: 1 | 2, index: number) => {
    if (row === 1) {
      const newRow1 = [...state.row1Tiles];
      newRow1[index] = null;
      actions.setRow1Tiles(newRow1);
    } else {
      const newRow2 = [...state.row2Tiles];
      newRow2[index] = null;
      actions.setRow2Tiles(newRow2);
    }
  };

  const value: TileEditContextValue = {
    state,
    toggleEditMode,
    addTile,
    removeTile,
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
