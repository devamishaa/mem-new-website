"use client";

import React, { Fragment, Suspense } from "react";
import { getComponent } from "@/utils/get-component";
import { PAGES_MANIFEST } from "@/configs/dynamic-page-config";

// Simple per-block error boundary so one bad block doesn’t take the page down
class BlockErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(err, info) {
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.error("[DynamicPageRenderer] Block error:", err, info);
    }
  }
  render() {
    if (this.state.hasError) return this.props.fallback ?? null;
    return this.props.children;
  }
}

/**
 * <DynamicPageRenderer pageId="HOME" />
 * - Renders blocks in declared order
 * - Loads the right variant per block
 * - Passes optional props from manifest.props[block]
 */
export default function DynamicPageRenderer({
  pageId,
  // global options
  suspense = false, // wrap blocks in <Suspense> if true
  blockFallback = <div />, // fallback UI for Suspense/ErrorBoundary
  className,
}) {
  const page = PAGES_MANIFEST?.[pageId];
  if (!page) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(`[DynamicPageRenderer] Unknown pageId "${pageId}".`);
    }
    return null;
  }

  const order = page.order || [];
  const mapping = page.components || {};
  const propsMap = page.props || {};

  return (
    <div className={className}>
      {order.map((type) => {
        const variant = mapping[type];
        const Block = getComponent(type, variant);

        // Per-block props (optional)
        const blockProps = propsMap[type] || {};

        const content = (
          <BlockErrorBoundary
            key={`${type}:${variant}`}
            fallback={blockFallback}
          >
            {suspense ? (
              <Suspense fallback={blockFallback}>
                <Block {...blockProps} />
              </Suspense>
            ) : (
              <Block {...blockProps} />
            )}
          </BlockErrorBoundary>
        );

        return <Fragment key={`${type}:${variant}`}>{content}</Fragment>;
      })}
    </div>
  );
}
