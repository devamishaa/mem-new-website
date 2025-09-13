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
  const { t } = useTranslation();

  const [activeSlide, setActiveSlide] = useState(0);

  // number of slides — keep in sync with panels rendered below
  const slides = useMemo(() => Array.from({ length: 7 }), []);

  // GSAP horizontal scroll setup (scoped with gsap.context)
  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray(".slide-panel");
      const slidesCount = panels.length;

      // compute total scroll distance properly (width * (n-1))
      const getTotalScroll = () =>
        (containerRef.current ? containerRef.current.offsetWidth : 0) *
        (slidesCount - 1);

      // main horizontal tween
      const tween = gsap.to(panels, {
        xPercent: -100 * (slidesCount - 1),
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: () => "+=" + window.innerWidth * 1,
          pin: true,
          scrub: 0.5,
          // snap to exact slide fractions
          snap: {
            snapTo: 1 / Math.max(1, slidesCount - 1),
            duration: 0.25,
            ease: "power2.inOut",
          },
          // update activeSlide on every update (clamped + rounded)
          onUpdate(self) {
            const progress = gsap.utils.clamp(0, 1, self.progress);
            const rawIndex = progress * (slidesCount - 1);
            const newIndex = Math.round(rawIndex);
            setActiveSlide((prev) => (prev !== newIndex ? newIndex : prev));
          },
          // ensure final index after snapping completes
          onSnapComplete(self) {
            const snapped = Math.round(self.progress * (slidesCount - 1));
            setActiveSlide(snapped);
          },
          // when refresh (resize), recompute end
          onRefresh(self) {
            // onRefresh will be called by ScrollTrigger.refresh(); ensure end remains correct
            self.vars.end = `+=${getTotalScroll()}`;
          },
        },
      });

      // Force a refresh once so end is calculated correctly initialy
      ScrollTrigger.refresh();
    }, containerRef);

    // refresh on resize (keeps end / pin behaviour correct)
    const handleResize = () => {
      ScrollTrigger.refresh();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      ctx.revert(); // kills tweens & ScrollTriggers scoped to this context
    };
  }, []); // run once

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

  // fade animation when image changes
  useEffect(() => {
    if (imgRef.current) {
      gsap.fromTo(
        imgRef.current,
        { autoAlpha: 0, scale: 0.95 },
        { autoAlpha: 1, scale: 1, duration: 0.35, ease: "power2.out" }
      );
    }
  }, [emotionImage]);

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

      {/* fixed content */}
      <div className="sm:mt-30 relative z-[2] text-center text-white h-full flex flex-col justify-center items-center">
        <div className="speech-bubble-tail mb-[25px] rounded-xl bg-white/85 px-6 py-3 text-base font-medium text-[#333] shadow-md max-sm:max-w-[320px]">
          <p className="text-[20px] font-medium leading-snug max-sm:text-lg">
            {speechBubbleText}
          </p>
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
