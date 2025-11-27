import React, { useState } from "react";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import TileSelectorModal from "../../components/Tiles/TileSelectorModal";
import PageContent from "../../components/Page/PageComponent/PageContent/PageContent";
import TabGeneral from "./TabGeneral";
import { TileEditProvider, useTileEdit } from "../../context/TileEditContext";

const DashboardContent: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const { state, toggleEditMode, addTile } = useTileEdit();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleAddTileClick = () => {
    setModalOpen(true);
  };

  const handleTileSelect = (tileId: string) => {
    addTile(tileId);
    setModalOpen(false);
  };

  const placedTileIds = state.layouts.lg.map((item) => item.i);

  const a11yProps = (index: number) => {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  };

  return (
    <PageContent title="Dashboard" userName="Developer">
      <Box sx={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider", display: "flex", justifyContent: "space-between", alignItems: "center", pr: 2 }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="dashboard tabs">
            <Tab label="General" {...a11yProps(0)} />
          </Tabs>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {state.editMode && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddTileClick}
                sx={{ textTransform: "none" }}
              >
                Add Tile
              </Button>
            )}
            <FormControlLabel
              control={<Switch checked={state.editMode} onChange={toggleEditMode} />}
              label="Edit Mode"
            />
          </Box>
        </Box>
        <TabGeneral value={tabValue} index={0} />
        <TileSelectorModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          allowedTypes={["Type1", "Type2"]}
          onSelectTile={handleTileSelect}
          excludedTileIds={placedTileIds}
        />
      </Box>
    </PageContent>
  );
};

const Dashboard: React.FC = () => {
  return (
    <TileEditProvider>
      <DashboardContent />
    </TileEditProvider>
  );
};

export { Dashboard };
export default Dashboard;