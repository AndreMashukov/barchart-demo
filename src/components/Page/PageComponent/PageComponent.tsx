import React, { useContext, useLayoutEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';

// Layout components
import Sidebar from '../../layout/Sidebar/Sidebar';
import Main from '../../layout/Main/Main';
import Header from '../../layout/Header/Header';
import { PageContext } from '../context/PageContext';

// Icons for menu items
import DashboardIcon from '@mui/icons-material/Dashboard';
import BarChartIcon from '@mui/icons-material/BarChart';
import PieChartIcon from '@mui/icons-material/PieChart';
import TimelineIcon from '@mui/icons-material/Timeline';
import TableChartIcon from '@mui/icons-material/TableChart';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonIcon from '@mui/icons-material/Person';
import HelpIcon from '@mui/icons-material/Help';
import NotificationsIcon from '@mui/icons-material/Notifications';
import InventoryIcon from '@mui/icons-material/Inventory';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SearchIcon from '@mui/icons-material/Search';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Typography from '@mui/material/Typography';

interface PageComponentProps {
  children: React.ReactNode;
}

// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#fc7b00',
    },
    secondary: {
      main: '#1976d2',
    },
  },
});

// Menu items
const menuItems = [
  { id: '1', title: 'Dashboard', path: '/dashboard', icon: DashboardIcon },
  { id: '2', title: 'Bar Charts', path: '/bar-charts', icon: BarChartIcon },
  { id: '3', title: 'Pie Charts', path: '/pie-charts', icon: PieChartIcon },
  { id: '4', title: 'Line Charts', path: '/line-charts', icon: TimelineIcon },
  { id: '5', title: 'Data Tables', path: '/data-tables', icon: TableChartIcon },
  { id: '6', title: 'Inventory', path: '/inventory', icon: InventoryIcon },
  { id: '7', title: 'Notifications', path: '/notifications', icon: NotificationsIcon },
  { id: '8', title: 'Profile', path: '/profile', icon: PersonIcon },
  { id: '9', title: 'Settings', path: '/settings', icon: SettingsIcon },
  { id: '10', title: 'Help & Support', path: '/help', icon: HelpIcon },
];

const PageComponent: React.FC<PageComponentProps> = ({ children }) => {
  const { state, actions } = useContext(PageContext);
  const { openSidebar, isArrowActive } = state;
  const { setOpen, setIsArrowActive } = actions;

  const drawerWidth = 280;

  useLayoutEffect(() => {
    const openDrawerStatus = localStorage.getItem('isOpenDrawer');
    const isOpenDrawer = openDrawerStatus ? JSON.parse(openDrawerStatus) : true;
    setOpen(isOpenDrawer);
    setIsArrowActive(isOpenDrawer);
  }, []); // Remove dependencies to prevent infinite loop

  const handleToggleDrawer = () => {
    localStorage.setItem('isOpenDrawer', JSON.stringify(!openSidebar));
    setOpen(!openSidebar);
    setIsArrowActive(!isArrowActive);
  };

  // Header props with corner icons
  const headerProps = {
    title: "Tiles Dashboard",
    cornerIcons: [
      {
        Icon: SearchIcon,
        action: () => console.log("Search clicked"),
      },
      {
        Icon: NotificationsIcon,
        action: () => console.log("Notifications clicked"),
        badgeContent: 3,
      },
      {
        Icon: AccountCircleIcon,
        action: () => console.log("Profile clicked"),
      },
      {
        Icon: MoreVertIcon,
        action: () => console.log("More options clicked"),
      },
    ],
    state: { openSidebar },
    drawerWidth,
  };

  const sidebarProps = {
    openSidebar,
    setOpenSidebar: handleToggleDrawer,
    drawerWidth,
    menuList: menuItems,
    header: <></>,
    footer: (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="caption" color="textSecondary">
          © 2025 BarChart Demo
        </Typography>
      </Box>
    ),
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ 
        display: 'flex', 
        minHeight: '100vh',
        background: 'whitesmoke',
      }}>
        <Header {...headerProps} />
        <Sidebar {...sidebarProps} />
        <Main
          openSidebar={openSidebar}
          drawerWidth={drawerWidth}
          sidebarRequired={true}
        >
          <Toolbar />
          {children}
        </Main>
      </Box>
    </ThemeProvider>
  );
};

export default PageComponent;