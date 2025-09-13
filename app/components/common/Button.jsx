"use client";

import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";

// --- START: STYLING CONFIGURATION ---
// Using a configuration object for variants is a scalable and maintainable pattern.
const buttonVariants = {
  base: "inline-flex items-center justify-center relative box-border border-none outline-none cursor-pointer no-underline transition-transform transition-shadow transition-opacity duration-200 ease-out hover:-translate-y-px active:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#557bf4]",
  variants: {
    primary: {
      base: "bg-gradient-to-r from-[#557bf4] to-[#ff66c4] rounded-full gap-2.5",
      text: "font-figtree font-medium text-white whitespace-nowrap leading-snug",
      icon: "flex items-center justify-center aspect-square",
      sizes: {
        sm: "h-10 min-w-[120px] px-4 py-[8px_9px] text-lg",
        md: "h-[50px] min-w-[240px] px-6 text-xl md:h-[57px] md:min-w-[300px] md:py-[11px_12px] md:text-2xl sm:min-w-[260px] lg:min-w-[320px] xl:min-w-[323px] max-[374px]:h-12 max-[374px]:min-w-[220px] max-[374px]:px-4 max-[374px]:py-[8px_9px] max-[374px]:text-lg",
        lg: "h-14 min-w-[280px] px-6 text-2xl md:h-16 md:min-w-[350px] md:px-8 md:text-3xl sm:min-w-[300px] lg:min-w-[370px] xl:min-w-[380px]",
      },
      iconSizes: {
        sm: "h-4 w-4",
        md: "h-5 w-5",
        lg: "h-6 w-6",
      },
    },
    secondary: {
      base: "bg-white/40 rounded-full gap-2 p-4",
      text: "font-figtree text-2xl font-medium text-white",
      icon: "flex items-center justify-center h-5 w-5",
    },
    navbar: {
      base: "bg-[#1ea952] rounded-full gap-2 h-[49px] px-5 py-2 hover:animate-mainJelly",
      text: "font-['Plus_Jakarta_Sans-Medium'] text-sm font-medium text-white whitespace-nowrap",
      icon: "flex items-center justify-center aspect-square h-[18px] w-[18px]",
    },
  },
  states: {
    disabled: "opacity-50 cursor-not-allowed pointer-events-none",
    loading: "pointer-events-none",
    fullWidth: "w-full",
  },
};
// --- END: STYLING CONFIGURATION ---

// Component for rendering the loading spinner
function LoadingSpinner() {
  return (
    <span className="flex items-center justify-center" aria-hidden="true">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"></span>
    </span>
  );
}

// Component for rendering button content (text + icons)
function ButtonContent({
  children,
  icon,
  iconPosition,
  loading,
  variant,
  size,
}) {
  if (loading) {
    return <LoadingSpinner />;
  }

  const variantConfig = buttonVariants.variants[variant];
  const textClass = variantConfig?.text;
  const iconBaseClass = variantConfig?.icon;
  const iconSizeClass = variantConfig?.iconSizes?.[size] || "";

  return (
    <>
      {icon && iconPosition === "before" && (
        <span className={clsx(iconBaseClass, iconSizeClass)} aria-hidden="true">
          {icon}
        </span>
      )}
      <span className={textClass}>{children}</span>
      {icon && iconPosition === "after" && (
        <span className={clsx(iconBaseClass, iconSizeClass)} aria-hidden="true">
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
  size,
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
          variant={variant}
          size={size}
        >
          {children}
        </ButtonContent>
      </span>
    );
  }

  const isExternal =
    href &&
    (href.startsWith("http") ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:"));

  return (
    <a
      href={href}
      className={className}
      role="button"
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      {...ariaProps}
      {...props}
    >
      <ButtonContent
        icon={icon}
        iconPosition={iconPosition}
        loading={loading}
        variant={variant}
        size={size}
      >
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
  size,
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
      <ButtonContent
        icon={icon}
        iconPosition={iconPosition}
        loading={loading}
        variant={variant}
        size={size}
      >
        {children}
      </ButtonContent>
    </button>
  );
}

// Utility to build CSS classes using the configuration and tailwind-merge
function buildClasses({
  variant,
  size,
  disabled,
  loading,
  fullWidth,
  className,
}) {
  const variantConfig = buttonVariants.variants[variant];
  const sizeClasses = variantConfig?.sizes?.[size] || "";

  return twMerge(
    clsx(
      buttonVariants.base,
      variantConfig?.base,
      sizeClasses,
      disabled && buttonVariants.states.disabled,
      loading && buttonVariants.states.loading,
      fullWidth && buttonVariants.states.fullWidth,
      className
    )
  );
}

// Utility to determine icon position
function getIconPosition(iconPosition, variant) {
  return iconPosition || (variant === "navbar" ? "before" : "after");
}

// Utility to determine if should render as link
function shouldRenderAsLink(href, disabled, loading) {
  return href && !disabled && !loading;
}

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
      size,
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
