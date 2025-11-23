import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grow from "@mui/material/Grow";
import { TileType, TileConfig, availableTiles } from "../../../config/availableTiles";

interface TileSelectorModalProps {
  open: boolean;
  onClose: () => void;
  allowedTypes: TileType[];
  onSelectTile: (tileId: string) => void;
  excludedTileIds: string[];
}

const TileSelectorModal: React.FC<TileSelectorModalProps> = ({
  open,
  onClose,
  allowedTypes,
  onSelectTile,
  excludedTileIds,
}) => {
  // Filter tiles by allowed types and exclude already placed tiles
  const availableForSelection = availableTiles.filter(
    (tile) => allowedTypes.includes(tile.type) && !excludedTileIds.includes(tile.id)
  );

  const handleTileClick = (tileId: string) => {
    onSelectTile(tileId);
    onClose();
  };

  const getTitle = () => {
    if (allowedTypes.length === 1) {
      return `Select ${allowedTypes[0] === "Type1" ? "a Simple" : "a Sparkline"} Tile`;
    }
    return "Select a Tile";
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{getTitle()}</DialogTitle>
      <DialogContent>
        {availableForSelection.length === 0 ? (
          <Box sx={{ py: 4, textAlign: "center" }}>
            <Typography color="text.secondary">
              No more tiles available. All tiles are already in use.
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 1 }}>
            {availableForSelection.map((tile, index) => (
              <Box key={tile.id} sx={{ flex: "1 1 calc(50% - 8px)", minWidth: "200px" }}>
                <Grow in={true} timeout={300 + index * 100}>
                  <Box
                    onClick={() => handleTileClick(tile.id)}
                    sx={{
                      p: 3,
                      border: "2px solid",
                      borderColor: "grey.300",
                      borderRadius: 2,
                      cursor: "pointer",
                      backgroundColor: tile.backgroundColor,
                      color: tile.color,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        borderColor: "primary.main",
                        transform: "translateY(-4px)",
                        boxShadow: 3,
                      },
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                      {tile.label}
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                      {tile.component}
                    </Typography>
                  </Box>
                </Grow>
              </Box>
            ))}
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TileSelectorModal;
