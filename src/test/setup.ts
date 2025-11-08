import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock window.matchMedia for touch detection tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    // addListener: vi.fn(),
    // removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock navigator.maxTouchPoints
Object.defineProperty(navigator, 'maxTouchPoints', {
  writable: true,
  value: 0,
});

// Mock window.ontouchstart
Object.defineProperty(window, 'ontouchstart', {
  writable: true,
  value: undefined,
});
