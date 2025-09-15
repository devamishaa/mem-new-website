"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import SvgIcon from "@/app/components/common/svg/SvgIcon";
import DropdownErrorBoundary from "./DropdownErrorBoundary";
import { useNavbarTheme } from "@/contexts/NavbarThemeContext";
import clsx from "clsx";

// All hooks (useNestedDropdown, useDropdownPosition, etc.) remain unchanged as their logic is independent of the styling technology.
function useNestedDropdown(isOpen, allowNested) {
  const [expandedItems, setExpandedItems] = useState(new Set());
  const toggleNestedItem = (itemId) => {
    if (!allowNested) return;
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) newSet.delete(itemId);
      else newSet.add(itemId);
      return newSet;
    });
  };
  useEffect(() => {
    if (!isOpen) setExpandedItems(new Set());
  }, [isOpen]);
  return { expandedItems, toggleNestedItem };
}

function useDropdownPosition(isOpen, mode, triggerRef, dropdownRef) {
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const computePosition = () => {
    if (
      !isOpen ||
      !triggerRef?.current ||
      (typeof window !== "undefined" && window.innerWidth <= 768)
    )
      return;
    const rect = triggerRef.current.getBoundingClientRect();
    const header = triggerRef.current.closest("header");
    const hostRect = header ? header.getBoundingClientRect() : rect;
    const dropdownWidth = dropdownRef.current?.offsetWidth || 230;
    const gutter = 8;
    let left = Math.round(rect.left + rect.width / 2 - dropdownWidth / 2);
    const maxLeft = Math.max(
      gutter,
      window.innerWidth - dropdownWidth - gutter
    );
    left = Math.min(Math.max(left, gutter), maxLeft);
    setPosition({ top: Math.round(hostRect.bottom + 16), left });
  };
  useEffect(() => {
    if (mode === "portal") computePosition();
  }, [isOpen, mode]);
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
  return { position };
}

