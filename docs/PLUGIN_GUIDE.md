# LARK Web Plugin Development Guide

This guide will help you create plugins for LARK Web. Our plugin system is designed to be flexible and powerful, allowing you to extend the editor's functionality in various ways.

## Table of Contents
1. [Plugin Architecture](#plugin-architecture)
2. [Getting Started](#getting-started)
3. [Plugin API](#plugin-api)
4. [File System Integration](#file-system-integration)
5. [UI Integration](#ui-integration)
6. [Best Practices](#best-practices)
7. [Publishing](#publishing)

## Plugin Architecture

### Overview
LARK Web plugins are TypeScript/JavaScript modules that extend the editor's functionality through a well-defined API. Plugins can:
- Add new commands and UI elements
- Modify editor behavior
- Integrate with the file system
- Add language support
- Customize the UI
- Handle file operations

### Plugin Structure
```typescript
export interface Plugin {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  activate: (context: PluginContext) => void;
  deactivate: () => void;
}
```

## Getting Started

### Creating a New Plugin
1. Create a new directory in the `plugins` folder
2. Initialize a new npm package:
   ```bash
   npm init
   ```
3. Create a `plugin.json` file:
   ```json
   {
     "id": "my-plugin",
     "name": "My Plugin",
     "version": "1.0.0",
     "description": "Description of my plugin",
     "author": "Your Name",
     "main": "dist/index.js"
   }
   ```
4. Create your plugin entry point:
   ```typescript
   import { Plugin, PluginContext } from '@lark-web/plugin-api';

   export class MyPlugin implements Plugin {
     activate(context: PluginContext) {
       // Plugin initialization code
     }

     deactivate() {
       // Cleanup code
     }
   }
   ```

## Plugin API

### Core APIs
- **Editor API**: Interact with the Monaco editor instance
- **File System API**: Access and manipulate files
- **UI API**: Add UI elements and modify the interface
- **Command API**: Register new commands
- **Theme API**: Modify editor themes
- **Language API**: Add language support

### Editor Integration
```typescript
interface EditorAPI {
  // Get the current editor instance
  getCurrentEditor(): monaco.editor.IStandaloneCodeEditor;
  
  // Register editor commands
  registerCommand(command: Command): void;
  
  // Add decorations
  addDecoration(decoration: EditorDecoration): void;
  
  // Subscribe to editor events
  onDidChangeContent(callback: (e: ContentChangeEvent) => void): void;
}
```

### File System Integration
```typescript
interface FileSystemAPI {
  // File operations
  createFile(path: string, content?: string): Promise<void>;
  readFile(path: string): Promise<string>;
  writeFile(path: string, content: string): Promise<void>;
  deleteFile(path: string): Promise<void>;
  renameFile(oldPath: string, newPath: string): Promise<void>;
  
  // Directory operations
  createDirectory(path: string): Promise<void>;
  readDirectory(path: string): Promise<FileEntry[]>;
  deleteDirectory(path: string): Promise<void>;
  
  // Watch for file changes
  watchFile(path: string, callback: FileWatchCallback): void;
}
```

### UI Integration
```typescript
interface UIAPI {
  // Add UI elements
  addStatusBarItem(item: StatusBarItem): void;
  addToolbarItem(item: ToolbarItem): void;
  addContextMenuItem(item: ContextMenuItem): void;
  
  // Show notifications
  showMessage(message: string, type: MessageType): void;
  showError(error: Error): void;
  
  // Custom views
  registerView(view: View): void;
  registerWebviewPanel(panel: WebviewPanel): void;
}
```

## File System Integration

### Handling File Operations
```typescript
class FileSystemPlugin implements Plugin {
  activate(context: PluginContext) {
    // Register file system handlers
    context.fileSystem.registerFileHandler({
      scheme: 'custom',
      read: async (uri) => {
        // Custom file reading logic
      },
      write: async (uri, content) => {
        // Custom file writing logic
      }
    });

    // Watch for file changes
    context.fileSystem.watchFile('**/*.txt', (event) => {
      // Handle file changes
    });
  }
}
```

### Custom File System Providers
```typescript
interface FileSystemProvider {
  // Required methods
  readFile(uri: URI): Promise<Uint8Array>;
  writeFile(uri: URI, content: Uint8Array): Promise<void>;
  
  // Optional methods
  watch?: (uri: URI, options: WatchOptions) => Disposable;
  readDirectory?: (uri: URI) => Promise<[string, FileType][]>;
  createDirectory?: (uri: URI) => Promise<void>;
}
```

## Best Practices

### Performance
1. Use async operations for file system access
2. Implement proper cleanup in deactivate()
3. Cache expensive computations
4. Use event debouncing for frequent updates

### Error Handling
1. Always catch and handle errors
2. Provide meaningful error messages
3. Use the UI API to show errors to users
4. Implement proper fallbacks

### Security
1. Validate all file paths
2. Sanitize user input
3. Use proper permissions
4. Handle sensitive data securely

### Testing
1. Write unit tests for plugin logic
2. Test file system operations
3. Implement integration tests
4. Test error scenarios

## Publishing

### Preparation
1. Update plugin.json with latest version
2. Update README and documentation
3. Run tests
4. Build the plugin

### Publishing Process
1. Package your plugin:
   ```bash
   npm run package
   ```
2. Test the packaged plugin
3. Submit to the LARK Web plugin marketplace
4. Provide documentation and examples

### Maintenance
1. Respond to issues
2. Keep dependencies updated
3. Follow semantic versioning
4. Maintain compatibility

## Support

Need help? Here are some resources:
- [Plugin API Documentation](https://docs.larkweb.com/api)
- [Example Plugins](https://github.com/larkweb/example-plugins)
- [Community Forum](https://forum.larkweb.com)
- [Issue Tracker](https://github.com/larkweb/issues)

---

This guide is continuously updated as new features are added to the LARK Web plugin system.
