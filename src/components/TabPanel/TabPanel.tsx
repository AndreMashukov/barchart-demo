import React from "react";
import Box from '@mui/material/Box';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      style={{ flex: 1, display: value === index ? 'flex' : 'none', flexDirection: 'column' }}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column' }}>
          {children}
        </Box>
      )}
    </div>
  );
};

export default TabPanel;
