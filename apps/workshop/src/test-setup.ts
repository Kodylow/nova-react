/**
 *              © 2025-2026 Visa
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 **/
import '@testing-library/jest-dom/vitest';
import { toHaveNoViolations } from 'jest-axe';
import { vi } from 'vitest';
import { act } from '@testing-library/react';

expect.extend(toHaveNoViolations);

window.matchMedia =
  window.matchMedia ||
  function () {
    return {
      addListener: () => {},
      addEventListener: () => {},
      matches: false,
      removeListener: () => {},
    };
  };

window.scrollTo = vi.fn();

// Mock React's scheduler to prevent window access errors during test teardown
vi.mock('scheduler', () => ({
  unstable_scheduleCallback: vi.fn(),
  unstable_cancelCallback: vi.fn(),
  unstable_shouldYield: vi.fn(() => false),
  unstable_requestPaint: vi.fn(),
  unstable_now: vi.fn(() => Date.now()),
  unstable_getCurrentPriorityLevel: vi.fn(() => 3),
  unstable_ImmediatePriority: 1,
  unstable_UserBlockingPriority: 2,
  unstable_NormalPriority: 3,
  unstable_LowPriority: 4,
  unstable_IdlePriority: 5,
}));

// Polyfills for React Router v7 and other modern web APIs
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const global: any;

// Add TextEncoder/TextDecoder polyfill for Jest environment
try {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const util = eval('require("util")') as any;
  if (!global.TextEncoder) {
    global.TextEncoder = util.TextEncoder;
  }
  if (!global.TextDecoder) {
    global.TextDecoder = util.TextDecoder;
  }
} catch {
  // Fallback will use jsdom defaults if available
}

// Ensure window exists during test teardown
afterEach(() => {
  // Clear any pending timers to prevent React state updates after teardown
  vi.clearAllTimers();

  // Flush any pending React updates
  if (typeof window !== 'undefined' && window.document) {
    act(() => {
      // Flush any pending updates
    });
  }
});

// Additional cleanup for React components
beforeEach(() => {
  idCounter = 0;
  // Ensure clean state before each test
  vi.clearAllMocks();
});

// Mock window.requestIdleCallback and window.cancelIdleCallback
Object.defineProperty(window, 'requestIdleCallback', {
  value: vi.fn(cb => setTimeout(cb, 0)),
  writable: true,
});

Object.defineProperty(window, 'cancelIdleCallback', {
  value: vi.fn(id => clearTimeout(id)),
  writable: true,
});

let idCounter = 0;
// mock react's useId implementation to not have utf8 characters which broken on vitest in jenkins CI pipeline
vi.mock('react', async importActual => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const actual: any = await importActual();
  return { ...actual, useId: () => `test-id-${idCounter++}` };
});
