# LARK Web

A modern, extensible web-based version of the Language Analysis and Response Kit (LARK).

## Project Structure

```
src/
├── components/     # React components
│   ├── admin/      # Admin components
│   │   └── AdminPanel.tsx   # Admin control panel
│   ├── auth/       # Authentication components
│   │   ├── AuthGuard.tsx   # Auth protection wrapper
│   │   ├── LoginForm.tsx   # Login form
│   │   └── RegisterForm.tsx # Registration form
│   ├── chat/       # AI Chat components
│   │   ├── ChatPage.tsx    # Main chat interface
│   │   └── FileSidebar.tsx # File reference sidebar
│   ├── common/     # Shared components
│   │   └── LordIcon.tsx    # LordIcon component wrapper
│   ├── editor/     # Editor components
│   │   ├── AIWritingAssistant.tsx # AI writing assistance
│   │   ├── Editor.tsx      # Main editor component
│   │   ├── EditorLayout.tsx # Editor layout container
│   │   ├── FileOperationDialog.tsx # File operation UI
│   │   ├── MonacoEditor.tsx # Monaco editor wrapper
│   │   ├── QuickActionBar.tsx # Quick action floating menu
│   │   └── TabBar.tsx      # Editor tabs management
│   ├── files/      # File management components
│   │   ├── FileExplorer.tsx # File system navigation
│   │   └── FilePreview.tsx  # File preview component
│   ├── layout/     # Layout components
│   │   └── MainLayout.tsx   # Main app layout
│   ├── moderation/ # Moderation components
│   │   └── ModerationPanel.tsx # Content moderation UI
│   ├── profile/    # User profile components
│   │   ├── Profile.tsx     # User profile view
│   │   └── ProfilePage.tsx # Profile page container
│   └── settings/   # Settings components
│       ├── AISettings.tsx  # AI provider configuration
│       ├── AISettingsDialog.tsx # AI settings modal
│       └── SettingsPage.tsx # Settings page container
├── core/           # Core functionality
│   └── types/      # Core type definitions
│       ├── auth.ts          # Authentication types
│       └── editor.ts        # Editor types
├── services/       # Application services
│   ├── AIService.ts         # AI integration service
│   ├── FileSystemService.ts # Base file system service
│   ├── MockFileSystemService.ts # Mock implementation
│   └── UserFileSystemService.ts # User file system operations
├── stores/         # State management
│   ├── aiStore.ts          # AI settings state
│   ├── authStore.ts        # Authentication state
│   ├── chatStore.ts        # Chat history and settings
│   ├── editorStore.ts      # Editor state
│   └── fileSystemStore.ts  # File system state
├── types/          # Type definitions
│   ├── ai.ts             # AI integration types
│   ├── editor.ts         # Editor types
│   ├── fileSystem.ts     # File system types
│   └── vite-env.d.ts     # Vite environment types
├── utils/          # Utility functions
│   └── formatters.ts     # Data formatting utilities
├── App.tsx         # Root application component
├── main.tsx       # Application entry point
└── theme.ts       # Theme configuration
```

## Features

LARK Web is a modern, extensible web-based editor designed for writers, featuring:

- **Advanced Text Editor**
  - Rich text editing with Monaco Editor
  - Multi-file support with tabs
  - File explorer with tree view
  - Syntax highlighting for markdown
  - File sharing capabilities
  - Automatic saving
  - Full-screen mode
  - Real-time file syncing
  - Intelligent path handling
  - Automatic conflict resolution

- **AI Integration**
  - Interactive AI chat interface
  - File context integration
  - Multiple chat conversations
  - Persistent chat history
  - Temperature and token controls
  - File reference support with auto-complete
  - Line range references
  - Open and recent files tracking
  - OpenAI-compatible API providers
  - Text improvement suggestions
  - Story continuation assistance
  - Creative brainstorming
  - Real-time writing feedback
  - Customizable AI parameters
  - Secure API key management
  - Quick access through editor
  - Multiple provider support
  - Custom prompts and instructions

- **File Management**
  - Advanced file explorer
  - Real-time file syncing
  - Automatic file opening
  - Intelligent path handling
  - Instant file creation
  - Directory structure support
  - File metadata tracking
  - Error recovery system
  - File status monitoring
  - Cross-component synchronization

