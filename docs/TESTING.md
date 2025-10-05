# Testing Guide

Complete testing documentation for LARK-Web project.

---

## Overview

LARK-Web uses a comprehensive testing approach with:
- **Vitest** - Fast unit testing framework (Vite-native)
- **React Testing Library** - Component testing utilities
- **@testing-library/jest-dom** - Custom matchers for DOM
- **jsdom** - Browser environment simulation

---

## Quick Start

### Install Dependencies

```bash
npm install
```

### Run Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

---

## Test Structure

```
src/
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   └── __tests__/
│   │       └── LoginForm.test.tsx
│   └── editor/
│       ├── QuickActionBar.tsx
│       └── __tests__/
│           └── QuickActionBar.test.tsx
├── services/
│   ├── AIService.ts
│   └── __tests__/
│       ├── AIService.test.ts
│       └── MockFileSystemService.test.ts
├── stores/
│   ├── editorStore.ts
│   ├── aiStore.ts
│   └── __tests__/
│       ├── editorStore.test.ts
│       └── aiStore.test.ts
└── tests/
    ├── setup.ts              # Global test setup
    ├── utils/
    │   └── test-utils.tsx    # Custom render utilities
    └── integration/
        ├── editor-workflow.test.tsx
        └── ai-workflow.test.ts
```

---

## Test Categories

### 1. Unit Tests

Test individual functions, components, and modules in isolation.

**Location:** `__tests__/` folders next to source files

**Example - Store Test:**
```typescript
import { describe, it, expect } from 'vitest';
import { useEditorStore } from '../editorStore';

describe('editorStore', () => {
  it('should update file content', () => {
    const { updateFileContent } = useEditorStore.getState();
    updateFileContent('file-1', 'new content');
    
    const { files } = useEditorStore.getState();
    expect(files[0].content).toBe('new content');
  });
});
```

**Example - Service Test:**
```typescript
import { describe, it, expect, vi } from 'vitest';
import { AIService } from '../AIService';

describe('AIService', () => {
  it('should improve writing', async () => {
    const aiService = AIService.getInstance();
    const result = await aiService.improveWriting('text');
    expect(result).toBeDefined();
  });
});
```

---

### 2. Component Tests

Test React components with user interactions and DOM assertions.

**Example:**
```typescript
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '../../tests/utils/test-utils';
import { LoginForm } from '../LoginForm';

describe('LoginForm', () => {
  it('should handle email input', () => {
    render(<LoginForm />);
    
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    
    expect(emailInput.value).toBe('test@example.com');
  });
});
```

**Custom Render Utility:**
```typescript
// tests/utils/test-utils.tsx
import { render } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';
import { BrowserRouter } from 'react-router-dom';

const AllTheProviders = ({ children }) => (
  <ThemeProvider theme={theme}>
    <BrowserRouter>
      {children}
    </BrowserRouter>
  </ThemeProvider>
);

export const customRender = (ui, options) =>
  render(ui, { wrapper: AllTheProviders, ...options });
```

---

### 3. Integration Tests

Test workflows across multiple components, stores, and services.

**Location:** `src/tests/integration/`

**Example:**
```typescript
import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useEditorStore } from '../../stores/editorStore';

describe('Editor Workflow', () => {
  it('should complete file creation and editing', async () => {
    const { result } = renderHook(() => useEditorStore());
    
    // Create file
    await act(async () => {
      await result.current.createFile('/test.txt', 'content');
    });
    
    // Open file
    await act(async () => {
      await result.current.openFile('file-id');
    });
    
    // Edit content
    act(() => {
      result.current.updateFileContent('file-id', 'updated');
    });
    
    // Save file
    await act(async () => {
      await result.current.saveFile('file-id');
    });
    
    expect(result.current.files[0].isUnsaved).toBe(false);
  });
});
```

---

## Writing Tests

### Best Practices

#### 1. **Arrange-Act-Assert (AAA) Pattern**
```typescript
it('should do something', () => {
  // Arrange - Set up test data
  const input = 'test';
  
  // Act - Perform the action
  const result = doSomething(input);
  
  // Assert - Verify the result
  expect(result).toBe('expected');
});
```

#### 2. **Use Descriptive Test Names**
```typescript
// Good ✓
it('should display error when login fails with invalid credentials', () => {});

// Bad ✗
it('login error', () => {});
```

#### 3. **Test User Behavior, Not Implementation**
```typescript
// Good ✓
it('should show password when visibility toggle is clicked', () => {
  render(<LoginForm />);
  const toggle = screen.getByLabelText(/toggle password/i);
  fireEvent.click(toggle);
  expect(screen.getByLabelText(/password/i)).toHaveAttribute('type', 'text');
});

// Bad ✗
it('should set showPassword state to true', () => {
  // Testing internal state instead of user-visible behavior
});
```

#### 4. **Clean Up After Each Test**
```typescript
import { beforeEach, afterEach } from 'vitest';

beforeEach(() => {
  // Reset stores, mocks, etc.
  useEditorStore.setState({ files: [], openFiles: [] });
});

afterEach(() => {
  vi.clearAllMocks();
});
```

---

### Mocking

#### Mock Services
```typescript
import { vi } from 'vitest';

vi.mock('../services/AIService', () => ({
  AIService: {
    getInstance: vi.fn(() => ({
      improveWriting: vi.fn().mockResolvedValue('improved'),
      setProvider: vi.fn(),
    })),
  },
}));
```

