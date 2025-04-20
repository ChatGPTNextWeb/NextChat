import { jest } from '@jest/globals';

// Create mocks
const mockInvoke = jest.fn();
const mockListen = jest.fn();

// Mock Tauri modules before import
jest.mock('@tauri-apps/api/core', () => ({
  invoke: (...args: any[]) => mockInvoke(...args)
}));

jest.mock('@tauri-apps/api/event', () => ({
  listen: (...args: any[]) => mockListen(...args)
}));

// Import function after mocking
import { fetch as streamFetch } from '../app/utils/stream';
import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';

// Mock global objects
// @ts-ignore
global.TransformStream = class TransformStream {
  writable = {
    getWriter: () => ({
      ready: Promise.resolve(),
      // @ts-ignore
      write: jest.fn().mockResolvedValue(undefined as any),
      // @ts-ignore
      close: jest.fn().mockResolvedValue(undefined as any)
    })
  };
  readable = {} as any;
} as any;

// Add Response to global context
global.Response = class Response {
  constructor(public body: any, public init: any) {
    Object.assign(this, init);
  }
  status: number = 200;
  statusText: string = 'OK';
  headers: any = {};
} as any;

describe('stream-fetch', () => {
  let originalFetch: any;
  let originalWindow: any;

  beforeAll(() => {
    originalFetch = global.fetch;
    originalWindow = global.window;

    // Mock window object
    Object.defineProperty(global, 'window', {
      value: {
        __TAURI__: true,
        __TAURI_INTERNALS__: {
          transformCallback: (callback: Function) => callback,
          invoke: mockInvoke
        },
        fetch: jest.fn(),
        Headers: class Headers {
          constructor() {}
          entries() { return []; }
        },
        TextEncoder: class TextEncoder {
          encode(text: string) {
            return new Uint8Array(Array.from(text).map(c => c.charCodeAt(0)));
          }
        },
        navigator: {
          userAgent: 'test-agent'
        },
        Response: class Response {
          constructor(public body: any, public init: any) {}
          status: number = 200;
          statusText: string = 'OK';
          headers: any = {};
        }
      },
      writable: true,
    });
  });

  afterAll(() => {
    Object.defineProperty(global, 'window', {
      value: originalWindow,
      writable: true,
    });
    global.fetch = originalFetch;
  });

  beforeEach(() => {
    jest.clearAllMocks();

    // Set up default behavior for listen
    mockListen.mockImplementation(() => Promise.resolve(() => {}));
  });

  test('should use native fetch when Tauri is unavailable', async () => {
    // Temporarily remove __TAURI__
    const tempWindow = { ...window };
    delete (tempWindow as any).__TAURI__;
    Object.defineProperty(global, 'window', {
      value: tempWindow,
      writable: true,
    });

    await streamFetch('https://example.com');

    // Check that native fetch was called
    expect(window.fetch).toHaveBeenCalledWith('https://example.com', undefined);

    // Restore __TAURI__
    Object.defineProperty(global, 'window', {
      value: { ...tempWindow, __TAURI__: true },
      writable: true,
    });
  });

  test('should use Tauri API when Tauri is available', async () => {
    // Mock successful response from Tauri
    // @ts-ignore
    mockInvoke.mockResolvedValue({
      request_id: 123,
      status: 200,
      status_text: 'OK',
      headers: {}
    } as any);

    // Call fetch function
    await streamFetch('https://example.com');

    // Check that Tauri invoke was called with correct parameters
    expect(mockInvoke).toHaveBeenCalledWith(
      'stream_fetch',
      expect.objectContaining({
        url: 'https://example.com'
      }),
      undefined
    );
  });

  test('should add abort signal to request', async () => {
    // Mock successful response from Tauri
    // @ts-ignore
    mockInvoke.mockResolvedValue({
      request_id: 123,
      status: 200,
      status_text: 'OK',
      headers: {}
    } as any);

    // Create AbortController
    const controller = new AbortController();
    const addEventListenerSpy = jest.spyOn(controller.signal, 'addEventListener');

    // Call fetch with signal
    await streamFetch('https://example.com', {
      signal: controller.signal
    });

    // Check that signal was added
    expect(addEventListenerSpy).toHaveBeenCalledWith('abort', expect.any(Function));
  });
});