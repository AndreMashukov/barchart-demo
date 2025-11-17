import React, { useMemo } from 'react';
import { useBaseReducer } from '../../../hooks/useBaseReducer';
import { PageContext, PageState } from './PageContext';

interface PageContextProviderProps {
  children: React.ReactNode;
}

export const PageContextProvider: React.FC<PageContextProviderProps> = ({ children }) => {
  const { state, actions } = useBaseReducer({
    initialState: {
      openSidebar: true,
      isOpenRightDrawer: true,
      isArrowActive: true,
    } as PageState,
  });

  const pageActions = useMemo(() => ({
    setOpen: actions.setOpenSidebar,
    setIsOpenRightDrawer: actions.setIsOpenRightDrawer,
    setIsArrowActive: actions.setIsArrowActive,
  }), [actions.setOpenSidebar, actions.setIsOpenRightDrawer, actions.setIsArrowActive]);

  const contextValue = useMemo(() => ({
    state,
    actions: pageActions,
  }), [state, pageActions]);

  return (
    <PageContext.Provider value={contextValue}>
      {children}
    </PageContext.Provider>
  );
};