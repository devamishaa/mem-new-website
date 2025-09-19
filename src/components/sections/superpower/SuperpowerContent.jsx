import { useEffect, useRef, useState } from "react";
import styles from "@/styles/components/sections/superpower/Superpower.module.css";
import CdnImage from "@/components/common/images/CdnImage";
import { useNavbarColor } from "@/hooks/useNavbarColor";

const SuperpowerContent = ({
  currentEmotionImage = "/homepage/Memorae_Character.png",
  activeSlide = 0,
  model,
}) => {
  const containerRef = useRef(null);
  const [emotionText, setEmotionText] = useState("");

  // Set navbar theme to dark for this section
  useNavbarColor([
    {
      ref: containerRef,
      theme: "light",
    },
  ]);
  // Mark the emotion image as hydrated so external overlays wait to mutate it
  const imgRef = useRef(null);
  useEffect(() => {
    if (imgRef.current) {
      imgRef.current.setAttribute("data-hydrated", "");
    }
  }, []);

  // Ensure image is visible when component mounts or image changes
  useEffect(() => {
    if (imgRef.current) {
      // Reset to visible state when image changes
      imgRef.current.style.opacity = "1";
      imgRef.current.style.visibility = "visible";
      imgRef.current.style.animation = ""; // Reset animation
    }
  }, [currentEmotionImage]);

  useEffect(() => {
    const emotionTextElement = document.querySelector("[data-emotion-text]");
    if (!emotionTextElement) return;

    const observer = new MutationObserver(() => {
      const text = emotionTextElement.textContent || "";
      setEmotionText(text);
    });

    // Initial check
    setEmotionText(emotionTextElement.textContent || "");

    // Start observing
    observer.observe(emotionTextElement, {
      childList: true,
      characterData: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className={styles.emotionPanel} data-panel-1>
      {/* Desktop background */}
      <CdnImage
        className={styles.desktopBackground}
        src="https://cdn.memorae.ai/mem-next/homepage/Desktop.webp"
        alt="Desktop background"
        fill
        priority
        style={{ objectFit: "cover", zIndex: 1 }}
      />
      <div className={styles.bubblesContainer}>
        <img src="/bubble.svg" alt="bubble" className={`${styles.movingBubble} ${styles.movingBubble1}`} />
        <img src="/bubble.svg" alt="bubble" className={`${styles.movingBubble} ${styles.movingBubble2}`} />
        <img src="/bubble.svg" alt="bubble" className={`${styles.movingBubble} ${styles.movingBubble3}`} />
        <img src="/bubble.svg" alt="bubble" className={`${styles.movingBubble} ${styles.movingBubble4}`} />
        <img src="/bubble.svg" alt="bubble" className={`${styles.movingBubble} ${styles.movingBubble5}`} />
        <img src="/bubble.svg" alt="bubble" className={`${styles.movingBubble} ${styles.movingBubble6}`} />
      </div>
      <div className={styles.emotionContent}>
        <div className={styles.characterContainer}>
          <div
            className={styles.speechBubble}
            style={{ display: emotionText ? "block" : "none" }}
          >
            <p data-emotion-text className={styles.emotionText}>
              {emotionText}
            </p>
          </div>
          <div className={styles.characterImageContainer}>
            <img
              data-emotion-image
              ref={imgRef}
              className={styles.characterImage}
              alt="Emotion character"
              src={currentEmotionImage}
              style={{
                zIndex: 3,
                // Start visible by default, let GSAP animation control visibility when needed
                opacity: 1,
                visibility: "visible",
                // Faster transition for quicker emotion sliding
                transition: "opacity 0.06s ease-out",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperpowerContent;
