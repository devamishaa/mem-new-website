import Image from "next/image";
import Button from "../common/Button";
import FeatureCard from "./FeatureCard";
import { useMemo, useRef, useEffect, useState } from "react";
import clsx from "clsx"; // Recommended for conditional classes: npm install clsx
import { useTranslation } from "@/hooks/useTranslation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Random gradient colors for border with radial gradient from bottom
const getGradientColors = (index) => {
  const gradients = [
    "radial-gradient(50% 100% at 50% 100%, #946CF5 0%, rgba(79, 53, 79, 0.00) 100%)",
    "radial-gradient(50% 100% at 50% 100%, #FF6B6B 0%, rgba(255, 107, 107, 0.00) 100%)",
    "radial-gradient(50% 100% at 50% 100%, #4ECDC4 0%, rgba(78, 205, 196, 0.00) 100%)",
    "radial-gradient(50% 100% at 50% 100%, #45B7D1 0%, rgba(69, 183, 209, 0.00) 100%)",
    "radial-gradient(50% 100% at 50% 100%, #96CEB4 0%, rgba(150, 206, 180, 0.00) 100%)",
    "radial-gradient(50% 100% at 50% 100%, #FECA57 0%, rgba(254, 202, 87, 0.00) 100%)",
    "radial-gradient(50% 100% at 50% 100%, #FF9FF3 0%, rgba(255, 159, 243, 0.00) 100%)",
    "radial-gradient(50% 100% at 50% 100%, #54A0FF 0%, rgba(84, 160, 255, 0.00) 100%)",
    "radial-gradient(50% 100% at 50% 100%, #5F27CD 0%, rgba(95, 39, 205, 0.00) 100%)",
    "radial-gradient(50% 100% at 50% 100%, #00D2D3 0%, rgba(0, 210, 211, 0.00) 100%)",
  ];
  return gradients[index % gradients.length];
};

// Get darker border color based on card gradient
const getBorderColor = (index) => {
  const borderColors = [
    "#7C5AE8", // Darker purple for #946CF5
    "#E55A5A", // Darker red for #FF6B6B
    "#3FB8B0", // Darker teal for #4ECDC4
    "#3A9BB8", // Darker blue for #45B7D1
    "#7FB89A", // Darker green for #96CEB4
    "#E6B847", // Darker yellow for #FECA57
    "#E68AD6", // Darker pink for #FF9FF3
    "#4A8FE6", // Darker blue for #54A0FF
    "#4E1FA8", // Darker purple for #5F27CD
    "#00B3B4", // Darker cyan for #00D2D3
  ];
  return borderColors[index % borderColors.length];
};

