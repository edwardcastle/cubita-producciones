import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock next-intl
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => 'es',
}));

vi.mock('next-intl/server', () => ({
  getLocale: vi.fn(() => Promise.resolve('es')),
  getTranslations: vi.fn(() => Promise.resolve((key: string) => key)),
  setRequestLocale: vi.fn(),
}));

// Mock @/i18n/routing
vi.mock('@/i18n/routing', async () => {
  const React = await import('react');
  return {
    Link: ({ children, href, ...props }: Record<string, unknown> & { children?: React.ReactNode; href: string }) => {
      return React.createElement('a', { href, ...props }, children);
    },
    usePathname: () => '/',
  };
});

// Mock next/image
vi.mock('next/image', async () => {
  const React = await import('react');
  return {
    default: ({ src, alt, ...props }: Record<string, unknown> & { src: string; alt: string }) => {
      return React.createElement('img', { src, alt, ...props });
    },
  };
});

// Mock framer-motion — Proxy handles any motion.X element (div, nav, button, etc.)
vi.mock('framer-motion', async () => {
  const React = await import('react');
  const motionProps = ['initial', 'animate', 'exit', 'variants', 'whileHover', 'whileTap', 'transition'];
  const isMotionValue = (v: unknown): v is { get: () => unknown } =>
    typeof v === 'object' && v !== null && typeof (v as Record<string, unknown>).get === 'function';
  const handler: ProxyHandler<Record<string, never>> = {
    get(_target, prop: string) {
      return ({ children, ...props }: Record<string, unknown> & { children?: React.ReactNode }) => {
        const filtered = Object.fromEntries(Object.entries(props).filter(([k]) => !motionProps.includes(k)));
        const resolvedChildren = isMotionValue(children) ? (children.get() as React.ReactNode) : children;
        return React.createElement(prop, filtered, resolvedChildren);
      };
    },
  };
  // Minimal motion value stub — tests don't assert on motion values
  const makeMotionValue = (initial: unknown) => {
    let v = initial;
    return { get: () => v, set: (n: unknown) => { v = n; }, on: () => () => {} };
  };
  return {
    motion: new Proxy({}, handler),
    AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
    useInView: () => true,
    useMotionValue: (initial: unknown) => makeMotionValue(initial),
    useSpring: (mv: ReturnType<typeof makeMotionValue>) => mv,
    useReducedMotion: () => false,
    // NOTE: snapshot — evaluates transform once at call time, not reactively.
    // Sufficient for tests where IntersectionObserver never fires and values never change.
    useTransform: (mv: ReturnType<typeof makeMotionValue>, fn: (v: number) => number) => makeMotionValue(fn(mv.get() as number)),
    animate: () => ({ stop: () => {} }),
    useMotionTemplate: (strings: TemplateStringsArray, ...values: Array<ReturnType<typeof makeMotionValue> | string | number>) => {
      const compute = () => strings.reduce((acc, str, i) => {
        const val = values[i];
        const resolved = val && typeof val === 'object' && 'get' in val ? val.get() : val ?? '';
        return acc + str + resolved;
      }, '').trimEnd();
      return makeMotionValue(compute());
    },
  };
});

// Mock IntersectionObserver
class MockIntersectionObserver {
  observe = vi.fn();
  disconnect = vi.fn();
  unobserve = vi.fn();
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: MockIntersectionObserver,
});

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
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

// Mock fetch
global.fetch = vi.fn();

// Reset all mocks before each test
beforeEach(() => {
  vi.clearAllMocks();
});