- **User Interface**
  - Modern, clean design
  - Light and dark themes
  - Customizable layout
  - Quick action bar
  - File preview
  - Split view support
  - Full keyboard navigation
  - Responsive design

- **Development Features**
  - Plugin system
  - Custom theme support
  - API provider integration
  - Development mode
  - Mock file system
  - Error handling
  - Performance optimization

## Getting Started

### Prerequisites
- Node.js 18 or higher
- npm 9 or higher
- A modern browser with File System Access API support
- An API key from an OpenAI-compatible service (for AI features)

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

### Setting Up AI Features

1. Obtain an API key from an OpenAI-compatible service provider
2. Navigate to your profile settings in LARK Web
3. Go to the "AI Settings" tab
4. Click "Add Provider" and enter your provider details:
   - Provider Name (e.g., "OpenAI")
   - API Endpoint (e.g., "https://api.openai.com")
   - API Key
   - Model Name (e.g., "gpt-3.5-turbo")
   - Optional: Adjust temperature and token settings

### Development

The project uses:
- Vite for fast development and building
- TypeScript for type safety
- React for UI components
- Zustand for state management
- Monaco Editor for text editing
- Material-UI for components and theming

## AI Integration

LARK Web features a powerful AI integration system that enhances the writing experience:

### AI Provider Configuration

You can configure multiple AI providers through either:
- The Profile page under the AI Settings section
- The Settings page under the AI tab

Each provider configuration includes:
- Provider name (e.g., "OpenAI", "Azure", etc.)
- API endpoint
- API key (securely stored)
- Model name (e.g., "gpt-3.5-turbo")
- Temperature (controls creativity, 0.0-1.0)
- Max tokens (controls response length)

### AI Features

The AI integration provides several writing assistance features:

1. **Quick Actions**
   - Access AI features directly from the editor's quick action bar
   - Format text with a single click
   - Apply AI suggestions instantly

2. **Writing Enhancement**
   - Improve text clarity and engagement
   - Fix grammar and style issues
   - Enhance sentence structure
   - Make text more professional

3. **Creative Assistance**
   - Generate story continuations
   - Brainstorm ideas and plot points
   - Develop character dialogues
   - Explore narrative possibilities

4. **Custom Instructions**
   - Create custom AI prompts
   - Tailor AI responses to your needs
   - Save frequently used prompts
   - Share prompts with team members

### Using AI Features

1. **Text Improvement**
   - Select text in the editor
   - Click the AI icon in the quick action bar
   - Choose "Improve Writing"
   - Review and apply suggestions

2. **Continuation**
   - Place cursor at the end of your text
   - Click the AI icon
   - Select "Continue Writing"
   - Choose from generated continuations

3. **Brainstorming**
   - Select relevant context
   - Click the AI icon
   - Choose "Brainstorm Ideas"
   - Review generated suggestions

4. **Custom Prompts**
   - Select text
   - Click the AI icon
   - Choose "Custom Prompt"
   - Enter your instruction
   - Apply the AI's response

### Security and Privacy

- API keys are securely stored and never exposed
- All AI interactions are encrypted
- No data is stored on AI provider servers
- Options to use local or private AI models
- Configurable data retention policies

## File System Integration

LARK Web provides a flexible file system integration that works with both mock data during development and real backend APIs in production:

### Development Mode
- In-memory mock file system
- Sample files and directories
- Full CRUD operations support
- File search capabilities
- No backend required

### Production Mode
- Real backend API integration
- Cloud-based storage
- Secure file handling
- User-specific management
- File sharing capabilities

For details on switching between development and production modes, see the [API Migration Guide](docs/API_MIGRATION.md).

### Features
- Create, read, update, and delete files
- Directory management
- File search with content support
- Path-based navigation
- Type-safe operations
- Progress tracking for large operations

### Usage Example
```typescript
const fileSystem = UserFileSystemService.getInstance();

// Create a new file
await fileSystem.createFile({
  name: 'My Story.md',
  content: '# Chapter 1\n\nOnce upon a time...',
  parentId: 'root'
});

// Share a file
const shareLink = await fileSystem.shareFile('file-id');
```

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
