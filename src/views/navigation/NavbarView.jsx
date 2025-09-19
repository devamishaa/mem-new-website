"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SvgIcon from "@/components/common/svg/SvgIcon";
import Dropdown from "@/components/common/dropdown";
import Button from "@/components/common/button";
import styles from "@/styles/components/navigation/navbar/navbar.module.css";
import { useNavbarTheme } from "@/contexts/NavbarThemeContext";

// Hook for managing navbar state
function useNavbarState() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const handleDropdownToggle = (linkId) => {
    setActiveDropdown(activeDropdown === linkId ? null : linkId);
  };

  const handleDropdownClose = () => {
    setActiveDropdown(null);
  };

  const handleMobileMenuClose = () => {
    setMobileOpen(false);
  };

  return {
    mobileOpen,
    setMobileOpen,
    activeDropdown,
    handleDropdownToggle,
    handleDropdownClose,
    handleMobileMenuClose,
  };
}

// Hook for link utilities
function useLinkUtils() {
  const pathname = usePathname();

  const isActive = (href) => href !== "/" && pathname?.startsWith(href);
  const isDisabledPath = (href) =>
    ["/dashboard", "/domina", "/about"].includes(href);
  const shouldShowChevron = (link) =>
    link.showIcon ||
    link.href === "/domina" ||
    link.id === "domina" ||
    /master\s*memorae/i.test(link.label || "");

  return { isActive, isDisabledPath, shouldShowChevron };
}

// Component for rendering the logo
function NavbarLogo({ logoHref }) {
  return (
    <Link href={logoHref} className={styles.logo}>
      <SvgIcon
        name="MemoraeLogo"
        width={118}
        height={50}
        title="Memorae Logo"
        decorative={false}
      />
    </Link>
  );
}

// Component for rendering dropdown links (like Superpowers)
function DropdownLink({ link, isActive, onToggle, superpowersRef }) {
  return (
    <div key={link.id} className={styles.dropdownContainer}>
      <button
        ref={superpowersRef}
        onClick={onToggle}
        className={styles.linkFrame}
        aria-expanded={isActive}
      >
        <span className={styles.linkFrameText}>{link.label}</span>
        <SvgIcon
          name="ChevronDown"
          width={9}
          height={5}
          className={`${styles.chevronIcon} ${
            isActive ? styles.chevronUp : ""
          }`}
        />
      </button>
    </div>
  );
}

// Component for rendering chevron links (like Domina Memorae)
function ChevronLink({ link, isDisabled }) {
  return (
    <div className={`${styles.linkFrame} ${isDisabled ? styles.disabled : ""}`}>
      <span className={styles.linkFrameText}>{link.label}</span>
      <SvgIcon
        name="ChevronDown"
        width={9}
        height={5}
        className={styles.chevronIcon}
      />
    </div>
  );
}

// Component for rendering regular navigation links
function RegularLink({ link, isDisabled }) {
  if (isDisabled) {
    return (
      <span className={`${styles.link} ${styles.disabled}`}>{link.label}</span>
    );
  }
  return (
    <Link href={link.href} className={styles.link}>
      {link.label}
    </Link>
  );
}

// Component for rendering desktop navigation
function DesktopNavigation({
  model,
  activeDropdown,
  onDropdownToggle,
  superpowersRef,
}) {
  const { shouldShowChevron, isDisabledPath } = useLinkUtils();

  function getLinkKind(link) {
    if (link.id === "superpowers" && link.dropdown) return "dropdown";
    if (shouldShowChevron(link)) return "chevron";
    return "regular";
  }

  function renderNavItem({
    link,
    activeDropdown,
    onDropdownToggle,
    superpowersRef,
    shouldShowChevron,
    isDisabledPath,
  }) {
    const kind = getLinkKind(link);
    const isDisabled = isDisabledPath(link.href);
    switch (kind) {
      case "dropdown":
        return (
          <DropdownLink
            key={link.id}
            link={link}
            isActive={activeDropdown === link.id}
            onToggle={() => onDropdownToggle(link.id)}
            superpowersRef={superpowersRef}
          />
        );
      case "chevron":
        return (
          <ChevronLink key={link.id} link={link} isDisabled={isDisabled} />
        );
      case "regular":
      default:
        return (
          <RegularLink key={link.id} link={link} isDisabled={isDisabled} />
        );
    }
  }

  return (
    <nav className={styles.desktop}>
      <div className={styles.content}>
        {model.links.map((link) =>
          renderNavItem({
            link,
            activeDropdown,
            onDropdownToggle,
            superpowersRef,
            shouldShowChevron,
            isDisabledPath,
          })
        )}
      </div>
    </nav>
  );
}

