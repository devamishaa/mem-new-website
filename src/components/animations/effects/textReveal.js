import { gsap } from "@/utils/gsap";

// Split text into words and wrap each in a span with optimized DOM manipulation
function splitTextIntoWords(element) {
  // Cache the original text and avoid multiple DOM reads
  const text = element.textContent;
  const words = text.split(" ");

  // Use document fragment for better performance
  const fragment = document.createDocumentFragment();
  const wordSpans = [];

  words.forEach((word, index) => {
    // Create outer wrapper span
    const outerSpan = document.createElement("span");
    outerSpan.style.cssText = "display: inline-block; overflow: hidden;";

    // Create inner span for animation
    const innerSpan = document.createElement("span");
    innerSpan.style.cssText =
      "display: inline-block; transform: translateY(100%);";
    innerSpan.textContent = word;

    outerSpan.appendChild(innerSpan);
    fragment.appendChild(outerSpan);
    wordSpans.push(innerSpan);

    // Add space between words (except for the last word)
    if (index < words.length - 1) {
      fragment.appendChild(document.createTextNode(" "));
    }
  });

  // Single DOM write operation
  element.innerHTML = "";
  element.appendChild(fragment);

  return wordSpans;
}

export function createTextReveal(
  el,
  {
    start = "top 85%",
    duration = 0.7,
    ease = "power3.out",
    once = true,
    immediate = false,
    delay = 0,
  } = {}
) {
  // Split text into words for character-by-character reveal
  const wordSpans = splitTextIntoWords(el);

  if (immediate) {
    return gsap.to(wordSpans, {
      y: 0,
      duration: duration,
      ease: ease,
      delay: delay,
      stagger: 0.08, // Stagger each word by 80ms
    });
  }

  return gsap.to(wordSpans, {
    y: 0,
    duration: duration,
    ease: ease,
    stagger: 0.08,
    scrollTrigger: {
      trigger: el,
      start,
      end: "+=1",
      once,
    },
  });
}
