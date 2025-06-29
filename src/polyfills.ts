/**
 * Polyfills for Angular and third-party libraries
 */

import 'zone.js';

// Global polyfills for Node.js compatibility - must be set before any imports
declare const global: any;

// Comprehensive global setup
if (typeof (globalThis as any).global === 'undefined') {
  (globalThis as any).global = globalThis;
}

if (typeof (window as any).global === 'undefined') {
  (window as any).global = window;
}

// Process polyfill for Node.js compatibility
if (typeof (globalThis as any).process === 'undefined') {
  (globalThis as any).process = {
    env: {},
    version: '',
    platform: 'browser',
    nextTick: (fn: Function, ...args: any[]) => {
      setTimeout(() => fn(...args), 0);
    },
    cwd: () => '/',
    browser: true
  };
}

// Buffer polyfill
if (typeof (globalThis as any).Buffer === 'undefined') {
  (globalThis as any).Buffer = {
    isBuffer: () => false,
    from: (data: any) => data,
    alloc: (size: number) => new Array(size).fill(0)
  };
}

// setImmediate polyfill for STOMP.js
if (typeof (globalThis as any).setImmediate === 'undefined') {
  (globalThis as any).setImmediate = (fn: Function, ...args: any[]) => {
    return setTimeout(() => fn(...args), 0);
  };
}

if (typeof (globalThis as any).clearImmediate === 'undefined') {
  (globalThis as any).clearImmediate = (id: any) => {
    clearTimeout(id);
  };
}

// Additional WebSocket compatibility
if (typeof (globalThis as any).WebSocket === 'undefined' && typeof (window as any).WebSocket !== 'undefined') {
  (globalThis as any).WebSocket = (window as any).WebSocket;
}