import 'zone.js';

// Global polyfills for Node.js compatibility
if (typeof (globalThis as any).global === 'undefined') {
  (globalThis as any).global = globalThis;
}

if (typeof (window as any).global === 'undefined') {
  (window as any).global = window;
}

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

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig);
