import { useEffect, useRef, useState, useLayoutEffect } from "react";
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

  // StackedReveal animation
  useLayoutEffect(() => {
    if (!containerRef.current) return;

    let ctx = gsap.context(() => {
      const sections = gsap.utils.toArray(".panel");

      console.log("SuperpowerView - Found sections:", sections.length);
      console.log("SuperpowerView - Sections:", sections);

      // Set all panels below the viewport initially (except first one)
      gsap.set(sections, { yPercent: 101 });
      gsap.set(sections[0], { yPercent: 0 }); // First section visible initially

      // Set initial scale for the second panel (SuperpowerSlides)
      if (sections[1]) {
        gsap.set(sections[1], {
          scale: 0.5, // Start very small
          transformOrigin: "center center",
          borderTopLeftRadius: "3rem", // Start with 3rem
          borderTopRightRadius: "3rem", // Start with 3rem
        });
      }

      // Create animation timeline with more time for first section
      const animation = gsap.timeline();

      // First section (SuperpowerContent) stays visible for 7 slides duration
      animation.to(
        sections[0],
        {
          yPercent: 0, // Already visible, just maintain
          duration: 7, // 7x duration for 7 emotion slides
          borderTopLeftRadius: "0rem",
          borderTopRightRadius: "0rem",
          ease: "none",
        },
        0
      );

      // Second section (SuperpowerSlider) starts after first section completes
      if (sections[1]) {
        // Create detailed border radius animation with specific values
        animation.to(
          sections[1],
          {
            yPercent: 0,
            scale: 1, // Scale from 0.5 to 1.0 (original size)
            duration: 2, // Increased duration for smoother transition
            ease: "power2.out", // Smooth easing for all animations
          },
          6 // Start a bit earlier for smoother transition
        );

        // Border radius animation with specific progression
        animation.to(
          sections[1],
          {
            borderTopLeftRadius: "2.5rem",
            borderTopRightRadius: "2.5rem",
            duration: 0.2,
            ease: "none",
          },
          6.1
        );

        animation.to(
          sections[1],
          {
            borderTopLeftRadius: "2rem",
            borderTopRightRadius: "2rem",
            duration: 0.2,
            ease: "none",
          },
          6.3
        );

        animation.to(
          sections[1],
          {
            borderTopLeftRadius: "1.5rem",
            borderTopRightRadius: "1.5rem",
            duration: 0.2,
            ease: "none",
          },
          6.5
        );

        animation.to(
          sections[1],
          {
            borderTopLeftRadius: "1rem",
            borderTopRightRadius: "1rem",
            duration: 0.2,
            ease: "none",
          },
          6.7
        );

        animation.to(
          sections[1],
          {
            borderTopLeftRadius: "0.5rem",
            borderTopRightRadius: "0.5rem",
            duration: 0.2,
            ease: "none",
          },
          6.9
        );

        animation.to(
          sections[1],
          {
            borderTopLeftRadius: "0rem",
            borderTopRightRadius: "0rem",
            duration: 0.2,
            ease: "none",
          },
          7.1
        );
      }

      // ScrollTrigger to pin and scrub
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "+=" + 200 + "%", // Reduced scroll distance for faster transition
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

  return (
    <div
      ref={containerRef}
      className="gallery relative w-full h-screen overflow-hidden"
    >
      {/* Section 1 - SuperpowerContent */}
      <section className="panel absolute inset-0 bg-gray-200 flex items-center justify-center">
        <SuperpowerContent />
      </section>

      {/* Section 2 - SuperpowerSlides */}
      <section className="panel absolute inset-0 bg-[#06101D] flex items-center justify-center">
        <SuperpowerSlides />
      </section>
    </div>
  );
};

export default SuperpowerView;
