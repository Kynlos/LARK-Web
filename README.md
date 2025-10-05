# LARK Web

A modern, extensible web-based version of the Language Analysis and Response Kit (LARK).

## 🚀 Recent Updates (October 5, 2025)

### ✅ Critical Bug Fixes
- **QuickActionBar AI Integration** - Fixed runtime errors with singleton pattern usage
- **Router Guards** - Fixed loaders to use proper `redirect()` API  
- **File Renaming** - Fully implemented across all services and stores
- **Error Handling** - Added user-visible error notifications in FileExplorer

### 🧪 Test Suite
- **8 comprehensive test files** covering stores, services, components, and workflows
- **50+ test cases** for critical functionality
- **Vitest + React Testing Library** setup with coverage reporting
- **CI/CD pipeline** with GitHub Actions

### 📊 Performance Roadmap
See [docs/IMPROVEMENTS.md](./docs/IMPROVEMENTS.md) for planned optimizations:
- 30-60% bundle size reduction via code splitting
- 50%+ fewer re-renders with Zustand selectors
- Monaco editor debouncing to eliminate typing lag
- IndexedDB migration for large file handling

---

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

## 🐛 Bug Fixes & Improvements

### Fixed Issues (October 5, 2025)

#### 1. QuickActionBar AI Integration ✅
**Problem:** Runtime errors when using AI features through the quick action bar.
- Incorrect store access pattern (`activeProvider` instead of `settings.activeProvider`)
- Attempted to instantiate singleton with `new AIService()`  
- Called non-existent methods

**Solution:**
```typescript
// Fixed store access
const { settings } = useAIStore();
const provider = settings.providers.find(p => p.name === settings.activeProvider);

// Use singleton pattern correctly
const aiService = AIService.getInstance();
aiService.setProvider(provider);

// Call correct methods
await aiService.improveWriting(text);  // was: improveText()
await aiService.brainstormIdeas(text);  // was: brainstorm()
```

#### 2. Router Guards ✅
**Problem:** Loaders returned React components instead of using React Router's redirect API.

**Solution:**
```typescript
// Before (incorrect)
loader: () => {
  const { isAuthenticated } = useAuthStore.getState();
  return isAuthenticated ? Navigate({ to: '/' }) : null;
}

// After (correct)
loader: () => {
  const { isAuthenticated } = useAuthStore.getState();
  if (isAuthenticated) return redirect('/');
  return null;
}
```

#### 3. File Renaming ✅
**Problem:** `renameFile` function was a TODO placeholder.

**Solution:** Implemented complete rename functionality:
- Added `renameFile()` method to `MockFileSystemService`
- Added `renameFile()` method to `UserFileSystemService`
- Implemented `renameFile()` action in `editorStore`
- Includes duplicate name detection
- Updates all file references (files, projectFiles, paths)
- Syncs with backend when available

#### 4. Error Handling in FileExplorer ✅
**Problem:** Errors were logged to console but never shown to users.

**Solution:**
- Added error state management
- Implemented Material-UI Snackbar with Alert component
- Display user-friendly error messages for:
  - File creation failures
  - File open failures
  - Network errors
  - Permission issues

---

## 🧪 Testing

### Test Suite Overview

LARK-Web now includes a comprehensive test suite built with:
- **Vitest** - Fast, Vite-native testing framework
- **React Testing Library** - Component testing utilities
- **@testing-library/jest-dom** - Custom DOM matchers

### Test Coverage

**8 Test Files** covering:

1. **Store Tests** (2 files)
   - `editorStore.test.ts` - File operations, recent files, state management
   - `aiStore.test.ts` - Provider management, configuration

2. **Service Tests** (2 files)
   - `AIService.test.ts` - API calls, writing assistance, error handling
   - `MockFileSystemService.test.ts` - CRUD operations, search, rename

3. **Component Tests** (2 files)
   - `LoginForm.test.tsx` - Authentication flow, form validation
   - `QuickActionBar.test.tsx` - Formatting, AI actions, button states

4. **Integration Tests** (2 files)
   - `editor-workflow.test.tsx` - Complete file lifecycle
   - `ai-workflow.test.ts` - Provider setup and AI usage

### Running Tests

```bash
# Install dependencies
npm install

# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Interactive test UI
npm run test:ui
```

### Test Documentation

- **[docs/TESTING.md](./docs/TESTING.md)** - Complete testing guide
- **[README.test.md](./README.test.md)** - Test suite summary
- **[TEST_SUITE_SETUP.md](./TEST_SUITE_SETUP.md)** - Setup instructions

### CI/CD

GitHub Actions workflow automatically:
- Runs tests on Node 18.x and 20.x
- Checks linting and type errors
- Generates coverage reports
- Uploads to Codecov
- Validates builds

---

## 📚 Documentation

### Available Guides

- **[AGENTS.md](./AGENTS.md)** - AI agent instructions, common commands
- **[docs/TESTING.md](./docs/TESTING.md)** - Complete testing guide (300+ lines)
- **[docs/IMPROVEMENTS.md](./docs/IMPROVEMENTS.md)** - Performance optimization roadmap
- **[docs/BUG_FIXES.md](./docs/BUG_FIXES.md)** - Detailed bug fix documentation
- **[CONTRIBUTING.md](./CONTRIBUTING.md)** - Contribution guidelines

### Quick Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run preview          # Preview production build

# Quality Checks
npm run lint             # Run ESLint
npm test                 # Run test suite
npm run test:coverage    # Generate coverage report

# Pre-commit Checks
npm run lint && npm test && npm run build
```

---

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

Before submitting a PR:
1. Run `npm run lint` to check code style
2. Run `npm test` to ensure all tests pass  
3. Run `npm run build` to verify TypeScript compilation
4. Add tests for new features
5. Update documentation as needed

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Maintained by:** LARK-Web Team  
**Last Updated:** October 5, 2025  
**Version:** 0.1.0
