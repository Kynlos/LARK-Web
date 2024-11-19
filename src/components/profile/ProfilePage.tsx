import React, { useState, useCallback, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Avatar,
  Divider,
  Switch,
  FormControlLabel,
  IconButton,
  Tab,
  Tabs
} from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import { useAuthStore } from '../../stores/authStore';
import { AISettings } from '../settings/AISettings';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export const ProfilePage = () => {
  const { user, updateUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const [tabValue, setTabValue] = useState(0);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    bio: user?.bio || '',
    theme: user?.preferences?.theme || 'dark',
    fontSize: user?.preferences?.editorSettings?.fontSize || 14,
    fontFamily: user?.preferences?.editorSettings?.fontFamily || 'JetBrains Mono, monospace',
    tabSize: user?.preferences?.editorSettings?.tabSize || 2,
    showLineNumbers: user?.preferences?.editorSettings?.showLineNumbers || true,
  });

  const debouncedSave = useCallback((newBio: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(async () => {
      if (!user) return;
      await updateUser({
        ...user,
        bio: newBio,
      });
    }, 1000);
  }, [user, updateUser]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    const newValue = e.target.type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    // Auto-save bio changes
    if (name === 'bio') {
      debouncedSave(value);
    }
  };

  const handleProfilePictureUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    try {
      // Convert image to base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        await updateUser({
          ...user,
          profilePicture: base64String,
        });
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading profile picture:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    await updateUser({
      ...user,
      username: formData.username,
      email: formData.email,
      preferences: {
        theme: formData.theme as 'light' | 'dark',
        editorSettings: {
          fontSize: Number(formData.fontSize),
          fontFamily: formData.fontFamily,
          tabSize: Number(formData.tabSize),
          showLineNumbers: formData.showLineNumbers,
        }
      }
    });
    setIsEditing(false);
  };

  if (!user) return null;

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
            <Tab label="Profile" />
            <Tab label="Editor Settings" />
            <Tab label="AI Settings" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Avatar
                  sx={{ width: 120, height: 120, mb: 2 }}
                  src={user?.profilePicture}
                >
                  {user?.username?.[0]?.toUpperCase()}
                </Avatar>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="avatar-upload"
                  type="file"
                  onChange={handleProfilePictureUpload}
                />
                <label htmlFor="avatar-upload">
                  <IconButton component="span">
                    <PhotoCamera />
                  </IconButton>
                </label>
              </Box>
            </Grid>
            <Grid item xs={12} sm={8}>
              <TextField
                fullWidth
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                margin="normal"
                disabled={!isEditing}
              />
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                margin="normal"
                disabled={!isEditing}
              />
              <TextField
                fullWidth
                label="Bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                margin="normal"
                multiline
                rows={4}
                disabled={!isEditing}
              />
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant={isEditing ? 'contained' : 'outlined'}
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? 'Save Changes' : 'Edit Profile'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6" gutterBottom>
                Editor Appearance
              </Typography>
              <TextField
                fullWidth
                label="Font Size"
                name="fontSize"
                type="number"
                value={formData.fontSize}
                onChange={handleInputChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Font Family"
                name="fontFamily"
                value={formData.fontFamily}
                onChange={handleInputChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Tab Size"
                name="tabSize"
                type="number"
                value={formData.tabSize}
                onChange={handleInputChange}
                margin="normal"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.showLineNumbers}
                    onChange={handleInputChange}
                    name="showLineNumbers"
                  />
                }
                label="Show Line Numbers"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6" gutterBottom>
                Theme Settings
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.theme === 'dark'}
                    onChange={(e) => handleInputChange({
                      ...e,
                      target: {
                        ...e.target,
                        name: 'theme',
                        value: e.target.checked ? 'dark' : 'light'
                      }
                    })}
                  />
                }
                label="Dark Theme"
              />
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <AISettings />
        </TabPanel>
      </Paper>
    </Box>
  );
};
