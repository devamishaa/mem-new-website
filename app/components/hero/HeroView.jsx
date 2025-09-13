"use client";

import { useRef } from "react";
import { useHeroTimeline } from "./userHeroTimeline";
import HeroBackgroundElements from "./HeroBackgroundElements";
import HeroFloatingCards from "./HeroFloatingCards";
import HeroTextContent from "./HeroTextContent";
import HeroPhoneSection from "./HeroPhoneSection";
import HeroDecorativeElements from "./HeroDecorativeElements";

const HeroView = ({ model, language, imageDimensions, ctaHref }) => {
  const containerRef = useRef(null);

  useHeroTimeline(containerRef);

  return (
    <section
      ref={containerRef}
      className="relative flex w-full flex-col items-center justify-start overflow-hidden bg-[#eaf2f1] px-[30.6px] pt-[115px] pb-[17.5px] text-left font-figtree text-[4.25px] 
                 md:min-h-[900px] md:px-10 md:pt-[140px] md:pb-6 
                 lg:min-h-[1200px] 
                 xl:min-h-[1531px]"
      aria-label="Hero section - Memorae AI assistant introduction"
      data-hero
    >
      <img
        className="absolute top-[100px] z-50 h-auto w-[100px] max-h-full object-cover 
                   hidden 
                   lg:w-[92px] lg:left-auto 
                   xl:top-[106px] xl:w-[112px]"
        alt="Memorae AI assistant character"
        src="/homepage/Memorae_Character 1.svg"
        data-parallax="0.2"
        data-reveal="scale"
        data-reveal-delay="0.05"
      />

      {/* All child components below were converted in previous steps */}
      <HeroBackgroundElements imageDimensions={imageDimensions} />
      <HeroFloatingCards model={model} />
      <HeroTextContent model={model} ctaHref={ctaHref} />
      <HeroPhoneSection model={model} language={language} />
      <HeroDecorativeElements imageDimensions={imageDimensions} />
    </section>
  );
};

export default HeroView;
