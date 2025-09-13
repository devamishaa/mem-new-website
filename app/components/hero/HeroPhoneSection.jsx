"use client";

import { useEffect, useRef, useState } from "react";
import CdnImage from "@/app/components/common/CdnImage";
import Notification from "@/app/components/common/notification/Notification";

const HeroPhoneSection = ({ model, language }) => {
  // Debug logging

  const [currentTime, setCurrentTime] = useState(null);

  useEffect(() => {
    const update = () => setCurrentTime(new Date());
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date) => {
    if (!date) return "";
    const options = {
      weekday: "long",
      month: "long",
      day: "numeric",
      timeZone:
        (typeof Intl !== "undefined" &&
          Intl.DateTimeFormat().resolvedOptions().timeZone) ||
        "UTC",
    };
    return date.toLocaleDateString(language || "en-US", options);
  };

  const formatTime = (date) => {
    if (!date) return "";
    const timeString = date.toLocaleTimeString(language || "en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone:
        (typeof Intl !== "undefined" &&
          Intl.DateTimeFormat().resolvedOptions().timeZone) ||
        "UTC",
    });
    return timeString.replace(/^0/, "");
  };

  return (
    <div
      className="relative z-50 flex h-[515.6px] w-[243.6px] items-center justify-center transition-none will-change-transform max-[432px]:h-[675px] max-[432px]:w-[320px] max-[375px]:h-[590px] max-[375px]:w-[280px] md:h-[646px] md:w-[305px] lg:h-[670px] lg:w-[318px] xl:h-[815px] xl:w-[386px]"
      data-reveal="scale"
      data-reveal-delay="0.75"
      data-phone-zoom
      data-phone-pin
      style={{
        opacity: 1,
        visibility: "visible",
        display: "flex",
        position: "relative",
        zIndex: 50,
      }}
    >
      <CdnImage
        className="absolute z-[4] h-full w-full"
        decorative
        src="/hero/iphone-16-pro/iphone-16-frame.webp"
        priority
        width={935}
        height={1927}
        data-phone-element
      />
      <div
        className="absolute z-[3] h-[97%] w-[92%] overflow-hidden rounded-[3rem]"
        data-phone-element
      >
        <section
          className="absolute top-0 left-1/2 z-[2] h-full w-full -translate-x-1/2 translate-y-full rounded-[20px] border-2 border-[#ddd] bg-white"
          data-phone-iphone-area
        ></section>
        <div
          className="absolute inset-0 z-[1] flex flex-col items-center justify-around overflow-y-auto rounded-[3rem] bg-[radial-gradient(80%_80%_at_50%_25%,#edb4ff,rgb(255,255,255))]"
          data-phone-screen
          data-phone-screen-image
        >
          <div className="w-full max-w-[380px]">
            <div className="flex flex-col items-center gap-1">
              <div
                className="text-center font-medium leading-tight text-white xl:text-lg"
                suppressHydrationWarning
              >
                {formatDate(currentTime)}
              </div>
              <div
                className="font-sans text-center text-[68px] font-semibold text-white"
                suppressHydrationWarning
              >
                {formatTime(currentTime)}
              </div>
            </div>
          </div>
          <div className="relative z-10 flex w-full flex-col gap-[5px] p-4 md:gap-3 xl:max-w-[340px] xl:gap-3">
            <Notification
              appIcon="/hero/Notification.svg"
              appName="WhatsApp"
              message={model?.notifications?.whatsapp?.message}
              time={model?.notifications?.whatsapp?.time || "34m ago"}
              badgeIcon="/hero/Notification.svg"
              translations={model}
              index={0}
            />
            <Notification
              appIcon="/hero/Notification.svg"
              appName="Memorae"
              message={model?.notifications?.memoraeMeeting?.message}
              time={model?.notifications?.memoraeMeeting?.time || "1h ago"}
              badgeIcon="/hero/Notification.svg"
              translations={model}
              index={1}
            />
            <Notification
              appIcon="/hero/Notification.svg"
              appName="Calendar"
              message={model?.notifications?.calendar?.message}
              time={model?.notifications?.calendar?.time || "2h ago"}
              badgeIcon="/hero/Notification.svg"
              translations={model}
              index={2}
            />
            <Notification
              appIcon="/hero/Notification.svg"
              appName="Memorae"
              message={model?.notifications?.memoraeTask?.message}
              time={model?.notifications?.memoraeTask?.time || "3h ago"}
              badgeIcon="/hero/Notification.svg"
              translations={model}
              index={3}
            />
          </div>
        </div>
      </div>
      <div
        className="pointer-events-none absolute top-1/2 left-[calc(50%-80px)] z-[3] h-[600px] w-full -translate-y-1/2 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,#edb4ff,rgba(237,180,255,0))] opacity-0"
        data-gradient-ellipse5
      ></div>
      <div
        className="pointer-events-none absolute top-1/2 left-[calc(50%+100px)] z-[3] h-[600px] w-full -translate-y-1/2 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,#70d6ff,rgba(237,180,255,0))] opacity-0"
        data-gradient-ellipse3
      ></div>
      <CdnImage
        className="absolute z-[1] h-full w-[95%]"
        decorative
        src="/hero/iphone-16-pro/iphone-16-base.webp"
        priority
        width={917}
        height={1925}
        data-phone-element
      />
      <div
        className="pointer-events-none fixed left-1/2 top-1/2 z-[3] flex h-full w-auto items-center justify-center text-center will-change-transform -translate-x-1/2 -translate-y-1/2 opacity-100 transition-none"
        data-phone-text
      >
        <h2 className="absolute left-1/2 top-1/2 m-0 block w-max max-w-full overflow-wrap-break-word text-center font-figtree text-[22px] leading-tight text-[#01214f] transition-none will-change-[opacity,transform,font-size] max-[432px]:max-w-[90vw] max-[432px]:text-[32px] max-[375px]:text-[28px] max-[320px]:text-[24px] md:max-w-[80vw] md:text-[48px]">
          <span className="font-semibold">{model.phoneZoomText.line1} </span>
          <br />
          <b>{model.phoneZoomText.line2}</b>
        </h2>
      </div>
    </div>
  );
};

export default HeroPhoneSection;
