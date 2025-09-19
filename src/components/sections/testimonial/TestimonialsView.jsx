import { useRef } from "react";
import { useNavbarColor } from "@/hooks/useNavbarColor";
import styles from "@/styles/components/sections/testimonial/Testimonial.module.css";
import { useTestimonialsTimeline } from "./animations/useTestimonialsTimeline";

const badgeColors = [
  { text: styles.purple, bg: styles.purpleLight },
  { text: styles.blue, bg: styles.blueLight },
  { text: styles.green, bg: styles.greenLight },
  { text: styles.pink, bg: styles.pinkLight },
  { text: styles.yellow, bg: styles.yellowLight },
  { text: styles.red, bg: styles.redLight },
];

function TestimonialCard({ testimonial }) {
  const badgeColor =
    badgeColors[testimonial?.id % badgeColors.length] || badgeColors[0];

  const randomShadow = testimonial?.id
    ? (() => {
        const colors = [
          "rgba(147, 51, 234, 0.2)", // Purple
          "rgba(59, 130, 246, 0.2)", // Blue
          "rgba(16, 185, 129, 0.2)", // Green
          "rgba(236, 72, 153, 0.2)", // Pink
          "rgba(245, 158, 11, 0.2)", // Yellow
          "rgba(239, 68, 68, 0.2)", // Red
          "rgba(139, 92, 246, 0.2)", // Indigo
          "rgba(14, 165, 233, 0.2)", // Sky
          "rgba(34, 197, 94, 0.2)", // Emerald
          "rgba(251, 113, 133, 0.2)", // Rose
        ];
        const hash = testimonial.id;
        const colorIndex = hash % colors.length;
        // Equal shadow on all sides: 0px offset, consistent blur and spread
        const blur = 8;
        const spread = 0;
        return `0px 0px ${blur}px ${spread}px ${colors[colorIndex]}`;
      })()
    : "0px 0px 8px 0px rgba(150, 52, 231, 0.1)";

  if (!testimonial) return null;

  return (
    <div className={styles.testimonialCard} style={{ boxShadow: randomShadow }}>
      <div className={styles.cardHeader}>
        <span className={`${styles.badge} ${badgeColor.text} ${badgeColor.bg}`}>
          {testimonial.badge}
        </span>
        <div className={styles.verified}>
          <svg
            className={styles.verifiedIcon}
            viewBox="0 0 20 20"
            stroke="currentColor"
            fill="none"
            strokeWidth="2"
          >
            <path
              d="M10 18a8 8 0 100-16 8 8 0 000 16z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M7 10l2 2 4-4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>Verified user</span>
        </div>
      </div>
      <div className={styles.ratingStars}>
        {Array.from({ length: 5 }).map((_, i) => {
          const stars = Number(testimonial.stars) || 0;
          const full = Math.floor(stars);
          const hasHalf = stars - full >= 0.5;
          const isFull = i < full;
          const isHalf = !isFull && i === full && hasHalf;

          return (
            <svg
              key={i}
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              className={`${styles.ratingIcon} ${isFull ? styles.active : ""}`}
            >
              {isHalf && (
                <defs>
                  <linearGradient
                    id={`halfGrad-${i}`}
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="0"
                  >
                    <stop offset="50%" stopColor="#FAB115" />
                    <stop offset="50%" stopColor="rgba(250, 177, 21, 0.3)" />
                  </linearGradient>
                </defs>
              )}
              <path
                d="M12 17.2742L7.85002 19.7742C7.66668 19.8909 7.47501 19.9409 7.27501 19.9242C7.07501 19.9076 6.90002 19.8409 6.75002 19.7242C6.60001 19.6076 6.48335 19.4617 6.40002 19.2867C6.31668 19.1117 6.30002 18.9159 6.35002 18.6992L7.45002 13.9742L3.77502 10.7992C3.60835 10.6492 3.50418 10.4784 3.46252 10.2867C3.42085 10.0951 3.43335 9.90755 3.50002 9.72422C3.56668 9.54088 3.66668 9.39089 3.80002 9.27422C3.93335 9.15755 4.11668 9.08255 4.35002 9.04922L9.20002 8.62422L11.075 4.17422C11.1583 3.97422 11.2875 3.82422 11.4625 3.72422C11.6375 3.62422 11.8167 3.57422 12 3.57422C12.1833 3.57422 12.3625 3.62422 12.5375 3.72422C12.7125 3.82422 12.8417 3.97422 12.925 4.17422L14.8 8.62422L19.65 9.04922C19.8833 9.08255 20.0667 9.15755 20.2 9.27422C20.3333 9.39089 20.4333 9.54088 20.5 9.72422C20.5667 9.90755 20.5792 10.0951 20.5375 10.2867C20.4958 10.4784 20.3917 10.6492 20.225 10.7992L16.55 13.9742L17.65 18.6992C17.7 18.9159 17.6833 19.1117 17.6 19.2867C17.5167 19.4617 17.4 19.6076 17.25 19.7242C17.1 19.8409 16.925 19.9076 16.725 19.9242C16.525 19.9409 16.3333 19.8909 16.15 19.7742L12 17.2742Z"
                fill={
                  isFull
                    ? "#FAB115"
                    : isHalf
                    ? `url(#halfGrad-${i})`
                    : "rgba(250, 177, 21, 0.3)"
                }
              />
            </svg>
          );
        })}
      </div>
      <p className={styles.testimonialText}>{testimonial.text}</p>
      <p className={styles.username}>{testimonial.username}</p>
    </div>
  );
}

export default function TestimonialsView({ model }) {
  const containerRef = useRef(null);

  useNavbarColor([{ ref: containerRef, theme: "light" }]);
  useTestimonialsTimeline(containerRef);

  // Validate model structure and provide fallbacks without console warnings
  const testimonialData = model?.testimonials || {};
  const testimonialsList = Array.isArray(testimonialData.testimonials)
    ? testimonialData.testimonials
    : [];

  if (testimonialsList.length === 0) {
    return (
      <div className={styles.testimonialWrapper} ref={containerRef}>
        <div className={styles.testimonialHeader}>
          <h1 data-testimonial-title>
            <span className={styles.highlightText}>
              Loading testimonials...
            </span>
          </h1>
        </div>
      </div>
    );
  }

  const extendedTestimonials = [...testimonialsList, ...testimonialsList];

  return (
    <div
      className={styles.testimonialWrapper}
      ref={containerRef}
      data-testimonial-container
    >
      <div className={styles.testimonialHeader}>
        <h1 data-testimonial-title>
          <span className={styles.highlightText}>
            {testimonialData.label || "+20k people have forgotten to forget"}
          </span>
        </h1>
        <h2 data-testimonial-subtitle className={styles.normalText}>
          {testimonialData.tagline ||
            "You just live. Memorae remembers for you."}
        </h2>
      </div>
      <div className={styles.testimonialCarousel} data-testimonial-carousel>
        <div className={`${styles.carouselShadow} ${styles.left}`}></div>
        <div className={`${styles.carouselShadow} ${styles.right}`}></div>
        <div className={styles.carouselTrack}>
          {extendedTestimonials.map((testimonial, index) => (
            <TestimonialCard
              key={`${testimonial.id}-${index}`}
              testimonial={testimonial}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
