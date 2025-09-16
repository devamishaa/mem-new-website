"use client";

import { useMemo } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import HeroView from "@/app/components/hero/HeroView";

/**
 * HeroContainer:
 * - Handles all translation logic using direct useTranslation() hook
 * - Builds the model object that HeroView expects
 * - Keeps the same CTA fallback logic as before
 * - Maintains consistency with NavbarContainer pattern
 */
export default function HeroContainer(props) {
  const { t, language } = useTranslation();
  const { ctaHref = "/start", className } = props;

  // Fixed image dimension configurations (no breakpoint dependency)
  const imageDimensions = useMemo(() => {
    return {
      large: { width: 856, height: 364 },
      icon3: 94,
      icon4: 18,
      icon5: 116,
    };
  }, []);

  // Create translation helper function scoped to 'hero'
  const tHero = (key, fallback = "") => t(`hero.${key}`) || fallback;
  const tFirst = (keys, fallback = "") => {
    for (const key of keys) {
      const value = t(key);
      if (value && value !== key) return value;
    }
    return fallback;
  };
  const tList = (key, fallback = []) => {
    const value = t(`hero.${key}`);
    return Array.isArray(value) ? value : fallback;
  };

  const model = useMemo(() => {
    return {
      heading: (() => {
        const fullTitle = tHero("title", "Your second brain, on WhatsApp");
        const parts = fullTitle.split(",");
        return {
          line1: parts[0] + ",",
          line2: parts[1] ? parts[1].trim() : "on WhatsApp",
        };
      })(),
      subtitle: tHero("subtitle1", "Never forget anything important again"),
      subtitle2: tHero("subtitle2", "And forgetting everything... either."),
      ctaLabel: tFirst(
        ["hero.primaryCta", "cta.tryForFree", "nav.whatsAppBtn"],
        "Try for Free"
      ),

      cards: {
        reminder: {
          heading: tHero("cards.reminder.heading", "Reminder"),
          title: tHero("cards.reminder.title", "Team meeting tomorrow"),
          date: tHero("cards.reminder.date", "Dec 15"),
          time: tHero("cards.reminder.time", "2:00 PM"),
        },
        meeting: {
          heading: tHero("cards.meeting.heading", "Meeting"),
          title: tHero("cards.meeting.title", "Project review"),
          date: tHero("cards.meeting.date", "Dec 16"),
          time: tHero("cards.meeting.time", "10:00 AM"),
        },
        lists: {
          heading: tHero("cards.lists.heading", "Lists"),
          title: tFirst(
            ["hero.cards.lists.title", "hero.cards.lists.subtitle"],
            "Shopping List"
          ),
          items: tList("cards.lists.items", ["Milk", "Bread", "Coffee"]),
        },
      },

      phoneZoomText: {
        line1: tHero(
          "phoneZoomText.line1",
          "No te estás volviendo un desastre:"
        ),
        line2: tHero(
          "phoneZoomText.line2",
          "estás intentando hacerlo todo tú solo."
        ),
      },
      notifications: {
        whatsapp: {
          appName: tHero("notifications.whatsapp.appName", "WhatsApp"),
          message: tHero("notifications.whatsapp.message", "Memorae message"),
          time: tHero("notifications.whatsapp.time", "34m ago"),
        },
        memoraeMeeting: {
          appName: tHero("notifications.memoraeMeeting.appName", "Memorae"),
          message: tHero(
            "notifications.memoraeMeeting.message",
            "Reminder: Meeting at 3pm"
          ),
          time: tHero("notifications.memoraeMeeting.time", "1h ago"),
        },
        calendar: {
          appName: tHero("notifications.calendar.appName", "Calendar"),
          message: tHero(
            "notifications.calendar.message",
            "Event scheduled for tomorrow"
          ),
          time: tHero("notifications.calendar.time", "2h ago"),
        },
        memoraeTask: {
          appName: tHero("notifications.memoraeTask.appName", "Memorae"),
          message: tHero(
            "notifications.memoraeTask.message",
            "New voice note saved"
          ),
          time: tHero("notifications.memoraeTask.time", "3h ago"),
        },
      },
    };
  }, [t]);

  // Pass clean props to the view
  return (
    <HeroView
      model={model}
      language={language}
      imageDimensions={imageDimensions}
      ctaHref={ctaHref}
      className={className}
    />
  );
}
