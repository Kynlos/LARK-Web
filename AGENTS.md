# AGENTS.md - AI Agent Instructions

This file helps AI coding agents understand the LARK-Web project structure and common commands.

---

## Project Overview

LARK-Web is a modern web-based writing editor with AI integration, built with:
- **Frontend:** React 18 + TypeScript + Vite
- **UI:** Material-UI (MUI) components
- **Editor:** Monaco Editor
- **State:** Zustand
- **Testing:** Vitest + React Testing Library
- **File System:** Mock (dev) / Real backend (prod)
- **AI:** OpenAI-compatible API providers

---

## Common Commands

### Development
```bash
npm run dev          # Start dev server (localhost:5173)
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Testing
```bash
npm test                 # Run all tests
npm test -- --watch      # Run tests in watch mode
npm run test:ui          # Run tests with interactive UI
npm run test:coverage    # Generate coverage report
```

### Verification (run before commits)
```bash
npm run lint             # Check code style
npm run build            # Verify TypeScript compilation
npm test                 # Run test suite
npm run test:coverage    # Ensure >80% coverage
```

---

## Project Structure

```
src/
├── components/       # React components
│   ├── admin/        # Admin panel
│   ├── auth/         # Login, Register, AuthGuard
│   ├── chat/         # AI chat interface
│   ├── common/       # Shared components
│   ├── editor/       # Monaco editor, tabs, toolbars
│   ├── files/        # File explorer, preview
│   ├── layout/       # Main layout
│   ├── moderation/   # Content moderation
│   ├── profile/      # User profile
│   └── settings/     # Settings pages
├── core/             # Core types and utilities
├── services/         # Business logic
│   ├── AIService.ts              # AI integration
│   ├── MockFileSystemService.ts  # Mock file system
│   └── UserFileSystemService.ts  # File operations
├── stores/           # Zustand state management
│   ├── aiStore.ts           # AI provider settings
│   ├── authStore.ts         # Authentication
│   ├── chatStore.ts         # Chat history
│   ├── editorStore.ts       # Editor state, files
│   └── fileSystemStore.ts   # File system state
├── types/            # TypeScript type definitions
└── tests/            # Test utilities and integration tests
    ├── setup.ts
    ├── utils/
    └── integration/
```

---

## Code Conventions

### React Components
- Use functional components with hooks
- Use TypeScript interfaces for props
- Keep components small and focused
- Use Material-UI components for UI

### State Management
- Use Zustand for global state
- Use selective subscriptions to avoid re-renders
- Persist user preferences with middleware

### Styling
- Use MUI's `sx` prop for component styling
- Use theme tokens for consistent spacing/colors
- Responsive design with MUI breakpoints

### File Naming
- Components: PascalCase (e.g., `EditorLayout.tsx`)
- Services: PascalCase (e.g., `AIService.ts`)
- Stores: camelCase (e.g., `editorStore.ts`)
- Tests: `*.test.ts` or `*.test.tsx` in `__tests__/` folders

---

## Testing Requirements

### When to Add Tests
- ✅ New components → Add component test
- ✅ New store actions → Add store test
- ✅ New service methods → Add service test
- ✅ New workflows → Add integration test

### Test Location
```
src/component/Feature.tsx
src/component/__tests__/Feature.test.tsx
```

### Coverage Goals
- Maintain >80% coverage on new code
- Run `npm run test:coverage` before PRs

---

## Key Files

### Configuration
- `vite.config.ts` - Build configuration, path aliases
- `vitest.config.ts` - Test configuration
- `tsconfig.json` - TypeScript settings
- `package.json` - Dependencies and scripts

### Documentation
- `README.md` - Project overview
- `README.test.md` - Test suite summary
- `docs/TESTING.md` - Complete testing guide
- `docs/IMPROVEMENTS.md` - Performance roadmap
- `docs/BUG_FIXES.md` - Bug fix documentation

---

## Common Tasks

### Adding a New Component
1. Create component in appropriate folder
2. Create test in `__tests__/` subfolder
3. Export from parent `index.ts` if needed
4. Import and use in parent component
5. Run tests: `npm test`

### Adding a Store Action
1. Add action to store interface
2. Implement action in store
3. Add test in `stores/__tests__/`
4. Run tests: `npm test`

### Adding AI Feature
1. Add method to `AIService.ts`
2. Add test to `services/__tests__/AIService.test.ts`
3. Update UI component to use new method
4. Run tests: `npm test`

---

## File System

### Development Mode
Uses `MockFileSystemService.ts` with in-memory storage.
Toggle via `useMockApi` flag in `UserFileSystemService.ts`.

### Production Mode
Uses real backend API via `UserFileSystemService.ts`.

---

## Known Issues & Fixes

All critical bugs have been fixed (see `docs/BUG_FIXES.md`):
- ✅ QuickActionBar AI integration
- ✅ Router guards
- ✅ File renaming functionality
- ✅ Error handling in FileExplorer

---

## Performance Notes

See `docs/IMPROVEMENTS.md` for:
- Bundle size optimization strategies
- React re-render reduction techniques
- Monaco Editor optimization
- AI service caching
- Storage performance improvements

---

## Dependencies

### Core
- React 18.2.0
- TypeScript 5.0.2
- Vite 4.4.5

### UI
- @mui/material 5.16.7
- @emotion/react 11.13.3
- framer-motion 11.11.17

### Editor
- monaco-editor 0.52.0
- @monaco-editor/react 4.6.0

### State
- zustand 4.3.8

### Testing
- vitest 1.0.4
- @testing-library/react 14.1.2
- @testing-library/jest-dom 6.1.5

### Routing
- react-router-dom 6.28.0

---

## Environment Variables

Currently using `.env` file (not committed) for local configuration.
No environment-specific variables required for development.

---

## Git Workflow

```bash
# Before committing
npm run lint        # Fix linting issues
npm test            # Ensure tests pass
npm run build       # Verify build works
```

---

## Questions?

Refer to:
- [README.md](./README.md) - Project overview
- [TESTING.md](./docs/TESTING.md) - Testing guide
- [IMPROVEMENTS.md](./docs/IMPROVEMENTS.md) - Roadmap
- [CONTRIBUTING.md](./CONTRIBUTING.md) - Contribution guidelines

---

**Last Updated:** October 5, 2025
