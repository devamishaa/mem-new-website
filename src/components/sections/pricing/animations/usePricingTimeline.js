"use client";
import { useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/utils/gsap";

function shouldSkipAnimations(container) {
  if (!container || typeof window === "undefined") return true;
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches)
    return true;
  if (window.innerWidth <= 600) return true; // Skip animations on mobile screens
  return false;
}

function setupCardRevealAnimations(container) {
  const cards = container.querySelectorAll("[data-plan-card]");
  const features = container.querySelectorAll("[data-feature-item]");

  if (cards.length === 0) return null;

  const isMobile = window.innerWidth <= 600;

  if (isMobile) {
    // On mobile, set elements to visible state immediately
    gsap.set(cards, {
      opacity: 1,
      y: 0,
      scale: 1,
    });

    gsap.set(features, {
      opacity: 1,
      x: 0,
    });
  } else {
    // Set initial states for desktop animations
    gsap.set(cards, {
      opacity: 0,
      y: 50,
      scale: 0.95,
    });

    gsap.set(features, {
      opacity: 0,
      x: -30,
    });
  }

  return { cards, features };
}

function setupBillingToggleAnimation(container) {
  const monthlyBtn = container.querySelector('[data-billing-type="monthly"]');
  const annualBtn = container.querySelector('[data-billing-type="annual"]');
  const priceElements = container.querySelectorAll("[data-price]");
  const oldPriceElements = container.querySelectorAll("[data-old-price]");

  if (!monthlyBtn || !annualBtn) return null;

  const isMobile = window.innerWidth <= 600;

  const handleBillingChange = (isAnnual) => {
    // Update button states
    [monthlyBtn, annualBtn].forEach((btn) => {
      btn.classList.remove("active");
      btn.setAttribute("aria-selected", "false");
    });

    const activeBtn = isAnnual ? annualBtn : monthlyBtn;
    activeBtn.classList.add("active");
    activeBtn.setAttribute("aria-selected", "true");

    // Skip animations on mobile
    if (isMobile) return;

    // Animate price changes (desktop only)
    const tl = gsap.timeline();

    tl.to([...priceElements, ...oldPriceElements], {
      scale: 0.8,
      opacity: 0.5,
      duration: 0.15,
      ease: "power2.out",
    })
      .set([...priceElements, ...oldPriceElements], {
        // Update prices based on billing type
        // In a real implementation, this would update the actual text content
      })
      .to([...priceElements, ...oldPriceElements], {
        scale: 1,
        opacity: 1,
        duration: 0.2,
        ease: "back.out(1.7)",
      });
  };

  // Add click handlers
  monthlyBtn.addEventListener("click", () => handleBillingChange(false));
  annualBtn.addEventListener("click", () => handleBillingChange(true));

  return { handleBillingChange };
}

function setupPlanSelectionAnimation(container) {
  const cards = container.querySelectorAll("[data-plan-card]");
  const featuresContainer = container.querySelector("[data-features-list]");

  if (cards.length === 0) return null;

  const isMobile = window.innerWidth <= 600;

  const handlePlanSelection = (selectedPlan) => {
    // Update card states
    cards.forEach((card) => {
      const planKey = card.getAttribute("data-plan-card");
      const isSelected = planKey === selectedPlan;

      // Skip animations on mobile
      if (isMobile) return;

      gsap.to(card, {
        scale: isSelected ? 1.05 : 1,
        y: isSelected ? -10 : 0,
        boxShadow: isSelected
          ? "0 20px 40px rgba(0,0,0,0.1)"
          : "0 5px 15px rgba(0,0,0,0.05)",
        duration: 0.3,
        ease: "power2.out",
      });
    });

    // Skip feature animations on mobile
    if (isMobile || !featuresContainer) return;

    // Animate features update (desktop only)
    gsap.to(featuresContainer, {
      opacity: 0,
      y: 20,
      duration: 0.2,
      ease: "power2.out",
      onComplete: () => {
        // Features content would be updated here
        gsap.to(featuresContainer, {
          opacity: 1,
          y: 0,
          duration: 0.3,
          ease: "power2.out",
        });
      },
    });
  };

  // Add click handlers to cards
  cards.forEach((card) => {
    card.addEventListener("click", () => {
      const planKey = card.getAttribute("data-plan-card");
      handlePlanSelection(planKey);
    });
  });

  return { handlePlanSelection };
}

export function usePricingTimeline(containerRef) {
  const timelineRef = useRef();

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (shouldSkipAnimations(container)) return;

    const timer = setTimeout(() => {
      const elements = setupCardRevealAnimations(container);
      const billingAnimation = setupBillingToggleAnimation(container);
      const planSelectionAnimation = setupPlanSelectionAnimation(container);

      if (!elements) return;

      const ctx = gsap.context(() => {
        // Main reveal timeline
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: container,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
            id: "pricingReveal",
          },
        });

        // Animate cards in sequence
        tl.to(elements.cards, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "back.out(1.7)",
        }).to(
          elements.features,
          {
            opacity: 1,
            x: 0,
            duration: 0.4,
            stagger: 0.05,
            ease: "power2.out",
          },
          "-=0.3"
        );

        timelineRef.current = tl;
      }, container);

      return () => {
        ctx.revert();
      };
    }, 100);

    return () => {
      clearTimeout(timer);
    };
  }, [containerRef]);

  return {
    timeline: timelineRef.current,
  };
}
