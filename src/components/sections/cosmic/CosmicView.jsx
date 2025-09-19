"use client";
import { useRef, useEffect, useState } from "react";
import { useCosmicTimeline } from "./animations/useCosmicTimeline";
import { useNavbarColor } from "@/hooks/useNavbarColor";
import memorae from "../../../../public/homepage/smily_memorae.png";
import Image from "next/image";
import { gsap } from "@/utils/gsap";
import styles from "@/styles/components/sections/cosmic/Cosmic.module.css";

export default function CosmicLanding({ model }) {
  const containerRef = useRef(null); // Single ref for all DOM queries
  const [stars, setStars] = useState([]);
  const [isInView, setIsInView] = useState(false);
  const [animationsReady, setAnimationsReady] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useNavbarColor([{ ref: containerRef, theme: "light" }]);
  useCosmicTimeline(containerRef, model);

  // Set client-side flag to prevent hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Intersection Observer to detect when section is in view
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.1) {
            setIsInView(true);
            observer.unobserve(entry.target); // Only trigger once
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "100px 0px", // Start preparing before fully visible
      }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Generate stars only when in view (reduced count for mobile performance)
  useEffect(() => {
    if (!isInView) return;

    // Use requestAnimationFrame to avoid blocking scroll
    requestAnimationFrame(() => {
      const isMobile = window.innerWidth <= 600; // Changed to 600px
      const starCount = isMobile ? 40 : window.innerWidth > 1200 ? 60 : 25; // No stars on mobile
      const generated = Array.from({ length: starCount }, () => ({
        top: Math.random() * 100,
        left: Math.random() * 100,
        opacity: Math.random() * 0.8 + 0.2,
      }));
      setStars(generated);

      // Skip animations on mobile
      if (isMobile) {
        setAnimationsReady(true);
        return;
      }

      // Delay other animations to avoid blocking
      setTimeout(() => setAnimationsReady(true), 100);
    });
  }, [isInView]);

  // Animate stars with single DOM query (disabled for mobile)
  useEffect(() => {
    if (!containerRef.current || stars.length === 0 || !animationsReady) return;

    const setupStars = () => {
      const starsContainer = containerRef.current?.querySelector(
        "[data-cosmic-stars]"
      );
      const starsEls = starsContainer?.querySelectorAll(
        `.${styles.cosmicStar}`
      );
      if (!starsEls) return;

      const isMobile = window.innerWidth <= 600;

      if (isMobile) {
        // No star animations on mobile - stars are already disabled
        return;
      } else {
        // Original staggered animation for desktop
        starsEls.forEach((star, index) => {
          star.style.opacity = "0";
          star.style.transition = "opacity 0.5s ease-out";

          // Stagger appearance
          setTimeout(() => {
            const targetOpacity =
              parseFloat(star.style.getPropertyValue("--star-opacity")) || 0.8;
            star.style.opacity = targetOpacity.toString();
            star.style.animationDelay = `${(index * 0.2) % 2}s`;
          }, index * 50);
        });
      }
    };

    if (window.requestIdleCallback) {
      window.requestIdleCallback(setupStars);
    } else {
      setTimeout(setupStars, 100);
    }
  }, [stars, animationsReady]);

  // Image float animation using data attribute (disabled for mobile)
  useEffect(() => {
    if (!containerRef.current || !animationsReady) return;

    const startAnimation = () => {
      const image = containerRef.current?.querySelector("[data-cosmic-image]");
      if (!image) return;

      const isMobile = window.innerWidth <= 600;

      if (isMobile) {
        // No image animation on mobile
        return;
      } else {
        // Original float animation for desktop
        gsap.to(image, {
          y: -20, // Original bounce height
          duration: 2, // Original speed
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          force3D: true,
        });
      }
    };

    if (window.requestIdleCallback) {
      window.requestIdleCallback(startAnimation);
    } else {
      setTimeout(startAnimation, 500);
    }
  }, [animationsReady]);

  // Horizon stars using data attribute (disabled for mobile)
  useEffect(() => {
    if (!containerRef.current || !animationsReady || !isInView) return;

    const horizonContainer = containerRef.current.querySelector(
      "[data-cosmic-horizon]"
    );
    if (!horizonContainer) return;

    const frequency = 250; // Original frequency
    const maxStars = 15; // Original count
    let activeStars = 0;
    let isScrolling = false;
    let scrollTimer;
    let animationFrameId;

    // Pause during active scrolling
    const handleScroll = () => {
      isScrolling = true;
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        isScrolling = false;
      }, 150);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    const createHorizonStar = () => {
      if (activeStars >= maxStars || isScrolling) return;

      activeStars++;
      const star = document.createElement("div");
      star.className = styles.horizonStar;
      const size = gsap.utils.random(1, 6); // Original size range
      Object.assign(star.style, {
        position: "absolute",
        bottom: "20vh",
        left: `${gsap.utils.random(0, 100)}%`,
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: "50%",
        background: "rgba(255,215,0,0.9)",
        filter: "drop-shadow(0 0 4px rgba(255,215,0,0.8))",
        willChange: "transform, opacity",
      });

      if (horizonContainer) {
        horizonContainer.appendChild(star);

        // Original animation sequence
        gsap.fromTo(
          star,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.5,
            onComplete: () => {
              gsap.to(star, {
                y: -150, // Original distance
                x: gsap.utils.random(-80, 80), // Original spread
                duration: gsap.utils.random(2, 3), // Original duration
                ease: "power1.out",
                onComplete: () => {
                  gsap.to(star, {
                    opacity: 0,
                    duration: 0.8,
                    onComplete: () => {
                      star.remove();
                      activeStars--;
                    },
                  });
                },
              });
            },
          }
        );
      } else {
        activeStars--;
      }
    };

    // Wait before starting to avoid scroll conflicts
    const startTimer = setTimeout(() => {
      const interval = setInterval(createHorizonStar, frequency);
      return () => {
        clearInterval(interval);
        window.removeEventListener("scroll", handleScroll);
      };
    }, 1000); // Delay start

    return () => {
      clearTimeout(startTimer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [animationsReady, isInView]);

  // Text animations - show immediately, animate entrance only once (disabled for mobile)
  useEffect(() => {
    if (!containerRef.current) return;

    const text1 = containerRef.current.querySelector("[data-cosmic-text-1]");
    const text2 = containerRef.current.querySelector("[data-cosmic-text-2]");
    const text3 = containerRef.current.querySelector("[data-cosmic-text-3]");

    if (!text1 || !text2 || !text3) return;

    const isMobile = window.innerWidth <= 600;

    // Immediately show text with glow (no waiting for scroll)
    gsap.set([text1, text2, text3], {
      opacity: 1,
      x: 0,
      y: 0,
    });

    // On mobile, skip entrance animations completely
    if (isMobile) return;

    // Only run entrance animation once, when section comes into view (desktop only)
    if (!animationsReady) return;

    const setupEntranceAnimation = () => {
      const hasAnimated = text1.getAttribute("data-animated");
      if (hasAnimated) return; // Don't animate again

      const ctx = gsap.context(() => {
        // Create entrance animation timeline (runs once)
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
            once: true, // Critical: only trigger once ever
            onComplete: () => {
              // Mark as animated to prevent re-animation
              text1.setAttribute("data-animated", "true");
              text2.setAttribute("data-animated", "true");
              text3.setAttribute("data-animated", "true");
            },
          },
        });

        // Animate from offscreen positions to final positions
        tl.fromTo(
          text1,
          { x: -200, opacity: 0 },
          { x: 0, opacity: 1, duration: 1, ease: "power2.out" }
        )
          .fromTo(
            text2,
            { x: 200, opacity: 0 },
            { x: 0, opacity: 1, duration: 1, ease: "power2.out" },
            "-=0.4"
          )
          .fromTo(
            text3,
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, ease: "power2.out" },
            "-=0.4"
          );
      }, containerRef.current);

      return () => ctx.revert();
    };

    if (window.requestIdleCallback) {
      window.requestIdleCallback(setupEntranceAnimation);
    } else {
      setTimeout(setupEntranceAnimation, 300);
    }
  }, [animationsReady]);

  return (
    <>
      <div className={styles.cosmicContainer} ref={containerRef}>
        {/* Stars Layer */}
        <div data-cosmic-stars className={styles.cosmicStarsLayer}>
          {stars.map((star, i) => (
            <span
              key={i}
              className={styles.cosmicStar}
              style={{
                top: `${star.top}%`,
                left: `${star.left}%`,
                opacity: star.opacity,
              }}
            />
          ))}
        </div>

        {/* Shooting stars - Only visible on screens > 600px */}
        {isClient && (
          <>
            <span className={styles.shootingStar}></span>
            <span className={styles.shootingStar}></span>
          </>
        )}

        <div data-cosmic-horizon />

        {/* Arc with animated gradient overlay */}
        <div className={styles.cosmicArcContainer}>
          <div data-cosmic-circle className={styles.cosmicArcCircle} />
        </div>

        {/* Content */}
        <div className={styles.cosmicContent}>
          <div className={styles.imageContainer}>
            <Image src={memorae} alt="Memorae" data-cosmic-image />
          </div>
          <h1 className={styles.glowText} data-cosmic-text-1>
            {model?.cosmic?.title || "Tu caos"}
          </h1>
          <h1 className={styles.glowTextTwo} data-cosmic-text-2>
            {model?.cosmic?.subtitle || "Tu plan"}
          </h1>
          <p className={styles.glowTextThree} data-cosmic-text-3>
            {(() => {
              const desc =
                model?.cosmic?.description ||
                "Elige cómo quieres que Memorae te ayude a no perder la cabeza.";
              const parts = desc.split(" ");
              const midPoint = Math.ceil(parts.length / 2);
              return (
                <>
                  {parts.slice(0, midPoint).join(" ")}
                  <br />
                  {parts.slice(midPoint).join(" ")}
                </>
              );
            })()}
          </p>
        </div>
      </div>
    </>
  );
}
