import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

// Icons
import BarChartIcon from '@mui/icons-material/BarChart';
import DashboardIcon from '@mui/icons-material/Dashboard';

import BarChart from '../../components/BarChart';
import PageContent from '../../components/Page/PageComponent/PageContent/PageContent';

const Dashboard: React.FC = () => {
  // Sample data for demonstration
  const sampleChartData = [
    { label: 'Q1 2024', value: 120, color: '#ff6384' },
    { label: 'Q2 2024', value: 190, color: '#36a2eb' },
    { label: 'Q3 2024', value: 300, color: '#ffce56' },
    { label: 'Q4 2024', value: 250, color: '#4bc0c0' },
  ];

  return (
    <PageContent title="Dashboard" userName="Developer">
      {/* Main Content */}
      <Typography variant="h3" sx={{ mb: 3, fontWeight: 600, color: '#333' }}>
        Tiles Dashboard
      </Typography>
      
      <Typography variant="h6" sx={{ mb: 3, color: '#666' }}>
        Explore our interactive dashboard with sidebar navigation
      </Typography>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 4 }}>
        {/* Dashboard Stats Cards */}
        <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
          <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
            <CardContent>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                152
              </Typography>
              <Typography variant="body2">
                Total Charts
              </Typography>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
          <Card sx={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
            <CardContent>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                48
              </Typography>
              <Typography variant="body2">
                Active Users
              </Typography>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
          <Card sx={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
            <CardContent>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                12.5k
              </Typography>
              <Typography variant="body2">
                Data Points
              </Typography>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
          <Card sx={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', color: 'white' }}>
            <CardContent>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                99.9%
              </Typography>
              <Typography variant="body2">
                Uptime
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Sample Chart */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
            Quarterly Performance
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <BarChart data={sampleChartData} />
          </Box>
        </CardContent>
      </Card>

      {/* Feature Cards */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 4 }}>
        <Box sx={{ flex: '1 1 300px' }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <BarChartIcon sx={{ mr: 1, color: '#fc7b00' }} />
                <Typography variant="h6">Interactive Charts</Typography>
              </Box>
              <Typography variant="body2" color="textSecondary">
                Create beautiful and interactive bar charts, pie charts, and line charts with ease. 
                Customize colors, animations, and data visualization to suit your needs.
              </Typography>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: '1 1 300px' }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <DashboardIcon sx={{ mr: 1, color: '#fc7b00' }} />
                <Typography variant="h6">Dashboard Analytics</Typography>
              </Box>
              <Typography variant="body2" color="textSecondary">
                Monitor your data in real-time with our comprehensive dashboard. 
                Track key metrics, performance indicators, and business insights.
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Instructions */}
      <Card sx={{ background: '#f8f9fa' }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            🚀 Getting Started
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Use the sidebar to navigate between different sections:
          </Typography>
          <Box component="ul" sx={{ pl: 2 }}>
            <li>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Dashboard:</strong> View overall statistics and metrics
              </Typography>
            </li>
            <li>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Charts:</strong> Explore different chart types (Bar, Pie, Line)
              </Typography>
            </li>
            <li>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Data Tables:</strong> Manage and view your data in tabular format
              </Typography>
            </li>
            <li>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Settings:</strong> Customize your experience and preferences
              </Typography>
            </li>
          </Box>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
            Click the arrow icon on the sidebar to expand or collapse the menu.
          </Typography>
        </CardContent>
      </Card>
    </PageContent>
  );
};

export { Dashboard };
export default Dashboard;