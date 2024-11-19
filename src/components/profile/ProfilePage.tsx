import React from 'react';
import { useState } from 'react';
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
  FormControlLabel
} from '@mui/material';
import { useAuthStore } from '../../stores/authStore';

export const ProfilePage = () => {
  const { user, updateUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    theme: user?.preferences.theme || 'dark',
    fontSize: user?.preferences.editorSettings.fontSize || 14,
    fontFamily: user?.preferences.editorSettings.fontFamily || 'Fira Code',
    tabSize: user?.preferences.editorSettings.tabSize || 2,
    useSoftTabs: user?.preferences.editorSettings.useSoftTabs || true,
    showLineNumbers: user?.preferences.editorSettings.showLineNumbers || true,
    enableAutoComplete: user?.preferences.editorSettings.enableAutoComplete || true,
    enableLivePreview: user?.preferences.editorSettings.enableLivePreview || true
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: e.target.type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    await updateUser({
      ...user,
      username: formData.username,
      email: formData.email,
      preferences: {
        ...user.preferences,
        theme: formData.theme as 'light' | 'dark',
        editorSettings: {
          fontSize: Number(formData.fontSize),
          fontFamily: formData.fontFamily,
          tabSize: Number(formData.tabSize),
          useSoftTabs: formData.useSoftTabs,
          showLineNumbers: formData.showLineNumbers,
          enableAutoComplete: formData.enableAutoComplete,
          enableLivePreview: formData.enableLivePreview,
          theme: user.preferences.editorSettings.theme
        }
      }
    });
    setIsEditing(false);
  };

  if (!user) return null;

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Avatar
            sx={{ width: 80, height: 80, mr: 3 }}
          >
            {user.username.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="h4">{user.username}</Typography>
            <Typography variant="body1" color="text.secondary">
              {user.email}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Role: {user.role}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 4 }} />

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Profile Settings
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Editor Settings
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Font Size"
                name="fontSize"
                type="number"
                value={formData.fontSize}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Font Family"
                name="fontFamily"
                value={formData.fontFamily}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Tab Size"
                name="tabSize"
                type="number"
                value={formData.tabSize}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    name="useSoftTabs"
                    checked={formData.useSoftTabs}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                }
                label="Use Soft Tabs"
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    name="showLineNumbers"
                    checked={formData.showLineNumbers}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                }
                label="Show Line Numbers"
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    name="enableAutoComplete"
                    checked={formData.enableAutoComplete}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                }
                label="Enable Auto Complete"
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    name="enableLivePreview"
                    checked={formData.enableLivePreview}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                }
                label="Enable Live Preview"
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                {isEditing ? (
                  <>
                    <Button
                      variant="outlined"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                    >
                      Save Changes
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="contained"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Profile
                  </Button>
                )}
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};
