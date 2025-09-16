"use client";

import { useRef, useEffect } from "react";
// import styles from "@/styles/components/sections/pricing/BillingToggle.module.css"; // Converted to Tailwind

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
    <div className="relative w-[192px] h-[34px] rounded-[34px] bg-white/5 backdrop-blur-[9.45px] border border-white/10 flex flex-row items-center justify-center shadow-[6.299212455749512px_7.874015808105469px_12.6px_rgba(0,0,0,0.05)] m-auto">
      <div
        ref={backgroundRef}
        className="absolute top-1/2 left-10 -translate-y-1/2 h-[34px] rounded-[34px] bg-gradient-to-r from-[#5c7bf3] to-[#ff66c4] transition-all duration-200 ease-out"
      ></div>
      <button
        ref={monthlyRef}
        className={`relative border-0 bg-transparent text-white/70 px-3 py-1.5 rounded-[19px] font-medium cursor-pointer transition-all duration-200 text-xs sm:text-sm whitespace-nowrap flex flex-row items-center justify-center gap-1 left-0 min-w-[80px] z-10 ${
          billing === "mensual" ? "text-white font-bold" : "hover:text-white/90"
        }`}
        onClick={() => setBilling("mensual")}
        role="tab"
        aria-selected={billing === "mensual"}
      >
        {model.interval.monthly}
      </button>
      <button
        ref={annualRef}
        className={`relative border-0 bg-transparent text-white/70 px-3 py-1.5 rounded-[19px] font-medium cursor-pointer transition-all duration-200 text-xs sm:text-sm whitespace-nowrap flex flex-row items-center justify-center gap-1 min-w-[80px] z-10 ${
          billing === "anual" ? "text-white font-bold" : "hover:text-white/90"
        }`}
        onClick={() => setBilling("anual")}
        role="tab"
        aria-selected={billing === "anual"}
      >
        {model.interval.annual}
        <span className="rounded-[15px] bg-[#23cf67] text-[#090d10] px-1 py-0.5 text-[10px] sm:text-xs font-semibold">
          -40%
        </span>
      </button>
    </div>
  );
};

export default BillingToggle;
