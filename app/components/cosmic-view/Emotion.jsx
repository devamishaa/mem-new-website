"use client";
import { useRef, useEffect, useState } from "react";
import memorae from "../../../public/homepage/smily_memorae.png";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslation } from "@/hooks/useTranslation";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

export default function CosmicLanding({ model }) {
  const containerRef = useRef(null);
  const [stars, setStars] = useState([]);
  const [isInView, setIsInView] = useState(false);
  const [animationsReady, setAnimationsReady] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const { t } = useTranslation();

  //   useCosmicTimeline(containerRef, model);
  // Horizon stars using data attribute (disabled for mobile)
  useEffect(() => {
    if (!containerRef.current || !animationsReady || !isInView) return;

    // const isMobile = window.innerWidth <= 600;
    // if (isMobile) return; // Disable horizon stars completely on mobile

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
      star.className = "horizonStar";
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

  // Arc and text scroll trigger animations
  useEffect(() => {
    if (!containerRef.current || typeof window === "undefined") return;

    // Wait for next tick to avoid hydration mismatch
    const timer = setTimeout(() => {
      const arcElement =
        containerRef.current.querySelector("[data-cosmic-arc]");
      const text1Element = containerRef.current.querySelector(
        "[data-cosmic-text-1]"
      );
      const text2Element = containerRef.current.querySelector(
        "[data-cosmic-text-2]"
      );

      if (!arcElement || !text1Element || !text2Element) return;

      // Set initial states
      gsap.set(arcElement, {
        scaleY: 0,
        transformOrigin: "bottom center",
      });

      gsap.set(text1Element, {
        x: -200,
        opacity: 0,
      });

      gsap.set(text2Element, {
        x: 200,
        opacity: 0,
      });

      // Create scroll trigger animations
      const scrollTrigger = ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top 80%",
        end: "bottom 20%",
        scrub: 1,
        onEnter: () => {
          // Arc animation
          gsap.to(arcElement, {
            scaleY: 1,
            duration: 1.5,
            ease: "power2.out",
          });

          // Text 1 animation (from left)
          gsap.to(text1Element, {
            x: -30, // Move slightly left from center
            opacity: 1,
            duration: 1.2,
            ease: "power2.out",
            delay: 0.3,
          });

          // Text 2 animation (from right)
          gsap.to(text2Element, {
            x: 30, // Move slightly right from center
            opacity: 1,
            duration: 1.2,
            ease: "power2.out",
            delay: 0.6,
          });
        },
        onLeave: () => {
          gsap.to(arcElement, {
            scaleY: 0,
            duration: 1,
            ease: "power2.in",
          });

          gsap.to(text1Element, {
            x: -200,
            opacity: 0,
            duration: 0.8,
            ease: "power2.in",
          });

          gsap.to(text2Element, {
            x: 200,
            opacity: 0,
            duration: 0.8,
            ease: "power2.in",
          });
        },
        onEnterBack: () => {
          gsap.to(arcElement, {
            scaleY: 1,
            duration: 1.5,
            ease: "power2.out",
          });

          gsap.to(text1Element, {
            x: -30, // Move slightly left from center
            opacity: 1,
            duration: 1.2,
            ease: "power2.out",
            delay: 0.3,
          });

          gsap.to(text2Element, {
            x: 30, // Move slightly right from center
            opacity: 1,
            duration: 1.2,
            ease: "power2.out",
            delay: 0.6,
          });
        },
        onLeaveBack: () => {
          gsap.to(arcElement, {
            scaleY: 0,
            duration: 1,
            ease: "power2.in",
          });

          gsap.to(text1Element, {
            x: -200,
            opacity: 0,
            duration: 0.8,
            ease: "power2.in",
          });

          gsap.to(text2Element, {
            x: 200,
            opacity: 0,
            duration: 0.8,
            ease: "power2.in",
          });
        },
      });

      return () => {
        scrollTrigger.kill();
      };
    }, 0);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => setIsClient(true), []);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.1) {
            setIsInView(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "100px 0px" }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isInView) return;
    requestAnimationFrame(() => {
      const isMobile = window.innerWidth <= 600;
      const starCount = isMobile ? 0 : window.innerWidth > 1200 ? 60 : 25;
      const generated = Array.from({ length: starCount }, () => ({
        top: Math.random() * 100,
        left: Math.random() * 100,
        opacity: Math.random() * 0.8 + 0.2,
      }));
      setStars(generated);
      if (isMobile) {
        setAnimationsReady(true);
        return;
      }
      setTimeout(() => setAnimationsReady(true), 100);
    });
  }, [isInView]);

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#0a0a0a] via-[#1a1a2e] via-[#16213e] to-[#0f3460] text-white"
    >
      {/* Stars */}
      <div className="absolute inset-0 z-0">
        {stars.map((star, i) => (
          <span
            key={i}
            className="absolute w-[2px] h-[2px] rounded-full bg-white animate-[gentleStarTwinkle_2s_infinite_alternate_ease-in-out]"
            style={{
              top: `${star.top}%`,
              left: `${star.left}%`,
              opacity: star.opacity,
            }}
          />
        ))}
      </div>

      {/* Shooting stars */}
      {isClient && window.innerWidth > 600 && (
        <>
          <span className="shootingStar"></span>
          <span className="shootingStar"></span>
        </>
      )}

      {/* Horizon */}
      <div
        data-cosmic-horizon
        className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[horizonGlow_4s_ease-in-out_infinite_alternate]"
      />

      {/* Arc */}
      <div
        data-cosmic-arc
        className="absolute bottom-0 left-1/2 w-[150vw] h-[20vh] -translate-x-1/2 rounded-t-[40%] sm:rounded-t-[60%] lg:rounded-t-[80%] z-10"
      >
        <div className="absolute inset-0 w-[150vw] h-[90vh] left-1/2 -translate-x-1/2 rounded-t-[30%] sm:rounded-t-[40%] lg:rounded-t-[60%] bg-[#090d10] shadow-[0_-50px_100px_-40px_#ff9cd9,0_-20px_60px_-20px_rgba(255,102,196,0.5),0_-10px_30px_-10px_rgba(2,1,1,0.3)] animate-[shadowShift_6s_ease-in-out_infinite_alternate]" />
      </div>
      <div className="mb-8 absolute mt-10 left-[50%]">
        <Image
          src={memorae}
          alt="Memorae"
          data-cosmic-image
          className="mx-auto animate-[slowBounce_3s_ease-in-out_infinite]"
        />
      </div>
      {/* Content */}
      <div className="relative z-20 flex min-h-screen flex-col items-center justify-center px-4 pt-12 pb-20 text-center">
        <h1
          data-cosmic-text-1
          className="sm:text-7xl text-5xl font-bold text-white font-figtree"
        >
          {t("cosmic.title")}
        </h1>

        <h1
          data-cosmic-text-2
          className="mt-4 sm:text-7xl text-5xl font-bold text-white font-figtree"
        >
          {t("cosmic.subtitle")}
        </h1>

        <p
          data-cosmic-text-3
          className="mt-6 text-lg leading-relaxed font-figtree"
        >
          {(() => {
            const desc = t("cosmic.description");
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
  );
}
