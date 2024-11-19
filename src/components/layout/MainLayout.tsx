import React from 'react';
import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useTheme,
  Tooltip,
  Avatar,
  Menu,
  MenuItem,
  alpha,
  Badge,
  Divider
} from '@mui/material';
import {
  Menu as MenuIcon,
  Code as CodeIcon,
  Settings as SettingsIcon,
  AdminPanelSettings as AdminIcon,
  Gavel as ModeratorIcon,
  Person as ProfileIcon,
  Logout as LogoutIcon,
  Notifications as NotificationsIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  Folder as FolderIcon
} from '@mui/icons-material';
import { useState } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { UserRole } from '../../core/types/auth';
import { LordIcon } from '../common/LordIcon';

const DRAWER_WIDTH = 280;

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationsAnchor, setNotificationsAnchor] = useState<null | HTMLElement>(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationsOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationsAnchor(event.currentTarget);
  };

  const handleNotificationsClose = () => {
    setNotificationsAnchor(null);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleFileSystemAccess = async () => {
    try {
      const fileSystem = FileSystemService.getInstance();
      const granted = await fileSystem.requestProjectAccess();
      if (granted) {
        const files = await fileSystem.getProjectFiles();
        // setProjectFiles(files); // This line was commented out because setProjectFiles is not defined
      } else {
        // User cancelled or permission denied - continue without filesystem access
        console.log('File system access not granted - continuing in limited mode');
      }
    } catch (error) {
      console.error('Error accessing file system:', error);
      // Continue without filesystem access
    }
  };

  const drawerItems = [
    { text: 'Editor', icon: <CodeIcon />, path: '/' },
    { text: 'Files', icon: <FolderIcon />, path: '/files' },
    { text: 'Profile', icon: <ProfileIcon />, path: '/profile' },
    ...(user?.role === UserRole.MODERATOR || user?.role === UserRole.ADMIN
      ? [{ text: 'Moderation', icon: <ModeratorIcon />, path: '/moderation' }]
      : []),
    ...(user?.role === UserRole.ADMIN
      ? [{ text: 'Admin', icon: <AdminIcon />, path: '/admin' }]
      : []),
    { text: 'Settings', icon: <SettingsIcon />, path: '/settings' }
  ];

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <LordIcon
          src="https://cdn.lordicon.com/bhfjfgqz.json"
          trigger="hover"
          size={40}
          colors={{
            primary: theme.palette.primary.main,
            secondary: theme.palette.secondary.main
          }}
        />
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          LARK Web
        </Typography>
      </Box>
      <Divider />
      <List sx={{ flex: 1, px: 2 }}>
        {drawerItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => navigate(item.path)}
            sx={{
              mb: 1,
              borderRadius: 2,
              '&.Mui-selected': {
                backgroundColor: alpha(theme.palette.primary.main, 0.08),
              },
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.04),
              }
            }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: theme.palette.text.secondary }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.text}
              primaryTypographyProps={{
                fontSize: '0.9rem',
                fontWeight: 500
              }}
            />
          </ListItem>
        ))}
      </List>
      <Divider />
      <Box sx={{ p: 2 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            p: 2,
            borderRadius: 2,
            bgcolor: alpha(theme.palette.primary.main, 0.04),
          }}
        >
          <Avatar 
            src={user?.profilePicture}
            sx={{ 
              width: 40, 
              height: 40, 
              bgcolor: theme.palette.primary.main 
            }}
          >
            {user?.username.charAt(0).toUpperCase()}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              {user?.username}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {user?.role}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { sm: `${DRAWER_WIDTH}px` },
          bgcolor: 'background.paper',
          backdropFilter: 'blur(8px)',
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
        elevation={0}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton
              size="large"
              color="default"
              onClick={handleNotificationsOpen}
            >
              <Badge badgeContent={3} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton
              size="large"
              color="default"
            >
              {theme.palette.mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
            <Tooltip title="Account settings">
              <IconButton
                onClick={handleMenuOpen}
                size="small"
                sx={{ ml: 1 }}
              >
                <Avatar
                  src={user?.profilePicture}
                  sx={{
                    width: 40,
                    height: 40,
                    bgcolor: theme.palette.primary.main,
                    border: `2px solid ${theme.palette.background.paper}`,
                  }}
                >
                  {user?.username.charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { sm: DRAWER_WIDTH }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: DRAWER_WIDTH,
              borderRight: `1px solid ${theme.palette.divider}`,
            }
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: DRAWER_WIDTH,
              borderRight: `1px solid ${theme.palette.divider}`,
              boxShadow: 'none',
            }
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          minHeight: '100vh',
          bgcolor: 'background.default',
        }}
      >
        <Toolbar />
        {children}
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        onClick={handleMenuClose}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 200,
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => navigate('/profile')}>
          <ListItemIcon>
            <ProfileIcon fontSize="small" />
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem onClick={() => navigate('/settings')}>
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>

      <Menu
        anchorEl={notificationsAnchor}
        open={Boolean(notificationsAnchor)}
        onClose={handleNotificationsClose}
        onClick={handleNotificationsClose}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 300,
            maxHeight: 400,
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="subtitle1" fontWeight={600}>
            Notifications
          </Typography>
        </Box>
        <Divider />
        <MenuItem>
          <Box sx={{ py: 1 }}>
            <Typography variant="body2" fontWeight={500}>
              New comment on your code
            </Typography>
            <Typography variant="caption" color="text.secondary">
              2 minutes ago
            </Typography>
          </Box>
        </MenuItem>
        <MenuItem>
          <Box sx={{ py: 1 }}>
            <Typography variant="body2" fontWeight={500}>
              Your code was reviewed
            </Typography>
            <Typography variant="caption" color="text.secondary">
              1 hour ago
            </Typography>
          </Box>
        </MenuItem>
        <MenuItem>
          <Box sx={{ py: 1 }}>
            <Typography variant="body2" fontWeight={500}>
              System update available
            </Typography>
            <Typography variant="caption" color="text.secondary">
              1 day ago
            </Typography>
          </Box>
        </MenuItem>
      </Menu>
    </Box>
  );
};
