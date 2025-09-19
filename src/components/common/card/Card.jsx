"use client";

import { forwardRef } from "react";
import styles from "@/styles/components/common/card/card.module.css";
import FloatingCard from "./variants/floating/FloatingCard";

/**
 * Reusable Card Component - Based on Figma feature cards
 *
 * @param {'hero'|'hero-card'|'floating'|'gradient'|'testimonial'|'basic'} props.variant - Card style variant
 * @param {'sm'|'md'|'lg'} props.size - Card size
 * @param {boolean} props.shadow - Apply shadow (default: true)
 * @param {boolean} props.clickable - Make card clickable
 * @param {string} props.href - If provided, renders as link
 * @param {Object} props.pill - Pill/badge config: { text, color: 'green'|'pink'|'blue'|'purple' }
 * @param {string} props.title - Card title
 * @param {string|React.ReactNode} props.subtitle - Card subtitle/description
 * @param {string|React.ReactNode} props.meta - Meta information (date, time, etc.)
 * @param {React.ReactNode} props.content - Main card content
 * @param {Array} props.list - List items for list cards
 * @param {string} props.listTitle - Title for list cards
 * @param {React.ReactNode} props.whatsappUI - WhatsApp message component
 * @param {Object} props.testimonial - Testimonial config: { quote, author, rating, verified, userType }
 * @param {string} props.className - Additional CSS classes
 * @param {React.ReactNode} props.children - Custom card content (overrides structured props)
 */
const VARIANTS = {
  floating: FloatingCard,
};

// Build card class names deterministically
function buildCardClasses({
  variant,
  size,
  list,
  shadow,
  clickable,
  className,
}) {
  return [
    styles.card,
    styles[`variant-${variant}`],
    list &&
      (variant === "floating" || variant === "hero-card") &&
      styles.taskList,
    styles[`size-${size}`],
    shadow && styles.shadow,
    clickable && styles.clickable,
    className,
  ]
    .filter(Boolean)
    .join(" ");
}

// Fallback content when variant is unknown and no children were provided
function FallbackContent({ title, subtitle, content }) {
  return (
    <>
      {title && <h4 className={styles.title}>{title}</h4>}
      {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
      {content && <div className={styles.content}>{content}</div>}
    </>
  );
}

// Resolve content using children > variant component > fallback
function resolveCardContent({ children, variant, variantProps }) {
  if (children) return children;
  const Variant = VARIANTS[variant];
  if (Variant) return <Variant {...variantProps} />;
  const { title, subtitle, content } = variantProps;
  return (
    <FallbackContent title={title} subtitle={subtitle} content={content} />
  );
}

// Wrapper to render correct interactive element
function CardWrapper({ href, clickable, commonProps, onClick, children }) {
  if (href) {
    return (
      <a href={href} {...commonProps} onClick={onClick}>
        {children}
      </a>
    );
  }

  if (clickable) {
    return (
      <button type="button" {...commonProps} onClick={onClick}>
        {children}
      </button>
    );
  }

  return (
    <div {...commonProps} onClick={clickable ? onClick : undefined}>
      {children}
    </div>
  );
}

const Card = forwardRef(
  (
    {
      variant = "basic",
      size = "md",
      shadow = true,
      clickable = false,
      href,
      pill,
      title,
      subtitle,
      meta,
      content,
      list,
      listTitle,
      whatsappUI,
      testimonial,
      className = "",
      children,
      onClick,
      ...props
    },
    ref
  ) => {
    const baseClasses = buildCardClasses({
      variant,
      size,
      list,
      shadow,
      clickable,
      className,
    });

    const variantProps = {
      pill,
      title,
      list,
      meta,
      subtitle,
      content,
      listTitle,
      whatsappUI,
      testimonial,
    };

    const cardContent = resolveCardContent({ children, variant, variantProps });

    const commonProps = {
      className: baseClasses,
      ref,
      ...props,
    };

    return (
      <CardWrapper
        href={href}
        clickable={clickable}
        commonProps={commonProps}
        onClick={onClick}
      >
        {cardContent}
      </CardWrapper>
    );
  }
);

Card.displayName = "Card";

export default Card;
