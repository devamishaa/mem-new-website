"use client";
import { Component } from "react";

/**
 * Wrap each dynamic section with this boundary.
 * Props:
 * - fallback: ReactNode shown when a child throws
 * - sectionName: string for logs/telemetry (e.g., "Phone/Pinned")
 * - resetKey: string — remount boundary when this changes (e.g., `${pageId}:${section}:${variant}`)
 * - onError?: (payload) => void — optional reporter (Sentry/LogRocket)
 */
export default class SectionErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    const payload = {
      error: error?.message ?? String(error),
      componentStack: info?.componentStack ?? "",
      sectionName: this.props.sectionName ?? "unknown",
    };

    if (process.env.NODE_ENV !== "production") {
      // richer context in dev
      // eslint-disable-next-line no-console
      console.error("[LandingSectionError]", payload);
    }
    // Optional external reporter
    if (typeof this.props.onError === "function") {
      try {
        this.props.onError(payload);
      } catch {}
    }
    // Example: Sentry
    // if (typeof Sentry !== 'undefined') {
    //   Sentry.withScope(scope => {
    //     scope.setTag('section', payload.sectionName);
    //     scope.setExtra('componentStack', payload.componentStack);
    //     Sentry.captureException(error);
    //   });
    // }
  }

  componentDidUpdate(prevProps) {
    // Allow recovery when resetKey changes (e.g., variant swapped)
    if (prevProps.resetKey !== this.props.resetKey && this.state.hasError) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ hasError: false });
    }
  }

  render() {
    return this.state.hasError
      ? this.props.fallback ?? null
      : this.props.children;
  }
}
