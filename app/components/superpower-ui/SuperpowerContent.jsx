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

  // number of slides — keep in sync with panels rendered below
  const slides = useMemo(() => Array.from({ length: 7 }), []);

  // Use ScrollTrigger to control slide progression
  useEffect(() => {
    if (!containerRef.current) return;

    const totalSlides = 7;
    let currentSlide = 0;

    // Create a ScrollTrigger for this section
    const scrollTrigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top", // Start when section reaches top of viewport
      end: "bottom top", // End when section bottom reaches top of viewport
      scrub: 1,
      onUpdate: (self) => {
        // Calculate slide index based on scroll progress with better distribution
        const progress = self.progress;

        // Give more time to slides 1-6 by using a different distribution
        // Reserve only 2% for the last slide, give 98% to first 6 slides
        const lastSlideReserve = 0.01;
        const availableProgress = 1 - lastSlideReserve;

        let slideIndex;
        if (progress <= availableProgress) {
          // For first 6 slides, distribute evenly across 98% of progress
          // This gives each slide ~16% of progress
          slideIndex = Math.floor(
            (progress / availableProgress) * (totalSlides - 1)
          );
        } else {
          // For the last slide, use only 2% of progress
          slideIndex = totalSlides - 1;
        }

        const clampedIndex = Math.max(0, Math.min(slideIndex, totalSlides - 1));

        if (clampedIndex !== currentSlide) {
          currentSlide = clampedIndex;
          setActiveSlide(clampedIndex);
        }
      },
    });

    return () => {
      scrollTrigger.kill();
    };
  }, []);

  // Bubble animation effect
  useEffect(() => {
    if (!bubbleRef.current) return;

    // Set initial position (off-screen left)
    gsap.set(bubbleRef.current, { x: -100, y: "50%" });

    // Animate from left to right slowly
    gsap.to(bubbleRef.current, {
      x: "100vw", // Move to right edge of viewport
      duration: 18, // Slow animation (18 seconds)
      ease: "none", // Linear movement
      repeat: -1, // Infinite repeat
      yoyo: false, // Don't reverse, just restart
    });
  }, []);

  // Second bubble animation effect
  useEffect(() => {
    if (!bubble2Ref.current) return;

    // Set initial position (off-screen bottom)
    gsap.set(bubble2Ref.current, { x: "70%", y: "100vh" });

    // Animate from bottom to top slowly
    gsap.to(bubble2Ref.current, {
      y: -100, // Move to top edge of viewport
      duration: 15, // Different duration for variety
      ease: "none", // Linear movement
      repeat: -1, // Infinite repeat
      yoyo: false, // Don't reverse, just restart
    });
  }, []);

  // Third bubble animation effect
  useEffect(() => {
    if (!bubble3Ref.current) return;

    // Set initial position (off-screen right bottom)
    gsap.set(bubble3Ref.current, { x: "100vw", y: "100vh" });

    // Animate from right bottom to top slowly
    gsap.to(bubble3Ref.current, {
      x: "20%", // Move to left side
      y: -100, // Move to top edge
      duration: 20, // Different duration for variety
      ease: "none", // Linear movement
      repeat: -1, // Infinite repeat
      yoyo: false, // Don't reverse, just restart
    });
  }, []);

  // speech text from your translations JSON (emotions.slide1..)
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

  // emotion image mapping
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

      {/* bubble overlay */}
      <div className="absolute inset-0 z-[1] w-full h-full">
        <img
          ref={bubbleRef}
          src="/homepage/bubble.svg"
          alt="Bubble overlay"
          className="w-20 h-20 absolute"
        />
        <img
          ref={bubble2Ref}
          src="/homepage/bubble.svg"
          alt="Bubble overlay 2"
          className="w-16 h-16 absolute"
        />
        <img
          ref={bubble3Ref}
          src="/homepage/bubble.svg"
          alt="Bubble overlay 3"
          className="w-14 h-14 absolute"
        />
      </div>

      {/* fixed content */}
      <div className="sm:mt-30 relative z-[2] text-center text-white h-full flex flex-col justify-center items-center">
        <div className="mb-6 relative bg-white text-slate-800 text-lg font-medium px-6 py-3 rounded-xl shadow-md">
          {speechBubbleText}
          <div
            className="absolute left-1/2 -bottom-2 w-0 h-0 -translate-x-1/2 
          border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white"
          ></div>
        </div>

        <img
          ref={imgRef}
          src={emotionImage}
          alt="Emotion character"
          className="animate-[slowBounce_5s_ease-in-out_infinite]"
        />
      </div>

      {/* panels for horizontal scroll — width computed from slides length */}
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