// Component for rendering the CTA button
function NavbarCTA({ model }) {
  const whatsappLink =
    "https://api.whatsapp.com/message/UIF5BT6RJTSVA1?autoload=1&app_absent=0";

  return (
    <div className={styles.ctaWrap}>
      <Button
        variant="navbar"
        href={whatsappLink}
        target="_blank" // ✅ open in new tab
        rel="noopener noreferrer" // ✅ security best practice
        icon={<SvgIcon name="WhatsApp" width={18} height={18} />}
        iconPosition="before"
      >
        {model.cta.label}
      </Button>
    </div>
  );
}

// Component for rendering the mobile menu button
function MobileMenuButton({ mobileOpen, setMobileOpen, mobileMenuRef }) {
  return (
    <button
      ref={mobileMenuRef}
      className={styles.burger}
      aria-expanded={mobileOpen}
      onClick={() => setMobileOpen(!mobileOpen)}
      aria-label="Toggle mobile menu"
    >
      <div className={styles.burgerIcon}>
        <span className={styles.burgerLine}></span>
        <span className={styles.burgerLine}></span>
        <span className={styles.burgerLine}></span>
      </div>
    </button>
  );
}

// Component for rendering the superpowers dropdown
function SuperpowersDropdown({
  model,
  activeDropdown,
  onDropdownClose,
  superpowersRef,
}) {
  const superpowersLink = model.links.find(
    (link) => link.id === "superpowers" && link.dropdown
  );

  if (!superpowersLink) return null;

  return (
    <Dropdown
      isOpen={activeDropdown === "superpowers"}
      onClose={onDropdownClose}
      triggerRef={superpowersRef}
      items={superpowersLink.dropdown}
    />
  );
}

// Component for rendering the mobile dropdown
function MobileDropdown({
  model,
  mobileOpen,
  onMobileMenuClose,
  mobileMenuRef,
  isDisabledPath: incomingIsDisabledPath,
}) {
  const { isDisabledPath: hookIsDisabledPath } = useLinkUtils();
  const isDisabled = incomingIsDisabledPath || hookIsDisabledPath;
  const mobileItems = [
    ...model.links.map((link) => ({
      ...link,
      href: isDisabled(link.href) ? "#" : link.href,
    })),
    {
      id: "cta",
      label: model.cta.label,
      href: "https://api.whatsapp.com/message/UIF5BT6RJTSVA1?autoload=1&app_absent=0",
      icon: "WhatsApp",
    },
  ];

  return (
    <Dropdown
      isOpen={mobileOpen}
      onClose={onMobileMenuClose}
      triggerRef={mobileMenuRef}
      items={mobileItems}
      mode="portal"
      allowNested={true}
      className={styles.mobileDropdown}
    />
  );
}

// Main NavbarView component
function NavbarBody({ overlay, logoHref, model }) {
  const superpowersRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const { theme } = useNavbarTheme();

  const {
    mobileOpen,
    setMobileOpen,
    activeDropdown,
    handleDropdownToggle,
    handleDropdownClose,
    handleMobileMenuClose,
  } = useNavbarState();

  return (
    <header
      className={`${styles.navbar} ${overlay ? styles.overlay : ""} ${
        styles[theme]
      }`}
      data-reveal="scale"
      data-reveal-delay="0.0"
    >
      <div className={styles.inner}>
        <NavbarLogo logoHref={logoHref} />

        <DesktopNavigation
          model={model}
          activeDropdown={activeDropdown}
          onDropdownToggle={handleDropdownToggle}
          superpowersRef={superpowersRef}
        />

        <SuperpowersDropdown
          model={model}
          activeDropdown={activeDropdown}
          onDropdownClose={handleDropdownClose}
          superpowersRef={superpowersRef}
        />

        <NavbarCTA model={model} />

        <MobileMenuButton
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
          mobileMenuRef={mobileMenuRef}
        />
      </div>

      <MobileDropdown
        model={model}
        mobileOpen={mobileOpen}
        onMobileMenuClose={handleMobileMenuClose}
        mobileMenuRef={mobileMenuRef}
      />
    </header>
  );
}

export default function NavbarView(props) {
  return <NavbarBody {...props} />;
}
