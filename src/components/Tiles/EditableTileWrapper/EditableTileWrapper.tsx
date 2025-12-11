import React, { ReactNode } from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import Fade from "@mui/material/Fade";

interface EditableTileWrapperProps {
  children: ReactNode;
  editMode: boolean;
  onRemove: () => void;
  onEdit?: () => void;
  editable?: boolean;
}

const EditableTileWrapper: React.FC<EditableTileWrapperProps> = ({
  children,
  editMode,
  onRemove,
  onEdit,
  editable = true,
}) => {
  const handleRemoveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onRemove();
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (onEdit) {
      onEdit();
    }
  };

  return (
    <Fade in={true} timeout={500}>
      <Box sx={{ position: "relative", width: "100%", height: "100%" }}>
        {children}
        {editMode && (
          <>
            <Fade in={editMode} timeout={300}>
              <IconButton
                onClick={handleRemoveClick}
                onMouseDown={(e) => {
                  e.stopPropagation();
                }}
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  color: "white",
                  width: 32,
                  height: 32,
                  zIndex: 10,
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.7)",
                    transform: "scale(1.1)",
                  },
                  transition: "all 0.2s ease",
                }}
                size="small"
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Fade>
            {editable && onEdit && (
              <Fade in={editMode} timeout={300}>
                <IconButton
                  onClick={handleEditClick}
                  onMouseDown={(e) => {
                    e.stopPropagation();
                  }}
                  sx={{
                    position: "absolute",
                    top: 48,
                    right: 8,
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    color: "white",
                    width: 32,
                    height: 32,
                    zIndex: 10,
                    "&:hover": {
                      backgroundColor: "rgba(0, 0, 0, 0.7)",
                      transform: "scale(1.1)",
                    },
                    transition: "all 0.2s ease",
                  }}
                  size="small"
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Fade>
            )}
          </>
        )}
      </Box>
    </Fade>
  );
};

export default EditableTileWrapper;
