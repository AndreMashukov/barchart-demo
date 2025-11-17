import {styled} from "@mui/material/styles";
import {Theme} from "@mui/material/styles/createTheme";
import React, {useMemo, FC, ReactNode} from "react";

interface StyledMainProps {
  opensidebar: boolean;
  drawerwidth: number;
  sidebarRequired?: boolean;
}

const StyledMain = styled("main", {
  shouldForwardProp: (prop: string) =>
    prop !== "drawerwidth" &&
    prop !== "opensidebar" &&
    prop !== "sidebarRequired",
})(
  ({
    theme,
    opensidebar,
    sidebarRequired,
    drawerwidth,
  }: StyledMainProps & {theme: Theme}) => ({
    flexGrow: 1,
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    background: "whitesmoke",
    minHeight: "100vh",
    marginLeft: sidebarRequired
      ? opensidebar
        ? drawerwidth
        : `calc(${theme.spacing(8)} + 1px)`
      : "none",
    marginTop: theme.mixins.toolbar.minHeight, // Add margin top for the header
    [theme.breakpoints.down("md")]: {
      background: "white",
    },
    ...(opensidebar && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
  })
);

interface MainProps {
  openSidebar: boolean;
  drawerWidth: number;
  children: ReactNode;
  sidebarRequired?: boolean;
}

const Main: FC<MainProps> = ({
  openSidebar,
  drawerWidth,
  children,
  sidebarRequired = true,
}) => {
  return useMemo(
    () => (
      <StyledMain
        opensidebar={openSidebar}
        drawerwidth={drawerWidth}
        sidebarRequired={sidebarRequired}
      >
        {children}
      </StyledMain>
    ),
    [
      openSidebar,
      drawerWidth,
      sidebarRequired,
      children,
    ]
  );
};

export default React.memo(Main);