"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CdnImage from "@/app/components/common/CdnImage";
import CommonModal from "../common/CommonModal";
import SvgIcon from "../common/svg/SvgIcon";
import VideoCard from "../common/VideoCard";
import { planVideos } from "@/constants/planVideos";
import VideoModal from "../common/VideoModal";
import BillingToggle from "./BillingToggle";
import clsx from "clsx";

gsap.registerPlugin(ScrollTrigger);

// Tailwind classes for the selected plan's text color/gradient
const planTextStyles = {
  pro: "text-blue-400",
  super:
    "bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent",
  life: "text-yellow-400",
};

const planBorderColor = {
  pro: "#3B82F6", // Blue
  super: "#8B5CF6", // Purple
  life: "#F59E0B", // Yellow
};

const PricingView = ({ model, getFeaturesByPlan, priceUtils }) => {
  const [billing, setBilling] = useState("anual");
  const [selected, setSelected] = useState("super");
  const [modalFeature, setModalFeature] = useState(null);
  const [videoModal, setVideoModal] = useState(null);
  const planRefs = useRef({});
  const containerRef = useRef(null);
  const gridRef = useRef(null);
  const listRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  const openVideoModal = (planName) => setVideoModal(planName);
  const closeVideoModal = () => setVideoModal(null);

  const renderVideoCard = (planName) => {
    if (!model.userTimezone) return null;
    const shouldShowIndianContent = model.shouldShowIndianContent;
    const isRestOfTheWorld = model.shouldShowROWContent;

    // Normalize plan name for video data lookup
    const normalizedPlanName =
      planName.toLowerCase() === "life"
        ? "lifetime"
        : planName.toLowerCase() === "super"
        ? "super"
        : planName.toLowerCase();

    const videoData = planVideos(shouldShowIndianContent, isRestOfTheWorld)[
      normalizedPlanName
    ];

    if (!videoData) return null;
    const planData = model.plans[normalizedPlanName];
    if (!planData) return null;

    return (
      <VideoCard
        thumbnail={videoData.thumbnail}
        title={planData.cta.viewDemo}
        planName={planData.name}
        planPrefix={model.planPrefix}
        onClick={(e) => {
          e.stopPropagation();
          openVideoModal(planName);
        }}
      />
    );
  };

  const renderSavingsText = (planKey) => {
    if (!plans[planKey] || !priceUtils) return null;
    const plan = plans[planKey];
    const isAnnual = billing === "anual";

    if (isAnnual && planKey !== "life") {
      const annualPrice = priceUtils.getPriceForInterval(
        plan.planData.amount,
        "year",
        plan.planData,
        false
      );
      const originalAnnualPrice = priceUtils.getOriginalAnnualPrice(
        plan.planData.amount,
        plan.planData
      );
      return (
        <div className="self-stretch relative text-base leading-6 mt-1">
          {model.annually} {annualPrice} ({originalAnnualPrice})
        </div>
      );
    }
    if (planKey === "life") {
      const lifetimeSavings = priceUtils.getLifetimeSavings(plan.planData);
      return (
        <div className="self-stretch relative text-base leading-6 mt-1">
          {model.lifetimeSavings.replace("{{amount}}", lifetimeSavings)}
        </div>
      );
    }
    return null;
  };

  const openFeatureModal = (feature) => setModalFeature(feature);
  const closeFeatureModal = () => setModalFeature(null);

  const plans = useMemo(() => {
    // Memoization logic remains the same...
    if (!model.packages || !priceUtils) return {};
    const isAnnual = billing === "anual";
    const filteredPackages = model.packages.filter((pkg) =>
      isAnnual
        ? pkg.duration === "year" || pkg.duration === "forever"
        : pkg.duration === "month" || pkg.duration === "forever"
    );
    const proPlan = filteredPackages.find(
      (pkg) =>
        pkg.name === "Pro" && pkg.duration === (isAnnual ? "year" : "month")
    );
    const supernovaPlan = filteredPackages.find(
      (pkg) =>
        pkg.name === "Supernova" &&
        pkg.duration === (isAnnual ? "year" : "month")
    );
    const lifetimePlan = filteredPackages.find(
      (pkg) => pkg.name === "Supernova Lifetime" && pkg.duration === "forever"
    );
    const proMonthly = model.packages.find(
      (pkg) => pkg.name === "Pro" && pkg.duration === "month"
    );
    const supernovaMonthly = model.packages.find(
      (pkg) => pkg.name === "Supernova" && pkg.duration === "month"
    );

    const result = {};
    if (proPlan)
      result.pro = {
        name: model.plans.pro.name,
        badge: isAnnual ? model.plans.pro.badge : undefined,
        price: priceUtils.getPriceForInterval(
          proPlan.amount,
          proPlan.duration,
          proPlan,
          true
        ),
        old:
          isAnnual && proMonthly
            ? priceUtils.getPriceForInterval(
                proMonthly.amount,
                proMonthly.duration,
                proMonthly,
                false
              )
            : undefined,
        per: proPlan.duration === "forever" ? "" : model.interval.perMonth,
        ctaColor: "primary",
        demoLabel: model.plans.pro.cta.viewDemo,
        pricingNote: model.plans.pro.pricingNote,
        planData: proPlan,
      };
    if (supernovaPlan)
      result.super = {
        name: model.plans.supernova.name,
        badge: isAnnual ? model.plans.supernova.badge : undefined,
        price: priceUtils.getPriceForInterval(
          supernovaPlan.amount,
          supernovaPlan.duration,
          supernovaPlan,
          true
        ),
        old:
          isAnnual && supernovaMonthly
            ? priceUtils.getPriceForInterval(
                supernovaMonthly.amount,
                supernovaMonthly.duration,
                supernovaMonthly,
                false
              )
            : undefined,
        per:
          supernovaPlan.duration === "forever" ? "" : model.interval.perMonth,
        ctaColor: "gradient",
        demoLabel: model.plans.supernova.cta.viewDemo,
        pricingNote: model.plans.supernova.pricingNote,
        planData: supernovaPlan,
      };
    if (lifetimePlan)
      result.life = {
        name: model.plans.lifetime.name,
        badge: model.plans.lifetime.badge,
        price: priceUtils.getPriceForInterval(
          lifetimePlan.amount,
          lifetimePlan.duration,
          lifetimePlan,
          false
        ),
        old: undefined,
        per: "",
        ctaColor: "yellow",
        demoLabel: model.plans.lifetime.cta.viewDemo,
        pricingNote: model.plans.lifetime.pricingNote,
        planData: lifetimePlan,
      };
    return result;
  }, [billing, model, priceUtils]);

  const onSelectPlan = (key) => () => setSelected(key);
  const handleBillingChange = (newBilling) => {
    if (newBilling !== billing) setBilling(newBilling);
  };

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 1208);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Auto-scroll to Supernova plan on smaller screens
  useEffect(() => {
    if (!gridRef.current) return;

    const handleResize = () => {
      if (window.innerWidth <= 1024) {
        // Scroll to center the Supernova plan (middle card)
        const container = gridRef.current;
        const scrollLeft = container.scrollWidth / 3; // Supernova is the middle card
        container.scrollTo({
          left: scrollLeft,
          behavior: "smooth",
        });
      }
    };

    // Initial scroll
    handleResize();

    // Listen for resize events
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const renderProPlan = () => {
    /* Render logic for Pro Plan, already in Tailwind */
    const p = plans.pro;
    if (!p) return null;
    const active = selected === "pro";
    return (
      <div
        ref={(el) => (planRefs.current["pro"] = el)}
        data-plan-key="pro"
        className={clsx(
          "w-[383px] relative rounded-[32px] bg-[#0f1417] flex flex-col items-start justify-start p-8 min-h-fit gap-1 text-left text-2xl text-white font-figtree cursor-pointer transition-all duration-300 hover:-translate-y-1 snap-center flex-shrink-0",
          active && "border-[3px] border-[#557bf4]"
        )}
        onClick={onSelectPlan("pro")}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") onSelectPlan("pro")();
        }}
        aria-pressed={active}
      >
        <header className="w-full flex flex-col items-start justify-start">
          <div className="w-full flex flex-row items-center justify-between gap-0 mb-2">
            <h3 className="text-2xl font-light text-white m-0">{p.name}</h3>
            {p.badge && (
              <span className="rounded px-1 py-0.5 text-xs font-semibold text-[#090d10] bg-[#23cf67]">
                {p.badge}
              </span>
            )}
          </div>
          <div className="w-full flex flex-row items-baseline justify-start gap-2.5 text-[40px]">
            <span key={billing} className="font-figtree relative font-semibold">
              {p.price}
            </span>
            {p.old && (
              <span
                key={`old-${billing}`}
                className="relative text-2xl line-through font-semibold opacity-50"
              >
                {p.old}
              </span>
            )}
            {p.per && (
              <span
                key={`per-${billing}`}
                className="w-[69px] relative text-lg leading-6 flex items-end h-[52px] flex-shrink-0"
              >
                {p.per}
              </span>
            )}
          </div>
          <p className="w-full relative text-base leading-6 text-white m-0">
            {p.pricingNote}
          </p>
          {renderSavingsText("pro")}
        </header>
        <div className="w-full mt-2 rounded-xl bg-[#eaf2f1] min-h-[87px] overflow-visible flex-shrink-0 flex flex-col items-start justify-start box-border gap-2 text-base text-[#121723]">
          {renderVideoCard("pro")}
        </div>
        <button className="w-full mt-4 text-lg py-3 rounded-full font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2 bg-[#557bf4] hover:bg-[#4169e1]">
          {model.plans.pro.cta.try} <SvgIcon name="ArrowRight" size={18} />
        </button>
      </div>
    );
  };
  const renderSupernovaPlan = () => {
    /* Render logic for Supernova Plan, already in Tailwind */
    const p = plans.super;
    if (!p) return null;
    const active = selected === "super";
    return (
      <div
        className="w-[383px] relative cursor-pointer snap-center flex-shrink-0"
        ref={(el) => (planRefs.current["super"] = el)}
        data-plan-key="super"
        onClick={onSelectPlan("super")}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") onSelectPlan("super")();
        }}
        aria-pressed={active}
      >
        <div className="w-[383px] rounded-t-[200px] bg-gradient-to-r from-[#5c7bf3] to-[#ff66c4] flex flex-row items-center justify-center px-6 py-3 box-border">
          <div className="relative leading-6 font-semibold text-white text-sm m-0">
            {model.plans.supernova.mostPopular}
          </div>
        </div>
        <div className="w-[383px] rounded-b-[32px] relative flex flex-col items-start justify-start gap-6 text-left text-2xl text-white font-figtree transition-all duration-300 bg-gradient-to-r from-[#5c7bf3] to-[#ff66c4] p-[3px] box-border">
          <div className="w-full h-full rounded-b-[29px] bg-[#0f1417] p-8 flex flex-col items-start justify-start gap-1 box-border">
            <div className="w-full flex flex-col items-start justify-start">
              <div className="w-full flex flex-row items-center justify-between gap-0 mb-2">
                <h3 className="relative leading-6 font-light text-white text-2xl m-0">
                  {p.name}
                </h3>
                {p.badge && (
                  <div className="rounded bg-[#23cf67] flex flex-row items-center justify-center px-1 py-0.5 text-xs text-[#090d10]">
                    <div className="relative tracking-[0.05em] leading-[150%] uppercase font-semibold">
                      {p.badge}
                    </div>
                  </div>
                )}
              </div>
              <div className="w-full flex flex-row items-end justify-start gap-2.5 text-5xl">
                <div className="relative w-full flex flex-row items-baseline justify-start gap-2.5 text-left text-[40px] text-white font-figtree">
                  <div key={billing} className="relative font-semibold">
                    {p.price}
                  </div>
                  {p.old && (
                    <div
                      key={`old-${billing}`}
                      className="relative text-2xl line-through font-semibold opacity-50"
                    >
                      {p.old}
                    </div>
                  )}
                  {p.per && (
                    <div
                      key={`per-${billing}`}
                      className="w-[69px] relative text-lg leading-6 flex items-end h-[52px] flex-shrink-0"
                    >
                      {p.per}
                    </div>
                  )}
                </div>
              </div>
              <div className="w-full relative text-base leading-6">
                {p.pricingNote}
              </div>
              {renderSavingsText("super")}
            </div>
            <div className="w-full mt-2 rounded-xl bg-[#eaf2f1] min-h-[87px] overflow-visible flex-shrink-0 flex flex-col items-start justify-start box-border gap-2 text-base text-[#121723]">
              {renderVideoCard("super")}
            </div>
            <button className="w-full mt-4 text-lg py-3 rounded-full font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2 bg-gradient-to-r from-[#557bf4] to-[#ff66c4] hover:shadow-lg hover:shadow-pink-500/30">
              {model.plans.supernova.cta.try}{" "}
              <SvgIcon name="ArrowRight" size={18} />
            </button>
          </div>
        </div>
      </div>
    );
  };
  const renderLifetimePlan = () => {
    /* Render logic for Lifetime Plan, already in Tailwind */
    const p = plans.life;
    if (!p) return null;
    const active = selected === "life";
    return (
      <div
        ref={(el) => (planRefs.current["life"] = el)}
        data-plan-key="life"
        className={clsx(
          "w-[383px] relative rounded-[32px] bg-[#0f1417] flex flex-col items-start justify-start p-8 min-h-fit gap-1 text-left text-2xl text-white font-figtree cursor-pointer transition-all duration-300 hover:-translate-y-1 snap-center flex-shrink-0",
          active && "border-[3px] border-[#fab115]"
        )}
        onClick={onSelectPlan("life")}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") onSelectPlan("life")();
        }}
        aria-pressed={active}
      >
        <header className="w-full flex flex-col items-start justify-start">
          <div className="w-full flex flex-row items-center justify-between gap-0 mb-2">
            <h3 className="text-2xl font-light text-white m-0">{p.name}</h3>
            {p.badge && (
              <span className="rounded px-1 py-0.5 text-xs font-semibold text-[#090d10] bg-[#ffcc00]">
                {p.badge}
              </span>
            )}
          </div>
          <div className="w-full flex flex-row items-baseline justify-start gap-2.5 text-[40px]">
            <span
              key={billing}
              className="font-figtree relative font-semibold text-[40px]"
            >
              {p.price}
            </span>
          </div>
          <p className="w-full relative text-base leading-6 text-white m-0">
            {p.pricingNote}
          </p>
          {renderSavingsText("life")}
        </header>
        <div className="w-full mt-2 rounded-xl bg-[#eaf2f1] min-h-[87px] overflow-visible flex-shrink-0 flex flex-col items-start justify-start box-border gap-2 text-base text-[#121723]">
          {renderVideoCard("life")}
        </div>
        <button className="w-full mt-4 text-lg py-3 rounded-full font-semibold text-black transition-all duration-200 flex items-center justify-center gap-2 bg-[#fab115] hover:bg-[#e6a014]">
          {model.plans.lifetime.cta.try} <SvgIcon name="ArrowRight" size={18} />
        </button>
      </div>
    );
  };

  return (
    <section
      ref={containerRef}
      className="relative w-full z-[6] bg-[#090d10] min-h-screen overflow-hidden flex flex-col items-center justify-start px-8 py-12 lg:px-28 text-center text-white font-figtree"
    >
      {/* Background gradient handled by a separate div for cleaner dynamic classes */}
      <div
        className={clsx(
          "absolute w-[2060px] h-[2094px] top-1/2 -translate-y-1/2 rounded-full z-0 transition-all duration-700 ease-in-out",
          selected === "pro" &&
            "left-[calc(50%-1416px)] bg-[radial-gradient(50%_50%_at_50%_50%,rgba(85,123,244,0.25),rgba(9,13,16,0.3)_40%,rgba(9,13,16,0.8)_70%,rgba(9,13,16,1))]",
          selected === "super" &&
            "left-[calc(50%-1030px)] bg-[radial-gradient(50%_50%_at_50%_50%,rgba(229,69,157,0.5),rgba(9,13,16,0.3)_40%,rgba(9,13,16,0.8)_70%,rgba(9,13,16,1))]",
          selected === "life" &&
            "left-[calc(50%-579px)] bg-[radial-gradient(50%_50%_at_50%_50%,rgba(255,210,29,0.25),rgba(9,13,16,0.3)_40%,rgba(9,13,16,0.8)_70%,rgba(9,13,16,1))]"
        )}
      />

      <div className="relative z-10 w-full pt-20">
        <BillingToggle
          billing={billing}
          setBilling={handleBillingChange}
          model={model}
        />

        <div
          ref={gridRef}
          className="flex flex-row items-center justify-start lg:justify-center gap-8 z-[2] text-left min-h-[60vh] w-full mt-4 overflow-x-auto snap-x snap-mandatory px-4 lg:px-0 scrollbar-hide"
          style={{
            scrollSnapAlign: "center",
            scrollBehavior: "smooth",
          }}
        >
          {renderProPlan()}
          {renderSupernovaPlan()}
          {renderLifetimePlan()}
        </div>
      </div>

      <div className="relative z-10 mt-12 flex w-full max-w-7xl flex-col items-center gap-8">
        {selected && plans[selected] ? (
          <p className="text-2xl font-semibold text-white">
            {model.unlockWithPlan}{" "}
            <span className={planTextStyles[selected]}>
              {model.planPrefix} {plans[selected].name}
            </span>
          </p>
        ) : (
          <p className="text-xl text-gray-300">{model.selectPlanFeatures}</p>
        )}

        <div className="flex flex-col items-center gap-6 w-full">
          <div
            ref={listRef}
            className={clsx(
              "w-full py-2",
              isMobile
                ? "grid grid-cols-3 gap-2 overflow-visible"
                : "flex gap-4 overflow-x-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/20"
            )}
          >
            {getFeaturesByPlan(selected)[selected]?.map((feature, i) => (
              <div
                key={i}
                className="flex flex-col items-center gap-2 p-3 bg-white/5 rounded-xl border-2 border-transparent cursor-pointer transition-all duration-200 hover:bg-white/10 shrink-0 min-w-[110px] md:min-w-[120px]"
                onClick={() => openFeatureModal(feature)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = planBorderColor[selected];
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "transparent";
                }}
              >
                <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center">
                  {feature.iconPath ? (
                    <CdnImage
                      src={feature.iconPath}
                      alt={feature.label}
                      width={48}
                      height={48}
                    />
                  ) : (
                    <SvgIcon name={feature.icon} size={38} />
                  )}
                </div>
                <span className="text-xs md:text-sm text-center text-white font-medium">
                  {feature.label}
                </span>
              </div>
            ))}
          </div>

          {!isMobile && (selected === "life" || selected === "super") && (
            <div className="flex items-center gap-4">
              <button
                onClick={() =>
                  listRef.current?.scrollBy({ left: -300, behavior: "smooth" })
                }
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                aria-label="Scroll left"
              >
                <SvgIcon name="ChevronLeft" size={16} />
              </button>
              <button
                onClick={() =>
                  listRef.current?.scrollBy({ left: 300, behavior: "smooth" })
                }
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                aria-label="Scroll right"
              >
                <SvgIcon name="ChevronRight" size={16} />
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center justify-center gap-4 p-4 md:p-6 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10 text-left">
          <CdnImage
            src="/homepage/offer_check.svg"
            alt="offer"
            width={24}
            height={24}
            className="shrink-0"
          />
          <div>
            <h2 className="text-base md:text-lg font-semibold text-white">
              {model.refundGuaranteeTitle}
            </h2>
            <p className="text-xs md:text-sm text-gray-300 mt-1">
              {model.refundGuaranteeDescription}
            </p>
          </div>
        </div>
      </div>

      {videoModal && (
        <VideoModal
          planName={videoModal}
          onClose={closeVideoModal}
          timezoneConfig={{
            isIndian: model.shouldShowIndianContent,
            isLatinAmerican: model.shouldShowLatinContent,
            isRestOfTheWorld: model.shouldShowROWContent,
          }}
        />
      )}
      <CommonModal isOpen={!!modalFeature} onClose={closeFeatureModal}>
        {modalFeature && (
          <>
            <div className="w-16 h-16 flex items-center justify-center mb-4">
              {modalFeature.iconPath ? (
                <CdnImage
                  src={modalFeature.iconPath}
                  alt={modalFeature.label}
                  width={64}
                  height={64}
                />
              ) : (
                <SvgIcon name={modalFeature.icon} size={48} />
              )}
            </div>
            <h4 className="text-xl font-semibold text-white mb-3 text-center">
              {modalFeature.label}
            </h4>
            <p className="text-gray-300 text-center leading-relaxed">
              {modalFeature.description}
            </p>
          </>
        )}
      </CommonModal>
    </section>
  );
};

export default PricingView;
