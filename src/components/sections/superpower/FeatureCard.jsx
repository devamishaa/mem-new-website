import styles from "@/styles/components/sections/superpower/Superpower.module.css";

export default function FeatureCard({
  title,
  description,
  className,
  gradient,
  bgImage, // ✅ new prop
  messages = [],
}) {
  return (
    <div
      className={`${styles.featureCard} ${className || ""} ${
        gradient ? styles[gradient] : ""
      }`}
    >
      <div
        className={`${styles.featureCardBg} ${
          gradient ? styles[gradient] : ""
        }`}
      />
      <div className={styles.featureCardContent}>
        <div className={styles.featureCardTop}>
          <h3 className={styles.featureCardTitle}>{title}</h3>
          <p className={styles.featureCardDescription}>{description}</p>
        </div>

        <div
          className={`${styles.featureCardChildren} ${styles.spChatWrapper}`}
          style={{
            backgroundImage: bgImage ? `url(${bgImage})` : "none",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {messages.slice(0, 2).map((m, i) => (
            <SpeechBubble key={i} {...m} />
          ))}
        </div>
      </div>
    </div>
  );
}

function SpeechBubble({
  side = "receiver",
  name,
  text,
  imgSrc,
  imgAlt = "",
  timestamp,
  read = false,
}) {
  const isSender = side === "sender";

  return (
    <div className={styles.spBubbleRow}>
      <div
        className={[
          styles.spBubble,
          isSender ? styles.spBubbleAlt : "",
          isSender ? styles.spSender : styles.spReceiver,
        ].join(" ")}
      >
        <div className={styles.spTxt}>
          {name && (
            <p
              className={[styles.spName, isSender ? styles.spNameAlt : ""].join(
                " "
              )}
            >
              {name}
            </p>
          )}

          {imgSrc ? (
            <div className={styles.spImageContainer}>
              <img src={imgSrc} alt={imgAlt} className={styles.spImage} />
              <p className={styles.spMessage}>{text}</p>
            </div>
          ) : (
            <p className={styles.spMessage}>{text}</p>
          )}

          {timestamp && <span className={styles.spTimestamp}>{timestamp}</span>}
          {isSender && read && <ReadTicks />}
        </div>

        <div
          className={[
            styles.spBubbleArrow,
            isSender ? styles.spBubbleArrowAlt : "",
          ].join(" ")}
        />
      </div>
    </div>
  );
}

function ReadTicks() {
  return (
    <svg className={styles.spTicks} viewBox="0 0 16 15" aria-hidden="true">
      <path d="M9.6 6.2L6.1 10.4 4.2 8.3" />
      <path d="M12.8 5.7L8.3 11 7.0 9.5" />
    </svg>
  );
}
