import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Avatar,
  IconButton,
  useTheme,
  alpha,
  Skeleton,
  Divider,
  Tooltip,
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  PhotoCamera as PhotoCameraIcon,
} from '@mui/icons-material';
import { useAuthStore } from '../../stores/authStore';
import { debounce } from 'lodash';

export const Profile = () => {
  const theme = useTheme();
  const { user, updateUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState(user?.bio || '');
  const [profilePicture, setProfilePicture] = useState<string | undefined>(
    user?.profilePicture
  );
  const [isSaving, setIsSaving] = useState(false);

  // Debounced save function
  const debouncedSave = useCallback(
    debounce(async (newBio: string) => {
      if (!user) return;
      try {
        setIsSaving(true);
        await updateUser({
          ...user,
          bio: newBio,
        });
      } catch (error) {
        console.error('Failed to save bio:', error);
      } finally {
        setIsSaving(false);
      }
    }, 1000),
    [user, updateUser]
  );

  // Handle bio changes with automatic saving
  const handleBioChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newBio = event.target.value;
    setBio(newBio);
    debouncedSave(newBio);
  };

  // Handle profile picture upload
  const handleProfilePictureUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    try {
      setIsSaving(true);
      // Convert the file to base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        setProfilePicture(base64String);
        await updateUser({
          ...user,
          profilePicture: base64String,
        });
        setIsSaving(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Failed to upload profile picture:', error);
      setIsSaving(false);
    }
  };

  // Update local state when user changes
  useEffect(() => {
    if (user) {
      setBio(user.bio || '');
      setProfilePicture(user.profilePicture);
    }
  }, [user]);

  if (!user) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Please log in to view your profile.</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: 3,
        maxWidth: 800,
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 3,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 2,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 3,
          }}
        >
          <Box sx={{ position: 'relative' }}>
            <Avatar
              src={profilePicture}
              alt={user.username}
              sx={{
                width: 120,
                height: 120,
                bgcolor: theme.palette.primary.main,
                fontSize: '3rem',
              }}
            >
              {user.username.charAt(0).toUpperCase()}
            </Avatar>
            <input
              accept="image/*"
              type="file"
              id="profile-picture-upload"
              onChange={handleProfilePictureUpload}
              style={{ display: 'none' }}
            />
            <label htmlFor="profile-picture-upload">
              <Tooltip title="Change profile picture">
                <IconButton
                  component="span"
                  sx={{
                    position: 'absolute',
                    bottom: -4,
                    right: -4,
                    bgcolor: theme.palette.background.paper,
                    border: `2px solid ${theme.palette.background.paper}`,
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                    },
                  }}
                >
                  <PhotoCameraIcon />
                </IconButton>
              </Tooltip>
            </label>
          </Box>

          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" fontWeight={600} gutterBottom>
              {user.username}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {user.email}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                px: 1,
                py: 0.5,
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.main,
                borderRadius: 1,
                display: 'inline-block',
              }}
            >
              {user.role}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box>
          <Typography variant="h6" gutterBottom>
            Bio
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={bio}
            onChange={handleBioChange}
            placeholder="Tell us about yourself..."
            sx={{
              '& .MuiOutlinedInput-root': {
                bgcolor: alpha(theme.palette.background.paper, 0.6),
              },
            }}
          />
          {isSaving && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: 'block', mt: 1 }}
            >
              Saving changes...
            </Typography>
          )}
        </Box>
      </Paper>

      <Paper
        elevation={0}
        sx={{
          p: 3,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Account Information
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Member since
            </Typography>
            <Typography>
              {new Date(user.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Last active
            </Typography>
            <Typography>
              {new Date(user.lastActive).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};
