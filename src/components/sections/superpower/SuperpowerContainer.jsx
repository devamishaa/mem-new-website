"use client";
import { useMemo } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import SuperpowerView from "./SuperpowerView";

const SuperpowerContainer = () => {
  const { t, language } = useTranslation();

  const tSuperpowers = (key, fallback = "") => {
    const translationKey = `superpowers.${key}`;
    const translation = t(translationKey);
    return translation === translationKey ? fallback : translation;
  };

  const model = useMemo(() => {
    return {
      emotions: {
        // Emotion slides: 0..8 (desktop includes 0; mobile starts at 1)
        slides: [
          {
            text: "",
            image: "/homepage/memorae_emotions/Happy_memeorae.svg",
          },
          {
            text: t("emotions.slide1"),
            image: "/homepage/memorae_emotions/Happy_memeorae.svg",
          }, // 1: happy
          {
            text: t("emotions.slide2"),
            image: "/homepage/memorae_emotions/surprised_memorae.svg",
          }, // 2: surprised
          {
            text: t("emotions.slide3"),
            image: "/homepage/memorae_emotions/surprised_memorae.svg",
          }, // 3: surprised
          {
            text: t("emotions.slide4"),
            image: "/homepage/memorae_emotions/sad_memorae.svg",
          }, // 4: sad
          {
            text: t("emotions.slide5"),
            image: "/homepage/memorae_emotions/sad_memorae.svg",
          }, // 5: sad
          {
            text: t("emotions.slide6"),
            image: "/homepage/memorae_emotions/angry_memorae.svg",
          }, // 6: angry
          {
            text: t("emotions.slide6"),
            image: "/homepage/memorae_emotions/angry_memorae.svg",
          }, // 7: angry (same text as 6)
          {
            text: t("emotions.slide7"),
            image: "/homepage/memorae_emotions/angry_memorae.svg",
          }, // 8: angry (plants)
        ],
      },
      superpower: {
        title: tSuperpowers(
          "title",
          "Superpoderes para gente que no llega a todo"
        ),
        ctaLabel: tSuperpowers("ctaLabel", "Explorar superpoderes"),
        slides: [
          {
            title: tSuperpowers("slides.reminders.title"),
            dotTitle: tSuperpowers("slides.reminders.dotTitle"),
            description: tSuperpowers("slides.reminders.description"),
            image:
              language === "es"
                ? "/homepage/chat_one.svg"
                : "/homepage/chat_one.webp",
            gradient: "gradientBlue",
            messages: [
              {
                side: "sender",
                type: "text",
                text: tSuperpowers("slides.reminders.messages.sender"),
                timestamp: "17:48",
                read: true,
              },
              {
                side: "receiver",
                type: "text",
                text: tSuperpowers("slides.reminders.messages.receiver"),
                timestamp: "17:48",
              },
            ],
          },
          {
            title: tSuperpowers("slides.calendars.title"),
            dotTitle: tSuperpowers("slides.calendars.dotTitle"),
            description: tSuperpowers("slides.calendars.description"),
            image:
              language === "es"
                ? "/homepage/chat_two.svg"
                : "/homepage/chat_two.webp",
            gradient: "gradientPurple",
            messages: [
              {
                side: "sender",
                type: "text",
                text: tSuperpowers("slides.calendars.messages.sender"),
                timestamp: "17:48",
                read: true,
              },
              {
                side: "receiver",
                type: "text",
                text: tSuperpowers("slides.calendars.messages.receiver"),
                timestamp: "17:48",
              },
            ],
          },
          {
            title: tSuperpowers("slides.focus.title"),
            dotTitle: tSuperpowers("slides.focus.dotTitle"),
            description: tSuperpowers("slides.focus.description"),
            image:
              language === "es"
                ? "/homepage/chat_three.svg"
                : "/homepage/chat_three.webp",
            gradient: "gradientGreen",
            messages: [
              {
                side: "sender",
                type: "text",
                text: tSuperpowers("slides.focus.messages.sender"),
                timestamp: "17:48",
                read: true,
              },
              {
                side: "receiver",
                type: "text",
                text: tSuperpowers("slides.focus.messages.receiver"),
                timestamp: "17:48",
              },
            ],
          },
          {
            title: tSuperpowers("slides.insights.title"),
            dotTitle: tSuperpowers("slides.insights.dotTitle"),
            description: tSuperpowers("slides.insights.description"),
            image:
              language === "es"
                ? "/homepage/chat_four.svg"
                : "/homepage/chat_four.webp",
            gradient: "gradientPink",
            messages: [
              {
                side: "sender",
                type: "image",
                imgSrc: "/homepage/voice_pfp.svg",
                imgAlt: "Voice message waveform",
                timestamp: "17:48",
                read: true,
              },
              {
                side: "receiver",
                type: "text",
                text: tSuperpowers("slides.insights.messages.receiver"),
                timestamp: "17:48",
              },
            ],
          },
          {
            title: tSuperpowers("slides.listas.title"),
            dotTitle: tSuperpowers("slides.listas.dotTitle"),
            description: tSuperpowers("slides.listas.description"),
            image:
              language === "es"
                ? "/homepage/chat_five.svg"
                : "/homepage/chat_five.webp",
            gradient: "gradientBlue",
            messages: [
              {
                side: "sender",
                type: "image",
                imgSrc: "/homepage/Rectangle.svg",
                imgAlt: "Img Chat message",
                text: tSuperpowers("slides.listas.messages.sender"),
                timestamp: "17:48",
                read: true,
              },
              {
                side: "receiver",
                type: "text",
                text: tSuperpowers("slides.listas.messages.receiver"),
                timestamp: "17:48",
              },
            ],
          },
          {
            title: tSuperpowers("slides.integracion.title"),
            dotTitle: tSuperpowers("slides.integracion.dotTitle"),
            description: tSuperpowers("slides.integracion.description"),
            image:
              language === "es"
                ? "/homepage/chat_six.svg"
                : "/homepage/chat_six.webp",
            gradient: "gradientOrange",
            messages: [
              {
                side: "sender",
                type: "text",
                text: tSuperpowers("slides.integracion.messages.sender"),
                timestamp: "17:48",
                read: true,
              },
              {
                side: "receiver",
                type: "text",
                text: tSuperpowers("slides.integracion.messages.receiver"),
                timestamp: "17:48",
              },
            ],
          },
        ],
      },
    };
  }, [t]);

  return (
    <>
      <SuperpowerView model={model} />
    </>
  );
};

export default SuperpowerContainer;
