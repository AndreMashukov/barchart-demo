/* eslint-disable no-use-before-define */
import ListItemButton, {
  ListItemButtonProps,
} from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import React, {ElementType} from "react";
import {grey} from "@mui/material/colors";
import Tooltip from "@mui/material/Tooltip";

type MenuItemBase = {
  id: string;
  title: string;
  icon: ElementType;
};

export type MenuItemWithPath = {path: string; children?: never} & MenuItemBase;

export type MenuItemWithChildren = {
  path?: never;
  children: MenuItem[];
} & MenuItemBase;

export type MenuItem = MenuItemWithPath | MenuItemWithChildren;

export const StyledListItemButton = ({
  open,
  children,
  level = 1,
  ...others
}: {
  open: boolean;
  children: React.ReactNode;
  level?: number;
} & ListItemButtonProps) => (
  <ListItemButton
    sx={{
      minHeight: 48,
      justifyContent: open ? "initial" : "center",
      paddingLeft: open ? 2.5 + (level - 1) * 2 : 2.5,
      paddingRight: 2.5,
      // Expanded state: grey background unless selected
      // Submenu group that are expanded
      "&.DESubMenu-expanded": {
        backgroundColor: grey[100],
        "&.Mui-focusVisible, &:hover": {
          backgroundColor: grey[100],
        },
      },
      // Submenu list item that under the expanded group, unless it is selected
      ".DESubMenu-expanded &.MuiListItemButton-root:not(.Mui-selected)": {
        backgroundColor: grey[100],
      },
      // Selected state: always orange, even if expanded
      "&.Mui-selected": {
        color: "#FF7A00",
        "& .MuiListItemIcon-root": {
          color: "#FF7A00",
        },
        "& svg path#simple-icon": {
          fill: "#FF7A00",
        },
        "& svg path#layer-icon, circle#layer-icon": {
          stroke: "#FF7A00",
        },
      },
      // Focus/hover: no highlight, keep bg as is
      "&.Mui-focusVisible, &:hover": {
        backgroundColor: "inherit",
      },
    }}
    {...others}
    disableRipple
  >
    {children}
  </ListItemButton>
);

const CustomTooltip = ({title, children}: {title: string; children: React.ReactElement}) => (
  <Tooltip title={title} placement="right">
    {children}
  </Tooltip>
);

const CustomLinkButton = ({
  menu,
  open,
  selected,
  level,
}: {
  menu: MenuItem;
  open: boolean;
  selected: boolean;
  level?: number;
}) => {
  const icon = (
    <ListItemIcon
      sx={{
        minWidth: 0,
        mr: open ? 3 : "auto",
        justifyContent: "center",
      }}
    >
      <menu.icon />
    </ListItemIcon>
  );
  return (
    <StyledListItemButton open={open} selected={selected} level={level}>
      {open && icon}
      {!open && <CustomTooltip title={menu.title}>{icon}</CustomTooltip>}
      <ListItemText primary={menu.title} sx={{opacity: open ? 1 : 0}} />
    </StyledListItemButton>
  );
};

export default React.memo(CustomLinkButton);