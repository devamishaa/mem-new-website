import { useEffect, useRef, useState, useLayoutEffect } from "react";
import { useSuperpowerTimeline } from "./useSuperpowerTimeline";
import SuperpowerContent from "./SuperpowerContent";
import SuperpowerSlides from "./SuperpowerSlider";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

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
    setActiveSlide(currentIndex);
  }, [currentIndex]);

  // StackedReveal animation
  useLayoutEffect(() => {
    if (!containerRef.current) return;

    let ctx = gsap.context(() => {
      const sections = gsap.utils.toArray(".panel:not(:first-child)");

      // Set all panels below the viewport initially
      gsap.set(sections, { yPercent: 101 });

      // Create animation timeline
      const animation = gsap.to(sections, {
        yPercent: 0,
        duration: 1,
        stagger: 0.1, // Reduced stagger so first section stays visible longer
        borderTopLeftRadius: "2rem",
        borderTopRightRadius: "2rem",
        ease: "none",
      });

      // ScrollTrigger to pin and scrub
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "+=" + 1000 + "%", // Increased scroll distance: 900% for 7 slides + 100% for section transition
        pin: true,
        animation: animation,
        scrub: 1,
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

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
    <div
      ref={containerRef}
      className="gallery relative w-full h-screen overflow-hidden"
    >
      {/* Section 1 - SuperpowerContent */}
      <section className="panel absolute inset-0 bg-gray-200 flex items-center justify-center">
        <SuperpowerContent
          currentEmotionImage={currentEmotionImage}
          emotionText={currentEmotionText}
          activeSlide={activeSlide}
          model={model}
        />
      </section>

      {/* Section 2 - SuperpowerSlides */}
      <section className="panel absolute inset-0 bg-[#06101D] flex items-center justify-center">
        <SuperpowerSlides
          model={model}
          activeSlide={activeSlide}
          onDotClick={handleDotClick}
        />
      </section>
    </div>
  );
};

export default SuperpowerView;
