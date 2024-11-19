# API Migration Guide

This guide explains how to transition from the mock file system to a real backend API implementation.

## Current Mock Implementation

The application currently uses a mock file system for development, which provides:
- In-memory file storage
- Sample files and directories
- Full CRUD operations
- File search capabilities
- Directory support

## Switching to Real API

### Step 1: Disable Mock API

In `src/services/UserFileSystemService.ts`, set the `useMockApi` flag to `false`:

```typescript
private constructor() {
  this.baseUrl = '/api/files';
  this.useMockApi = false; // Change this line
}
```

### Step 2: Implement Backend API

Your backend API needs to implement the following endpoints:

#### File Operations
- `GET /api/files?path={path}` - List files in directory
- `POST /api/files` - Create new file
- `GET /api/files/{fileId}` - Read file
- `PUT /api/files/{fileId}` - Update file
- `DELETE /api/files/{fileId}` - Delete file
- `GET /api/files/search` - Search files
- `POST /api/files/directory` - Create directory

#### Request/Response Formats

Each endpoint should follow these formats:

##### List Files
```typescript
// GET /api/files?path=/some/path
Response: {
  files: Array<{
    id: string;
    name: string;
    path: string;
    size: number;
    type: string;
    isDirectory: boolean;
    content?: string;
    createdAt: Date;
    updatedAt: Date;
  }>
}
```

##### Create File
```typescript
// POST /api/files
Request: {
  name: string;
  path: string;
  type: string;
  isDirectory: boolean;
  content: string;
}
Response: {
  success: boolean;
  message: string;
  file?: UserFile;
}
```

Similar formats apply to other endpoints. See `src/types/fileSystem.ts` for complete type definitions.

### Step 3: Configure API URL

Update the `baseUrl` in `UserFileSystemService` to point to your backend:

```typescript
private constructor() {
  this.baseUrl = 'http://your-api-url/api/files'; // Update this line
  this.useMockApi = false;
}
```

### Step 4: Update CORS and Proxy Settings

1. Update `vite.config.ts` to proxy requests to your backend:

```typescript
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://your-api-url',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
});
```

2. Ensure your backend allows CORS from your frontend origin.

### Step 5: Error Handling

Implement proper error handling in your backend and ensure it returns appropriate HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 404: Not Found
- 500: Server Error

### Step 6: Testing

1. Test each file operation:
   - Creating files and directories
   - Reading file contents
   - Updating files
   - Deleting files
   - Listing directories
   - Searching files

2. Test edge cases:
   - Large files
   - Special characters in filenames
   - Deep directory structures
   - Concurrent operations

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Check your backend CORS configuration
   - Verify proxy settings in `vite.config.ts`

2. **404 Errors**
   - Ensure API endpoints match exactly
   - Check URL rewriting rules

3. **Type Mismatches**
   - Verify backend response formats match TypeScript interfaces
   - Check date format handling

### Getting Help

If you encounter issues:
1. Check the browser console for errors
2. Verify network requests in browser dev tools
3. Review backend logs
4. Ensure all types match between frontend and backend
