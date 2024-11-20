# API Migration Guide

This guide explains how to transition from the mock file system to a real backend API implementation and integrate with AI services.

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

## AI Service Integration

### AI Provider Configuration

The application supports multiple AI providers through a flexible configuration system. Each provider must implement the following API endpoints:

#### Chat Completion
```typescript
// POST {apiEndpoint}/v1/chat/completions
Request: {
  model: string;          // e.g., "gpt-3.5-turbo"
  messages: Array<{
    role: "system" | "user" | "assistant";
    content: string;
  }>;
  temperature?: number;   // 0.0-1.0
  max_tokens?: number;    // e.g., 2000
  stream?: boolean;       // For streaming responses
}

Response: {
  choices: Array<{
    message: {
      role: "assistant";
      content: string;
    };
    finish_reason: string;
  }>;
}
```

### Implementing a Custom AI Provider

1. **Create Provider Configuration**:
```typescript
const provider: AIProviderSettings = {
  name: "Custom Provider",
  apiEndpoint: "https://api.custom-provider.com",
  apiKey: "your-api-key",
  modelName: "custom-model",
  temperature: 0.7,
  maxTokens: 2000
};
```

2. **Register the Provider**:
```typescript
const aiStore = useAIStore();
aiStore.addProvider(provider);
```

3. **Use the Provider**:
```typescript
const aiService = new AIService(provider);
const result = await aiService.improveText(text, prompt);
```

### Security Considerations

1. **API Key Storage**:
   - Store API keys securely in the user's profile
   - Never expose keys in client-side code
   - Use environment variables for default providers

2. **Request/Response Security**:
   - Encrypt all API communications
   - Validate input before sending to AI
   - Sanitize AI responses before display

3. **Rate Limiting**:
   - Implement token usage tracking
   - Add request throttling
   - Monitor API usage

### Error Handling

1. **API Errors**:
```typescript
try {
  const result = await aiService.improveText(text, prompt);
} catch (error) {
  if (error instanceof AIServiceError) {
    // Handle specific AI service errors
    console.error('AI Service Error:', error.message);
  } else {
    // Handle general errors
    console.error('Unexpected error:', error);
  }
}
```

2. **Common Error Types**:
   - Authentication errors (invalid API key)
   - Rate limit exceeded
   - Invalid input format
   - Model not available
   - Context length exceeded
   - Network errors

### Best Practices

1. **Provider Selection**:
   - Allow users to choose their preferred provider
   - Support fallback providers
   - Cache provider availability

2. **Performance**:
   - Implement response caching
   - Use streaming for long responses
   - Batch similar requests

3. **User Experience**:
   - Show loading states during AI operations
   - Provide clear error messages
   - Allow cancellation of requests
   - Save user preferences

### Configuration

The AI service is designed to work with any OpenAI-compatible API. Configure providers through the AI Settings interface or programmatically:

```typescript
import { AIService } from '../services/AIService';
import { AIProvider } from '../types/ai';

const provider: AIProvider = {
  name: 'OpenAI',
  apiEndpoint: 'https://api.openai.com',
  apiKey: 'your-api-key',
  modelName: 'gpt-3.5-turbo',
  temperature: 0.7,
  maxTokens: 2000
};

const aiService = new AIService(provider);
```

### Usage Example

```typescript
// Text improvement
const improvedText = await aiService.improveText(
  'The cat sat on mat.',
  'Make this more descriptive'
);

// Story continuation
const continuation = await aiService.suggestContinuation(
  'Once upon a time in a dark forest...'
);

// Brainstorming
const ideas = await aiService.brainstorm(
  'Story ideas about a time-traveling detective'
);
```

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

## Security Considerations

1. **API Keys**: Never expose API keys in the client-side code. Use environment variables or secure storage.

2. **File Access**: The File System Access API requires explicit user permission for each operation.

3. **AI Provider Settings**: Store API keys securely and validate all API responses.

## Best Practices

1. **Error Handling**: Always wrap API calls in try-catch blocks:
   ```typescript
   try {
     const result = await aiService.improveText(text, prompt);
   } catch (error) {
     console.error('AI service error:', error);
     // Handle error appropriately
   }
   ```

2. **Type Safety**: Use the provided TypeScript interfaces:
   ```typescript
   import { AIProvider, AIResponse } from '../types/ai';
   import { FileSystemNode } from '../types/fileSystem';
   ```

3. **State Management**: Use the provided stores:
   ```typescript
   import { useAIStore } from '../stores/aiStore';
   import { useFileSystemStore } from '../stores/fileSystemStore';
   ```

## Migration Checklist

- [ ] Update environment variables
- [ ] Configure AI providers
- [ ] Test file system operations
- [ ] Verify AI integration
- [ ] Check error handling
- [ ] Update security settings
- [ ] Test user permissions
- [ ] Validate API responses
- [ ] Monitor performance
- [ ] Update documentation
