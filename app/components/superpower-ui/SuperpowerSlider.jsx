import Image from "next/image";
import Button from "../common/Button";
import FeatureCard from "./FeatureCard";
import { useMemo, useRef } from "react";
import clsx from "clsx"; // Recommended for conditional classes: npm install clsx
import { useTranslation } from "@/hooks/useTranslation";

const SuperpowerSlides = ({ activeSlide, onDotClick }) => {
  const scrollContainerRef = useRef(null);
  const containerRef = useRef(null);
  const { t } = useTranslation();

  const superpowerData = useMemo(() => {
    const slidesData = t('superpowers.slides');
    const gradients = [
      "from-blue-500 to-purple-600",
      "from-green-500 to-teal-600",
      "from-pink-500 to-red-600",
      "from-yellow-500 to-orange-600",
      "from-indigo-500 to-violet-600",
      "from-red-500 to-rose-600",
    ];

    const slides = slidesData && typeof slidesData === 'object' ? Object.values(slidesData).map((slide, index) => ({
      ...slide,
      messages: slide.messages ? [slide.messages.sender, slide.messages.receiver] : [],
      gradient: gradients[index % gradients.length],
    })) : [];

    return {
      title: t('superpowers.title'),
      ctaLabel: t('superpowers.ctaLabel'),
      slides,
    };
  }, [t]);

  // Scroll + sync state when dot clicked
  const handleDotClick = (i) => {
    const slideElement = scrollContainerRef.current.querySelector(
      `[data-slide-ref="${i}"]`
    );
    const container = scrollContainerRef.current;

    if (slideElement) {
      const containerRect = container.getBoundingClientRect();
      const slideRect = slideElement.getBoundingClientRect();
      const containerScrollLeft = container.scrollLeft;

      // distance of slide's center from container's center
      const slideCenter = slideRect.left + slideRect.width / 2;
      const containerCenter = containerRect.left + containerRect.width / 2;
      const distanceToCenter = slideCenter - containerCenter;

      container.scrollTo({
        left: containerScrollLeft + distanceToCenter,
        behavior: "smooth",
      });
    }

    // Immediately update React state / GSAP sync
    if (onDotClick) {
      onDotClick(i);
    }
  };

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-[2] h-screen w-full overflow-hidden bg-[#061120]"
      data-panel-2
    >
      <div
        data-content-2
        // style={{ width: "100vw", marginLeft: "calc(50% - 50vw)" }}
      >
        <div className="hidden max-md:block">
          <h2 className="hidden text-center text-sm font-semibold text-white max-md:block max-sm:mt-[3.7em] max-sm:px-[25px] max-sm:pb-0 max-sm:pt-[10px] max-sm:text-2xl">
            {superpowerData.title}
          </h2>
        </div>
        <div
          data-horizontal-viewport
          className="overflow-hidden 2xl:h-[90vh]" // viewport height is responsive
          style={{ width: "100vw" }}
        >
          <div
            data-horizontal-track
            className="flex snap-x snap-mandatory touch-pan-x scroll-smooth [-webkit-overflow-scrolling:touch] max-md:min-h-0 max-md:gap-4 max-md:px-[30px] max-md:py-[20px] 2xl:absolute 2xl:top-[92px] 2xl:mt-20 2xl:min-h-screen 2xl:w-fit 2xl:gap-8 2xl:px-8"
            style={{ willChange: "transform" }}
            ref={scrollContainerRef}
          >
            {/* Left content */}
            <div className="hidden shrink-0 snap-start rounded-[10px] bg-transparent p-0 backdrop-blur-none md:flex md:max-w-[600px] md:flex-col md:gap-[72px] md:min-w-[600px] md:ml-[140px]">
              <h2
                className="text-left text-5xl font-semibold leading-tight text-white max-lg:text-4xl"
                style={{ marginBottom: "1.5rem" }}
              >
                {superpowerData.title}
              </h2>
              <Button
                variant="primary"
                icon={<img src="/homepage/east.svg" alt="arrow icon" />}
                className="flex w-[150px] cursor-pointer items-center gap-2 rounded-full border-none bg-gradient-to-r from-[#6c6cff] to-[#ff66a9] px-6 py-3 font-semibold text-white transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:shadow-[0_8px_16px_rgba(108,108,255,0.3)] max-md:w-[250px]"
              >
                {superpowerData.ctaLabel}
              </Button>
            </div>

            {/* Cards */}
            <div className="flex min-w-fit gap-16 px-8 max-md:gap-4 max-md:px-0">
              {superpowerData.slides?.map((slide, i) => (
                <div
                  key={`${slide.title}-${i}`}
                  className="shrink-0 snap-center xl:w-[400px] lg:w-[320px] md:w-auto w-[300px]" // Responsive card widths
                  data-slide-ref={i}
                >
                  <FeatureCard
                    title={slide.title}
                    description={slide.description}
                    gradient={slide.gradient}
                    messages={slide.messages}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pagination */}
        <div
          className="relative my-8 mt-12 flex h-7 w-full items-center justify-center gap-[21px] max-md:mt-10 2xl:mb-20 2xl:mt-4"
          data-pagination-rail
        >
          {superpowerData.slides?.map((slide, i) => (
            <button
              key={`dot-${slide.title}-${i}`}
              data-dot-ref={i}
              className="relative flex cursor-pointer items-center justify-center border-none bg-transparent origin-center transition-all duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
              onClick={() => handleDotClick(i)}
            >
              <span
                className={clsx(
                  "inline-flex items-center justify-center overflow-hidden whitespace-nowrap text-sm leading-none text-white origin-center transition-all duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]",
                  activeSlide === i
                    ? "min-h-[22px] min-w-[90px] scale-105 rounded-2xl bg-gradient-to-br from-white/20 to-white/10 px-4 py-1.5 opacity-100 shadow-[0_4px_16px_rgba(0,0,0,0.3),0_0_0_1px_rgba(255,255,255,0.1),inset_0_1px_0_rgba(255,255,255,0.2)] backdrop-blur-lg"
                    : "h-2.5 w-2.5 scale-100 rounded-full bg-gray-400/40 p-0 text-transparent opacity-100 shadow-none"
                )}
              >
                {activeSlide === i ? slide.dotTitle || slide.title : ""}
              </span>
            </button>
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="my-8 hidden justify-center max-md:flex">
          <Button
            variant="primary"
            icon={<img src="/homepage/east.svg" alt="arrow icon" />}
            className="flex w-[250px] cursor-pointer items-center gap-2 rounded-full border-none bg-gradient-to-r from-[#6c6cff] to-[#ff66a9] px-6 py-3 font-semibold text-white"
          >
            {superpowerData.ctaLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SuperpowerSlides;