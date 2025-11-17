import Badge from "@mui/material/Badge";
import IconButton from "@mui/material/IconButton";
import React from "react";

interface CustomIconButtonProps {
  dataCy?: string;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  IconComponent: React.ElementType;
  badgeContent?: number;
}

const CustomIconButton: React.FC<CustomIconButtonProps> = ({
  dataCy,
  onClick,
  IconComponent,
  badgeContent,
}) => (
  <IconButton
    data-cy={dataCy}
    size="large"
    edge="end"
    color="inherit"
    onClick={onClick}
    sx={{ padding: 0, paddingX: 1.5 }}
  >
    {badgeContent ? (
      <Badge badgeContent={badgeContent} color="error">
        <IconComponent />
      </Badge>
    ) : (
      <IconComponent />
    )}
  </IconButton>
);

export default CustomIconButton;