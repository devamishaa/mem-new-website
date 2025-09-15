"use client";

import { useRef, useState } from "react";
import CdnImage from "@/app/components/common/CdnImage";
import styles from "@/styles/components/sections/pills/Pill.module.css";
import Button from "@/app/components/common/Button";
import { usePillTimeline } from "./usePillTimeline";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { useScrollLock } from "@/hooks/useScrollLock";
import { useNavbarColor } from "@/hooks/useNavbarColor";
import CompareTable from "./CompareTable";

export default function PillView({ model }) {
  const containerRef = useRef(null);
  const sectionRef = useRef(null);
  const breakpoint = useBreakpoint();
  const [showCompareTable, setShowCompareTable] = useState(false);

  // Lock scroll when modal is open
  useScrollLock(showCompareTable);

  // Derive responsive values from breakpoint
  const isMobile =
    breakpoint === "MOBILE_S" ||
    breakpoint === "MOBILE_M" ||
    breakpoint === "MOBILE_L" ||
    breakpoint === "TABLET";
  const isSmallScreen = breakpoint === "MOBILE_L";

  useNavbarColor([
    {
      ref: containerRef,
      theme: "light",
    },
  ]);

  // Use the custom hook for animations
  usePillTimeline(containerRef, sectionRef, styles, isMobile);

  const handleComparePlans = () => {
    setShowCompareTable(true);
  };

  return (
    <>
      <div ref={sectionRef}>
        <div className={styles.svgScrollWrapper} ref={containerRef}>
          {/* SVG */}
          <svg
            data-pill-svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 416 710"
            fill="none"
            className={styles.pillSvg}
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
            className={styles.logoWrapper}
            data-parallax="1.5"
          >
            <CdnImage
              src="/homepage/Memorae_Character.png"
              alt="Memorae Logo"
              className={styles.logoImg}
              width={200}
              height={200}
            />

            {/* Floating Objects - Only visible on screens >= 1200px */}
            {!isSmallScreen && (
              <>
                <div
                  data-float-obj="0"
                  className={`${styles.floatingObject} ${styles.obj1}`}
                  data-parallax="2.5"
                >
                  <CdnImage
                    className={styles.icon3}
                    decorative
                    src="/homepage/7.png"
                    priority
                    width={80}
                    height={80}
                    // width={imageDimensions.icon3}
                    // height={imageDimensions.icon3}
                    unoptimized
                    data-parallax="7.5"
                    data-float
                  />
                </div>
                <div
                  data-float-obj="1"
                  className={`${styles.floatingObject} ${styles.obj2}`}
                  data-parallax="3.5"
                >
                  <CdnImage
                    src="/homepage/8.png"
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
                  className={`${styles.floatingObject} ${styles.obj3}`}
                  data-parallax="4.5"
                >
                  <CdnImage
                    className={styles.icon4}
                    decorative
                    src="/homepage/8.png"
                    priority
                    width={80}
                    height={80}
                    // width={imageDimensions.icon4}
                    // height={imageDimensions.icon4}
                    unoptimized
                    data-parallax="10.0"
                    data-float
                  />
                </div>
                <div
                  data-float-obj="3"
                  className={`${styles.floatingObject} ${styles.obj4}`}
                  data-parallax="5.5"
                >
                  <CdnImage
                    className={styles.icon5}
                    decorative
                    src="/homepage/6.png"
                    priority
                    width={80}
                    height={80}
                    // width={imageDimensions.icon5}
                    // height={imageDimensions.icon5}
                    unoptimized
                    data-parallax="5.5"
                    data-float
                  />
                </div>
              </>
            )}

            {/* Waves - Only visible on screens > 600px */}
            {breakpoint !== "MOBILE_S" &&
              breakpoint !== "MOBILE_M" &&
              breakpoint !== "MOBILE_L" && (
                <div className={styles.waves}>
                  <div className={styles.wave}></div>
                  <div className={styles.wave}></div>
                  <div className={styles.wave}></div>
                  <div className={styles.wave}></div>
                </div>
              )}
          </div>

          {/* Text Elements - Only visible on screens >= 1200px */}

          <>
            <div
              className={`${styles.waveText} ${styles.topLeft}`}
              data-text-reveal
            >
              <p>
                {model?.pills?.topText ||
                  'Si no te tiembla la mano al pagar 5€ por un café "artesanal"'}
              </p>
            </div>

            <div className={`${styles.waveText} ${styles.bottomRight}`}>
              <p>
                {model?.pills?.bottomText ||
                  "¿por qué no invertir en recordarlo todo?"}
              </p>
            </div>

            <div className={`${styles.waveText} ${styles.comparePlans}`}>
              <Button
                onClick={() => {
                  handleComparePlans();
                }}
                icon={<img src="/homepage/east.svg" alt="" />}
                className={styles.comparePlansBtn}
              >
                {model?.pills?.comparePlansButton || "Compare Plans"}
              </Button>
            </div>
          </>
        </div>

        {/* Extended spacer for longer scroll experience */}
        <div
          style={{
            height: isSmallScreen ? "40vh" : "100vh",
            background: "#001A3F",
            borderBottomLeftRadius: "20px",
            borderBottomRightRadius: "20px",
          }}
        ></div>
      </div>

      {/* Compare Plans Table Modal */}
      {showCompareTable && (
        <div className={styles.comparePlansOverlay}>
          <div className={styles.comparePlansModal}>
            {/* Close button overlay */}
            <button
              className={styles.modalCloseButton}
              onClick={() => setShowCompareTable(false)}
            >
              ×
            </button>
            <div className={styles.modalContent} data-modal-content>
              <CompareTable
                onBack={() => setShowCompareTable(false)}
                selectedPlan="pro"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
