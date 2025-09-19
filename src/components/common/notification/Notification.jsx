import React from "react";
import Image from "next/image";
import styles from "@/styles/components/common/notification/Notification.module.css";

const Notification = ({
  appIcon,
  appName,
  message,
  time,
  badgeIcon,
  translations,
}) => {
  // Get translated text from home.json notifications section
  const getTranslatedContent = () => {
    if (!translations) return { appName, message };

    // Use the new notifications section from JSON
    switch (appName) {
      case "WhatsApp":
        return {
          appName:
            translations.hero?.notifications?.whatsapp?.appName || appName,
          message:
            translations.hero?.notifications?.whatsapp?.message || message,
        };
      case "Memorae":
        // Use different content for different Memorae notifications
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
    <div className={styles.notification}>
      <div className={styles.left}>
        <div className={styles.appIcon}>
          <Image
            src={appIcon}
            alt={`${translatedAppName} icon`}
            width={36}
            height={36}
          />
          {/* {badgeIcon && (
            <span className={styles.badge}>
              <Image
                src={badgeIcon}
                alt="badge"
                width={14}
                height={14}
                onError={(e) =>
                  console.error("Badge image failed to load:", badgeIcon, e)
                }
              />
            </span>
          )} */}
        </div>
        <div className={styles.text}>
          <h4>{translatedAppName}</h4>
          <p>{translatedMessage}</p>
        </div>
      </div>
      <span className={styles.time}>{time}</span>
    </div>
  );
};

export default Notification;
