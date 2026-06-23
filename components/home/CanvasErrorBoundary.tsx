'use client';

import { Component, ReactNode } from 'react';

interface Props {
  /** Rendered instead of the children if the WebGL scene throws during render or asset
   *  loading (e.g. an HDRI/font/texture fetch failure). Keeps the hero alive instead of
   *  crashing the page. (Async WebGL context-loss is a DOM event, not a React throw, so it
   *  is NOT covered here — it would need a `webglcontextlost` listener on the canvas.) */
  fallback: ReactNode;
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * Error boundary around the R3F `<Canvas>`. React-three-fiber re-throws render/loader
 * errors into the parent React tree, so a boundary here catches them and swaps in a
 * static fallback rather than letting the whole page error out. Defense-in-depth: the
 * primary fix is self-hosting the scene's assets, but the hero must never hard-crash.
 */
export default class CanvasErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    // Surfaced in the console for diagnostics; the user still sees the static fallback.
    console.error('[Hero3D] WebGL scene failed, falling back to static hero:', error);
  }

  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}
