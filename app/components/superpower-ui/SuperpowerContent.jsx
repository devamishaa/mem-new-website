"use client";

import CdnImage from "@/app/components/common/CdnImage";
import { useEffect, useRef, useMemo, useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const SpeechBubbleTailStyle = () => (
  <style jsx>{`
    .speech-bubble-tail::after {
      content: "";
      position: absolute;
      top: 50%;
      right: -10px;
      transform: translateY(-50%);
      width: 0;
      height: 0;
      border-top: 10px solid transparent;
      border-bottom: 10px solid transparent;
      border-left: 10px solid rgba(255, 255, 255, 0.85);
      z-index: 1;
    }
  `}</style>
);

const SuperpowerContent = () => {
  const containerRef = useRef(null);
  const imgRef = useRef(null);
  const bubbleRef = useRef(null);
  const bubble2Ref = useRef(null);
  const bubble3Ref = useRef(null);
  const { t } = useTranslation();

  const [activeSlide, setActiveSlide] = useState(0);
  const [isClient, setIsClient] = useState(false);

  const slides = useMemo(() => Array.from({ length: 7 }), []);

  // mark as client after hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

  // ScrollTrigger
  useEffect(() => {
    if (!containerRef.current || !isClient) return;
    const totalSlides = 7;
    let currentSlide = 0;

    const scrollTrigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "bottom top",
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;
        const slideIndex = Math.floor(progress * totalSlides);
        const clampedIndex = Math.max(0, Math.min(slideIndex, totalSlides - 1));

        if (clampedIndex !== currentSlide) {
          currentSlide = clampedIndex;
          setActiveSlide(clampedIndex);
        }
      },
    });

    return () => scrollTrigger.kill();
  }, [isClient]);

  // Bubble animations
  useEffect(() => {
    if (!bubbleRef.current || !isClient) return;
    gsap.set(bubbleRef.current, { x: -100, y: "50%" });
    gsap.to(bubbleRef.current, {
      x: "100vw",
      duration: 18,
      ease: "none",
      repeat: -1,
    });
  }, [isClient]);

  useEffect(() => {
    if (!bubble2Ref.current || !isClient) return;
    gsap.set(bubble2Ref.current, { x: "70%", y: "100vh" });
    gsap.to(bubble2Ref.current, {
      y: -100,
      duration: 15,
      ease: "none",
      repeat: -1,
    });
  }, [isClient]);

  useEffect(() => {
    if (!bubble3Ref.current || !isClient) return;
    gsap.set(bubble3Ref.current, { x: "100vw", y: "100vh" });
    gsap.to(bubble3Ref.current, {
      x: "20%",
      y: -100,
      duration: 20,
      ease: "none",
      repeat: -1,
    });
  }, [isClient]);

  // speech text
  const speechBubbleText = useMemo(() => {
    const slideKeys = {
      0: "emotions.slide1",
      1: "emotions.slide2",
      2: "emotions.slide3",
      3: "emotions.slide4",
      4: "emotions.slide5",
      5: "emotions.slide6",
      6: "emotions.slide7",
    };
    const key = slideKeys[activeSlide] || slideKeys[0];
    const translated = t(key);
    return translated === key
      ? "Hello! I'm Memorae, your personal assistant."
      : translated;
  }, [activeSlide, t]);

  // emotion image
  const emotionImage = useMemo(() => {
    const images = {
      0: "/homepage/memorae_emotions/Happy_memeorae.svg",
      1: "/homepage/memorae_emotions/surprised_memorae.svg",
      2: "/homepage/memorae_emotions/surprised_memorae.svg",
      3: "/homepage/memorae_emotions/sad_memorae.svg",
      4: "/homepage/memorae_emotions/sad_memorae.svg",
      5: "/homepage/memorae_emotions/angry_memorae.svg",
      6: "/homepage/memorae_emotions/angry_memorae.svg",
    };
    return images[activeSlide] || "/homepage/Memorae_Character.png";
  }, [activeSlide]);

  // ✅ Hooks always run → but render only when client
  if (!isClient) {
    return <div style={{ height: "100vh", width: "100vw" }} />; // placeholder (no mismatch)
  }

  return (
    <div
      ref={containerRef}
      className="relative w-screen h-screen overflow-hidden"
    >
      <SpeechBubbleTailStyle />

      {/* background */}
      <CdnImage
        className="absolute inset-0 z-[1] w-full h-full"
        src="/homepage/Desktop.webp"
        alt="Desktop background"
        fill
        priority
        style={{ objectFit: "cover", objectPosition: "center" }}
      />

      {/* bubbles */}
      <div className="absolute inset-0 z-[1] w-full h-full">
        <img
          ref={bubbleRef}
          src="/homepage/bubble.svg"
          alt="Bubble"
          className="w-20 h-20 absolute"
        />
        <img
          ref={bubble2Ref}
          src="/homepage/bubble.svg"
          alt="Bubble 2"
          className="w-16 h-16 absolute"
        />
        <img
          ref={bubble3Ref}
          src="/homepage/bubble.svg"
          alt="Bubble 3"
          className="w-14 h-14 absolute"
        />
      </div>

      {/* speech + character */}
      <div className="mt-30 relative z-[2] text-center text-white h-full flex flex-col justify-center items-center">
        <div className="mb-6 relative bg-white text-slate-800 text-lg font-medium px-6 py-3 rounded-xl shadow-md">
          {speechBubbleText}
          <div
            className="absolute left-1/2 -bottom-2 w-0 h-0 -translate-x-1/2 
            border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white"
          />
        </div>

        <img
          ref={imgRef}
          src={emotionImage}
          alt="Emotion character"
          className="animate-[slowBounce_5s_ease-in-out_infinite]"
          style={{ width: "220px", height: "230px" }}
        />
      </div>

      {/* slides */}
      <div
        className="flex h-full"
        style={{ width: `${slides.length * 100}vw` }}
      >
        {slides.map((_, i) => (
          <div key={i} className="slide-panel w-screen h-full flex-shrink-0" />
        ))}
      </div>
    </div>
  );
};

export default SuperpowerContent;
