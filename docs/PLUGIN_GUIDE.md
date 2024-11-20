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
8. [AI Integration](#ai-integration)
9. [Router Integration](#router-integration)

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

## AI Integration

LARK Web's plugin system allows you to create custom AI integrations and enhance the editor's AI capabilities.

### AI Provider Plugin

Create a custom AI provider by implementing the `AIProvider` interface:

```typescript
interface AIProvider extends Plugin {
  // Basic plugin properties
  id: string;
  name: string;
  version: string;
  
  // AI-specific methods
  createCompletion(prompt: string, options: AIOptions): Promise<string>;
  createChatCompletion(messages: Message[], options: AIOptions): Promise<string>;
  getModels(): Promise<string[]>;
  validateApiKey(apiKey: string): Promise<boolean>;
}

interface AIOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  stop?: string[];
  stream?: boolean;
}

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}
```

### Example AI Provider Plugin

Here's an example of a custom AI provider plugin:

```typescript
import { AIProvider, Plugin, PluginContext } from '@lark/types';

export class CustomAIProvider implements AIProvider {
  id = 'custom-ai-provider';
  name = 'Custom AI Provider';
  version = '1.0.0';
  
  private apiKey: string;
  private endpoint: string;
  
  async activate(context: PluginContext) {
    // Initialize provider
    this.apiKey = context.settings.get('apiKey');
    this.endpoint = context.settings.get('endpoint');
  }
  
  async createCompletion(prompt: string, options: AIOptions) {
    // Implement completion logic
    const response = await fetch(`${this.endpoint}/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt,
        ...options
      })
    });
    
    const data = await response.json();
    return data.choices[0].text;
  }
  
  async createChatCompletion(messages: Message[], options: AIOptions) {
    // Implement chat completion logic
    const response = await fetch(`${this.endpoint}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messages,
        ...options
      })
    });
    
    const data = await response.json();
    return data.choices[0].message.content;
  }
  
  async getModels() {
    // Return available models
    const response = await fetch(`${this.endpoint}/models`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`
      }
    });
    
    const data = await response.json();
    return data.models.map(m => m.id);
  }
  
  async validateApiKey(apiKey: string) {
    try {
      const response = await fetch(`${this.endpoint}/validate`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      });
      return response.ok;
    } catch {
      return false;
    }
  }
  
  deactivate() {
    // Cleanup
  }
}
```

### AI Feature Plugin

You can also create plugins that add new AI-powered features:

```typescript
import { Plugin, PluginContext, AIService } from '@lark/types';

export class AIFeaturePlugin implements Plugin {
  id = 'ai-feature-plugin';
  name = 'AI Feature Plugin';
  version = '1.0.0';
  
  private aiService: AIService;
  
  async activate(context: PluginContext) {
    this.aiService = context.services.get('ai');
    
    // Register commands
    context.commands.register('aiFeature.translate', () => {
      this.translateSelection();
    });
    
    // Add UI elements
    context.ui.addToolbarItem({
      id: 'translate',
      label: 'Translate',
      icon: 'translate',
      command: 'aiFeature.translate'
    });
  }
  
  async translateSelection() {
    const editor = this.context.editor;
    const selection = editor.getSelection();
    
    if (!selection) return;
    
    const text = editor.getText(selection);
    const translation = await this.aiService.translate(text);
    
    editor.replaceText(selection, translation);
  }
  
  deactivate() {
    // Cleanup
  }
}
```

### Best Practices for AI Plugins

1. **Performance**
   - Implement request caching
   - Use streaming for long responses
   - Add timeout handling
   - Show progress indicators

2. **Error Handling**
   - Handle API errors gracefully
   - Provide fallback responses
   - Show meaningful error messages
   - Implement retry logic

3. **Security**
   - Secure API keys
   - Validate user input
   - Handle sensitive data properly
   - Implement rate limiting

4. **User Experience**
   - Show loading states
   - Provide cancel options
   - Save user preferences
   - Handle offline mode

## Router Integration

### Overview
Plugins can integrate with LARK Web's router to add custom routes and enhance the application's navigation.

### Router API
```typescript
interface RouterAPI {
  // Navigate programmatically
  navigate(path: string, options?: NavigateOptions): void;
  
  // Get current location
  useLocation(): Location;
  
  // Access route parameters
  useParams(): Params;
  
  // Add custom routes
  addRoute(route: RouteConfig): void;
}
```

### Route Configuration
Plugins can add custom routes to the application:

```typescript
interface RouteConfig {
  path: string;
  element: React.ReactNode;
  loader?: () => Promise<any>;
  children?: RouteConfig[];
}

class MyPlugin implements Plugin {
  activate(context: PluginContext) {
    // Add a new route
    context.router.addRoute({
      path: 'my-plugin',
      element: <MyPluginView />,
      loader: async () => {
        // Load data for the route
        return await fetchData();
      }
    });
  }
}
```

Note: Custom routes will be added under the authenticated section (`/`) and will inherit the main layout and authentication protection.

## Support

Need help? Here are some resources:
- [Plugin API Documentation](https://docs.larkweb.com/api)
- [Example Plugins](https://github.com/larkweb/example-plugins)
- [Community Forum](https://forum.larkweb.com)
- [Issue Tracker](https://github.com/larkweb/issues)

---

This guide is continuously updated as new features are added to the LARK Web plugin system.
