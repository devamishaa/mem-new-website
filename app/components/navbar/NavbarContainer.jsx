"use client";

import { useMemo } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import NavbarView from "@/app/components/navbar/NavbarView";

export default function NavbarContainer(props) {
  const { t } = useTranslation();
  const { overlay = false, logoHref = "/" } = props;
  const model = useMemo(() => {
    const links = [
      {
        id: "dashboard",
        label: t("nav.dashboard", "Dashboard"),
        href: "/dashboard",
      },
      {
        id: "superpowers",
        label: t("nav.superpowers", "Superpowers"),
        href: "/superpowers",
        dropdown: [
          {
            id: "unlimitedReminders",
            label: t(
              "nav.superpowersMenu.unlimitedReminders",
              "Unlimited recurring reminders"
            ),
            href: "/superpowers/reminders",
            icon: "Notification",
          },
          {
            id: "calendars",
            label: t("nav.superpowersMenu.calendars", "Your calendars"),
            href: "/superpowers/calendars",
            icon: "Calendar",
          },
          {
            id: "lists",
            label: t("nav.superpowersMenu.lists", "Your lists"),
            href: "/superpowers/lists",
            icon: "EventList",
          },
          {
            id: "voiceNotes",
            label: t("nav.superpowersMenu.voiceNotes", "Unlimited voice notes"),
            href: "/superpowers/voice-notes",
            icon: "Voice",
          },
          {
            id: "smartSearch",
            label: t("nav.superpowersMenu.smartSearch", "Smart search"),
            href: "/superpowers/search",
            icon: "Search",
          },
          {
            id: "imageAnalysis",
            label: t("nav.superpowersMenu.imageAnalysis", "Image analysis"),
            href: "/superpowers/image-analysis",
            icon: "ImageSearch",
          },
        ],
      },
      {
        id: "domina",
        label: t("nav.dominaMemorae", "Master Memorae"),
        href: "/domina",
      },
      {
        id: "about",
        label: t("nav.about", "About Us"),
        href: "/about",
      },
    ];

    const cta = {
      label: t("cta.tryFree", "Try for Free"),
      href: "/start",
    };

    return { links, cta };
  }, [t]);

  return <NavbarView overlay={overlay} logoHref={logoHref} model={model} />;
}
