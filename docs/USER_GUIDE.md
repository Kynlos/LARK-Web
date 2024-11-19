# LARK Web User Guide

Welcome to LARK Web! This guide will help you get started with using the LARK Web editor.

## Table of Contents
1. [Getting Started](#getting-started)
2. [Editor Interface](#editor-interface)
3. [File Management](#file-management)
4. [Editor Features](#editor-features)
5. [User Settings](#user-settings)
6. [Keyboard Shortcuts](#keyboard-shortcuts)
7. [Plugins](#plugins)

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

### File Operations
- **Create File**: 
  - Click the "+" icon or right-click > New File
  - Specify file name and type
  - Add initial content (optional)
- **Create Folder**: 
  - Click the folder icon or right-click > New Folder
  - Organize files in hierarchical structure
- **Edit File**:
  - Open file by clicking
  - Edit content in Monaco editor
  - Changes are saved automatically
- **Delete**: 
  - Right-click > Delete or press Delete
  - Confirmation required for safety
- **Search**:
  - Search by file name or content
  - Results show matching files and locations
  - Quick preview of matches
- **File Info**:
  - View file metadata (size, type, dates)
  - See file path and location
  - Check file permissions

### File System Features
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
- **Error Handling**:
  - Clear error messages
  - Automatic retry for failed operations
  - Data recovery options

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