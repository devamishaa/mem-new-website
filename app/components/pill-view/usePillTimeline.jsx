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
      y: "-100vh",
    });
    gsap.set(`.${styles.floatingObject}`, {
      opacity: 0,
      scale: 0,
      y: -50,
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

    // Downward motion is now a separate, scrubbed animation
    const isMobile = window.innerWidth <= 768;
    const yValue = isMobile ? "26vh" : "32vh";

    // gsap.to(pillImage, {
    //   y: yValue,
    //   scale: 1.2,
    //   ease: "none",
    //   scrollTrigger: {
    //     trigger: `.${styles.svgScrollWrapper}`,
    //     start: "center center",
    //     end: "bottom top",
    //     scrub: 1,
    //   },
    // });
    // Downward motion for pill image + wave trigger
    gsap.to(pillImage, {
      y: yValue,
      scale: 1.2,
      ease: "none",
      scrollTrigger: {
        trigger: `.${styles.svgScrollWrapper}`,
        start: "center center",
        end: "bottom top",
        scrub: 1,
        onLeave: () => {
          // जब image बैठ गई → waves शुरू करो
          waveAnims = gsap.utils.toArray(`.${styles.wave}`).map((wave, i) => {
            return gsap.fromTo(
              wave,
              { scale: 0.5, opacity: 0.6 },
              {
                scale: isMobile ? 2 : 4,
                opacity: 0,
                duration: 4,
                delay: i * 2,
                repeat: -1,
                ease: "power2.out",
              }
            );
          });
        },
        onEnterBack: () => {
          // जब ऊपर लौटे → waves हटा दो
          waveAnims.forEach((anim) => anim.kill());
          waveAnims = [];
          gsap.set(`.${styles.wave}`, { opacity: 0 });
        },
      },
    });

    // Wave text animation
    const waveTextElements = container.querySelectorAll(`.${styles.waveText}`);
    gsap.to(waveTextElements, {
      opacity: 1,
      y: 0,
      stagger: 0.2,
      scrollTrigger: {
        trigger: `.${styles.svgScrollWrapper}`,
        start: "center center",
        end: "center center+=20%",
        scrub: true,
      },
    });

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
    // Animate section scale
    // sectionScaleTl.fromTo(
    //   section,
    //   { scale: 1, transformOrigin: "center top" },
    //   { scale: 1, duration: 1.2, ease: "power2.out" },
    //   0
    // );

    // sectionScaleTl.to(section, {
    //   scale: 0.942,
    //   transformOrigin: "center top",
    //   ease: "power2.in",
    // });

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
