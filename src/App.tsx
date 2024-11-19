import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { useAuthStore } from './stores/authStore';
import { MainLayout } from './components/layout/MainLayout';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { AuthGuard } from './components/auth/AuthGuard';
import { UserRole } from './core/types/auth';
import { EditorLayout } from './components/editor/EditorLayout';
import { ProfilePage } from './components/profile/ProfilePage';
import { SettingsPage } from './components/settings/SettingsPage';
import { AdminPage } from './components/admin/AdminPage';

function App() {
  const { isAuthenticated, user } = useAuthStore();

  return (
    <BrowserRouter>
      <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Routes>
          <Route
            path="/login"
            element={
              !isAuthenticated ? (
                <LoginForm />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/register"
            element={
              !isAuthenticated ? (
                <RegisterForm />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/"
            element={
              <AuthGuard>
                <MainLayout>
                  <EditorLayout />
                </MainLayout>
              </AuthGuard>
            }
          />
          <Route
            path="/profile"
            element={
              <AuthGuard>
                <MainLayout>
                  <ProfilePage />
                </MainLayout>
              </AuthGuard>
            }
          />
          <Route
            path="/settings"
            element={
              <AuthGuard>
                <MainLayout>
                  <SettingsPage />
                </MainLayout>
              </AuthGuard>
            }
          />
          <Route
            path="/admin/*"
            element={
              <AuthGuard requiredRole={UserRole.ADMIN}>
                <MainLayout>
                  <AdminPage />
                </MainLayout>
              </AuthGuard>
            }
          />
        </Routes>
      </Box>
    </BrowserRouter>
  );
}

export default App;
