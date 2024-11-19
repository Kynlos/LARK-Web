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
  IconButton
} from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import { useAuthStore } from '../../stores/authStore';

export const ProfilePage = () => {
  const { user, updateUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();
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
    <Box sx={{ maxWidth: 800, mx: 'auto', py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Box sx={{ position: 'relative' }}>
            <Avatar
              src={user.profilePicture}
              sx={{ width: 80, height: 80, mr: 3 }}
            >
              {user.username.charAt(0).toUpperCase()}
            </Avatar>
            <IconButton
              sx={{
                position: 'absolute',
                bottom: -10,
                right: 12,
                backgroundColor: 'background.paper',
                '&:hover': { backgroundColor: 'action.hover' },
              }}
              aria-label="upload picture"
              component="label"
              size="small"
            >
              <input
                hidden
                accept="image/*"
                type="file"
                onChange={handleProfilePictureUpload}
              />
              <PhotoCamera fontSize="small" />
            </IconButton>
          </Box>
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

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Tell us about yourself..."
                helperText="Changes are saved automatically"
              />
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
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? 'Cancel' : 'Edit Settings'}
                </Button>
                {isEditing && (
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                  >
                    Save Changes
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
