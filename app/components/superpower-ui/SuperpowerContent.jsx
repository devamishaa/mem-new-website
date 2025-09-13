import CdnImage from "@/app/components/common/CdnImage";
import { useEffect, useRef, useMemo } from "react";
import { useTranslation } from "@/hooks/useTranslation";

/**
 * A component to inject custom CSS for the speech bubble's tail,
 * as this shape cannot be created with standard Tailwind classes.
 */
const SpeechBubbleTailStyle = () => (
  <style jsx>{`
    .speech-bubble-tail::after {
      content: "";
      position: absolute;
      bottom: -10px;
      left: 50%;
      transform: translateX(-50%);
      width: 0;
      height: 0;
      border-left: 10px solid transparent;
      border-right: 10px solid transparent;
      border-top: 10px solid rgba(255, 255, 255, 0.85);
      z-index: 1;
    }
  `}</style>
);

const SuperpowerContent = ({
  currentEmotionImage = "/homepage/Memorae_Character.png",
  emotionText,
  model,
  activeSlide = 0,
}) => {
  const containerRef = useRef(null);
  const imgRef = useRef(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (imgRef.current) {
      imgRef.current.setAttribute("data-hydrated", "");
    }
  }, []);

  useEffect(() => {
    if (imgRef.current) {
      imgRef.current.style.opacity = "1";
      imgRef.current.style.visibility = "visible";
      imgRef.current.style.animation = ""; // Reset animation
    }
  }, [currentEmotionImage]);

  // Get speech bubble text from translations based on active slide - reactive to activeSlide changes
  const speechBubbleText = useMemo(() => {
    // Map activeSlide to existing superpowers.slides translation keys
    const slideTexts = {
      0: "superpowers.slides.reminders.description",
      1: "superpowers.slides.calendars.description",
      2: "superpowers.slides.focus.description",
      3: "superpowers.slides.insights.description",
      4: "superpowers.slides.listas.description",
      5: "superpowers.slides.integracion.description",
    };

    const textKey =
      slideTexts[activeSlide] || "superpowers.slides.reminders.description";
    const translatedText = t(textKey);

    console.log("SuperpowerContent - Translation debug:", {
      activeSlide,
      textKey,
      translatedText,
      isKeySame: translatedText === textKey,
    });

    // If translation returns the key itself, use a fallback
    if (translatedText === textKey) {
      return "Hello! I'm Memorae, your personal assistant.";
    }

    return translatedText;
  }, [activeSlide, t]);

  // Debug: Log when activeSlide changes
  useEffect(() => {
    console.log("SuperpowerContent - activeSlide changed:", activeSlide);
    console.log("SuperpowerContent - speechBubbleText:", speechBubbleText);
    console.log("SuperpowerContent - emotionText:", emotionText);

    // Test translation directly
    const testKey = "superpowers.slides.reminders.description";
    const testTranslation = t(testKey);
    console.log("Test translation for", testKey, ":", testTranslation);
  }, [activeSlide, speechBubbleText, emotionText, t]);

  return (
    <div
      ref={containerRef}
      className="relative z-[1] flex h-screen w-screen items-center justify-center overflow-hidden max-md:px-4 max-md:py-8 max-sm:px-4 max-sm:py-6"
      data-panel-1
      style={{ width: "100vw", marginLeft: "calc(50% - 50vw)" }}
    >
      <SpeechBubbleTailStyle />
      {/* Desktop background */}
      <CdnImage
        className="absolute inset-0 z-[1] w-full h-full"
        src="/homepage/Desktop.webp"
        alt="Desktop background"
        fill
        priority
        style={{
          objectFit: "cover",
          objectPosition: "center",
        }}
      />
      <div className="relative z-[2] text-center text-white">
        <div className="relative mt-[13em] flex flex-col items-center">
          <div
            className="speech-bubble-tail relative mb-[25px] rounded-xl bg-white/85 px-6 py-3 text-base font-medium text-[#333] shadow-[0_4px_12px_rgba(0,0,0,0.1)] max-sm:max-w-[320px] max-sm:px-[1.2rem] max-sm:py-[0.8rem]"
            style={{ display: speechBubbleText ? "block" : "none" }}
          >
            <p
              data-emotion-text
              className="font-intertight m-0 text-[20px] font-medium leading-snug max-sm:text-lg"
            >
              {speechBubbleText}
            </p>
          </div>
          <div className="relative z-[3] flex items-center justify-center">
            <img
              data-emotion-image
              ref={imgRef}
              className="animate-[slowBounce_8s_ease-in-out_infinite] h-50 max-md:max-h-[50px] max-md:max-w-[50px] max-sm:max-h-[78px] max-sm:max-w-[78px]"
              alt="Emotion character"
              src={currentEmotionImage}
              style={{
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
