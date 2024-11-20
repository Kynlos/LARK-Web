# LARK Web Routing Documentation

## Overview
LARK Web uses React Router v6 for handling navigation and routing. The routing structure is designed to protect routes based on authentication status and user roles.

## Route Structure

```
/
├── /login                 # Login page (public)
├── /register             # Registration page (public)
├── /                     # Main application (protected)
│   ├── /                 # Editor (default view)
│   ├── /files/*          # File explorer
│   ├── /chat             # Chat interface
│   ├── /profile          # User profile
│   ├── /settings         # Application settings
│   ├── /moderation       # Moderation tools (MODERATOR, ADMIN only)
│   └── /admin/*          # Admin panel (ADMIN only)
```

## Authentication Flow

1. **Public Routes** (`/login`, `/register`)
   - Accessible to all users
   - Redirects authenticated users to the main application
   - Handled by `AuthRedirect` component

2. **Protected Routes** (all other routes)
   - Requires authentication
   - Redirects unauthenticated users to login
   - Handled by `AuthGuard` component

## Components

### `AuthGuard`
- Protects routes from unauthorized access
- Checks both authentication status and user roles
- Props:
  - `children`: React nodes to render if authorized
  - `requiredRole`: Optional role requirement (UserRole enum)

### `AuthRedirect`
- Prevents authenticated users from accessing login/register pages
- Redirects to main application if already authenticated

### `MainLayout`
- Provides the application shell (sidebar, header)
- Uses React Router's `Outlet` to render nested routes
- Handles navigation through the sidebar

## Role-Based Access

- **USER**: Base access level
  - Can access: Editor, Files, Chat, Profile, Settings
- **MODERATOR**: Extended access
  - Includes USER access
  - Can access: Moderation tools
- **ADMIN**: Full access
  - Includes MODERATOR access
  - Can access: Admin panel

## File System Integration

### File Explorer Routes
The file explorer (`/files/*`) supports deep linking and navigation:

```
/files
├── /*                    # View any directory path
├── /new                  # Create new file dialog
└── /upload              # File upload interface
```

### File Operations
All file operations are handled through the FileSystemService:

1. **Create Operations**
   ```typescript
   // Create file
   createFile({
     name: string,
     path: string,
     type?: string,
     content?: string,
     isDirectory: false
   }): Promise<FileOperationResponse>

   // Create directory
   createDirectory(path: string): Promise<FileOperationResponse>
   ```

2. **Response Handling**
   ```typescript
   interface FileOperationResponse {
     success: boolean;
     message: string;
     file?: UserFile;     // Present for successful operations
   }
   ```

3. **Path Handling**
   - All paths are normalized to start with '/'
   - Parent/child relationships are preserved
   - Duplicate paths are prevented
   - Path validation occurs before operations

### State Management
File system state is managed through multiple stores:

1. **FileSystemStore**
   - Manages file explorer state
   - Handles file operations
   - Maintains current path
   - Manages file selection

2. **EditorStore**
   - Manages open files
   - Handles file content
   - Syncs with file system
   - Manages editor state

3. **Store Synchronization**
   - Changes in explorer reflect in editor
   - Editor operations update explorer
   - Real-time state consistency
   - Automatic conflict resolution

## Implementation Details

1. **Route Definition** (App.tsx)
   ```tsx
   <BrowserRouter>
     <Routes>
       <Route path="/login" element={<AuthRedirect><LoginForm /></AuthRedirect>} />
       <Route path="/" element={<AuthGuard><MainLayout /></AuthGuard>}>
         <Route index element={<EditorLayout />} />
         {/* Other nested routes */}
       </Route>
     </Routes>
   </BrowserRouter>
   ```

2. **Navigation** (MainLayout.tsx)
   ```tsx
   const navigate = useNavigate();
   // Navigate programmatically
   navigate('/path');
   ```

## Best Practices

1. **Route Protection**
   - Always wrap protected routes with `AuthGuard`
   - Use `requiredRole` prop for role-specific routes

2. **Navigation**
   - Use React Router's `useNavigate` hook for programmatic navigation
   - Use `Link` or `NavLink` components for declarative navigation

3. **Layout**
   - Use nested routes with `Outlet` for shared layouts
   - Keep layout components separate from route components

4. **Error Handling**
   - Use `ErrorBoundary` components around routes
   - Provide meaningful error messages for unauthorized access
