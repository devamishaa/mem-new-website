import styles from "./hero.module.css";
import CdnImage from "@/app/components/common/CdnImage";
import Notification from "@/app/components/common/notification/Notification";
import { useState, useEffect } from "react";

const HeroPhoneSection = ({ model, language }) => {
  // Render nothing for date/time during SSR and initial hydration to avoid mismatch.
  // Populate on client after mount and update every second.
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
      // year: "numeric",
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
      hour12: false, // Use 24-hour format (removes AM/PM)
      timeZone:
        (typeof Intl !== "undefined" &&
          Intl.DateTimeFormat().resolvedOptions().timeZone) ||
        "UTC",
    });
    // Remove leading zero from hour (e.g., "05:24" -> "5:24")
    return timeString.replace(/^0/, "");
  };

  return (
    <div
      className={styles.frameDiv}
      data-reveal="scale"
      data-reveal-delay="0.75"
      data-phone-zoom
      data-phone-pin
    >
      <CdnImage
        className={styles.iphoneFrame}
        decorative
        src="/hero/iphone-16-pro/iphone-16-frame.webp"
        priority
        width={935}
        height={1927}
        data-phone-element
      />
      <div className={styles.iphoneScreenMask} data-phone-element>
        <section
          className={styles.iphonePopupArea}
          data-phone-iphone-area
        ></section>
        <div
          className={styles.phoneScreenContent}
          data-phone-screen
          data-phone-screen-image
        >
          <div className={styles.phoneStatusBar}>
            <div className={styles.dateTimeContainer}>
              <div className={styles.currentDate} suppressHydrationWarning>
                {formatDate(currentTime)}
              </div>
              <div className={styles.currentTime} suppressHydrationWarning>
                {formatTime(currentTime)}
              </div>
            </div>
          </div>
          <div className={styles.notificationsContainer}>
            <Notification
              appIcon="/hero/Notification.svg"
              appName="WhatsApp"
              message={
                model?.notifications?.whatsapp?.message
                // "Reminder notification"
              }
              time={model?.notifications?.whatsapp?.time || "34m ago"}
              badgeIcon="/hero/Notification.svg"
              translations={model}
            />
            <Notification
              appIcon="/hero/Notification.svg"
              appName="Memorae"
              message={
                model?.notifications?.memoraeMeeting?.message ||
                "Meeting notification"
              }
              time={model?.notifications?.memoraeMeeting?.time || "1h ago"}
              badgeIcon="/hero/Notification.svg"
              translations={model}
            />
            <Notification
              appIcon="/hero/Notification.svg"
              appName="Calendar"
              message={
                model?.notifications?.calendar?.message ||
                "Calendar notification"
              }
              time={model?.notifications?.calendar?.time || "2h ago"}
              badgeIcon="/hero/Notification.svg"
              translations={model}
            />
            <Notification
              appIcon="/hero/Notification.svg"
              appName="Memorae"
              message={
                model?.notifications?.memoraeTask?.message ||
                "Task notification"
              }
              time={model?.notifications?.memoraeTask?.time || "3h ago"}
              badgeIcon="/hero/Notification.svg"
              translations={model}
            />
          </div>
        </div>
      </div>
      <div className={styles.textGradientEllipse5} data-gradient-ellipse5></div>
      <div className={styles.textGradientEllipse3} data-gradient-ellipse3></div>
      <CdnImage
        className={styles.iphoneBase}
        decorative
        src="/hero/iphone-16-pro/iphone-16-base.webp"
        priority
        width={917}
        height={1925}
        data-phone-element
      />

      {/* Text positioned OUTSIDE phone zoom group - stays absolute size */}
      <div className={styles.iphoneScreenText} data-phone-text>
        <h2 className={styles.headingText}>
          <span className={styles.noTeEsts}>{model.phoneZoomText.line1} </span>
          <br />
          <b>{model.phoneZoomText.line2}</b>
        </h2>
      </div>
    </div>
  );
};

export default HeroPhoneSection;