function useOutsideClick({ isOpen, mode, dropdownRef, triggerRef, onClose }) {
  useEffect(() => {
    if (mode !== "portal" || !isOpen) return;
    function handleClickOutside(event) {
      const isOutside =
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        triggerRef?.current &&
        !triggerRef.current.contains(event.target);
      if (isOutside) onClose?.();
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose, triggerRef, dropdownRef, mode]);
}

// Helper functions for item types
function isItemDisabled(item) {
  return (
    item.disabled || ["/dashboard", "/domina", "/about"].includes(item.href)
  );
}
function shouldShowChevronForItem(item) {
  return (
    item.showIcon ||
    item.href === "/domina" ||
    item.id === "domina" ||
    /master\s*memorae/i.test(item.label || "")
  );
}
function hasNestedDropdown(item, allowNested) {
  return allowNested && item.dropdown && item.dropdown.length > 0;
}
function getItemKind(item, allowNested) {
  if (hasNestedDropdown(item, allowNested)) return "nested";
  if (shouldShowChevronForItem(item)) return "chevron";
  if (isItemDisabled(item)) return "disabled";
  return "link";
}

// --- Sub-components converted to Tailwind CSS ---

function ItemIconAndLabel({ iconName, label, color }) {
  return (
    <>
      {iconName && (
        <div className="relative h-5 w-5 shrink-0">
          <SvgIcon
            name={iconName}
            size={15}
            className="absolute top-0.5 left-0.5 h-[15px] w-[15px] text-current"
          />
        </div>
      )}
      <span
        className="font-figtree text-sm font-medium whitespace-nowrap"
        style={color ? { color } : undefined}
      >
        {label}
      </span>
    </>
  );
}

function NestedDropdownItem({ item, onClose }) {
  const itemClasses =
    "flex items-center gap-2 p-3 rounded-lg no-underline w-full transition-colors duration-200 hover:bg-blue-500/10";
  return (
    <Link
      href={item.href}
      className={clsx(itemClasses, item.highlighted && "bg-blue-500/10")}
      onClick={onClose}
    >
      <ItemIconAndLabel
        iconName={item.icon}
        label={item.label}
        color={item.color}
      />
    </Link>
  );
}

function NestedDropdownContainer({ item, isExpanded, onToggle, onClose }) {
  return (
    <div className="w-full">
      <button
        type="button"
        className={clsx(
          "flex w-full items-center justify-between gap-2 rounded-lg p-3 text-left transition-colors duration-200 hover:bg-blue-500/10",
          item.highlighted && "bg-blue-500/10"
        )}
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
          className={clsx(
            "shrink-0 transition-transform duration-200",
            isExpanded && "rotate-180"
          )}
        />
      </button>
      <div
        className="mt-1 overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
        style={{
          maxHeight: isExpanded ? `${item.dropdown.length * 48 + 32}px` : "0px",
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

function ChevronItem({ item, isDisabled }) {
  return (
    <div
      className={clsx(
        "flex items-center gap-2 p-3 rounded-lg",
        isDisabled && "cursor-not-allowed opacity-45"
      )}
    >
      <span
        className="font-figtree text-sm font-medium whitespace-nowrap"
        style={item.color ? { color } : undefined}
      >
        {item.label}
      </span>
      <SvgIcon name="ChevronDown" width={9} height={5} />
    </div>
  );
}

function DisabledItem({ item }) {
  const ctaClasses =
    "flex justify-center mt-2 rounded-full bg-green-600 p-2.5 font-semibold";
  return (
    <span
      className={clsx(
        "flex items-center gap-2 p-3 rounded-lg cursor-not-allowed opacity-45",
        item.highlighted && "bg-blue-500/10",
        item.id === "cta" && ctaClasses
      )}
    >
      <ItemIconAndLabel
        iconName={item.icon}
        label={item.label}
        color={item.color}
      />
    </span>
  );
}

function LinkItem({ item, isDisabled, onClose }) {
  const ctaClasses =
    "flex justify-center mt-2 rounded-full bg-green-600 hover:bg-green-700 text-white! p-2.5 font-semibold";
  const ctaIconFilter =
    item.id === "cta"
      ? "[&_svg]:filter [&_svg]:brightness-0 [&_svg]:invert"
      : "";
  return (
    <Link
      href={item.href}
      className={clsx(
        "flex items-center gap-2 p-3 rounded-lg no-underline transition-colors duration-200 hover:bg-blue-500/10",
        item.highlighted && "bg-blue-500/10",
        item.id === "cta" && ctaClasses,
        isDisabled && "cursor-not-allowed opacity-45",
        ctaIconFilter
      )}
      onClick={isDisabled ? (e) => e.preventDefault() : onClose}
    >
      <ItemIconAndLabel
        iconName={item.icon}
        label={item.label}
        color={item.color}
      />
    </Link>
  );
}

function DropdownItem({
  item,
  allowNested,
  expandedItems,
  onToggleNested,
  onClose,
}) {
  const kind = getItemKind(item, allowNested);
  const isExpanded = expandedItems.has(item.id);

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
    default:
      return <LinkItem item={item} isDisabled={false} onClose={onClose} />;
  }
}

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

  const themeClasses = {
    light:
      "bg-white/60 text-[#01214f] border-white/40 shadow-2xl hover:text-blue-500",
    dark: "bg-gray-800/50 text-white border-white/20 shadow-2xl shadow-black/50 hover:text-blue-500",
  };

  const mobileClasses =
    "fixed! top-[100px]! left-5! right-5! w-auto! min-w-0! transform-none! overflow-y-auto [&_.item]:w-full [&_.item]:p-4 [&_.item]:justify-center [&_.item:not(.ctaItem)_.iconContainer]:hidden";

  return (
    <div
      ref={dropdownRef}
      className={clsx(
        "fixed z-50 min-w-[290px] rounded-[32px] border p-4 shadow-lg backdrop-blur-xl backdrop-saturate-125 isolate origin-top animate-fadeIn",
        themeClasses[theme],
        mode === "inline" &&
          "static w-full min-w-full transition-[max-height,padding] duration-300 ease-in-out",
        isMobile && mobileClasses,
        className
      )}
      style={inlineStyles}
      aria-hidden={mode === "inline" ? !isOpen : undefined}
      role={mode === "inline" ? "region" : undefined}
    >
      <div className="absolute inset-0 -z-10 rounded-inherit pointer-events-none  [mix-blend-mode:overlay]" />
      <div className="flex flex-col gap-2">
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
  mode = "portal",
  allowNested = false,
}) {
  const dropdownRef = useRef(null);
  const [mounted, setMounted] = useState(false);
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
  useEffect(() => {
    setMounted(true);
  }, []);
  useOutsideClick({ isOpen, mode, dropdownRef, triggerRef, onClose });

  if (mode === "portal" && (!isOpen || !mounted)) return null;

  const isMobile = typeof window !== "undefined" && window.innerWidth <= 768;
  const inlineStyles =
    mode === "inline"
      ? {
          maxHeight: isOpen ? "640px" : "0px",
          paddingTop: isOpen ? 16 : 0,
          paddingBottom: isOpen ? 16 : 0,
          overflow: "hidden",
          width: "100%",
        }
      : isMobile
      ? {}
      : { top: `${position.top}px`, left: `${position.left}px` };

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

  if (mode === "inline") return dropdownEl;

  return (
    <DropdownErrorBoundary>
      {createPortal(dropdownEl, document.body)}
    </DropdownErrorBoundary>
  );
}
