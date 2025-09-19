"use client";

import { forwardRef } from "react";
import styles from "./Button.module.css";

// Component for rendering the loading spinner
function LoadingSpinner() {
  return (
    <span className={styles.spinner} aria-hidden="true">
      <span className={styles.spinnerCircle}></span>
    </span>
  );
}

// Component for rendering button content (text + icons)
function ButtonContent({ children, icon, iconPosition, loading }) {
  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      {icon && iconPosition === "before" && (
        <span className={styles.icon} aria-hidden="true">
          {icon}
        </span>
      )}
      <span className={styles.text}>{children}</span>
      {icon && iconPosition === "after" && (
        <span className={styles.icon} aria-hidden="true">
          {icon}
        </span>
      )}
    </>
  );
}

// Utility to create ARIA attributes
function createAriaAttributes(loading, disabled, variant) {
  return {
    "aria-busy": loading || undefined,
    "aria-disabled": disabled || loading || undefined,
    "data-loading": loading ? "true" : undefined,
    "data-variant": variant,
  };
}

// Component for rendering button as a link
function ButtonLink({
  href,
  className,
  icon,
  iconPosition,
  loading,
  disabled,
  variant,
  children,
  ...props
}) {
  const ariaProps = createAriaAttributes(loading, disabled, variant);

  if (disabled || loading) {
    return (
      <span className={className} role="button" {...ariaProps} {...props}>
        <ButtonContent
          icon={icon}
          iconPosition={iconPosition}
          loading={loading}
        >
          {children}
        </ButtonContent>
      </span>
    );
  }

  return (
    <a
      href={href}
      className={className}
      role="button"
      {...ariaProps}
      {...props}
    >
      <ButtonContent icon={icon} iconPosition={iconPosition} loading={loading}>
        {children}
      </ButtonContent>
    </a>
  );
}

// Component for rendering button as a button element
function ButtonElement({
  className,
  disabled,
  loading,
  onClick,
  icon,
  iconPosition,
  variant,
  children,
  forwardedRef,
  ...props
}) {
  const ariaProps = createAriaAttributes(loading, disabled, variant);

  return (
    <button
      type="button"
      className={className}
      disabled={disabled || loading}
      onClick={disabled || loading ? undefined : onClick}
      ref={forwardedRef}
      {...ariaProps}
      {...props}
    >
      <ButtonContent icon={icon} iconPosition={iconPosition} loading={loading}>
        {children}
      </ButtonContent>
    </button>
  );
}

// Utility to build CSS classes
function buildClasses({
  variant,
  size,
  disabled,
  loading,
  fullWidth,
  className,
}) {
  return [
    styles.button,
    styles[`variant-${variant}`],
    styles[`size-${size}`],
    disabled && styles.disabled,
    loading && styles.loading,
    fullWidth && styles.fullWidth,
    className,
  ]
    .filter(Boolean)
    .join(" ");
}

// Utility to determine icon position
function getIconPosition(iconPosition, variant) {
  return iconPosition || (variant === "navbar" ? "before" : "after");
}

// Utility to determine if should render as link
function shouldRenderAsLink(href, disabled, loading) {
  return href && !disabled && !loading;
}

/**
 * Reusable Button Component - Based on Figma designs
 *
 * @param {'primary'|'secondary'|'navbar'} props.variant - Button style variant
 * @param {'sm'|'md'|'lg'} props.size - Button size
 * @param {boolean} props.disabled - Disabled state
 * @param {boolean} props.loading - Loading state
 * @param {boolean} props.fullWidth - Full width button
 * @param {string} props.href - If provided, renders as link
 * @param {React.ReactNode} props.icon - Icon (arrow, etc.)
 * @param {'before'|'after'} props.iconPosition - Icon position relative to text
 * @param {string} props.className - Additional CSS classes
 * @param {React.ReactNode} props.children - Button text
 */
const Button = forwardRef(
  (
    {
      variant = "primary",
      size = "md",
      disabled = false,
      loading = false,
      fullWidth = false,
      href,
      icon,
      iconPosition,
      className = "",
      children,
      onClick,
      ...props
    },
    ref
  ) => {
    const finalClassName = buildClasses({
      variant,
      size,
      disabled,
      loading,
      fullWidth,
      className,
    });
    const finalIconPosition = getIconPosition(iconPosition, variant);
    const isLink = shouldRenderAsLink(href, disabled, loading);

    const commonProps = {
      className: finalClassName,
      icon,
      iconPosition: finalIconPosition,
      loading,
      disabled,
      variant,
      children,
      ...props,
    };

    if (isLink) {
      return <ButtonLink href={href} {...commonProps} />;
    }

    return (
      <ButtonElement onClick={onClick} forwardedRef={ref} {...commonProps} />
    );
  }
);

Button.displayName = "Button";

export default Button;
