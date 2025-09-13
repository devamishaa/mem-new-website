"use client";

import { useRef, useState } from "react";
import CdnImage from "@/app/components/common/CdnImage";
import Button from "@/app/components/common/Button";
import { usePillTimeline } from "./usePillTimeline";
export default function PillView({ model }) {
  const containerRef = useRef(null);
  const sectionRef = useRef(null);
  const [showCompareTable, setShowCompareTable] = useState(false);

  // Use the custom hook for animations
  usePillTimeline(containerRef, sectionRef, false);

  const handleComparePlans = () => {
    setShowCompareTable(true);
  };

  return (
    <>
      <div ref={sectionRef}>
        <div
          className="relative h-screen w-full overflow-hidden"
          ref={containerRef}
        >
          {/* SVG */}
          <svg
            data-pill-svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 416 710"
            fill="none"
            className="absolute inset-0 h-full w-full"
          >
            <path
              d="M3.00302 157.305V192.156L0.889098 548.587C0.658247 587.511 26.0267 621.962 63.2649 633.296L301.877 705.919C358.411 723.125 415.5 680.826 415.5 621.731V88.6698C415.5 30.0522 359.268 -12.1806 302.973 4.15689L66.4762 72.7916C28.873 83.7046 3.00302 118.15 3.00302 157.305Z"
              fill="url(#paint0_linear)"
            />
            <defs>
              <linearGradient
                id="paint0_linear"
                x1="415.5"
                y1="356"
                x2="0.5"
                y2="356"
                gradientUnits="userSpaceOnUse"
              >
                <stop data-gradient-stop1 offset="0%" stopColor="#0F1417" />
                <stop data-gradient-stop2 offset="100%" stopColor="#090C0D" />
              </linearGradient>
            </defs>
          </svg>

          {/* Image */}
          <div
            data-pill-image
            className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2"
            data-parallax="1.5"
          >
            <CdnImage
              name="/homepage/smily_memorae.png"
              alt="Memorae Logo"
              className="h-48 w-48 object-contain"
              width={200}
              height={200}
            />

            {/* Floating Objects - Hidden on small screens */}
            <div className="hidden xl:block">
              <div
                data-float-obj="0"
                className="absolute -top-4 -right-4 z-20"
                data-parallax="2.5"
              >
                <CdnImage
                  className="h-20 w-20"
                  decorative
                  name="/homepage/7.png"
                  priority
                  width={80}
                  height={80}
                  unoptimized
                  data-parallax="7.5"
                  data-float
                />
              </div>
              <div
                data-float-obj="1"
                className="absolute -bottom-4 -left-4 z-20"
                data-parallax="3.5"
              >
                <CdnImage
                  name="/homepage/8.png"
                  alt="Floating 2"
                  width={80}
                  height={80}
                  decorative
                  unoptimized
                  data-parallax="10.0"
                  data-float
                />
              </div>
              <div
                data-float-obj="2"
                className="absolute top-1/4 -right-8 z-20"
                data-parallax="4.5"
              >
                <CdnImage
                  className="h-20 w-20"
                  decorative
                  name="/homepage/8.png"
                  priority
                  width={80}
                  height={80}
                  unoptimized
                  data-parallax="10.0"
                  data-float
                />
              </div>
              <div
                data-float-obj="3"
                className="absolute bottom-1/4 -left-8 z-20"
                data-parallax="5.5"
              >
                <CdnImage
                  className="h-20 w-20"
                  decorative
                  name="/homepage/6.png"
                  priority
                  width={80}
                  height={80}
                  unoptimized
                  data-parallax="5.5"
                  data-float
                />
              </div>
            </div>
          </div>

          {/* Text Elements - Hidden on small screens */}
          <div className="hidden xl:block">
            <div
              className="absolute left-8 top-1/4 z-30 max-w-xs"
              data-text-reveal
            >
              <p className="text-sm font-medium text-white">
                {model?.pills?.topText ||
                  'Si no te tiembla la mano al pagar 5€ por un café "artesanal"'}
              </p>
            </div>

            <div className="absolute bottom-1/4 right-8 z-30 max-w-xs">
              <p className="text-sm font-medium text-white">
                {model?.pills?.bottomText ||
                  "¿por qué no invertir en recordarlo todo?"}
              </p>
            </div>

            <div className="absolute bottom-8 left-1/2 z-30 -translate-x-1/2">
              <Button
                onClick={() => {
                  handleComparePlans();
                }}
                icon={<img src="/homepage/east.svg" alt="" />}
                className="bg-white text-black hover:bg-gray-100"
              >
                {model?.pills?.comparePlansButton || "Compare Plans"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Compare Plans Table Modal */}
      {showCompareTable && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-lg bg-white">
            {/* Close button overlay */}
            <button
              className="absolute right-4 top-4 z-10 text-2xl font-bold text-gray-600 hover:text-gray-800"
              onClick={() => setShowCompareTable(false)}
            >
              ×
            </button>
            <div className="p-6" data-modal-content>
              {/* CompareTable component would go here */}
              <div className="text-center">
                <h2 className="text-2xl font-bold">Compare Plans</h2>
                <p className="mt-4 text-gray-600">
                  Compare table functionality would be implemented here
                </p>
                <button
                  className="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                  onClick={() => setShowCompareTable(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
