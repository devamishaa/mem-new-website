"use client";
import { useEffect, useState, useRef } from "react";
import styles from "@/styles/components/global/loading-screen.module.css";

export default function LoadingScreen({ visible = true, onComplete }) {
  const [show, setShow] = useState(visible);
  const [progress, setProgress] = useState(0);
  const completedRef = useRef(false);

  useEffect(() => {
    if (visible) {
      setShow(true);
      setProgress(0);
      completedRef.current = false;
    } else {
      const t = setTimeout(() => setShow(false), 250);
      return () => clearTimeout(t);
    }
  }, [visible]);

  useEffect(() => {
    if (!visible || completedRef.current) return;

    const handleLoad = () => {
      if (completedRef.current) return;
      completedRef.current = true;

      // Complete immediately when page is ready
      setProgress(100);

      // Very brief visual feedback before completion
      setTimeout(() => {
        if (onComplete) onComplete();
      }, 50);
    };

    // Check if already loaded
    if (typeof document !== "undefined" && document.readyState === "complete") {
      handleLoad();
      return;
    }

    // Simple progress animation while waiting for actual load
    let startTime = Date.now();
    let rafId = 0;

    const tick = () => {
      if (completedRef.current) return;

      const elapsed = Date.now() - startTime;
      // Smooth progress that asymptotically approaches 90% while waiting for load
      // This gives visual feedback but doesn't fake completion
      const naturalProgress = 90 * (1 - Math.exp(-elapsed / 800)); // 800ms time constant

      setProgress(Math.min(naturalProgress, 90)); // Cap at 90% until actual load

      if (naturalProgress < 90) {
        rafId = requestAnimationFrame(tick);
      }
    };

    // Start progress animation and listen for load
    rafId = requestAnimationFrame(tick);

    if (typeof window !== "undefined") {
      window.addEventListener("load", handleLoad, { once: true });
    }

    return () => {
      cancelAnimationFrame(rafId);
      if (typeof window !== "undefined") {
        window.removeEventListener("load", handleLoad);
      }
    };
  }, [visible, onComplete]);

  if (!show) return null;

  return (
    <div
      className={styles.container}
      data-loading-screen
      data-hidden={visible ? "false" : "true"}
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <div className={styles.iconWrapper}>
        <img
          src="/homepage/Memorae_Character 1.svg"
          alt="Memorae Character"
          className={styles.icon}
        />
      </div>
      <div
        className={styles.progress}
        role="progressbar"
        aria-label="Loading"
        aria-valuenow={Math.round(progress)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={styles.progressBar}
          style={{ transform: `scaleX(${progress / 100})` }}
        />
      </div>
    </div>
  );
}
