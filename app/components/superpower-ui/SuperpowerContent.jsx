import CdnImage from "@/app/components/common/CdnImage";
import { useEffect, useRef, useState } from "react";

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
  // activeSlide and model props are kept for API consistency
  activeSlide = 0,
  model,
}) => {
  const containerRef = useRef(null);
  const [emotionText, setEmotionText] = useState(
    "¡Hola! Soy Memorae, tu asistente personal para recordar todo lo importante."
  );

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
    <div
      ref={containerRef}
      className="relative z-[1] flex h-screen w-full items-center justify-center overflow-hidden max-md:px-4 max-md:py-8 max-sm:px-4 max-sm:py-6"
      data-panel-1
    >
      <SpeechBubbleTailStyle />
      {/* Desktop background */}
      <CdnImage
        className="absolute inset-0 z-[1]"
        src="/homepage/Desktop.webp"
        alt="Desktop background"
        fill
        priority
        style={{ objectFit: "cover" }}
      />
      <div className="relative z-[2] text-center text-white">
        <div className="relative mt-[13em] flex flex-col items-center">
          <div
            className="speech-bubble-tail relative mb-[25px] rounded-xl bg-white/85 px-6 py-3 text-base font-medium text-[#333] shadow-[0_4px_12px_rgba(0,0,0,0.1)] max-sm:max-w-[320px] max-sm:px-[1.2rem] max-sm:py-[0.8rem]"
            style={{ display: emotionText ? "block" : "none" }}
          >
            <p
              data-emotion-text
              className="font-intertight m-0 text-[20px] font-medium leading-snug max-sm:text-lg"
            >
              {emotionText}
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
