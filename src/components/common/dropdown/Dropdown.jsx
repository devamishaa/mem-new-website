"use client";

import React, { useRef, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import SvgIcon from "@/components/common/svg/SvgIcon";
import DropdownErrorBoundary from "./DropdownErrorBoundary";
import { useNavbarTheme } from "@/contexts/NavbarThemeContext";
import styles from "@/styles/components/common/dropdown/dropdown.module.css";

// Hook for managing nested dropdown state
function useNestedDropdown(isOpen, allowNested) {
  const [expandedItems, setExpandedItems] = useState(new Set());

  const toggleNestedItem = (itemId) => {
    if (!allowNested) return;

    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  // Reset expanded items when dropdown closes
  useEffect(() => {
    if (!isOpen) {
      setExpandedItems(new Set());
    }
  }, [isOpen]);

  return { expandedItems, toggleNestedItem };
}

// Hook for managing dropdown positioning
function useDropdownPosition(isOpen, mode, triggerRef, dropdownRef) {
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const computePosition = () => {
    if (!isOpen || !triggerRef?.current) return;
    const triggerElement = triggerRef.current;

    // Check if we're on mobile
    const isMobile = window.innerWidth <= 768;

    if (isMobile) {
      // Mobile positioning is handled by CSS
      setPosition({ top: 0, left: 0 });
      return;
    }

    // Use viewport-relative rect; our dropdown is fixed to viewport via portal
    const rect = triggerElement.getBoundingClientRect();

    // Find the navbar (header) to anchor vertical gap from its bottom
    const header = triggerElement.closest("header");
    const hostRect = header ? header.getBoundingClientRect() : rect;

    const dropdownWidth = dropdownRef.current?.offsetWidth || 230;

    // Center to trigger horizontally, clamp within viewport with small gutters
    const gutter = 8;
    let left = Math.round(rect.left + rect.width / 2 - dropdownWidth / 2);
    const maxLeft = Math.max(
      gutter,
      window.innerWidth - dropdownWidth - gutter
    );
    left = Math.min(Math.max(left, gutter), maxLeft);

    setPosition({
      top: Math.round(hostRect.bottom + 16), // exact 16px gap below navbar
      left,
    });
  };

  // Calculate dropdown position for portal mode
  useEffect(() => {
    if (mode === "portal") {
      computePosition();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, mode]);

  // Recalculate on resize/scroll while open
  useEffect(() => {
    if (!isOpen || mode !== "portal") return;
    const handler = () => computePosition();
    window.addEventListener("resize", handler, { passive: true });
    window.addEventListener("scroll", handler, { passive: true });
    return () => {
      window.removeEventListener("resize", handler);
      window.removeEventListener("scroll", handler);
    };
  }, [isOpen, mode]);

  return { position, computePosition };
}

// Hook for closing on outside click (portal mode)
function useOutsideClick({ isOpen, mode, dropdownRef, triggerRef, onClose }) {
  function isOutsideClickTarget(event) {
    const dropdownEl = dropdownRef.current;
    const triggerEl = triggerRef?.current;
    return (
      dropdownEl &&
      !dropdownEl.contains(event.target) &&
      triggerEl &&
      !triggerEl.contains(event.target)
    );
  }
  useEffect(() => {
    if (mode !== "portal") return;
    function handleClickOutside(event) {
      if (isOutsideClickTarget(event)) {
        onClose?.();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen, onClose, triggerRef, dropdownRef, mode]);
}

// Inline styles calculator for container sizing/positioning
function getInlineStyles(mode, isOpen, isMobile, position) {
  if (mode === "inline") {
    return {
      maxHeight: isOpen ? "640px" : "0px",
      paddingTop: isOpen ? 16 : 0,
      paddingBottom: isOpen ? 16 : 0,
      overflow: "hidden",
      width: "100%",
    };
  }
  return isMobile
    ? {}
    : { top: `${position.top}px`, left: `${position.left}px` };
}

// Shared icon + label presenter to avoid duplication
function ItemIconAndLabel({ iconName, label, color }) {
  return (
    <>
      {iconName && (
        <div className={styles.iconContainer}>
          <SvgIcon name={iconName} size={15} className={styles.icon} />
        </div>
      )}
      <span className={styles.label} style={color ? { color } : undefined}>
        {label}
      </span>
    </>
  );
}

// Predicate helpers to simplify conditionals
function isItemDisabled(item) {
  return (
    item.disabled || ["/dashboard", "/domina", "/about"].includes(item.href)
  );
}

function shouldShowChevronForItem(item) {
  const predicates = [
    (it) => Boolean(it.showIcon),
    (it) => it.href === "/domina",
    (it) => it.id === "domina",
    (it) => /master\s*memorae/i.test(it.label || ""),
  ];
  return predicates.some((p) => p(item));
}

function hasNestedDropdown(item, allowNested) {
  return Boolean(allowNested && item.dropdown && item.dropdown.length > 0);
}

function getItemKind(item, allowNested) {
  if (hasNestedDropdown(item, allowNested)) return "nested";
  if (shouldShowChevronForItem(item)) return "chevron";
  if (isItemDisabled(item)) return "disabled";
  return "link";
}

// Component for rendering nested dropdown items
function NestedDropdownItem({ item, onClose }) {
  return (
    <Link
      href={item.href}
      className={`${styles.item} ${styles.nestedItem} ${
        item.highlighted ? styles.highlighted : ""
      } ${styles.disabled}`}
      onClick={(e) => e.preventDefault()}
    >
      <ItemIconAndLabel
        iconName={item.icon}
        label={item.label}
        color={item.color}
      />
    </Link>
  );
}

// Component for rendering nested dropdown container
function NestedDropdownContainer({ item, isExpanded, onToggle, onClose }) {
  return (
    <div className={styles.nestedContainer}>
      <button
        type="button"
        className={`${styles.item} ${styles.nestedTrigger} ${
          item.highlighted ? styles.highlighted : ""
        }`}
        onClick={onToggle}
        aria-expanded={isExpanded}
      >
        <ItemIconAndLabel
          iconName={item.icon}
          label={item.label}
          color={item.color}
        />
        <SvgIcon
          name="ChevronDown"
          width={9}
          height={5}
          className={`${styles.chevronIcon} ${
            isExpanded ? styles.chevronUp : ""
          }`}
        />
      </button>

      <div
        className={styles.nestedDropdown}
        style={{
          maxHeight: isExpanded ? `${item.dropdown.length * 48 + 32}px` : "0px",
          opacity: isExpanded ? 1 : 0,
          transform: isExpanded ? "translateY(0)" : "translateY(-8px)",
        }}
      >
        {item.dropdown.map((nestedItem) => (
          <NestedDropdownItem
            key={nestedItem.id}
            item={nestedItem}
            onClose={onClose}
          />
        ))}
      </div>
    </div>
  );
}

// Component for rendering chevron items (like Domina Memorae)
function ChevronItem({ item, isDisabled }) {
  return (
    <div className={`${styles.item} ${isDisabled ? styles.disabled : ""}`}>
      <span
        className={`${styles.label} ${isDisabled ? styles.disabled : ""}`}
        style={item.color ? { color: item.color } : undefined}
      >
        {item.label}
      </span>
      <SvgIcon
        name="ChevronDown"
        width={9}
        height={5}
        className={styles.chevronIcon}
      />
    </div>
  );
}

// Component for rendering disabled items
function DisabledItem({ item }) {
  return (
    <span
      className={`${styles.item} ${styles.disabled} ${
        item.highlighted ? styles.highlighted : ""
      } ${item.id === "cta" ? styles.ctaItem : ""}`}
    >
      <ItemIconAndLabel
        iconName={item.icon}
        label={item.label}
        color={item.color}
      />
    </span>
  );
}

// Component for rendering regular link items
function LinkItem({ item, isDisabled, onClose }) {
  return (
    <Link
      href={item.href}
      className={`${styles.item} ${
        item.highlighted ? styles.highlighted : ""
      } ${item.id === "cta" ? styles.ctaItem : ""} ${
        styles.disabled
      }`}
      onClick={(e) => e.preventDefault()}
    >
      <ItemIconAndLabel
        iconName={item.icon}
        label={item.label}
        color={item.color}
      />
    </Link>
  );
}

// Component for rendering individual dropdown items
function DropdownItem({
  item,
  allowNested,
  expandedItems,
  onToggleNested,
  onClose,
}) {
  const isExpanded = expandedItems.has(item.id);
  const kind = getItemKind(item, allowNested);

  switch (kind) {
    case "nested":
      return (
        <NestedDropdownContainer
          item={item}
          isExpanded={isExpanded}
          onToggle={() => onToggleNested(item.id)}
          onClose={onClose}
        />
      );
    case "chevron":
      return <ChevronItem item={item} isDisabled={isItemDisabled(item)} />;
    case "disabled":
      return <DisabledItem item={item} />;
    case "link":
    default:
      return <LinkItem item={item} isDisabled={false} onClose={onClose} />;
  }
}

// Presentation-only content component for the dropdown body
function DropdownContent(props) {
  const {
    dropdownRef,
    className,
    mode,
    isMobile,
    isOpen,
    inlineStyles,
    items,
    allowNested,
    expandedItems,
    onToggleNested,
    onClose,
  } = props;

  const { theme } = useNavbarTheme();

  return (
    <div
      ref={dropdownRef}
      className={`${styles.dropdown} ${
        mode === "inline" ? styles.inline : ""
      } ${isMobile ? styles.mobile : ""} ${styles[theme]} ${className}`}
      style={inlineStyles}
      aria-hidden={mode === "inline" ? !isOpen : undefined}
      role={mode === "inline" ? "region" : undefined}
    >
      <div className={styles.content}>
        {items.map((item) => (
          <DropdownItem
            key={item.id}
            item={item}
            allowNested={allowNested}
            expandedItems={expandedItems}
            onToggleNested={onToggleNested}
            onClose={onClose}
          />
        ))}
      </div>
    </div>
  );
}

// Main Dropdown component
export default function Dropdown({
  isOpen,
  onClose,
  triggerRef,
  items = [],
  className = "",
  mode = "portal", // 'portal' | 'inline'
  allowNested = false, // New prop for nested dropdowns
}) {
  const dropdownRef = useRef(null);
  const [mounted, setMounted] = useState(false);

  // Custom hooks for managing state
  const { expandedItems, toggleNestedItem } = useNestedDropdown(
    isOpen,
    allowNested
  );
  const { position } = useDropdownPosition(
    isOpen,
    mode,
    triggerRef,
    dropdownRef
  );

  // Mount flag for portals
  useEffect(() => {
    setMounted(true);
  }, []);

  // Close dropdown when clicking outside (portal mode only)
  useOutsideClick({ isOpen, mode, dropdownRef, triggerRef, onClose });

  if (mode === "portal" && !isOpen) return null;
  if (mode === "portal" && !mounted) return null;

  const isMobile = typeof window !== "undefined" && window.innerWidth <= 768;
  const inlineStyles = getInlineStyles(mode, isOpen, isMobile, position);

  const dropdownEl = (
    <DropdownContent
      dropdownRef={dropdownRef}
      className={className}
      mode={mode}
      isMobile={isMobile}
      isOpen={isOpen}
      inlineStyles={inlineStyles}
      items={items}
      allowNested={allowNested}
      expandedItems={expandedItems}
      onToggleNested={toggleNestedItem}
      onClose={onClose}
    />
  );

  // Render in place for inline mode; otherwise portal with error boundary
  if (mode === "inline") return dropdownEl;

  return (
    <DropdownErrorBoundary>
      {createPortal(dropdownEl, document.body)}
    </DropdownErrorBoundary>
  );
}
