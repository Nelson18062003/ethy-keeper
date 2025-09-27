import { Buffer } from 'buffer';

// Make Buffer globally available for libraries that expect it
if (typeof globalThis !== 'undefined') {
  globalThis.Buffer = Buffer;
} else if (typeof window !== 'undefined') {
  (window as any).Buffer = Buffer;
} else if (typeof global !== 'undefined') {
  global.Buffer = Buffer;
}