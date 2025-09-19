'use client';
import { useEffect } from "react";
import { gsap, ScrollTrigger } from "@/utils/gsap";

export function useTestimonialsTimeline(containerRef) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container || typeof window === 'undefined') return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;

    // Simple scroll-based animations that complement the existing CSS marquee
    const title = container.querySelector('[data-testimonial-title]');
    const subtitle = container.querySelector('[data-testimonial-subtitle]');
    const carousel = container.querySelector('[data-testimonial-carousel]');

    if (!title || !subtitle) return;

    // Fade in animations on scroll
    gsap.fromTo(title, 
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: container,
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      }
    );

    gsap.fromTo(subtitle, 
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        delay: 0.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: container,
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      }
    );

    if (carousel) {
      gsap.fromTo(carousel, 
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          delay: 0.4,
          ease: "power2.out",
          scrollTrigger: {
            trigger: container,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [containerRef]);
}