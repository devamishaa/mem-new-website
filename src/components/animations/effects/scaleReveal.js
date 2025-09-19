import { gsap, ScrollTrigger } from "@/utils/gsap";

export function createScaleReveal(el, opts = {}) {
  const {
    start = "top 85%",
    duration = 2.0,
    delay = 0,
    once = true,
    y = 0,
    scale = 0.6,
    ease = "cubic-bezier(.19, 1, .22, 1)",
  } = opts;
  return gsap.fromTo(
    el,
    { opacity: 0, y, scale },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration,
      delay,
      ease,
      scrollTrigger: { trigger: el, start, end: "+=1", once },
    }
  );
}

export function batchScaleReveal(nodes, opts = {}) {
  const list = gsap.utils.toArray(nodes);
  if (!list.length) return null;

  // If immediate is true, animate right away without ScrollTrigger
  if (opts.immediate) {
    list.forEach((el) => {
      const delay = Number(el.getAttribute("data-reveal-delay") || 0) || 0;
      createScaleRevealImmediate(el, { ...opts, delay });
    });
    return null;
  }

  return ScrollTrigger.batch(list, {
    start: opts.start ?? "top 85%",
    once: opts.once ?? true,
    onEnter: (batch) =>
      batch.forEach((el) =>
        createScaleReveal(el, {
          ...opts,
          delay: Number(el.getAttribute("data-reveal-delay") || 0) || 0,
        })
      ),
  });
}

export function createScaleRevealImmediate(el, opts = {}) {
  const {
    duration = 2.0,
    delay = 0,
    y = 0,
    scale = 0.6,
    ease = "cubic-bezier(.19, 1, .22, 1)",
  } = opts;
  return gsap.fromTo(
    el,
    { opacity: 0, y, scale },
    { opacity: 1, y: 0, scale: 1, duration, delay, ease }
  );
}
