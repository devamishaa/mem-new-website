"use client";

import { useRef, useEffect } from "react";
import styles from "@/styles/components/sections/pricing/BillingToggle.module.css";

const BillingToggle = ({ billing, setBilling, model }) => {
  const backgroundRef = useRef(null);
  const monthlyRef = useRef(null);
  const annualRef = useRef(null);

  useEffect(() => {
    const activeButton =
      billing === "anual" ? annualRef.current : monthlyRef.current;
    if (backgroundRef.current && activeButton) {
      backgroundRef.current.style.width = `${activeButton.offsetWidth}px`;
      backgroundRef.current.style.left = `${activeButton.offsetLeft}px`;
    }
  }, [billing]);

  return (
    <div className={styles.billingToggle}>
      <div ref={backgroundRef} className={styles.background}></div>
      <button
        ref={monthlyRef}
        className={`${styles.toggleButton} ${
          billing === "mensual" ? styles.active : ""
        }`}
        onClick={() => setBilling("mensual")}
        role="tab"
        aria-selected={billing === "mensual"}
      >
        {model.interval.monthly}
      </button>
      <button
        ref={annualRef}
        className={`${styles.toggleButton} ${
          billing === "anual" ? styles.active : ""
        }`}
        onClick={() => setBilling("anual")}
        role="tab"
        aria-selected={billing === "anual"}
      >
        {model.interval.annual}
        <span className={styles.discountPill}>-40%</span>
      </button>
    </div>
  );
};

export default BillingToggle;
