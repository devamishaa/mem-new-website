import { useEffect, useRef, useState } from "react";
import { useSuperpowerTimeline } from "./useSuperpowerTimeline";
import SuperpowerContent from "./SuperpowerContent";
import SuperpowerSlides from "./SuperpowerSlider";

const SuperpowerView = ({ model }) => {
  console.log(model, "model");

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
    (text) => setCurrentEmotionText(text) // let GSAP update emotion text too
  );

  // Sync local activeSlide with GSAP scroll progress
  useEffect(() => {
    console.log("SuperpowerView - currentIndex changed:", currentIndex);
    setActiveSlide(currentIndex);
  }, [currentIndex]);

  // Debug activeSlide changes
  useEffect(() => {
    console.log("SuperpowerView - activeSlide changed:", activeSlide);
  }, [activeSlide]);

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