const SuperpowerSlides = () => {
  const scrollContainerRef = useRef(null);
  const containerRef = useRef(null);
  const { t } = useTranslation();
  const [activeSlide, setActiveSlide] = useState(-1); // Start with title card

  const superpowerData = useMemo(() => {
    console.log("SuperpowerSlider - Building superpowerData with translations");

    // Debug translation function
    console.log("SuperpowerSlider - Translation debug:", {
      title: t("superpowers.title"),
      ctaLabel: t("superpowers.ctaLabel"),
      remindersTitle: t("superpowers.slides.reminders.title"),
      remindersDesc: t("superpowers.slides.reminders.description"),
      isTitleSame: t("superpowers.title") === "superpowers.title",
      isCtaSame: t("superpowers.ctaLabel") === "superpowers.ctaLabel",
    });

    const gradients = [
      "from-blue-500 to-purple-600",
      "from-green-500 to-teal-600",
      "from-pink-500 to-red-600",
      "from-yellow-500 to-orange-600",
      "from-indigo-500 to-violet-600",
      "from-red-500 to-rose-600",
    ];

    // Get individual slide data using translation keys with fallbacks
    const slides = [
      {
        title:
          t("superpowers.slides.reminders.title") ||
          "Unlimited automatic reminders",
        description:
          t("superpowers.slides.reminders.description") ||
          "One-time or recurring. Weekly, monthly, with excuses or relentless. For anything, anytime, as many times as needed.",
        dotTitle: t("superpowers.slides.reminders.dotTitle") || "Reminders",
        messages: [
          t("superpowers.slides.reminders.messages.sender") ||
            "Memorae, remind me tomorrow at 8 a.m. that I have to take my medication",
          t("superpowers.slides.reminders.messages.receiver") ||
            "I've created your reminder for tomorrow at 8 a.m. so you don't forget your medication. Don't forget to dedicate that moment to taking care of yourself!🧘",
        ],
        gradient: gradients[0],
      },
      {
        title: t("superpowers.slides.calendars.title"),
        description: t("superpowers.slides.calendars.description"),
        dotTitle: t("superpowers.slides.calendars.dotTitle"),
        messages: [
          t("superpowers.slides.calendars.messages.sender"),
          t("superpowers.slides.calendars.messages.receiver"),
        ],
        gradient: gradients[1],
      },
      {
        title: t("superpowers.slides.focus.title"),
        description: t("superpowers.slides.focus.description"),
        dotTitle: t("superpowers.slides.focus.dotTitle"),
        messages: [
          t("superpowers.slides.focus.messages.sender"),
          t("superpowers.slides.focus.messages.receiver"),
        ],
        gradient: gradients[2],
      },
      {
        title: t("superpowers.slides.insights.title"),
        description: t("superpowers.slides.insights.description"),
        dotTitle: t("superpowers.slides.insights.dotTitle"),
        messages: [t("superpowers.slides.insights.messages.receiver")],
        gradient: gradients[3],
      },
      {
        title: t("superpowers.slides.listas.title"),
        description: t("superpowers.slides.listas.description"),
        dotTitle: t("superpowers.slides.listas.dotTitle"),
        messages: [
          t("superpowers.slides.listas.messages.sender"),
          t("superpowers.slides.listas.messages.receiver"),
        ],
        gradient: gradients[4],
      },
      {
        title: t("superpowers.slides.integracion.title"),
        description: t("superpowers.slides.integracion.description"),
        dotTitle: t("superpowers.slides.integracion.dotTitle"),
        messages: [
          t("superpowers.slides.integracion.messages.sender"),
          t("superpowers.slides.integracion.messages.receiver"),
        ],
        gradient: gradients[5],
      },
    ];

    const result = {
      title: t("superpowers.title"),
      ctaLabel: t("superpowers.ctaLabel"),
      slides,
    };

    // Debug first slide
    console.log("SuperpowerSlider - First slide data:", {
      title: result.slides[0]?.title,
      description: result.slides[0]?.description,
      dotTitle: result.slides[0]?.dotTitle,
      messages: result.slides[0]?.messages,
    });

    return result;
  }, [t]);

  // Initialize active slide to title card
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      // Ensure we start at the title card (scroll position 0)
      container.scrollLeft = 0;
    }
    setActiveSlide(-1); // Set to title card
  }, []);

  // Border radius and scale animation effect
  useEffect(() => {
    if (!containerRef.current || typeof window === "undefined") return;

    // Wait for next tick to avoid hydration mismatch
    const timer = setTimeout(() => {
      // Set initial state (small and rounded)
      console.log("Setting initial state - scale: 0.2"); // Debug log
      gsap.set(containerRef.current, {
        borderRadius: "34px 34px 0px 0px",
        scale: 0.2,
        transformOrigin: "center top",
      });

      // Create ScrollTrigger for border radius and scale animation
      const scrollTrigger = ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top bottom-=200",
        end: "top center+=100",
        scrub: 1,
        onUpdate: (self) => {
          // Gradually reduce border radius and increase scale as it comes into view
          const progress = self.progress;
          const borderRadius = 34 - progress * 10; // From 34px to 24px (keeping some radius)
          const scale = 0.2 + progress * 0.8; // From 0.2 to 1.0 (dramatic scale change)

          console.log("ScrollTrigger progress:", progress, "scale:", scale); // Debug log

          gsap.set(containerRef.current, {
            borderRadius: `${borderRadius}px ${borderRadius}px 0px 0px`,
            scale: scale,
          });
        },
        onEnter: () => {
          console.log("ScrollTrigger entered"); // Debug log
        },
        onLeave: () => {
          console.log("ScrollTrigger left"); // Debug log
        },
      });

      return () => {
        scrollTrigger.kill();
      };
    }, 0);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  // Handle scroll events to update active slide
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const slideWidth = 320; // w-80 = 320px
      const gap = 24; // gap-6 = 24px
      const scrollLeft = container.scrollLeft;

      // Check if we're on small screen (< 600px)
      const isSmallScreen = window.innerWidth < 600;

      if (isSmallScreen) {
        // On small screens, only cards are in the scroll container
        const totalSlides = superpowerData.slides.length;
        const slideIndex = Math.floor(scrollLeft / (slideWidth + gap) + 0.5);
        const clampedIndex = Math.max(0, Math.min(slideIndex, totalSlides - 1));
        const newActiveSlide = clampedIndex;

        if (newActiveSlide !== activeSlide) {
          setActiveSlide(newActiveSlide);
        }
      } else {
        // On larger screens, title card + feature cards are in the scroll container
        const totalSlides = superpowerData.slides.length + 1; // +1 for title card
        const slideIndex = Math.floor(scrollLeft / (slideWidth + gap) + 0.5);
        const clampedIndex = Math.max(0, Math.min(slideIndex, totalSlides - 1));
        const newActiveSlide = clampedIndex === 0 ? -1 : clampedIndex - 1;

        if (newActiveSlide !== activeSlide) {
          setActiveSlide(newActiveSlide);
        }
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [activeSlide, superpowerData.slides.length]);

  // Scroll + sync state when dot clicked
  const handleDotClick = (i) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const slideWidth = 320; // w-80 = 320px
    const gap = 24; // gap-6 = 24px

    // Check if we're on small screen (< 600px)
    const isSmallScreen = window.innerWidth < 600;

    let scrollPosition;

    if (isSmallScreen) {
      // On small screens, only cards are in the scroll container
      if (i >= 0 && i < superpowerData.slides.length) {
        scrollPosition = i * (slideWidth + gap);
      } else {
        scrollPosition = 0;
      }
    } else {
      // On larger screens, title card + feature cards are in the scroll container
      const totalSlides = superpowerData.slides.length + 1; // +1 for title card

      if (i === -1) {
        // Title card (first slide)
        scrollPosition = 0;
      } else if (i >= 0 && i < superpowerData.slides.length) {
        // Feature cards
        scrollPosition = (i + 1) * (slideWidth + gap);
      } else {
        // Invalid index, scroll to last slide
        scrollPosition = (totalSlides - 1) * (slideWidth + gap);
      }
    }

    // Ensure scroll position doesn't exceed container width
    const maxScroll = container.scrollWidth - container.clientWidth;
    // For the last slide, allow scrolling to the very end to show the card fully
    if (i === superpowerData.slides.length - 1) {
      scrollPosition = maxScroll;
    } else {
      scrollPosition = Math.min(scrollPosition, maxScroll);
    }

    container.scrollTo({
      left: scrollPosition,
      behavior: "smooth",
    });

    // Immediately update React state
    setActiveSlide(i);
  };

  return (
    <div
      ref={containerRef}
      className="w-full bg-[#06101D] py-16 sm:h-[100vh] md:h-[60vh] lg:h-[100vh] h-[150vh]"
      style={{
        borderTopLeftRadius: "24px",
        borderTopRightRadius: "24px",
      }}
    >
      <div className="mx-auto px-0">
        {/* Main Content - Responsive Layout */}
        <div className="mb-12">
          {/* Title Section - Above cards on small screens */}
          <div className="block max-[600px]:block min-[600px]:hidden mb-4 mt-50 md:mt-0 text-center">
            <h2 className="sm:text-2xl text-xl md:px-0 px-4 text-left font-bold mb-6 text-white">
              {superpowerData.title}
            </h2>
            <Button icon={<img src="/homepage/east.svg" alt="arrow icon" />}>
              {superpowerData.ctaLabel}
            </Button>
          </div>

          {/* Slider Container */}
          <div className="relative">
            {/* Slider Track - Only Cards on small screens, Title + Cards on larger screens */}
            <div
              ref={scrollContainerRef}
              className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory gap-6 pb-4 pr-152"
              style={{ scrollBehavior: "smooth" }}
            >
              {/* Title Card - Only visible on screens >= 600px */}
              <div
                data-slide-ref="title"
                className="hidden min-[600px]:block group relative flex-shrink-0 w-80 md:w-96 h-80 md:h-96 overflow-hidden rounded-2xl p-5 md:p-7 text-white snap-center flex flex-col justify-center bg-transparent"
              >
                <div className="relative z-10">
                  <h2 className="text-xl md:text-2xl font-bold mb-8">
                    {superpowerData.title}
                  </h2>
                  <Button
                    icon={<img src="/homepage/east.svg" alt="arrow icon" />}
                  >
                    {superpowerData.ctaLabel}
                  </Button>
                </div>
              </div>
              {superpowerData.slides.map((slide, index) => (
                <div
                  key={index}
                  data-slide-ref={index}
                  className="mt-10 group relative flex-shrink-0 w-80 md:w-96 h-100 md:h-120 overflow-hidden rounded-4xl p-5 md:p-7 text-white transition-all duration-300 hover:scale-105 snap-center"
                  style={{
                    background: getGradientColors(index),
                    position: "relative",
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                    borderBottom: `2px solid ${getBorderColor(index)}`,
                  }}
                >
                  {/* Card Content */}
                  <div className="relative z-10 h-full flex flex-col bg-transparent">
                    <h3 className="text-xl font-semibold mb-3">
                      {slide.title}
                    </h3>
                    <p className="text-sm mb-0 opacity-90 flex-grow">
                      {slide.description}
                    </p>

                    {/* Messages Section */}
                    <div
                      className="mt-auto"
                      style={{
                        backgroundImage: "url('/SuperpowerCardBg.svg')",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                      }}
                    >
                      <div className="relative flex justify-center">
                        <div className="relative rounded-lg overflow-hidden  w-full">
                          <Image
                            src={`/homepage/chat_${
                              index === 0
                                ? "one"
                                : index === 1
                                ? "two"
                                : index === 2
                                ? "three"
                                : index === 3
                                ? "four"
                                : index === 4
                                ? "five"
                                : "two"
                            }.svg`}
                            alt="Chat message"
                            width={200}
                            height={120}
                            className="w-full h-auto object-cover"
                            unoptimized
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Arrows */}
            {/* <button
              onClick={() => {
                const container = scrollContainerRef.current;
                if (!container) return;

                const slideWidth = 320; // w-80 = 320px
                const gap = 24; // gap-6 = 24px
                const currentScroll = container.scrollLeft;
                const slideStep = slideWidth + gap;

                // Calculate previous slide position
                const prevPosition = Math.max(0, currentScroll - slideStep);

                container.scrollTo({
                  left: prevPosition,
                  behavior: "smooth",
                });
              }}
              className={`absolute ml-80 left-4 top-1/2 -translate-y-1/2 p-3 rounded-full transition-all duration-200 z-10 ${
                activeSlide === -1
                  ? "bg-white/10 text-white/50 cursor-not-allowed"
                  : "bg-white/20 hover:bg-white/30 text-white"
              }`}
              disabled={activeSlide === -1}
              aria-label="Previous slide"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <button
              onClick={() => {
                const container = scrollContainerRef.current;
                if (!container) return;

                const slideWidth = 320; // w-80 = 320px
                const gap = 24; // gap-6 = 24px
                const currentScroll = container.scrollLeft;
                const slideStep = slideWidth + gap;
                const maxScroll = container.scrollWidth - container.clientWidth;

                // Calculate next slide position
                let nextPosition = Math.min(
                  maxScroll,
                  currentScroll + slideStep
                );

                // If we're near the end, scroll to the very end to show the last card fully
                if (nextPosition >= maxScroll * 0.8) {
                  nextPosition = maxScroll;
                }

                container.scrollTo({
                  left: nextPosition,
                  behavior: "smooth",
                });
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all duration-200 z-10"
              aria-label="Next slide"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button> */}
          </div>
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center items-center space-x-4 -mt-6 md:mt-6">
          {/* Title Dot - Only show on larger screens */}
          <button
            data-dot-ref="title"
            onClick={() => handleDotClick(-1)}
            className={`hidden min-[600px]:block transition-colors duration-200 ${
              activeSlide === -1
                ? "px-4 py-2 rounded-full bg-white text-black text-sm font-medium"
                : "w-3 h-3 rounded-full bg-white/20 hover:bg-white/30"
            }`}
          >
            {activeSlide === -1 && "Overview"}
          </button>

          {/* Feature Dots */}
          {superpowerData.slides.map((slide, index) => (
            <button
              key={index}
              data-dot-ref={index}
              onClick={() => handleDotClick(index)}
              className={`transition-colors duration-200 ${
                activeSlide === index
                  ? "px-4 py-2 rounded-full bg-white text-black text-sm font-medium"
                  : "w-3 h-3 rounded-full bg-white/20 hover:bg-white/30"
              }`}
            >
              {activeSlide === index && (slide.dotTitle || slide.title)}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default SuperpowerSlides;
