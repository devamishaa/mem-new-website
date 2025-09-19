import Image from "next/image";
import styles from "@/styles/components/sections/superpower/Superpower.module.css";
import Button from "@/components/common/button/Button";
import FeatureCard from "./FeatureCard";
import { useRef } from "react";
import { useNavbarColor } from "@/hooks/useNavbarColor";

const SuperpowerSlides = ({ model, activeSlide, onDotClick }) => {
  const scrollContainerRef = useRef(null);
  const containerRef = useRef(null);

  // Set navbar theme to dark for this section
  useNavbarColor([
    {
      ref: containerRef,
      theme: "light",
    },
  ]);

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
        behavior: "auto",
      });
    }

    // Immediately update React state / GSAP sync
    if (onDotClick) {
      onDotClick(i);
    }
  };

  return (
    <div ref={containerRef} className={styles.featuresPanel} data-panel-2>
      <div
        className={styles.featureDiv}
        data-content-2
        style={{ width: "100vw", marginLeft: "calc(50% - 50vw)" }}
      >
        <div className={styles.mobileContent}>
          <h2 className={styles.mobileTitle}>{model?.superpower?.title}</h2>
        </div>
        <div
          data-horizontal-viewport
          className={styles.viewPort}
          style={{ width: "100vw" }}
        >
          <div
            data-horizontal-track
            className={styles.horizontalScrollContainer}
            style={{
              willChange: "transform",
              display: "flex",
              scrollSnapType: "x mandatory",
              scrollBehavior: "smooth",
              WebkitOverflowScrolling: "touch",
            }}
            ref={scrollContainerRef}
          >
            {/* Left content */}
            <div
              className={styles.leftContent}
              style={{
                background: "transparent",
                backdropFilter: "none",
                borderRadius: 10,
                padding: 0,
                flexShrink: 0,
                scrollSnapAlign: "start",
              }}
            >
              <h2
                className={styles.leftTitle}
                style={{ marginBottom: "1.5rem" }}
              >
                {model?.superpower?.title}
              </h2>
              <Button
                variant="primary"
                // href={ctaHref}
                icon={
                  <img
                    src="https://cdn.memorae.ai/mem-next/homepage/east.svg"
                    alt=""
                  />
                }
                className={styles.gradientButton}
              >
                {model?.superpower?.ctaLabel}
              </Button>
            </div>

            {/* Cards */}
            <div className={styles.cardsContainer}>
              {model?.superpower?.slides?.map((slide, i) => (
                <div
                  key={`${slide.title}-${i}`}
                  className={styles.cardSlide}
                  data-slide-ref={i}
                  style={{
                    flexShrink: 0,
                    scrollSnapAlign: "center",
                  }}
                >
                  <FeatureCard
                    bgImage="/SuperpowerCardBg.svg"
                    title={slide.title}
                    description={slide.description}
                    className={styles.featureCard}
                    gradient={slide.gradient}
                    messages={slide.messages}
                  ></FeatureCard>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pagination */}
        <div className={styles.paginationRail} data-pagination-rail>
          {model?.superpower?.slides?.map((slide, i) => (
            <button
              key={`dot-${slide.title}-${i}`}
              data-dot-ref={i}
              className={`${styles.dotButton} ${
                activeSlide === i ? styles.activeDot : ""
              }`}
              onClick={() => handleDotClick(i)}
            >
              <span className={styles.dotLabel}>
                {activeSlide === i ? slide.dotTitle || slide.title : ""}
              </span>
            </button>
          ))}
        </div>

        {/* Mobile CTA */}
        <div className={styles.mobileBtn}>
          <Button
            variant="primary"
            // href={ctaHref}
            icon={
              <img
                src="https://cdn.memorae.ai/mem-next/homepage/east.svg"
                alt=""
              />
            }
            className={styles.button}
          >
            {model?.superpower?.ctaLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SuperpowerSlides;
