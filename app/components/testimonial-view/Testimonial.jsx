"use client";

import { useRef } from "react";
import { useTranslation } from "@/hooks/useTranslation";
// import { useTestimonialsTimeline } from "./animations/useTestimonialsTimeline";

const badgeColors = [
  { text: "text-purple-600", bg: "bg-purple-100" },
  { text: "text-blue-600", bg: "bg-blue-100" },
  { text: "text-green-600", bg: "bg-green-100" },
  { text: "text-pink-600", bg: "bg-pink-100" },
  { text: "text-yellow-600", bg: "bg-yellow-100" },
  { text: "text-red-600", bg: "bg-red-100" },
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
        return `0px 0px 8px 0px ${colors[colorIndex]}`;
      })()
    : "0px 0px 8px 0px rgba(150, 52, 231, 0.1)";

  if (!testimonial) return null;

  return (
    <div
      className="flex w-[383px] flex-col gap-4 rounded-2xl bg-white p-8 text-base shadow-[0_28px_33px_-17px_rgba(150,52,231,0.1)]"
      style={{ boxShadow: randomShadow }}
    >
      <div className="mb-4 flex items-center justify-between">
        <span
          className={`rounded-md px-2 py-1 text-xs font-medium uppercase ${badgeColor.text} ${badgeColor.bg}`}
        >
          {testimonial.badge}
        </span>
        <div className="flex items-center gap-1 text-xs font-medium text-green-500">
          <svg
            className="h-4 w-4 text-green-500"
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

      {/* Rating Stars */}
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <svg
            key={i}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            className={`transition-opacity ${
              i < testimonial.stars ? "opacity-100" : "opacity-30"
            }`}
          >
            <mask
              id={`mask-${i}`}
              style={{ maskType: "alpha" }}
              maskUnits="userSpaceOnUse"
              x="0"
              y="0"
              width="24"
              height="24"
            >
              <rect width="24" height="24" fill="#FAB115" />
            </mask>
            <g mask={`url(#mask-${i})`}>
              <path
                d="M12 17.2742L7.85002 19.7742C7.66668 19.8909 7.47501 19.9409 7.27501 19.9242C7.07501 19.9076 6.90002 19.8409 6.75002 19.7242C6.60001 19.6076 6.48335 19.4617 6.40002 19.2867C6.31668 19.1117 6.30002 18.9159 6.35002 18.6992L7.45002 13.9742L3.77502 10.7992C3.60835 10.6492 3.50418 10.4784 3.46252 10.2867C3.42085 10.0951 3.43335 9.90755 3.50002 9.72422C3.56668 9.54088 3.66668 9.39089 3.80002 9.27422C3.93335 9.15755 4.11668 9.08255 4.35002 9.04922L9.20002 8.62422L11.075 4.17422C11.1583 3.97422 11.2875 3.82422 11.4625 3.72422C11.6375 3.62422 11.8167 3.57422 12 3.57422C12.1833 3.57422 12.3625 3.62422 12.5375 3.72422C12.7125 3.82422 12.8417 3.97422 12.925 4.17422L14.8 8.62422L19.65 9.04922C19.8833 9.08255 20.0667 9.15755 20.2 9.27422C20.3333 9.39089 20.4333 9.54088 20.5 9.72422C20.5667 9.90755 20.5792 10.0951 20.5375 10.2867C20.4958 10.4784 20.3917 10.6492 20.225 10.7992L16.55 13.9742L17.65 18.6992C17.7 18.9159 17.6833 19.1117 17.6 19.2867C17.5167 19.4617 17.4 19.6076 17.25 19.7242C17.1 19.8409 16.925 19.9076 16.725 19.9242C16.525 19.9409 16.3333 19.8909 16.15 19.7742L12 17.2742Z"
                fill="#FAB115"
              />
            </g>
          </svg>
        ))}
      </div>

      <p className="mb-4 text-gray-500">{testimonial.text}</p>
      <p className="font-medium text-gray-400">{testimonial.username}</p>
    </div>
  );
}

export default function TestimonialsView({ model }) {
  const containerRef = useRef(null);
  const { t } = useTranslation();

  //   useTestimonialsTimeline(containerRef);

  // Get testimonials from translation data
  const testimonialsList = t("testimonials.testimonials", []) || [];

  // Use only testimonials from translation data
  const finalTestimonialsList = testimonialsList;

  if (finalTestimonialsList.length === 0) {
    return (
      <div
        ref={containerRef}
        className="flex min-h-screen flex-col items-center justify-center bg-white font-figtree"
      >
        <div className="mb-16 text-center max-w-3xl">
          <h1 data-testimonial-title>
            <span className="bg-gradient-to-r from-[#5f64ff] to-[#ff66c4] bg-clip-text text-transparent text-5xl font-[500]">
              {t("testimonials.label", "+20k people")}
            </span>
          </h1>
          <h2
            data-testimonial-subtitle
            className="text-4xl font-[500] text-[#01214f] mt-4"
          >
            {t("testimonials.tagline", "have forgotten to forget")}
          </h2>
          <p className="text-gray-500 mt-4">Loading testimonials...</p>
        </div>
      </div>
    );
  }

  const extendedTestimonials = [
    ...finalTestimonialsList,
    ...finalTestimonialsList,
    ...finalTestimonialsList,
  ];

  return (
    <div
      ref={containerRef}
      className="mt-10 flex min-h-screen flex-col items-center justify-center bg-white font-figtree"
      data-testimonial-container
    >
      <div className="mb-16 max-w-3xl text-center">
        <h1 data-testimonial-title>
          <span className="bg-gradient-to-r from-[#5f64ff] to-[#ff66c4] bg-clip-text text-transparent text-5xl font-[600]">
            {t("testimonials.label", "+20k people")}
          </span>
        </h1>
        <h2
          data-testimonial-subtitle
          className="text-xl sm:text-4xl font-semibold text-[#01214f]"
        >
          {t("testimonials.tagline", "have forgotten to forget")}
        </h2>
      </div>

      {/* Carousel */}
      <div className="relative w-full max-w-full overflow-x-hidden overflow-y-visible py-5">
        {/* Shadows */}
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-12 bg-gradient-to-r from-white to-transparent"></div>
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-12 bg-gradient-to-l from-white to-transparent"></div>

        {/* Track */}
        <div
          className="flex w-max gap-4 animate-marquee will-change-transform"
          style={{ minHeight: "200px" }}
        >
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
