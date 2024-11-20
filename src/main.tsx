import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { theme } from './theme';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { AuthGuard } from './components/auth/AuthGuard';
import { MainLayout } from './components/layout/MainLayout';
import { EditorLayout } from './components/editor/EditorLayout';
import { ProfilePage } from './components/profile/ProfilePage';
import { SettingsPage } from './components/settings/SettingsPage';
import { AdminPage } from './components/admin/AdminPage';
import { FileExplorer } from './components/files/FileExplorer';
import { ChatPage } from './components/chat/ChatPage';
import { useAuthStore } from './stores/authStore';
import './index.css';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginForm />,
    loader: () => {
      const { isAuthenticated } = useAuthStore.getState();
      return isAuthenticated ? Navigate({ to: '/' }) : null;
    },
  },
  {
    path: '/register',
    element: <RegisterForm />,
    loader: () => {
      const { isAuthenticated } = useAuthStore.getState();
      return isAuthenticated ? Navigate({ to: '/' }) : null;
    },
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <AuthGuard><EditorLayout /></AuthGuard>,
      },
      {
        path: 'profile',
        element: <AuthGuard><ProfilePage /></AuthGuard>,
      },
      {
        path: 'settings',
        element: <AuthGuard><SettingsPage /></AuthGuard>,
      },
      {
        path: 'files/*',
        element: <AuthGuard><FileExplorer /></AuthGuard>,
      },
      {
        path: 'chat',
        element: <AuthGuard><ChatPage /></AuthGuard>,
      },
      {
        path: 'admin/*',
        element: <AuthGuard requiredRole="admin"><AdminPage /></AuthGuard>,
      },
      {
        path: '*',
        element: <Navigate to="/" replace />,
      }
    ],
  }
], {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>
);
