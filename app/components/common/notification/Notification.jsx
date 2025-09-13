"use client";

import React from "react";
import Image from "next/image";
// Note: No more CSS Module import is needed.

const Notification = ({
  appIcon,
  appName,
  message,
  time,
  badgeIcon,
  translations,
  style, // Accept style prop for animation delay
}) => {
  // Logic for translations remains the same
  const getTranslatedContent = () => {
    if (!translations) return { appName, message };
    switch (appName) {
      case "WhatsApp":
        return {
          appName:
            translations.hero?.notifications?.whatsapp?.appName || appName,
          message:
            translations.hero?.notifications?.whatsapp?.message || message,
        };
      case "Memorae":
        if (message.includes("Meeting") || message.includes("Reunión")) {
          return {
            appName:
              translations.hero?.notifications?.memoraeMeeting?.appName ||
              appName,
            message:
              translations.hero?.notifications?.memoraeMeeting?.message ||
              message,
          };
        } else {
          return {
            appName:
              translations.hero?.notifications?.memoraeTask?.appName || appName,
            message:
              translations.hero?.notifications?.memoraeTask?.message || message,
          };
        }
      case "Calendar":
        return {
          appName:
            translations.hero?.notifications?.calendar?.appName || appName,
          message:
            translations.hero?.notifications?.calendar?.message || message,
        };
      default:
        return { appName, message };
    }
  };

  const { appName: translatedAppName, message: translatedMessage } =
    getTranslatedContent();

  return (
    <div
      className="relative flex w-full max-w-[380px] shrink-0 items-center justify-between rounded-[15px] p-1.5 font-sans text-[#111] shadow-[0_4px_20px_rgba(0,0,0,0.15)] backdrop-blur-[15px] animate-slideInFromRight"
      style={style} // Apply dynamic styles here
    >
      <div className="flex items-center gap-2.5">
        <div className="relative h-[42px] w-[42px] shrink-0">
          <Image
            src={appIcon}
            alt={`${translatedAppName} icon`}
            width={36}
            height={36}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex flex-col gap-1">
          <h4 className="m-0 text-left text-[15px] font-medium">
            {translatedAppName}
          </h4>
          <p className="m-0 text-xs text-[#444]">{translatedMessage}</p>
        </div>
      </div>
      <span className="text-[10px] text-black/20">{time}</span>
    </div>
  );
};

export default Notification;
