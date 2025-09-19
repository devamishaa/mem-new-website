import { gsap } from "@/utils/gsap";

export function createFloat(
  el,
  { duration = 3, distance = 20, ease = "sine.inOut", delay = 0 } = {}
) {
  return gsap.to(el, {
    y: distance,
    duration: duration,
    ease: ease,
    delay: delay,
    yoyo: true,
    repeat: -1,
  });
}
