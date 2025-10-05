import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock lottie-web to avoid canvas errors
vi.mock('lottie-web', () => ({
  default: {
    loadAnimation: vi.fn().mockReturnValue({
      play: vi.fn(),
      stop: vi.fn(),
      destroy: vi.fn(),
    }),
  },
}));

// Mock lord-icon-element
vi.mock('lord-icon-element', () => ({}));

global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
