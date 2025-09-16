"use client";
import { useEffect } from "react";
import { gsap, ScrollTrigger } from "@/utils/gsap";

export function usePillTimeline(containerRef, sectionRef, styles, isMobile) {
  useEffect(() => {
    const container = containerRef.current;
    const section = sectionRef.current;
    if (!container || !section || typeof window === "undefined") return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    const parallaxAnims = [];
    // Parallax elements
    const parallaxElements = container.querySelectorAll("[data-parallax]");
    parallaxElements.forEach((el) => {
      const speed = Number(el.getAttribute("data-parallax")) || 0.25;
      const animation = gsap.fromTo(
        el,
        { yPercent: -speed * 20 },
        {
          yPercent: speed * 20,
          ease: "none",
          immediateRender: false,
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
      parallaxAnims.push(animation);
    });

    // Initially hide the waves and text elements
    gsap.set(`.${styles.wave}`, { opacity: 0 });
    gsap.set(`.${styles.waveText}`, { opacity: 0 });

    // Set initial position of the image high up
    gsap.set(container.querySelector("[data-pill-image]"), {
      y: "-10vh",
    });

    // Set initial state for floating objects - hide them initially
    gsap.set(`.${styles.floatingObject}`, {
      opacity: 0,
      scale: 0.5,
      y: 30,
    });

    // Floating animation for continuous looping
    const floatTl = gsap.to(`.${styles.floatingObject}`, {
      y: "+=15",
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      paused: true,
    });

    // Floating animation will be triggered when image settles down

    let waveAnims = [];
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: `.${styles.svgScrollWrapper}`,
        scrub: 1.2,
        start: "top 20%",
        end: "+=600",
        pinSpacing: false,
        anticipatePin: 0,
        invalidateOnRefresh: true,
      },
    });

    // SVG rotation
    tl.fromTo(
      container.querySelector("[data-pill-svg]"),
      { rotateY: -50 },
      {
        rotateY: 0,
        ease: "power2.out",
        duration: 2,
      },
      0
    );

    // Gradients - much faster transitions
    const stop1 = container.querySelector("[data-gradient-stop1]");
    const stop2 = container.querySelector("[data-gradient-stop2]");
    tl.to(stop1, { stopColor: "#0F1417", duration: 0.9 }, 0)
      .to(stop2, { stopColor: "#090C0D", duration: 0.9 }, 0)
      .to(stop1, { stopColor: "#0F1417", duration: 0.9 }, 2)
      .to(stop2, { stopColor: "#0F1417", duration: 0.9 }, 2)
      .to(stop1, { stopColor: "#481B34", duration: 0.8 }, 4)
      .to(stop2, { stopColor: "#090C0D", duration: 0.9 }, 4)
      .to(stop1, { stopColor: "#FF1A99", duration: 0.9 }, 6.5)
      .to(stop2, { stopColor: "#8921CA", duration: 0.9 }, 6.5);

    // Main image animation (emerge) - moved earlier
    const pillImage = container.querySelector("[data-pill-image]");
    tl.fromTo(
      pillImage,
      { x: "1vw", opacity: 0, rotate: -50 },
      {
        x: "-3vw",
        opacity: 1,
        rotate: 0,
        ease: "power3.out",
        duration: 3,
      },
      6 // Changed from 9 to 6 - appears much earlier
    );

    // Floating objects will be animated when image settles down

    // Downward motion is now a separate, scrubbed animation
    const yValue = isMobile ? "20vh" : "32vh";

    // Downward motion for pill image + wave trigger
    gsap.fromTo(
      pillImage,
      { y: "-100vh", scale: 1 }, // start
      {
        y: yValue, // end (dynamic)
        scale: 1.2,
        ease: "none",
        scrollTrigger: {
          trigger: `.${styles.svgScrollWrapper}`,
          start: "center center",
          end: "bottom top",
          scrub: 1,
          onLeave: () => {
            // जब image बैठ गई → waves शुरू करो
            const vw = typeof window !== "undefined" ? window.innerWidth : 1440;
            const waveScale = vw <= 600 ? 2.3 : vw <= 1024 ? 1.8 : 4; // mobile / tablet / desktop
            waveAnims = gsap.utils.toArray(`.${styles.wave}`).map((wave, i) => {
              return gsap.fromTo(
                wave,
                { scale: 0.5, opacity: 0.6 },
                {
                  scale: waveScale,
                  opacity: 0,
                  duration: 4,
                  delay: i * 2,
                  repeat: -1,
                  ease: "power2.out",
                }
              );
            });

            // जब image बैठ गई → floating objects भी दिखाओ
            gsap.to(`.${styles.floatingObject}`, {
              opacity: 1,
              scale: 1,
              y: 0,
              rotate: 0,
              duration: 1.5,
              stagger: 0.2,
              ease: "back.out(1.7)",
              onComplete: () => {
                // Start floating animation after objects appear
                floatTl.play();
              },
            });

            // जब image बैठ गई → text भी दिखाओ with beautiful animations
            const waveTextElements = container.querySelectorAll(
              `.${styles.waveText}`
            );
            waveTextElements.forEach((textEl, index) => {
              // Animate text appearance with fade effects
              if (index === 0) {
                // First text: Fade in with slide from left
                gsap.fromTo(
                  textEl,
                  {
                    opacity: 0,
                    x: -80,
                    y: 20,
                    scale: 0.9,
                    filter: "blur(10px)",
                  },
                  {
                    opacity: 1,
                    x: 0,
                    y: 0,
                    scale: 1,
                    filter: "blur(0px)",
                    duration: 2,
                    ease: "power2.out",
                    delay: 0.5 + index * 0.3,
                  }
                );
              } else if (index === 1) {
                // Second text: Fade in with slide from right
                gsap.fromTo(
                  textEl,
                  {
                    opacity: 0,
                    x: 80,
                    y: 20,
                    scale: 0.9,
                    filter: "blur(10px)",
                  },
                  {
                    opacity: 1,
                    x: 0,
                    y: 0,
                    scale: 1,
                    filter: "blur(0px)",
                    duration: 2,
                    ease: "power2.out",
                    delay: 0.5 + index * 0.3,
                  }
                );
              } else {
                // Other texts: Fade in with scale up
                gsap.fromTo(
                  textEl,
                  {
                    opacity: 0,
                    y: 30,
                    scale: 0.8,
                    filter: "blur(8px)",
                    transformOrigin: "center center",
                  },
                  {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    filter: "blur(0px)",
                    duration: 2,
                    ease: "power2.out",
                    delay: 0.5 + index * 0.3,
                  }
                );
              }

              // Add word-by-word reveal animation with fade effects
              const textContent = textEl.querySelector("p");
              if (textContent) {
                // Split text into words and wrap each word in a span with fade effects
                const words = textContent.textContent.split(" ");
                textContent.innerHTML = words
                  .map(
                    (word) =>
                      `<span style="display: inline-block; opacity: 0; transform: translateY(20px) scale(0.8); filter: blur(5px);">${word}</span>`
                  )
                  .join(" ");

                // Animate each word with fade and scale effects
                const wordSpans = textContent.querySelectorAll("span");
                gsap.to(wordSpans, {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  filter: "blur(0px)",
                  duration: 0.8,
                  stagger: 0.15,
                  ease: "power2.out",
                  delay: 1.5 + index * 0.3, // Start after text element appears
                });
              }

              // Add continuous subtle floating animation after text appears
              gsap.to(textEl, {
                y: "+=10",
                duration: 2,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                delay: 2.5 + index * 0.3, // Start after text and words appear
              });
            });
          },
          onEnterBack: () => {
            // when going back → waves also hide
            waveAnims.forEach((anim) => anim.kill());
            waveAnims = [];
            gsap.set(`.${styles.wave}`, { opacity: 0 });

            // when going back → floating objects also hide
            floatTl.pause();
            gsap.set(`.${styles.floatingObject}`, {
              opacity: 0,
              scale: 0.5,
              y: 30,
            });

            // when going back → text also hide
            gsap.set(`.${styles.waveText}`, {
              opacity: 0,
              x: 0,
              y: 0,
              scale: 1,
              filter: "blur(0px)",
            });
          },
        },
      }
    );

    // Text animations are now handled when image settles down

    // Section scaling animation (moved from PillView component)
    const sectionScaleTl = gsap.timeline({
      scrollTrigger: {
        // start: "top 90%", // Start when section is 90% from the top
        // end: "bottom 80%", // End when section is 80% from the top
        // scrub: 1, // Smoothly sync with scroll
        // toggleActions: "play none none reverse", // Play on enter, reverse on leave
        trigger: section,
        scrub: 1.2,
        start: "top top",
        end: "center center",
        fastScrollEnd: true,
        pin: true,
        pinSpacing: true,
        invalidateOnRefresh: true,
      },
    });

    sectionScaleTl.fromTo(
      section,
      { scale: 1, transformOrigin: "center top" },
      { scale: 0.942, transformOrigin: "center top", ease: "power2.in" }
    );

    // Cursor-following hover effect for floating objects
    const cleanupFunctions = [];
    const floatingObjects = container.querySelectorAll("[data-float-obj]");
    floatingObjects.forEach((floatObj) => {
      if (!floatObj) return; // Skip if element is null

      const handleMouseMove = (e) => {
        floatTl.pause(); // Pause floating animation during hover
        const rect = floatObj.getBoundingClientRect();
        const offsetX = e.clientX - rect.left - rect.width / 2;
        const offsetY = e.clientY - rect.top - rect.height / 2;
        gsap.to(floatObj, {
          x: offsetX * 0.4, // Slightly reduced scaling for smoother movement
          y: offsetY * 0.4,
          duration: 0.5, // Increased duration for smoother transition
          ease: "elastic.out(1, 0.7)", // Bouncier easing
          overwrite: "auto",
        });
      };

      const handleMouseLeave = () => {
        gsap.to(floatObj, {
          x: 0,
          y: 0,
          duration: 0.8, // Increased duration for bouncier return
          ease: "elastic.out(1, 0.5)", // Enhanced bounce effect
          onComplete: () => floatTl.play(),
        });
      };

      floatObj.addEventListener("mousemove", handleMouseMove);
      floatObj.addEventListener("mouseleave", handleMouseLeave);

      // Store cleanup function for this floatObj
      cleanupFunctions.push(() => {
        floatObj.removeEventListener("mousemove", handleMouseMove);
        floatObj.removeEventListener("mouseleave", handleMouseLeave);
      });
    });

    // Cleanup GSAP animations and event listeners
    return () => {
      waveAnims.forEach((anim) => anim.kill());
      tl.kill();
      sectionScaleTl.kill();
      floatTl.kill();
      cleanupFunctions.forEach((cleanup) => cleanup());
      parallaxAnims.forEach((anim) => anim.kill());
    };
  }, [containerRef, sectionRef, styles, isMobile]);
}
