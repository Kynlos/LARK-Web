import React from 'react';
import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Link,
  CircularProgress,
  InputAdornment,
  IconButton,
  useTheme,
  alpha
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../stores/authStore';
import { LordIcon } from '../common/LordIcon';
import { Link as RouterLink } from 'react-router-dom';

const MotionPaper = motion(Paper);
const MotionBox = motion(Box);

export const LoginForm = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { login, isLoading, error, setError, setLoading } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!email || !password) {
        throw new Error('Please enter both email and password');
      }

      await login({ email, password });
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      setError((error as Error).message || 'Failed to login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        bgcolor: 'background.default',
        background: `linear-gradient(45deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`
      }}
    >
      <MotionPaper
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        elevation={3}
        sx={{
          p: 4,
          width: '100%',
          maxWidth: 400,
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          backdropFilter: 'blur(10px)',
          background: alpha(theme.palette.background.paper, 0.8),
          border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
          borderRadius: 2
        }}
      >
        <MotionBox
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mb: 2
          }}
        >
          <LordIcon
            src="https://cdn.lordicon.com/eszyyflr.json"
            trigger="loop"
            size={120}
            colors={{
              primary: theme.palette.primary.main,
              secondary: theme.palette.secondary.main
            }}
          />
        </MotionBox>

        <Typography
          variant="h4"
          component={motion.h4}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          sx={{
            textAlign: 'center',
            fontWeight: 'bold',
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent'
          }}
        >
          Welcome Back
        </Typography>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LordIcon
                    src="https://cdn.lordicon.com/bgebyztw.json"
                    trigger="morph"
                    size={25}
                    colors={{
                      primary: theme.palette.text.secondary,
                      secondary: theme.palette.primary.main
                    }}
                  />
                </InputAdornment>
              )
            }}
          />

          <TextField
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LordIcon
                    src="https://cdn.lordicon.com/bgebyztw.json"
                    trigger="morph"
                    size={25}
                    colors={{
                      primary: theme.palette.text.secondary,
                      secondary: theme.palette.primary.main
                    }}
                  />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleTogglePassword} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={isLoading}
            sx={{
              mt: 2,
              height: 48,
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              '&:hover': {
                background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`
              }
            }}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Sign In'
            )}
          </Button>

          {error && (
            <Typography
              color="error"
              variant="body2"
              component={motion.p}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              sx={{ textAlign: 'center', mt: 2 }}
            >
              {error}
            </Typography>
          )}

          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Link
              component={RouterLink}
              to="/register"
              sx={{
                color: theme.palette.primary.main,
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline'
                }
              }}
            >
              Don't have an account? Register
            </Link>
          </Box>
        </form>
      </MotionPaper>
    </Box>
  );
};
