/**
 * Test Setup File
 * 
 * Initializes testing environment:
 * - Imports testing utilities
 * - Configures global test helpers
 * - Sets up DOM matchers
 * 
 * Runs before all tests
 */
import '@testing-library/jest-dom';
import { vi } from 'vitest';

/**
 * Mock localStorage for tests
 */
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

/**
 * Suppress console errors/warnings in test output
 * (keep console.log for debugging if needed)
 */
global.console = {
  ...console,
  error: vi.fn(),
  warn: vi.fn(),
};
