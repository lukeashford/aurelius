import '@testing-library/jest-dom';

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
} as any;

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock Math.random to return deterministic values for consistent snapshots
let mockRandomCounter = 0;
const originalRandom = Math.random;

beforeEach(() => {
  mockRandomCounter = 0;
  Math.random = () => {
    mockRandomCounter++;
    // Return deterministic values based on counter
    // This ensures IDs are consistent across test runs
    return mockRandomCounter * 0.1;
  };
});

afterEach(() => {
  Math.random = originalRandom;
});
