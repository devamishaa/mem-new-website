import { useEffect, useRef, useState } from "react";
import styles from "@/styles/components/sections/superpower/Superpower.module.css";
import { useSuperpowerTimeline } from "./animations";
import SuperpowerContent from "./SuperpowerContent";
import SuperpowerSlides from "./SuperpowerSlides";

const SuperpowerView = ({ model }) => {
  const containerRef = useRef(null);
  // Start with the first emotion slide image
  const [currentEmotionImage, setCurrentEmotionImage] = useState(
    model?.emotions?.slides?.[0]?.image || "/homepage/Memorae_Character.png"
  );

  const [activeSlide, setActiveSlide] = useState(0);
  const [currentEmotionText, setCurrentEmotionText] = useState(
    model?.emotions?.slides?.[0]?.text || ""
  );
  const { currentIndex } = useSuperpowerTimeline(
    containerRef,
    model,
    (img) => setCurrentEmotionImage(img),
    (idx) => setActiveSlide(idx), // let GSAP update activeSlide too
    (text) => setCurrentEmotionText(text) // let GSAP update emotion text too
  );

  // Sync local activeSlide with GSAP scroll progress
  useEffect(() => {
    setActiveSlide(currentIndex);
  }, [currentIndex]);

  // Handle dot click (manual navigation)
  const handleDotClick = (i) => {
    setActiveSlide(i);
    // Map first dot to emotion slide 1 to skip blank slide 0
    const emotionIndex = i + 1;
    const nextSlide = model?.emotions?.slides?.[emotionIndex];
    if (nextSlide) {
      if (nextSlide.image) setCurrentEmotionImage(nextSlide.image);
      if (nextSlide.text) setCurrentEmotionText(nextSlide.text);
    }
  };

  return (
    <section
      ref={containerRef}
      className={styles.superpowerSection}
      aria-label="Superpower section - Features showcase"
      data-superpower
    >
      <SuperpowerContent
        currentEmotionImage={currentEmotionImage}
        emotionText={currentEmotionText}
        activeSlide={activeSlide}
        model={model}
      />
      <SuperpowerSlides
        model={model}
        activeSlide={activeSlide}
        onDotClick={handleDotClick}
      />
    </section>
  );
};

export default SuperpowerView;
