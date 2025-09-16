import { useRef } from "react";
import styles from "./hero.module.css";
import { useHeroTimeline } from "./userHeroTimeline";
import { useNavbarColor } from "@/hooks/useNavbarColor";
import HeroBackgroundElements from "./HeroBackgroundElements";
import HeroFloatingCards from "./HeroFloatingCards";
import HeroTextContent from "./HeroTextContent";
import HeroPhoneSection from "./HeroPhoneSection";
import HeroDecorativeElements from "./HeroDecorativeElements";

const HeroView = ({ model, language, imageDimensions, ctaHref }) => {
  const containerRef = useRef(null);

  useHeroTimeline(containerRef);

  // Set navbar theme to light for hero section
  useNavbarColor([
    {
      ref: containerRef,
      theme: "light",
    },
  ]);

  return (
    <section
      ref={containerRef}
      className={styles.Hero}
      aria-label="Hero section - Memorae AI assistant introduction"
      data-hero
    >
      <img
        className={styles.memoraeCharacter1Icon}
        alt="Memorae AI assistant character"
        src="/homepage/Memorae_Character 1.svg"
        data-parallax="0.2"
        data-reveal="scale"
        data-reveal-delay="0.05"
      />
      <HeroBackgroundElements imageDimensions={imageDimensions} />
      <HeroFloatingCards model={model} />
      <HeroTextContent model={model} ctaHref={ctaHref} />
      <HeroPhoneSection model={model} language={language} />
      <HeroDecorativeElements imageDimensions={imageDimensions} />
      {/* Motion path and helper removed */}
    </section>
  );
};

export default HeroView;
