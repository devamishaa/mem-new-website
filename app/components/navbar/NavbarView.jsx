"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SvgIcon from "@/app/components/common/svg/SvgIcon";
import Dropdown from "@/app/components/common/dropdown/Dropdown";
import Button from "@/app/components/common/Button";
import { useNavbarTheme } from "@/contexts/NavbarThemeContext";
import clsx from "clsx";

// Hook for managing navbar state (no changes needed)
function useNavbarState() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const handleDropdownToggle = (linkId) =>
    setActiveDropdown(activeDropdown === linkId ? null : linkId);
  const handleDropdownClose = () => setActiveDropdown(null);
  const handleMobileMenuClose = () => setMobileOpen(false);
  return {
    mobileOpen,
    setMobileOpen,
    activeDropdown,
    handleDropdownToggle,
    handleDropdownClose,
    handleMobileMenuClose,
  };
}

// Hook for link utilities (no changes needed)
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
    <Link
      href={logoHref}
      className="relative inline-flex h-[50px] w-[118px] items-center justify-center no-underline"
    >
      <SvgIcon
        name="MemoraeLogo"
        className="block h-full w-full"
        title="Memorae Logo"
        decorative={false}
      />
    </Link>
  );
}

// Component for rendering dropdown links (like Superpowers)
function DropdownLink({ link, isActive, onToggle, superpowersRef }) {
  return (
    <div className="relative">
      <button
        ref={superpowersRef}
        onClick={onToggle}
        className="inline-flex cursor-pointer items-center gap-1 border-none bg-transparent p-0"
        aria-expanded={isActive}
      >
        <span className="font-figtree text-sm font-medium leading-tight whitespace-nowrap transition-colors">
          {link.label}
        </span>
        <SvgIcon
          name="ChevronDown"
          width={9}
          height={5}
          className={clsx(
            "transition-transform duration-300 ease-out",
            isActive && "rotate-180"
          )}
        />
      </button>
    </div>
  );
}

// Component for rendering chevron links (like Domina Memorae)
function ChevronLink({ link, isDisabled }) {
  return (
    <div
      className={clsx(
        "inline-flex items-center gap-1",
        isDisabled && "cursor-not-allowed opacity-45"
      )}
    >
      <span className="font-figtree text-sm font-medium leading-tight whitespace-nowrap">
        {link.label}
      </span>
      <SvgIcon name="ChevronDown" width={9} height={5} />
    </div>
  );
}

// Component for rendering regular navigation links
function RegularLink({ link, isDisabled }) {
  const linkClasses =
    "font-figtree text-sm font-medium leading-tight whitespace-nowrap no-underline transition-colors";
  if (isDisabled) {
    return (
      <span className={clsx(linkClasses, "cursor-not-allowed opacity-45")}>
        {link.label}
      </span>
    );
  }
  return (
    <Link href={link.href} className={linkClasses}>
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
  const getLinkKind = (link) => {
    if (link.id === "superpowers" && link.dropdown) return "dropdown";
    if (shouldShowChevron(link)) return "chevron";
    return "regular";
  };

  return (
    <nav className="hidden min-[860px]:block">
      <div className="inline-flex items-center gap-6">
        {model.links.map((link) => {
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
                <ChevronLink
                  key={link.id}
                  link={link}
                  isDisabled={isDisabled}
                />
              );
            default:
              return (
                <RegularLink
                  key={link.id}
                  link={link}
                  isDisabled={isDisabled}
                />
              );
          }
        })}
      </div>
    </nav>
  );
}

// Component for rendering the CTA button
function NavbarCTA({ model }) {
  return (
    <div className="hidden min-[860px]:block">
      <Button
        variant="navbar"
        href={model.cta.href}
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
  const lineBase =
    "bg-[#01214F] absolute h-[3px] rounded-[3px] origin-center transition-all duration-300 ease-out";
  return (
    <button
      ref={mobileMenuRef}
      className="group inline-flex h-10 w-10 cursor-pointer items-center justify-center border-0 min-[860px]:hidden"
      aria-expanded={mobileOpen}
      onClick={() => setMobileOpen(!mobileOpen)}
      aria-label="Toggle mobile menu"
    >
      <div className="relative inline-block h-4 w-6">
        <span
          className={clsx(
            lineBase,
            "top-0 left-[3px] right-[3px]",
            "group-aria-[expanded=true]:left-0 group-aria-[expanded=true]:right-0 group-aria-[expanded=true]:translate-y-[6.5px] group-aria-[expanded=true]:translate-x-[1.5px] group-aria-[expanded=true]:rotate-45"
          )}
        />
        <span
          className={clsx(
            lineBase,
            "top-[6.5px] left-0 right-0",
            "group-aria-[expanded=true]:opacity-0 group-aria-[expanded=true]:scale-x-0"
          )}
        />
        <span
          className={clsx(
            lineBase,
            "top-[13px] left-[3px] right-[3px]",
            "group-aria-[expanded=true]:left-0 group-aria-[expanded=true]:right-0 group-aria-[expanded=true]:-translate-y-[6.5px] group-aria-[expanded=true]:translate-x-[1.5px] group-aria-[expanded=true]:-rotate-45"
          )}
        />
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
      href: model.cta.href,
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
    />
  );
}

// Main NavbarView component body
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

  const themeClasses = {
    light: "bg-white/60 text-[#142b4e] shadow-lg",
    dark: "bg-[#1a1f23]/50 text-white border border-white/5 shadow-glass",
  };
  const burgerLineClasses = {
    light: "bg-[#01214f]",
    dark: "bg-white",
  };

  return (
    <header
      className={clsx(
        "fixed top-4 left-1/2 -translate-x-1/2 z-50 inline-flex max-w-[1240px] items-center justify-between gap-12 rounded-4xl p-2 pl-6 backdrop-blur-[6rem] backdrop-saturate-125 transition-colors duration-300 ease-in-out isolate max-[860px]:w-[calc(100%-40px)]",
        themeClasses[theme],
        overlay && "bg-white/10"
      )}
      data-reveal="scale"
    >
      {/* Inner div for child selector access to theme */}
      <div className={clsx("contents", theme)}>
        <div
          className={clsx(
            "absolute inset-0 -z-10 rounded-inherit  [mix-blend-mode:overlay]"
          )}
        />
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
        <div
          className={clsx(
            "*:transition-colors *:duration-300",
            "max-[860px]:!*:bg-transparent",
            "lg:hidden"
          )}
        >
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
      </div>
    </header>
  );
}

export default function NavbarView(props) {
  return <NavbarBody {...props} />;
}
