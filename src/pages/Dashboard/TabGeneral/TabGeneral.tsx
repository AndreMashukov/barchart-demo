import React from 'react';
import Box from '@mui/material/Box';
import { blue, indigo, orange, green } from '@mui/material/colors';
import TabPanel from '../../../components/TabPanel';
import SimpleTile from '../../../components/Tiles/SimpleTile';

interface TabGeneralProps {
  value: number;
  index: number;
}

const TabGeneral: React.FC<TabGeneralProps> = ({ value, index }) => {
  return (
    <TabPanel value={value} index={index}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4, flex: 1 }}>
        {/* Dashboard Stats Tiles */}
        <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
          <SimpleTile
            count={152}
            label="Total Charts"
            loading={false}
            color="white"
            backgroundColor={indigo[900]}
          />
        </Box>

        <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
          <SimpleTile
            count={48}
            label="Active Users"
            loading={false}
            color="white"
            backgroundColor={orange[700]}
          />
        </Box>

        <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
          <SimpleTile
            count={12500}
            label="Data Points"
            loading={false}
            color="white"
            backgroundColor={blue[500]}
          />
        </Box>

        <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
          <SimpleTile
            count={99.9}
            label="Uptime %"
            loading={false}
            color="white"
            backgroundColor={green[600]}
          />
        </Box>
      </Box>
    </TabPanel>
  );
};

export default TabGeneral;
