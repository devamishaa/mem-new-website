import Image from "next/image";
import Button from "../common/Button";
import FeatureCard from "./FeatureCard";
import { useMemo, useRef, useEffect } from "react";
import clsx from "clsx"; // Recommended for conditional classes: npm install clsx
import { useTranslation } from "@/hooks/useTranslation";

// Deterministic gradient colors for border (index-based to avoid hydration issues)
const getGradientColors = (index) => {
  const gradients = [
    "#ff6b6b, #4ecdc4",
    "#a8edea, #fed6e3",
    "#ff9a9e, #fecfef",
    "#ffecd2, #fcb69f",
    "#a8c0ff, #3f2b96",
    "#ff8a80, #ff80ab",
    "#84fab0, #8fd3f4",
    "#ffecd2, #fcb69f",
    "#667eea, #764ba2",
    "#f093fb, #f5576c",
  ];
  return gradients[index % gradients.length];
};

const SuperpowerSlides = ({ activeSlide, onDotClick }) => {
  const scrollContainerRef = useRef(null);
  const containerRef = useRef(null);
  const { t } = useTranslation();

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
    if (onDotClick && activeSlide !== -1) {
      onDotClick(-1);
    }
  }, []);

  // Handle scroll events to update active slide
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const slideWidth = 320; // w-80 = 320px
      const gap = 24; // gap-6 = 24px
      const scrollLeft = container.scrollLeft;

      // Calculate which slide is currently visible
      // 0 = title card, 1+ = feature cards
      const slideIndex = Math.round(scrollLeft / (slideWidth + gap));
      const newActiveSlide = slideIndex === 0 ? -1 : slideIndex - 1;

      if (onDotClick && newActiveSlide !== activeSlide) {
        onDotClick(newActiveSlide);
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [activeSlide, onDotClick]);

  // Scroll + sync state when dot clicked
  const handleDotClick = (i) => {
    const slideElement = scrollContainerRef.current?.querySelector(
      `[data-slide-ref="${i}"]`
    );
    const container = scrollContainerRef.current;

    if (container) {
      const slideWidth = 320; // w-80 = 320px
      const gap = 24; // gap-6 = 24px
      // For title card (i = -1), scroll to position 0
      // For feature cards (i >= 0), scroll to position (i + 1) * (slideWidth + gap)
      const scrollPosition = i === -1 ? 0 : (i + 1) * (slideWidth + gap);
      container.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });
    }

    // Immediately update React state / GSAP sync
    if (onDotClick) {
      onDotClick(i);
    }
  };

  return (
    <div ref={containerRef} className="w-full bg-black py-16 h-[100vh]">
      <div className="mx-auto px-4">
        {/* Main Content - Combined Title and Slider */}
        <div className="mb-12">
          {/* Combined Slider Container */}
          <div className="relative">
            {/* Slider Track with Title and Cards */}
            <div
              ref={scrollContainerRef}
              className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory gap-6 pb-4"
              style={{ scrollBehavior: "smooth" }}
            >
              {/* Title Card - First Slide */}
              <div
                data-slide-ref="title"
                className="group relative flex-shrink-0 w-80 md:w-96 h-80 md:h-96 overflow-hidden rounded-2xl p-5 md:p-7 text-white transition-all duration-300 hover:scale-105 snap-center flex flex-col justify-center bg-transparent"
              >
                <div className="relative z-10">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    {superpowerData.title}
                  </h2>
                  <p className="text-lg text-gray-200 mb-6">
                    {superpowerData.ctaLabel}
                  </p>
                </div>
              </div>
              {superpowerData.slides.map((slide, index) => (
                <div
                  key={index}
                  data-slide-ref={index}
                  className="mt-10 group relative flex-shrink-0 w-80 md:w-96 h-80 md:h-96 overflow-hidden rounded-4xl p-5 md:p-7 text-white transition-all duration-300 hover:scale-105 snap-center bg-transparent"
                  style={{
                    position: "relative",
                  }}
                >
                  {/* Rounded Gradient Border Bottom */}
                  <div
                    className="absolute bottom-0 left-0 right-0 h-2"
                    style={{
                      background: `linear-gradient(90deg, ${getGradientColors(
                        index
                      )})`,
                      borderRadius: "0 0 32px 32px",
                      height: "8px",
                      marginLeft: "8px",
                      marginRight: "8px",
                    }}
                  ></div>
                  {/* Card Content */}
                  <div className="relative z-10 h-full flex flex-col bg-transparent">
                    <h3 className="text-xl font-semibold mb-3">
                      {slide.title}
                    </h3>
                    <p className="text-sm mb-4 opacity-90 flex-grow">
                      {slide.description}
                    </p>

                    {/* Messages Section */}
                    <div className="space-y-2 mt-auto">
                      {slide.messages.map((message, msgIndex) => (
                        <div
                          key={msgIndex}
                          className={`text-xs p-2 rounded-lg relative ${
                            msgIndex % 2 === 0
                              ? "bg-[#DCF7C5] text-left text-[#000]"
                              : "bg-[#FAFAFA] text-right text-[#000]"
                          }`}
                        >
                          {message}
                          {/* Chat bubble tail using SVG */}
                          <div
                            className={`absolute top-1/2 -translate-y-1/2 ${
                              msgIndex % 2 === 0
                                ? "left-0 -ml-1"
                                : "right-0 -mr-1"
                            }`}
                          >
                            <svg
                              width="10"
                              height="17"
                              viewBox="0 0 10 17"
                              fill="none"
                              className={`${
                                msgIndex % 2 === 0
                                  ? "scale-x-100"
                                  : "scale-x-[-1]"
                              }`}
                            >
                              <path
                                d="M1.06952 12.0015C6.45536 9.8956 9.6814 6.12422 9.6814 0.838867V16.3095C5.44397 16.1029 2.37371 15.3483 0.470664 14.0454C0.285939 13.919 0.145062 13.7383 0.0674381 13.5283C-0.139564 12.9683 0.14653 12.3466 0.706477 12.1396L1.06952 12.0015Z"
                                fill={
                                  msgIndex % 2 === 0 ? "#DCF7C5" : "#FAFAFA"
                                }
                              />
                            </svg>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Hover Effect Overlay */}
                  {/* <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" /> */}
                </div>
              ))}
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={() => {
                const container = scrollContainerRef.current;
                if (container) {
                  const slideWidth = 320; // w-80 = 320px
                  const gap = 24; // gap-6 = 24px
                  container.scrollBy({
                    left: -(slideWidth + gap),
                    behavior: "smooth",
                  });
                }
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all duration-200 z-10"
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
                if (container) {
                  const slideWidth = 320; // w-80 = 320px
                  const gap = 24; // gap-6 = 24px
                  container.scrollBy({
                    left: slideWidth + gap,
                    behavior: "smooth",
                  });
                }
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
            </button>
          </div>
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center items-center space-x-4 mt-8">
          {/* Title Dot */}
          <button
            data-dot-ref="title"
            onClick={() => handleDotClick(-1)}
            className={`relative overflow-hidden transition-all duration-300 ease-in-out ${
              activeSlide === -1
                ? "px-4 py-2 rounded-full bg-white text-black text-sm font-medium min-w-[80px]"
                : "w-3 h-3 rounded-full bg-white/20 hover:bg-white/30 min-w-[12px]"
            }`}
          >
            <span
              className={`inline-block transition-all duration-300 ease-in-out ${
                activeSlide === -1
                  ? "opacity-100 transform scale-100"
                  : "opacity-0 transform scale-75 absolute"
              }`}
            >
              Overview
            </span>
          </button>

          {/* Feature Dots */}
          {superpowerData.slides.map((slide, index) => (
            <button
              key={index}
              data-dot-ref={index}
              onClick={() => handleDotClick(index)}
              className={`relative overflow-hidden transition-all duration-300 ease-in-out ${
                activeSlide === index
                  ? "px-4 py-2 rounded-full bg-white text-black text-sm font-medium min-w-[80px]"
                  : "w-3 h-3 rounded-full bg-white/20 hover:bg-white/30 min-w-[12px]"
              }`}
            >
              <span
                className={`inline-block transition-all duration-300 ease-in-out ${
                  activeSlide === index
                    ? "opacity-100 transform scale-100"
                    : "opacity-0 transform scale-75 absolute"
                }`}
              >
                {slide.dotTitle || slide.title}
              </span>
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
