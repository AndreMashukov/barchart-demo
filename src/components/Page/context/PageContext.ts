import { createContext } from "react";

export interface PageState {
  openSidebar: boolean;
  isOpenRightDrawer: boolean;
  isArrowActive: boolean;
}

export interface PageActions {
  setOpen: (open: boolean) => void;
  setIsOpenRightDrawer: (open: boolean) => void;
  setIsArrowActive: (active: boolean) => void;
}

export interface PageContextType {
  state: PageState;
  actions: PageActions;
}

export const PageContext = createContext<PageContextType>({
  state: {
    openSidebar: true,
    isOpenRightDrawer: true,
    isArrowActive: true,
  },
  actions: {
    setOpen: () => {},
    setIsOpenRightDrawer: () => {},
    setIsArrowActive: () => {},
  },
});