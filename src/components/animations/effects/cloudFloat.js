import { gsap } from "@/utils/gsap";

export function createCloudFloat(
  el,
  {
    duration = 8,
    xDistance = 15,
    yDistance = 20,
    rotateDistance = 3,
    delay = 0,
  } = {}
) {
  const tl = gsap.timeline({ repeat: -1, yoyo: true });

  tl.to(el, {
    x: xDistance,
    y: yDistance,
    rotation: rotateDistance,
    duration: duration,
    ease: "sine.inOut",
    delay: delay,
  });

  return tl;
}
