import React from 'react';
import { Box } from '@mui/material';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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
import { FileExplorer } from './components/files/FileExplorer';
import { ChatPage } from './components/chat/ChatPage';
import { ErrorBoundary } from './components/common/ErrorBoundary';

function App() {
  console.log('App rendering');
  
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route
            path="/login"
            element={
              <RouteErrorBoundary>
                <AuthRedirect>
                  <LoginForm />
                </AuthRedirect>
              </RouteErrorBoundary>
            }
          />
          <Route
            path="/register"
            element={
              <RouteErrorBoundary>
                <AuthRedirect>
                  <RegisterForm />
                </AuthRedirect>
              </RouteErrorBoundary>
            }
          />
          <Route
            path="/"
            element={
              <RouteErrorBoundary>
                <AuthGuard>
                  <MainLayout />
                </AuthGuard>
              </RouteErrorBoundary>
            }
          >
            <Route 
              index 
              element={
                <RouteErrorBoundary>
                  <EditorLayout />
                </RouteErrorBoundary>
              } 
            />
            <Route 
              path="profile" 
              element={
                <RouteErrorBoundary>
                  <ProfilePage />
                </RouteErrorBoundary>
              } 
            />
            <Route 
              path="files/*" 
              element={
                <RouteErrorBoundary>
                  <FileExplorer />
                </RouteErrorBoundary>
              } 
            />
            <Route 
              path="chat" 
              element={
                <RouteErrorBoundary>
                  <ChatPage />
                </RouteErrorBoundary>
              } 
            />
            <Route 
              path="settings" 
              element={
                <RouteErrorBoundary>
                  <SettingsPage />
                </RouteErrorBoundary>
              } 
            />
            <Route
              path="admin/*"
              element={
                <RouteErrorBoundary>
                  <AuthGuard requiredRole={UserRole.ADMIN}>
                    <AdminPage />
                  </AuthGuard>
                </RouteErrorBoundary>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

function RouteErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      {children}
    </ErrorBoundary>
  );
}

function AuthRedirect({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  console.log('AuthRedirect - isAuthenticated:', isAuthenticated);
  
  if (isAuthenticated) {
    console.log('AuthRedirect - redirecting to /');
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
}

export default App;
