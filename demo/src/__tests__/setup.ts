import '@testing-library/jest-dom';
import React from 'react';
import {TextDecoder, TextEncoder} from 'node:util';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as any;

// Mock react-player
jest.mock('react-player', () => {
  return {
    __esModule: true,
    default: (props: any) => {
      // Filter out props that are not valid for a div or use a custom tag
      const {src, playing, controls, light, volume, muted, loop, ...rest} = props;
      return React.createElement('div', {
        'data-testid': 'mock-react-player',
        'data-src': src,
        ...rest
      });
    },
  };
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {
  }

  disconnect() {
  }

  observe() {
  }

  takeRecords() {
    return [];
  }

  unobserve() {
  }
} as any;

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor(callback: ResizeObserverCallback) {
  }

  disconnect() {
  }

  observe() {
  }

  unobserve() {
  }
} as any;

// Mock URL.createObjectURL and revokeObjectURL
global.URL.createObjectURL = jest.fn((blob: Blob) => `blob:mock-url-${Math.random()}`);
global.URL.revokeObjectURL = jest.fn();

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
