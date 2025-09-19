"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CdnImage from "@/components/common/images/CdnImage";
import CommonModal from "@/components/common/Modal";
import SvgIcon from "@/components/common/svg/SvgIcon";
import { VideoCard } from "@/components/common/card";
import { planVideos } from "@/constants/planVideos";
import VideoModal from "@/components/common/modal/VideoModal";
import BillingToggle from "./BillingToggle";
import { useNavbarColor } from "@/hooks/useNavbarColor";
import { handlePlanCheckout } from "@/utils/checkout";
import styles from "@/styles/components/sections/pricing/Pricing.module.css";

gsap.registerPlugin(ScrollTrigger);

const PricingView = ({ model, getFeaturesByPlan, priceUtils }) => {
  const [billing, setBilling] = useState("anual");
  const [selected, setSelected] = useState("super");
  const [modalFeature, setModalFeature] = useState(null);
  const [videoModal, setVideoModal] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const planRefs = useRef({});
  const modalRef = useRef(null);
  const containerRef = useRef(null);
  const gridRef = useRef(null);
  useNavbarColor([
    {
      ref: containerRef,
      theme: "dark",
    },
  ]);

  const openVideoModal = (planName) => {
    setVideoModal(planName);
    console.log("Opening modal for plan:", planName);
  };

  const closeVideoModal = () => {
    if (modalRef.current) {
      gsap.to(modalRef.current, {
        opacity: 0,
        scale: 0.8,
        duration: 0.3,
        ease: "power2.out",
        onComplete: () => setVideoModal(null),
      });
    } else {
      setVideoModal(null);
    }
  };

  const handleTryPlan = (planKey) => {
    const plan = plans[planKey];

    if (plan && plan.planData) {
      handlePlanCheckout(plan.planData, planKey, billing);
    } else {
      console.error('Plan data not found for checkout:', planKey);
      alert('Plan data not available. Please try again.');
    }
  };

  const renderVideoCard = (planName) => {
    if (!model.userTimezone) return null;

    // Use timezone configuration from model (no duplicate logic)
    const shouldShowIndianContent = model.shouldShowIndianContent;
    const isRestOfTheWorld = model.shouldShowROWContent;
    const videoData = planVideos(shouldShowIndianContent, isRestOfTheWorld)[
      planName
    ];

    if (!videoData) {
      console.error(`No video data found for plan: ${planName}`);
      return null;
    }

    const normalizedPlanName =
      planName.toLowerCase() === "life"
        ? "lifetime"
        : planName.toLowerCase() === "super"
        ? "supernova"
        : planName.toLowerCase();
    const planData = model.plans[normalizedPlanName];

    if (!planData) {
      console.error(
        `No plan data found for normalized plan: ${normalizedPlanName}`
      );
      return null;
    }

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

    // Only show savings for annual plans
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
        <div className={styles.savingsText}>
          {model.annually} {annualPrice} ({originalAnnualPrice})
        </div>
      );
    }

    // Show lifetime savings for lifetime plan
    if (planKey === "life") {
      const lifetimeSavings = priceUtils.getLifetimeSavings(plan.planData);
      return (
        <div className={styles.savingsText}>
          {model.lifetimeSavings.replace("{{amount}}", lifetimeSavings)}
        </div>
      );
    }

    return null;
  };

  const openFeatureModal = (feature) => setModalFeature(feature);
  const closeFeatureModal = () => setModalFeature(null);
  const listRef = useRef();

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;

    // Check if we're on mobile
    const isMobile = window.innerWidth <= 1208;

    if (isMobile) {
      // Mobile: Use grid layout
      el.style.display = "grid";
      el.style.gridTemplateColumns = "repeat(3, 1fr)";
      el.style.gap = "8px";
      el.style.overflow = "visible";
      el.style.padding = "4px 0";
      el.classList.remove("scrollable");
    } else {
      // Desktop: Use scrollable layout
      el.style.display = "flex";
      el.style.overflowX = "auto";
      el.style.scrollBehavior = "smooth";
      el.style.gap = "16px";

      if (el.scrollWidth > el.clientWidth) {
        el.classList.add("scrollable");
        console.log("Features list is scrollable");
      } else {
        el.classList.remove("scrollable");
        console.log("Features list is NOT scrollable");
      }
    }
  }, [selected]);

  const plans = useMemo(() => {
    if (!model.packages || !priceUtils) return {};

    const isAnnual = billing === "anual";

    // Filter packages based on billing cycle
    const filteredPackages = model.packages.filter((pkg) => {
      if (isAnnual) {
        return pkg.duration === "year" || pkg.duration === "forever";
      } else {
        return pkg.duration === "month" || pkg.duration === "forever";
      }
    });

    // Find specific plans
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

    // Find monthly plans for showing old prices when annual is selected
    const proMonthly = model.packages.find(
      (pkg) => pkg.name === "Pro" && pkg.duration === "month"
    );
    const supernovaMonthly = model.packages.find(
      (pkg) => pkg.name === "Supernova" && pkg.duration === "month"
    );

    const result = {};

    if (proPlan) {
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
    }

    if (supernovaPlan) {
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
    }

    if (lifetimePlan) {
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
    }

    return result;
  }, [billing, model, priceUtils]);

  const onSelectPlan = (key) => () => setSelected(key);

  // Handle billing change with smooth crossfade (no jumping)
  const handleBillingChange = (newBilling) => {
    if (newBilling === billing) return;
    setBilling(newBilling);
  };

  // Get border color based on selected plan
  const getPlanBorderColor = (planKey) => {
    switch (planKey) {
      case "pro":
        return "#3B82F6"; // Blue for Pro
      case "super":
        return "#8B5CF6"; // Purple for Supernova
      case "life":
        return "#F59E0B"; // Yellow for Lifetime
      default:
        return "#6B7280"; // Default gray
    }
  };

  const renderProPlan = () => {
    const p = plans.pro;
    if (!p) return null;
    const active = selected === "pro";
    return (
      <div
        ref={(el) => (planRefs.current["pro"] = el)}
        className={`${styles.pricingCard} ${styles.pricingCardPro} ${
          active ? styles.isActive : ""
        }`}
        onClick={onSelectPlan("pro")}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") onSelectPlan("pro")();
        }}
        aria-pressed={active}
      >
        <header className={styles.pricingCardHeader}>
          <div className={styles.pricingCardTitleRow}>
            <h3 className={styles.pricingCardTitle}>{p.name}</h3>
            {p.badge && (
              <span className={`${styles.pill} ${styles.pillGreen}`}>
                {p.badge}
              </span>
            )}
          </div>
          <div className={styles.pricingCardPrice}>
            <span
              key={billing}
              className={`${styles.pricingCardAmount} ${styles.priceAnim}`}
            >
              {p.price}
            </span>
            {p.old && (
              <span
                key={`old-${billing}`}
                className={`${styles.pricingCardOld} ${styles.priceAnim}`}
              >
                {p.old}
              </span>
            )}
            {p.per && (
              <span
                key={`per-${billing}`}
                className={`${styles.pricingCardPer} ${styles.priceAnim}`}
              >
                {p.per}
              </span>
            )}
          </div>
          <p className={styles.smallText}>{p.pricingNote}</p>
          {renderSavingsText("pro")}
        </header>
        <div className={styles.pricingCardDemo}>{renderVideoCard("pro")}</div>
        <button
          className={`${styles.cta} ${
            styles[
              `cta${p.ctaColor.charAt(0).toUpperCase() + p.ctaColor.slice(1)}`
            ] || ""
          }`}
          onClick={() => handleTryPlan('pro')}
        >
          {model.plans.pro.cta.try} <SvgIcon name="ArrowRight" size={22} />
        </button>
      </div>
    );
  };

  const renderSupernovaPlan = () => {
    const p = plans.super;
    if (!p) return null;
    const active = selected === "super";
    return (
      <div
        className={styles.frameParent}
        ref={(el) => (planRefs.current["super"] = el)}
        onClick={onSelectPlan("super")}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") onSelectPlan("super")();
        }}
        aria-pressed={active}
      >
        <div className={styles.msPopularWrapper}>
          <div className={styles.msPopular}>
            {model.plans.supernova.mostPopular}
          </div>
        </div>
        <div className={styles.frameGroup}>
          <div className={styles.frameGroupInner}>
            <div className={styles.frameContainer}>
              <div className={styles.supernovaParent}>
                <h3 className={styles.supernova}>{p.name}</h3>
                {p.badge && (
                  <div className={styles.textWrapper}>
                    <div className={styles.text}>{p.badge}</div>
                  </div>
                )}
              </div>
              <div className={styles.frameDiv}>
                <div className={styles.parent}>
                  <div
                    key={billing}
                    className={`${styles.div} ${styles.priceAnim}`}
                  >
                    {p.price}
                  </div>
                  {p.old && (
                    <div
                      key={`old-${billing}`}
                      className={`${styles.div1} ${styles.priceAnim}`}
                    >
                      {p.old}
                    </div>
                  )}
                  {p.per && (
                    <div
                      key={`per-${billing}`}
                      className={`${styles.porMes} ${styles.priceAnim}`}
                    >
                      {p.per}
                    </div>
                  )}
                </div>
              </div>
              <div className={styles.mesesPor8988}>{p.pricingNote}</div>
              {renderSavingsText("super")}
            </div>
            <div className={styles.pricingCardDemo}>
              {renderVideoCard("super")}
            </div>
            <button
              className={`${styles.cta} ${
                styles[
                  `cta${
                    p.ctaColor.charAt(0).toUpperCase() + p.ctaColor.slice(1)
                  }`
                ] || ""
              }`}
              onClick={() => handleTryPlan('super')}
            >
              {model.plans.supernova.cta.try}{" "}
              <SvgIcon name="ArrowRight" size={22} />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderLifetimePlan = () => {
    const p = plans.life;
    if (!p) return null;
    const active = selected === "life";
    return (
      <div
        ref={(el) => (planRefs.current["life"] = el)}
        className={`${styles.pricingCard} ${active ? styles.isActive : ""} ${
          styles.pricingCardLifetime
        }`}
        onClick={onSelectPlan("life")}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") onSelectPlan("life")();
        }}
        aria-pressed={active}
      >
        <header className={styles.pricingCardHeader}>
          <div className={styles.pricingCardTitleRow}>
            <h3 className={styles.pricingCardTitle}>{p.name}</h3>
            {p.badge && (
              <span className={`${styles.pill} ${styles.pillYellow}`}>
                {p.badge}
              </span>
            )}
          </div>
          <div className={styles.pricingCardPrice}>
            <span
              key={billing}
              className={`${styles.pricingCardAmount} ${styles.priceAnim}`}
            >
              {p.price}
            </span>
            {p.old && (
              <span
                key={`old-${billing}`}
                className={`${styles.pricingCardOld} ${styles.priceAnim}`}
              >
                {p.old}
              </span>
            )}
            {p.per && (
              <span
                key={`per-${billing}`}
                className={`${styles.pricingCardPer} ${styles.priceAnim}`}
              >
                {p.per}
              </span>
            )}
          </div>
          <p className={styles.smallText}>{p.pricingNote}</p>
          {renderSavingsText("life")}
        </header>
        <div className={styles.pricingCardDemo}>
          {renderVideoCard("lifetime")}
        </div>
        <button
          className={`${styles.cta} ${
            styles[
              `cta${p.ctaColor.charAt(0).toUpperCase() + p.ctaColor.slice(1)}`
            ] || ""
          }`}
          onClick={() => handleTryPlan('life')}
        >
          {model.plans.lifetime.cta.try} <SvgIcon name="ArrowRight" size={22} />
        </button>
      </div>
    );
  };

  useEffect(() => {
    const grid = gridRef.current;
    const supernovaPlan = planRefs.current.super;

    if (window.innerWidth <= 600 && grid && supernovaPlan) {
      const scrollAmount = supernovaPlan.offsetLeft - grid.offsetLeft - 20; // Account for padding
      grid.scrollLeft = scrollAmount;
    }
  }, [plans]);

  useEffect(() => {
    if (window.innerWidth > 600) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const planKey = entry.target.getAttribute("data-plan-key");
            if (planKey && selected !== planKey) {
              setSelected(planKey);
            }
          }
        });
      },
      {
        root: document.querySelector(".slider-container"),
        threshold: 0.6,
      }
    );

    Object.entries(planRefs.current).forEach(([key, el]) => {
      if (el) {
        el.setAttribute("data-plan-key", key);
        observer.observe(el);
      }
    });

    return () => observer.disconnect();
  }, [selected]);

  // Add resize listener to handle orientation changes and window resizing
  useEffect(() => {
    const handleResize = () => {
      const el = listRef.current;
      if (!el) return;

      const isMobile = window.innerWidth <= 1208;

      if (isMobile) {
        // Mobile: Use grid layout
        el.style.display = "grid";
        el.style.gridTemplateColumns = "repeat(3, 1fr)";
        el.style.gap = "8px";
        el.style.overflow = "visible";
        el.style.padding = "4px 0";
        el.classList.remove("scrollable");
      } else {
        // Desktop: Use scrollable layout
        el.style.display = "flex";
        el.style.overflowX = "auto";
        el.style.scrollBehavior = "smooth";
        el.style.gap = "16px";
        el.style.padding = "8px 0";
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = window.innerWidth <= 768; // Define a breakpoint for mobile

  return (
    <section
      id="pricing"
      ref={containerRef}
      className={`${styles.pricing} ${styles[`${selected}Bg`] || ""}`}
      data-theme="light"
    >
      {/* Mobile-only title that shows above cosmic section */}

      <div className={styles.pricingInner}>
        <div className={styles.pricingToggle}>
          <BillingToggle
            billing={billing}
            setBilling={handleBillingChange}
            model={model}
          />
        </div>

        <div
          ref={gridRef}
          className={`${styles.pricingGrid} ${styles.sliderContainer}`}
        >
          {renderProPlan()}
          {renderSupernovaPlan()}
          {renderLifetimePlan()}
        </div>

        {/* Mobile Swipe Indicator */}
      </div>

      <div className={styles.pricingContent}>
        <div className={styles.offerContainerMobile}>
          <div className={styles.offer}>
            <CdnImage
              src="https://cdn.memorae.ai/mem-next/homepage/offer_check.svg"
              alt="offer"
              width={20}
              height={20}
            />
            <h2 className={styles.offerTitle}>
              {model.refundGuaranteeTitle}
              <span className={styles.offerDescription}>
                {model.refundGuaranteeDescription}
              </span>
            </h2>
          </div>
        </div>
        <div>
          {selected && plans[selected] ? (
            <p className={styles.pricingSubtitle}>
              {model.unlockWithPlan}{" "}
              <span
                className={
                  styles[
                    `plan${
                      selected.charAt(0).toUpperCase() + selected.slice(1)
                    }`
                  ] || ""
                }
              >
                {model.planPrefix} {plans[selected].name}
              </span>
            </p>
          ) : (
            <p>{model.selectPlanFeatures}</p>
          )}
        </div>

        <div className={styles.pricingExtras}>
          {selected && (
            <div className={styles.featuresContainer}>
              <div className={styles.featuresList} ref={listRef}>
                {(() => {
                  const items = getFeaturesByPlan(selected)[selected] || [];
                  const target = "Unlimited unique reminders";
                  const ordered = [...items].sort((a, b) => {
                    const aIs = (a?.label || "").trim() === target;
                    const bIs = (b?.label || "").trim() === target;
                    if (aIs && !bIs) return -1;
                    if (!aIs && bIs) return 1;
                    return 0;
                  });
                  return ordered;
                })().map((feature, i) => (
                  <div
                    key={i}
                    className={styles.featureItem}
                    onClick={() => openFeatureModal(feature)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform =
                        "scale3d(1.05, 1.05, 1)";
                      e.currentTarget.style.borderColor =
                        getPlanBorderColor(selected);
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scale3d(1, 1, 1)";
                      e.currentTarget.style.borderColor = "";
                    }}
                    style={{ flexShrink: 0 }}
                  >
                    <div className={styles.featureIcon}>
                      {typeof feature.component === "string" ||
                      feature.component?.src ? (
                        <CdnImage
                          src={feature.component}
                          alt={feature.label}
                          width={48}
                          height={48}
                        />
                      ) : (
                        feature.component
                      )}
                    </div>
                    <span className={styles.featureLabel}>{feature.label}</span>
                  </div>
                ))}
              </div>

              {/* Navigation arrows for lifetime and supernova plans */}
              {(selected === "life" || selected === "super") && (
                <div className={styles.featuresNavigation}>
                  <button
                    className={`${styles.featuresNavBtn} ${styles.featuresNavBtnLeft}`}
                    onClick={() => {
                      const list = listRef.current;
                      if (list) {
                        console.log(
                          "Scrolling left, current scrollLeft:",
                          list.scrollLeft
                        );
                        list.scrollBy({ left: -300, behavior: "smooth" });
                      } else {
                        console.log("listRef.current is null");
                      }
                    }}
                    aria-label="Scroll features left"
                  >
                    <SvgIcon name="LeftIcon" size={14} />
                  </button>

                  <button
                    className={`${styles.featuresNavBtn} ${styles.featuresNavBtnRight}`}
                    onClick={() => {
                      const list = listRef.current;
                      if (list) {
                        console.log(
                          "Scrolling right, current scrollLeft:",
                          list.scrollLeft
                        );
                        list.scrollBy({ left: 300, behavior: "smooth" });
                      } else {
                        console.log("listRef.current is null");
                      }
                    }}
                    aria-label="Scroll features right"
                  >
                    <SvgIcon name="RightIcon" size={20} />
                  </button>
                </div>
              )}
            </div>
          )}

          <div className={styles.offerContainer}>
            <div className={styles.offer}>
              <CdnImage
                src="https://cdn.memorae.ai/mem-next/homepage/offer_check.svg"
                alt="offer"
                width={20}
                height={20}
              />
              <h2 className={styles.offerTitle}>
                {model.refundGuaranteeTitle}
                <span className={styles.offerDescription}>
                  {model.refundGuaranteeDescription}
                </span>
              </h2>
            </div>
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
            <div className={styles.modalIcon}>
              {typeof modalFeature.component === "string" ||
              modalFeature.component?.src ? (
                <CdnImage
                  src={modalFeature.component}
                  alt={modalFeature.label}
                  width={64}
                  height={64}
                />
              ) : (
                modalFeature.component
              )}
            </div>
            <h4 className={styles.modalTitle}>{modalFeature.label}</h4>
            <p className={styles.modalDescription}>
              {modalFeature.description}
            </p>
          </>
        )}
      </CommonModal>
    </section>
  );
};

export default PricingView;
