import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import PageContent from '../../components/Page/PageComponent/PageContent/PageContent';
import TabGeneral from './TabGeneral';

const Dashboard: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const a11yProps = (index: number) => {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  };

  return (
    <PageContent title="Dashboard" userName="Developer">
      <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider'}}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="dashboard tabs">
            <Tab label="General" {...a11yProps(0)} />
          </Tabs>
        </Box>
        <TabGeneral value={tabValue} index={0} />
      </Box>
    </PageContent>
  );
};

export { Dashboard };
export default Dashboard;