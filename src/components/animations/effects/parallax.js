import { gsap } from "@/utils/gsap";

export function createParallax(
  el,
  { speed = 0.25, start = "top bottom", end = "bottom top" } = {}
) {
  const s = Number(el.getAttribute("data-parallax") || speed) || speed;
  return gsap.fromTo(
    el,
    { yPercent: -s * 20 },
    {
      yPercent: s * 20,
      ease: "none",
      scrollTrigger: { trigger: el, start, end, scrub: true },
    }
  );
}
