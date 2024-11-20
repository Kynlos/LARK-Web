# LARK Web User Guide

Welcome to LARK Web! This guide will help you get started with using the LARK Web editor.

## Table of Contents
1. [Getting Started](#getting-started)
2. [Editor Interface](#editor-interface)
3. [File Management](#file-management)
4. [Editor Features](#editor-features)
5. [AI Features](#ai-features)
6. [User Settings](#user-settings)
7. [Keyboard Shortcuts](#keyboard-shortcuts)
8. [Plugins](#plugins)
9. [Application Structure](#application-structure)

## Getting Started

### Installation
1. Clone the repository
2. Run `npm install` to install dependencies
3. Run `npm run dev` to start the development server
4. Open your browser and navigate to `http://localhost:5173`

### First Steps
1. Sign in or create an account
2. Create a new project or open an existing one
3. Start editing your files

## Editor Interface

### Layout
- **File Explorer**: Left sidebar showing your project files
- **Editor Area**: Main editing area with tabs for open files
- **Status Bar**: Bottom bar showing file information and editor status

### Themes
- Light and dark themes available
- Customizable editor colors and fonts
- High-contrast options for accessibility

## File Management

### File Explorer
- View your project's file structure
- Create new files and folders
- Rename and delete files
- Drag and drop files to reorganize
- Context menu for quick actions
- Search files by name and content
- Filter files by type
- Automatic syncing with editor

### File Operations
- **Create File**: 
  - Click the "+" icon or right-click > New File
  - Specify file name and type
  - New files automatically open in editor
  - Changes sync instantly across views
- **Create Folder**: 
  - Click the folder icon or right-click > New Folder
  - Organize files in hierarchical structure
  - Folders appear instantly in explorer
- **Edit File**:
  - Open file by clicking
  - Edit content in Monaco editor
  - Changes are saved automatically
  - Real-time sync between explorer and editor
- **Delete**: 
  - Right-click > Delete or press Delete
  - Confirmation required for safety
  - Updates reflect immediately in all views
- **Search**:
  - Search by file name or content
  - Results show matching files and locations
  - Quick preview of matches
  - Real-time search updates
- **File Info**:
  - View file metadata (size, type, dates)
  - See file path and location
  - Check file permissions
  - Monitor file status

### File System Features
- **Automatic Syncing**:
  - Changes sync between explorer and editor
  - Real-time updates across all views
  - Consistent file state management
  - Automatic conflict resolution
- **Path Handling**:
  - Intelligent path normalization
  - Proper handling of nested paths
  - Automatic path resolution
  - Prevention of duplicate paths
- **Error Handling**:
  - Clear error messages
  - Automatic retry for failed operations
  - Data recovery options
  - Graceful failure handling
- **Automatic Saving**:
  - Changes saved automatically
  - Backup copies maintained
  - Restore previous versions
- **File Types**:
  - Text files (.txt, .md, etc.)
  - Source code files
  - Images and media
  - Directories
- **Path Navigation**:
  - Breadcrumb navigation
  - Quick directory jumping
  - Recent locations history

### Development vs Production
The file system operates in two modes:
1. **Development Mode**:
   - Uses in-memory mock storage
   - Comes with sample files
   - No backend required
   - Instant operations
2. **Production Mode**:
   - Connects to real backend
   - Persistent storage
   - User authentication
   - File sharing features

## Editor Features

### Basic Editing
- Syntax highlighting
- Code completion
- Multi-cursor editing
- Find and replace
- Code folding
- Line numbers
- Minimap navigation

### Advanced Features
- Multiple file editing
- Split view editing
- Code formatting
- Error detection
- Quick fixes and suggestions

## AI Features

LARK Web includes powerful AI features to enhance your writing experience.

### Setting Up AI

1. **Configure AI Provider**
   - Go to Settings > AI or Profile > AI Settings
   - Click "Add Provider"
   - Enter your provider details:
     - Name (e.g., "OpenAI")
     - API Endpoint (e.g., "https://api.openai.com")
     - API Key
     - Model Name (e.g., "gpt-3.5-turbo")
   - Adjust optional settings:
     - Temperature (0.0-1.0)
     - Max Tokens

2. **Select Active Provider**
   - Choose your preferred provider from the dropdown
   - The active provider will be used for all AI operations

### Using AI Features

#### Quick Actions Bar
Access AI features through the quick action bar on the right side of the editor:

1. **Improve Writing**
   - Select text you want to improve
   - Click the magic wand icon
   - Choose "Improve Writing"
   - Review and apply suggestions

2. **Continue Writing**
   - Place cursor at the end of your text
   - Click the pencil icon
   - Choose "Continue Writing"
   - Select from generated continuations

3. **Brainstorm Ideas**
   - Select context text (optional)
   - Click the lightbulb icon
   - Choose "Brainstorm Ideas"
   - Review generated suggestions

4. **Custom Prompts**
   - Select text (optional)
   - Click the brain icon
   - Choose "Custom Prompt"
   - Enter your instruction
   - Apply the AI's response

#### Editor Toolbar
AI features are also available in the main editor toolbar:

- AI Settings button for quick access to provider configuration
- AI assistance button for common operations
- Format text with AI suggestions

### AI Chat
The AI Chat interface provides a powerful way to interact with AI while maintaining context of your code and files:

#### Basic Usage
- Open the chat interface from the sidebar
- Type your message and press Enter to send
- Use Shift+Enter for multiline messages
- Messages are saved automatically and persist across sessions
- Create multiple chat conversations for different topics
- Delete chats with confirmation to prevent accidental loss

#### File References
- Click files in the sidebar to reference them in chat
- Type @ to see a list of files you can reference (with real-time filtering)
- Use line ranges to reference specific parts of files:
  - Click a file and enter line range (e.g., 1-10) in the sidebar
  - Or type @filename:1-10 directly in the chat
- Referenced files provide context to the AI for better responses
- Files are tracked in both "Open Files" and "Recent Files" tabs
- Copy file references quickly with the copy button
- Click on file references in messages to open them in the editor

#### Chat Settings
- Customize AI provider settings per chat
- Adjust temperature and max tokens
- Save frequently used settings as presets
- Configure auto-completion behavior
- Set default system prompts

### AI Writing Assistance
#### Quick Actions Bar
Access AI features through the quick action bar on the right side of the editor:

1. **Improve Writing**
   - Select text you want to improve
   - Click the magic wand icon
   - Choose "Improve Writing"
   - Review and apply suggestions

2. **Continue Writing**
   - Place cursor at the end of your text
   - Click the pencil icon
   - Choose "Continue Writing"
   - Select from generated continuations

3. **Brainstorm Ideas**
   - Select context text (optional)
   - Click the lightbulb icon
   - Choose "Brainstorm Ideas"
   - Review generated suggestions

4. **Custom Prompts**
   - Select text (optional)
   - Click the brain icon
   - Choose "Custom Prompt"
   - Enter your instruction
   - Apply the AI's response

#### Editor Toolbar
AI features are also available in the main editor toolbar:

- AI Settings button for quick access to provider configuration
- AI assistance button for common operations
- Format text with AI suggestions

### Keyboard Shortcuts

| Action | Windows/Linux | macOS |
|--------|--------------|-------|
| Improve Writing | Ctrl+Shift+I | ⌘+Shift+I |
| Continue Writing | Ctrl+Shift+C | ⌘+Shift+C |
| Brainstorm | Ctrl+Shift+B | ⌘+Shift+B |
| Custom Prompt | Ctrl+Shift+P | ⌘+Shift+P |

### Best Practices

1. **Text Selection**
   - Select specific text for targeted improvements
   - Select more context for better results
   - Use custom prompts for specific needs

2. **Provider Selection**
   - Choose providers based on your needs:
     - OpenAI for general writing
     - Azure for enterprise use
     - Custom providers for specific tasks

3. **Parameter Tuning**
   - Adjust temperature for creativity:
     - Lower (0.1-0.3) for factual writing
     - Higher (0.7-0.9) for creative writing
   - Set appropriate token limits:
     - Higher for longer responses
     - Lower for quicker responses

4. **Security**
   - Keep API keys secure
   - Review AI responses before applying
   - Don't share sensitive information
   - Use organization-approved providers

### Troubleshooting

Common issues and solutions:

1. **AI Not Responding**
   - Check API key validity
   - Verify internet connection
   - Ensure provider is available
   - Check rate limits

2. **Poor Results**
   - Provide more context
   - Adjust temperature setting
   - Try different models
   - Use more specific prompts

3. **Error Messages**
   - "Invalid API Key": Re-enter your API key
   - "Rate Limit": Wait or switch providers
   - "Context Length": Reduce selection size
   - "Network Error": Check connection

## User Settings

### Editor Preferences
- Font size and family
- Tab size
- Line numbers
- Whitespace rendering
- Word wrap
- Auto-save interval

### Customization
- Theme selection
- Custom keybindings
- File associations
- Plugin settings

## Keyboard Shortcuts

### File Operations
- `Ctrl+N`: New file
- `Ctrl+S`: Save file
- `Ctrl+W`: Close file
- `Ctrl+Tab`: Switch between files

### Editing
- `Ctrl+C`: Copy
- `Ctrl+X`: Cut
- `Ctrl+V`: Paste
- `Ctrl+Z`: Undo
- `Ctrl+Y`: Redo
- `Ctrl+F`: Find
- `Ctrl+H`: Replace
- `Alt+Click`: Add cursor
- `Ctrl+/`: Toggle comment

### Navigation
- `Ctrl+P`: Quick file open
- `Ctrl+G`: Go to line
- `Ctrl+Shift+O`: Go to symbol
- `F12`: Go to definition

## Application Structure

### Routing
The application uses React Router v6 with future flags enabled for v7 compatibility. Here's the route structure:

- `/login` - Login page
- `/register` - Registration page
- `/` - Main application layout
  - `/` (index) - Editor layout
  - `/profile` - User profile
  - `/settings` - Application settings
  - `/files/*` - File explorer (supports nested paths)
  - `/chat` - AI chat interface
  - `/admin` - Admin dashboard (requires admin role)

All routes under `/` require authentication and are protected by `AuthGuard`. The main layout (`MainLayout`) provides the common UI structure for all authenticated routes.

### Navigation
- Use the sidebar menu to navigate between main sections
- The URL bar reflects your current location
- Browser back/forward buttons work as expected
- Links maintain state when navigating

## Plugins

### Managing Plugins
- Browse available plugins
- Install and uninstall plugins
- Configure plugin settings
- Enable/disable plugins

### Popular Plugins
- Language support extensions
- Theme packages
- Code formatting tools
- Version control integration

## Support and Feedback

If you encounter any issues or have suggestions for improvement:
1. Check the [GitHub Issues](https://github.com/yourusername/LARK-Web/issues)
2. Submit a new issue with detailed information
3. Join our community discussions

For more detailed information about specific features, please refer to our [Features List](FEATURES.md) and [Plugin Development Guide](PLUGIN_GUIDE.md).