#### Mock Stores
```typescript
vi.mock('../stores/authStore', () => ({
  useAuthStore: vi.fn(() => ({
    isAuthenticated: true,
    user: { id: '1', email: 'test@example.com' },
    login: vi.fn(),
  })),
}));
```

#### Mock Fetch
```typescript
global.fetch = vi.fn();

(global.fetch as any).mockResolvedValueOnce({
  ok: true,
  json: async () => ({ data: 'response' }),
});
```

---

## Test Coverage

### View Coverage Report

```bash
npm run test:coverage
```

Coverage report will be generated in `coverage/` directory and displayed in terminal.

### Coverage Goals

- **Statements:** 80%+
- **Branches:** 75%+
- **Functions:** 80%+
- **Lines:** 80%+

### What to Test

✅ **Test:**
- User interactions and flows
- Business logic and data transformations
- Error handling and edge cases
- API integrations (with mocks)
- State management logic
- Form validation
- Conditional rendering

❌ **Don't Test:**
- Third-party libraries
- TypeScript types (compile-time checks)
- Trivial getters/setters
- Framework internals

---

## Running Specific Tests

### Run Single File
```bash
npm test src/stores/__tests__/editorStore.test.ts
```

### Run by Pattern
```bash
npm test editor
```

### Run in Watch Mode
```bash
npm test -- --watch
```

### Run Only Changed Files
```bash
npm test -- --changed
```

---

## Debugging Tests

### 1. Use `screen.debug()`
```typescript
import { screen } from '@testing-library/react';

it('debug example', () => {
  render(<Component />);
  screen.debug(); // Prints DOM tree to console
});
```

### 2. Use `--reporter=verbose`
```bash
npm test -- --reporter=verbose
```

### 3. Use Vitest UI
```bash
npm run test:ui
```

### 4. Focus on Single Test
```typescript
it.only('focused test', () => {
  // Only this test will run
});
```

### 5. Skip Tests
```typescript
it.skip('skipped test', () => {
  // This test will be skipped
});
```

---

## Common Testing Patterns

### Testing Async Operations

```typescript
it('should load data asynchronously', async () => {
  render(<Component />);
  
  await waitFor(() => {
    expect(screen.getByText('Loaded data')).toBeInTheDocument();
  });
});
```

### Testing Forms

```typescript
it('should submit form with values', async () => {
  const handleSubmit = vi.fn();
  render(<Form onSubmit={handleSubmit} />);
  
  fireEvent.change(screen.getByLabelText(/name/i), {
    target: { value: 'John' },
  });
  
  fireEvent.click(screen.getByRole('button', { name: /submit/i }));
  
  await waitFor(() => {
    expect(handleSubmit).toHaveBeenCalledWith({ name: 'John' });
  });
});
```

### Testing Error States

```typescript
it('should display error message on failure', async () => {
  const mockFetch = vi.fn().mockRejectedValue(new Error('API Error'));
  
  render(<Component fetch={mockFetch} />);
  
  await waitFor(() => {
    expect(screen.getByText(/error/i)).toBeInTheDocument();
  });
});
```

### Testing Zustand Stores

```typescript
it('should update store state', () => {
  const { result } = renderHook(() => useStore());
  
  act(() => {
    result.current.updateValue('new value');
  });
  
  expect(result.current.value).toBe('new value');
});
```

---

## Continuous Integration

### GitHub Actions Example

```yaml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - run: npm install
      - run: npm test
      - run: npm run test:coverage
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json
```

---

## Test Files Summary

### Stores (2 files)
- ✅ `editorStore.test.ts` - File management, recent files, editor instance
- ✅ `aiStore.test.ts` - Provider management, configuration state

### Services (2 files)
- ✅ `AIService.test.ts` - Singleton, chat completion, writing assistance
- ✅ `MockFileSystemService.test.ts` - CRUD operations, search, rename

### Components (2 files)
- ✅ `LoginForm.test.tsx` - Form inputs, validation, submission
- ✅ `QuickActionBar.test.tsx` - Formatting, AI actions, button states

### Integration (2 files)
- ✅ `editor-workflow.test.tsx` - File creation, editing, saving, deletion
- ✅ `ai-workflow.test.ts` - Provider setup, switching, AI usage

**Total:** 8 test files covering stores, services, components, and integration workflows

---

## Troubleshooting

### Issue: "Cannot find module"
**Solution:** Check path aliases in `vitest.config.ts` match `tsconfig.json`

### Issue: "Element is not visible"
**Solution:** Use `waitFor()` for async rendering

### Issue: "act(...) warning"
**Solution:** Wrap state updates in `act()`

### Issue: Tests pass locally but fail in CI
**Solution:** Check for timezone issues, async race conditions, or missing dependencies

---

## Next Steps

1. ✅ Run `npm install` to get testing dependencies
2. ✅ Run `npm test` to verify setup
3. ✅ Add tests when adding new features
4. ✅ Run `npm run test:coverage` before PRs
5. ✅ Aim for 80%+ coverage on new code

---

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Testing Zustand](https://docs.pmnd.rs/zustand/guides/testing)

---

**Last Updated:** October 5, 2025  
**Maintained By:** LARK-Web Team
