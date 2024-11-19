# LARK Web

A modern, extensible web-based version of the Language Analysis and Response Kit (LARK).

## Project Structure

```
src/
├── core/           # Core functionality and interfaces
│   ├── types/      # Type definitions
│   │   ├── auth.ts        # Authentication types
│   │   ├── editor.ts      # Editor types
│   │   ├── message.ts     # Message processing types
│   │   ├── fileSystem.ts  # File system types
│   │   └── plugin.ts      # Plugin system types
│   ├── PluginManager.ts   # Plugin management system
│   └── MessageProcessor.ts # Message processing pipeline
├── components/     # React components
│   ├── auth/       # Authentication components
│   ├── editor/     # Editor components
│   │   ├── Editor.tsx     # Monaco editor integration
│   │   ├── FileExplorer.tsx # File tree navigation
│   │   ├── TabBar.tsx     # Open files management
│   │   └── EditorLayout.tsx # Main editor layout
│   ├── files/      # File management components
│   │   └── FileExplorer.tsx # File system UI
│   ├── layout/     # Layout components
│   └── common/     # Shared components
├── services/       # Core services
│   ├── FileSystemService.ts # Local file system operations
│   └── UserFileSystemService.ts # Cloud file system operations
├── stores/         # State management
│   ├── authStore.ts    # Authentication state
│   ├── editorStore.ts  # Editor state
│   └── fileSystemStore.ts # File system state
├── utils/          # Utility functions
│   └── formatters.ts   # Date and size formatters
└── types/         # Global type definitions
    ├── file-system.d.ts # File System Access API types
    └── vite-env.d.ts    # Vite environment types
```

## Features

LARK Web is a modern, extensible web-based editor with features including:

- **Advanced Editor**
  - Monaco Editor integration with TypeScript support
  - Multi-file editing with tabs
  - File explorer with tree view
  - Syntax highlighting and theme support
  - Code folding and minimap navigation
  - Native file system integration using File System Access API

- **User Management**
  - Role-based access control
  - User profiles and preferences
  - Secure authentication
  - Personal file storage and management
  - File sharing capabilities

- **File System**
  - Cloud-based file storage for each user
  - Directory creation and management
  - File upload and download
  - File sharing with public links
  - Bulk file operations (download directories as zip)
  - File export and backup
  - Move and copy operations
  - Automatic file organization

- **Plugin System**
  - Extensible plugin architecture
  - Custom editor extensions
  - Language support plugins
  - Theme plugins
  - Message processing plugins

## Getting Started

### Prerequisites
- Node.js 18 or higher
- npm 9 or higher
- A modern browser that supports the File System Access API

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/LARK-Web.git
   cd LARK-Web
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

### Development

The project uses:
- Vite for fast development and building
- TypeScript for type safety
- React for UI components
- Zustand for state management
- Monaco Editor for code editing
- Material-UI for components and theming

## Plugin System

LARK Web features a powerful plugin system that allows you to extend its functionality. Plugins can:

- Process and analyze messages
- Add new UI components
- Extend the core functionality
- Integrate with external services

### Creating a Plugin

1. Create a new directory in `src/plugins/[YourPluginName]`
2. Implement the `Plugin` interface:

```typescript
export interface Plugin {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  initialize: () => Promise<void>;
  cleanup?: () => Promise<void>;
}
```

3. Register your plugin with the `pluginManager`

Example:
```typescript
class MyPlugin implements Plugin {
  id = 'my-plugin';
  name = 'My Plugin';
  version = '1.0.0';
  description = 'Does something awesome';
  author = 'Your Name';

  async initialize() {
    // Setup your plugin
    messageProcessor.registerProcessor(this.processMessage.bind(this));
  }

  async processMessage(message: Message): Promise<Partial<ProcessedMessage>> {
    // Process messages
    return {
      analysis: {
        sentiment: 'positive',
        customData: {
          myPluginData: 'some analysis'
        }
      }
    };
  }
}
```

## File System Integration

LARK Web provides a flexible file system integration that can work both with mock data during development and real backend APIs in production:

### Development Mode
- In-memory mock file system
- Sample files and directories for testing
- Full CRUD operations support
- File search capabilities
- No backend required

### Production Mode
- Real backend API integration
- Cloud-based file storage
- Secure file handling
- User-specific file management
- File sharing capabilities

For details on switching between development and production modes, see the [API Migration Guide](docs/API_MIGRATION.md).

### Features
- Create, read, update, and delete files
- Directory management
- File search with content support
- Path-based navigation
- Type-safe operations with TypeScript
- Proper error handling
- Progress tracking for large operations

### Usage Example
```typescript
const fileSystem = UserFileSystemService.getInstance();

// List files in a directory
const files = await fileSystem.listFiles('/documents');

// Create a new file
const newFile = await fileSystem.createFile({
  name: 'example.txt',
  path: '/documents/example.txt',
  type: 'text/plain',
  isDirectory: false,
  content: 'Hello, World!'
});

// Read file contents
const file = await fileSystem.readFile('fileId');

// Search files
const searchResults = await fileSystem.searchFiles('query', '/documents');
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
