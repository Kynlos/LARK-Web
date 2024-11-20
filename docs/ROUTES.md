# Application Routes

This document provides an overview of all routes available in the LARK-Web application.

## Authentication Routes

- `/login` - Login page
  - Redirects to home (`/`) if user is already authenticated
  - Displays login form for unauthenticated users

- `/register` - Registration page
  - Redirects to home (`/`) if user is already authenticated
  - Displays registration form for new users

## Main Application Routes

All routes below require authentication. Unauthenticated users will be redirected to the login page.

- `/` - Main editor page
  - Default landing page after authentication
  - Displays the editor layout

- `/profile` - User profile page
  - View and manage user profile settings

- `/files/*` - File explorer
  - Browse and manage files
  - Supports nested paths under `/files/`

- `/settings` - Application settings
  - Configure application preferences

## Admin Routes

The following routes require admin privileges (UserRole.ADMIN):

- `/admin/*` - Admin dashboard
  - Access to administrative functions
  - Only accessible to users with admin role
  - All sub-routes under `/admin/` are protected

## Route Protection

- All routes except `/login` and `/register` are protected by `AuthGuard`
- Admin routes have additional role-based protection requiring `UserRole.ADMIN`
- Authenticated users attempting to access `/login` or `/register` will be redirected to the home page
- Unauthenticated users attempting to access protected routes will be redirected to the login page
