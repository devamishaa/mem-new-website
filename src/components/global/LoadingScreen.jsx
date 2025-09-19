"use client";
import { useEffect, useState } from "react";
import styles from "./loading-screen.module.css";

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let minLoadingTime = 2000; // Show for at least 2 seconds
    let pageLoaded = false;
    let minTimeReached = false;

    const handleLoad = () => {
      pageLoaded = true;
      checkIfCanHide();
    };

    const checkIfCanHide = () => {
      if (pageLoaded && minTimeReached) {
        setIsLoading(false);
      }
    };

    // Check if already loaded
    if (document.readyState === "complete") {
      pageLoaded = true;
    } else {
      window.addEventListener("load", handleLoad);
    }

    // Ensure minimum loading time
    const minTimer = setTimeout(() => {
      minTimeReached = true;
      checkIfCanHide();
    }, minLoadingTime);

    return () => {
      window.removeEventListener("load", handleLoad);
      clearTimeout(minTimer);
    };
  }, []);

  if (!isLoading) return null;

  return (
    <div
      className={styles.container}
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <div className={styles.iconWrapper}>
        <img
          src="https://cdn.memorae.ai/mem-next/homepage/Memorae_Character 1.svg"
          alt="Memorae Character"
          className={styles.icon}
        />
      </div>
      <div className={styles.progress} role="progressbar" aria-label="Loading">
        <div className={styles.progressBar} />
      </div>
    </div>
  );
}
