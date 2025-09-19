"use client";

import { useEffect } from "react";
import { gsap } from "@/utils/gsap";

export function useFooterTimeline(containerRef) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container || typeof window === "undefined") return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      // Social icons hover animations
      const icons = container.querySelectorAll("[data-footer-social-icon]");
      
      icons.forEach((icon) => {
        const tl = gsap.timeline({ paused: true });
        tl.to(icon, {
          y: -8,
          scale: 1.2,
          duration: 0.2,
          ease: "power2.out",
        }).to(icon, {
          y: 0,
          scale: 1,
          duration: 0.4,
          ease: "bounce.out",
        });

        icon.addEventListener("mouseenter", () => tl.restart());
      });

      // Footer links hover animations
      const footerLinks = container.querySelectorAll("[data-footer-links] a");
      footerLinks.forEach((link) => {
        const hoverTl = gsap.timeline({ paused: true });
        hoverTl.to(link, {
          scale: 1.05,
          duration: 0.2,
          ease: "power2.out",
        });

        link.addEventListener("mouseenter", () => hoverTl.play());
        link.addEventListener("mouseleave", () => hoverTl.reverse());
      });
    }, container);

    return () => ctx.revert();
  }, [containerRef]);
}