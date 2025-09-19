"use client";

import React from "react";

class DropdownErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to console in development
    if (process.env.NODE_ENV === "development") {
      console.error(
        "Dropdown Error Boundary caught an error:",
        error,
        errorInfo
      );
    }

    // In production, you might want to log to an error reporting service
    // logErrorToService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI that doesn't break the page layout
      return (
        <div
          style={{
            display: "none", // Hidden fallback to preserve layout
            position: "fixed",
            top: 0,
            left: 0,
            zIndex: -1,
          }}
          aria-hidden="true"
        >
          {/* Silent fallback - dropdown simply doesn't appear */}
        </div>
      );
    }

    return this.props.children;
  }
}

export default DropdownErrorBoundary;
