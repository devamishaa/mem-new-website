"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import CdnImage from "@/components/common/images/CdnImage";
import ScalingText from "@/components/common/scalingText/ScalingText";
import { useNavbarColor } from "@/hooks/useNavbarColor";
import styles from "@/styles/components/sections/footer/Footer.module.css";
import BlurryCursor from "@/components/common/cursor/BlurryCursor";
import { useFooterTimeline } from "./animations/useFooterTimeline";

export default function FooterView({ model }) {
  const footerRef = useRef(null);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [isActive] = useState(true);
  const [scalingTextHeight, setScalingTextHeight] = useState(0);

  const handleScaleChange = (scale, isFinalState = false) => {
    if (isFinalState) {
      setScalingTextHeight(50);
    } else {
      const baseHeight = 200;
      const dynamicHeight = baseHeight * scale;
      setScalingTextHeight(dynamicHeight);
    }
  };

  useNavbarColor([
    {
      ref: footerRef,
      theme: "light",
    },
  ]);

  useFooterTimeline(footerRef);

  useEffect(() => {
    const checkScreen = () => {
      setIsSmallScreen(window.innerWidth < 1300); // Align with motion path breakpoint
    };
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  return (
    <footer className={styles.footer} ref={footerRef} data-footer>
      <div className={styles.footerContainer} data-footer-container>
        <div className={styles.footerTop} data-footer-top>
          <div className={styles.footerText} data-footer-text>
            <p>
              {model?.footer?.tagline ||
                "You just live. Memorae remembers for you."}
            </p>
          </div>

          <div className={styles.footerSocial} data-footer-social>
            <Link
              href="https://www.linkedin.com/company/memorae-ai/"
              aria-label="LinkedIn"
              className={styles.socialIconLink}
              data-footer-social-icon
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M19 3C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19ZM18.5 18.5V13.2C18.5 12.3354 18.1565 11.5062 17.5452 10.8948C16.9338 10.2835 16.1046 9.94 15.24 9.94C14.39 9.94 13.4 10.46 12.92 11.24V10.13H10.13V18.5H12.92V13.57C12.92 12.8 13.54 12.17 14.31 12.17C14.6813 12.17 15.0374 12.3175 15.2999 12.5801C15.5625 12.8426 15.71 13.1987 15.71 13.57V18.5H18.5ZM6.88 8.56C7.32556 8.56 7.75288 8.383 8.06794 8.06794C8.383 7.75288 8.56 7.32556 8.56 6.88C8.56 5.95 7.81 5.19 6.88 5.19C6.43178 5.19 6.00193 5.36805 5.68499 5.68499C5.36805 6.00193 5.19 6.43178 5.19 6.88C5.19 7.81 5.95 8.56 6.88 8.56ZM8.27 18.5V10.13H5.5V18.5H8.27Z" />
              </svg>
            </Link>
            <Link
              href="https://www.youtube.com/@memoraeAi"
              aria-label="YouTube"
              className={styles.socialIconLink}
              data-footer-social-icon
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M10 15L15.19 12L10 9V15ZM21.56 7.17C21.69 7.64 21.78 8.27 21.84 9.07C21.91 9.87 21.94 10.56 21.94 11.16L22 12C22 14.19 21.84 15.8 21.56 16.83C21.31 17.73 20.73 18.31 19.83 18.56C19.36 18.69 18.5 18.78 17.18 18.84C15.88 18.91 14.69 18.94 13.59 18.94L12 19C7.81 19 5.2 18.84 4.17 18.56C3.27 18.31 2.69 17.73 2.44 16.83C2.31 16.36 2.22 15.73 2.16 14.93C2.09 14.13 2.06 13.44 2.06 12.84L2 12C2 9.81 2.16 8.2 2.44 7.17C2.69 6.27 3.27 5.69 4.17 5.44C4.64 5.31 5.5 5.22 6.82 5.16C8.12 5.09 9.31 5.06 10.41 5.06L12 5C16.19 5 18.8 5.16 19.83 5.44C20.73 5.69 21.31 6.27 21.56 7.17Z" />
              </svg>
            </Link>
            <Link
              href="https://www.instagram.com/memorae.ai/"
              aria-label="Instagram"
              className={styles.socialIconLink}
              data-footer-social-icon
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M13.0276 2C14.1526 2.003 14.7236 2.009 15.2166 2.023L15.4106 2.03C15.6346 2.038 15.8556 2.048 16.1226 2.06C17.1866 2.11 17.9126 2.278 18.5496 2.525C19.2096 2.779 19.7656 3.123 20.3216 3.678C20.8303 4.17773 21.2238 4.78247 21.4746 5.45C21.7216 6.087 21.8896 6.813 21.9396 7.878C21.9516 8.144 21.9616 8.365 21.9696 8.59L21.9756 8.784C21.9906 9.276 21.9966 9.847 21.9986 10.972L21.9996 11.718V13.028C22.002 13.7574 21.9944 14.4868 21.9766 15.216L21.9706 15.41C21.9626 15.635 21.9526 15.856 21.9406 16.122C21.8906 17.187 21.7206 17.912 21.4746 18.55C21.2238 19.2175 20.8303 19.8223 20.3216 20.322C19.8219 20.8307 19.2171 21.2242 18.5496 21.475C17.9126 21.722 17.1866 21.89 16.1226 21.94L15.4106 21.97L15.2166 21.976C14.7236 21.99 14.1526 21.997 13.0276 21.999L12.2816 22H10.9726C10.2429 22.0026 9.51312 21.9949 8.78359 21.977L8.58959 21.971C8.3522 21.962 8.11487 21.9517 7.87759 21.94C6.81359 21.89 6.08759 21.722 5.44959 21.475C4.78242 21.2241 4.17804 20.8306 3.67859 20.322C3.16954 19.8224 2.7757 19.2176 2.52459 18.55C2.27759 17.913 2.10959 17.187 2.05959 16.122L2.02959 15.41L2.02459 15.216C2.00616 14.4868 1.99782 13.7574 1.99959 13.028V10.972C1.99682 10.2426 2.00416 9.5132 2.02159 8.784L2.02859 8.59C2.03659 8.365 2.04659 8.144 2.05859 7.878C2.10859 6.813 2.27659 6.088 2.52359 5.45C2.77529 4.7822 3.16982 4.17744 3.67959 3.678C4.17875 3.16955 4.78278 2.77607 5.44959 2.525C6.08759 2.278 6.81259 2.11 7.87759 2.06C8.14359 2.048 8.36559 2.038 8.58959 2.03L8.78359 2.024C9.51278 2.00623 10.2422 1.99857 10.9716 2.001L13.0276 2ZM11.9996 7C10.6735 7 9.40174 7.52678 8.46406 8.46447C7.52638 9.40215 6.99959 10.6739 6.99959 12C6.99959 13.3261 7.52638 14.5979 8.46406 15.5355C9.40174 16.4732 10.6735 17 11.9996 17C13.3257 17 14.5974 16.4732 15.5351 15.5355C16.4728 14.5979 16.9996 13.3261 16.9996 12C16.9996 10.6739 16.4728 9.40215 15.5351 8.46447C14.5974 7.52678 13.3257 7 11.9996 7ZM11.9996 9C12.3936 8.99993 12.7837 9.07747 13.1477 9.22817C13.5117 9.37887 13.8424 9.5998 14.1211 9.87833C14.3997 10.1569 14.6207 10.4875 14.7715 10.8515C14.9224 11.2154 15 11.6055 15.0001 11.9995C15.0002 12.3935 14.9226 12.7836 14.7719 13.1476C14.6212 13.5116 14.4003 13.8423 14.1218 14.121C13.8432 14.3996 13.5126 14.6206 13.1486 14.7714C12.7847 14.9223 12.3946 14.9999 12.0006 15C11.2049 15 10.4419 14.6839 9.87927 14.1213C9.31666 13.5587 9.00059 12.7956 9.00059 12C9.00059 11.2044 9.31666 10.4413 9.87927 9.87868C10.4419 9.31607 11.2049 9 12.0006 9M17.2506 5.5C16.9191 5.5 16.6011 5.6317 16.3667 5.86612C16.1323 6.10054 16.0006 6.41848 16.0006 6.75C16.0006 7.08152 16.1323 7.39946 16.3667 7.63388C16.6011 7.8683 16.9191 8 17.2506 8C17.5821 8 17.9001 7.8683 18.1345 7.63388C18.3689 7.39946 18.5006 7.08152 18.5006 6.75C18.5006 6.41848 18.3689 6.10054 18.1345 5.86612C17.9001 5.6317 17.5821 5.5 17.2506 5.5Z" />
              </svg>
            </Link>
            <Link
              href="https://www.facebook.com/memoraeai/"
              aria-label="Facebook"
              className={styles.socialIconLink}
              data-footer-social-icon
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M22 12C22 6.48 17.52 2 12 2C6.48 2 2 6.48 2 12C2 16.84 5.44 20.87 10 21.8V15H8V12H10V9.5C10 7.57 11.57 6 13.5 6H16V9H14C13.45 9 13 9.45 13 10V12H16V15H13V21.95C18.05 21.45 22 17.19 22 12Z" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      <div
        className={styles.blurryCursorDesktop}
        style={{
          minHeight: isSmallScreen
            ? "auto"
            : `${Math.max(50, scalingTextHeight)}px`,
          transition: "min-height 0.3s ease-out",
        }}
        data-footer-scaling-text
      >
        {!isSmallScreen && (
          <BlurryCursor targetRef={footerRef} isActive={isActive} />
        )}
        {isSmallScreen ? (
          <CdnImage
            src="https://cdn.memorae.ai/mem-next/homepage/footer_image.svg"
            alt="Memorae Footer"
            className={styles.memoraeMobileImg}
            width={377}
            height={110}
          />
        ) : (
          <ScalingText onScaleChange={handleScaleChange} />
        )}
      </div>

      <div
        className={styles.blurryCursorMobile}
        data-footer-mobile-cursor
      ></div>

      <div className={styles.footerBottom} data-footer-bottom>
        <p className={styles.footerCopyrightDesktop}>
          {model?.footer?.copyright ||
            "© 2024 Gemera Capital SLU. All rights reserved."}
        </p>

        <div className={styles.footerLinks} data-footer-links>
          <Link
            href="https://memorae.ai/privacy-policy"
            className={styles.footerLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            {model?.footer?.links?.privacy || "Privacy Policy"}
          </Link>
          <Link
            href="https://memorae.ai/terms"
            className={styles.footerLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            {model?.footer?.links?.terms || "Terms & Conditions"}
          </Link>
          <Link
            href="https://memorae.ai/cookies-settings"
            className={styles.footerLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            {model?.footer?.links?.cookies || "Cookie Settings"}
          </Link>
        </div>

        <p className={styles.footerCopyrightMobile}>
          {model?.footer?.copyright ||
            "© 2024 Gemera Capital SLU. All rights reserved."}
        </p>
      </div>
    </footer>
  );
}
