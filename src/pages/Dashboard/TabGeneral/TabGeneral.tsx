import React from 'react';
import Box from '@mui/material/Box';
import { blue, indigo, orange, green, purple, cyan, teal, pink } from '@mui/material/colors';
import TabPanel from '../../../components/TabPanel';
import SimpleTile from '../../../components/Tiles/SimpleTile';
import SparklineTileBarCol from '../../../components/Tiles/SparklineTileBarCol/SparklineTileBarCol';
import SparklineTileLineCol from '../../../components/Tiles/SparklineTileLineCol/SparklineTileLineCol';

interface TabGeneralProps {
  value: number;
  index: number;
}

// Mock data for sparklines
const mockBarData = [45, 52, 38, 65, 42, 58, 70, 61, 55, 48, 62, 68];

const mockRevenueData = [280, 320, 295, 340, 315, 370, 385, 360, 395, 410, 425, 440];
const mockTrafficData = [
  { date: '2024-01-01', value: 4200 },
  { date: '2024-02-01', value: 4580 },
  { date: '2024-03-01', value: 4320 },
  { date: '2024-04-01', value: 4890 },
  { date: '2024-05-01', value: 5120 },
  { date: '2024-06-01', value: 5450 },
  { date: '2024-07-01', value: 5680 },
];

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

        {/* Sparkline Tiles */}
        <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
          <SparklineTileBarCol
            count={68}
            label="Performance Score"
            loading={false}
            color="white"
            backgroundColor={purple[700]}
            sparklineData={mockBarData}
            sparklineHeight={40}
            sparklineWidth={200}
            highlightRange={[8, 11]}
            highlightColor={purple[300]}
          />
        </Box>

        <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
          <SparklineTileBarCol
            count={440}
            label="Revenue (k)"
            loading={false}
            color="white"
            backgroundColor={teal[600]}
            sparklineData={mockRevenueData}
            sparklineHeight={40}
            sparklineWidth={200}
          />
        </Box>

        <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
          <SparklineTileLineCol
            count={5680}
            label="Website Traffic"
            loading={false}
            color="white"
            backgroundColor={pink[600]}
            sparklineData={mockTrafficData}
            sparklineHeight={40}
            sparklineWidth={200}
          />
        </Box>
      </Box>
    </TabPanel>
  );
};

export default TabGeneral;
