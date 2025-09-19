"use client";

import { useMemo, useEffect, useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import PricingView from "./PricingView";
import SvgIcon from "@/components/common/svg/SvgIcon";
import CdnImage from "@/components/common/images/CdnImage";
import { pricingApi } from "@/utils/api";
import {
  getPriceForInterval,
  getOriginalPrice,
  getOriginalAnnualPrice,
  getSavingsAmount,
  getLifetimeSavings,
  getCoffeePrice,
  isIndianTimezone,
  isLatinAmericanTimezone,
  isRestOfTheWorld,
  getTimezoneConfig,
} from "@/utils/priceUtils";

export default function PricingContainer(props) {
  const { t } = useTranslation();
  const [state, setState] = useState({
    packages: [],
    loading: true,
    error: null,
    subscription: null,
    userTimezone: null,
  });

  // Helper function to update state
  const updateState = (updates) => {
    setState((prevState) => ({ ...prevState, ...updates }));
  };

  // Detect timezone and fetch packages
  useEffect(() => {
    const initializePricing = async () => {
      try {
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        updateState({ userTimezone: timezone });

        // Fetch packages from API
        const packagesResponse = await pricingApi.fetchPackages(timezone);

        if (packagesResponse.error) {
          console.error("API Error:", packagesResponse.message);
          updateState({
            error: packagesResponse.message,
            loading: false,
            packages: [],
          });
          return;
        }

        // Filter out free plan and sort by amount
        const paidPackages = packagesResponse.data
          .filter((pkg) => pkg.id !== 1)
          .sort((a, b) => a.amount - b.amount);

        updateState({
          packages: paidPackages,
          loading: false,
        });

        // Fetch current subscription only if user is logged in
        if (typeof window !== "undefined" && localStorage.getItem("token")) {
          const subResponse = await pricingApi.fetchCurrentSubscription();
          if (!subResponse.error) {
            updateState({ subscription: subResponse.data });
          } else {
            console.log(
              "No subscription found or user not logged in:",
              subResponse.message
            );
          }
        }
      } catch (error) {
        console.error("Error initializing pricing:", error);
        updateState({
          error: "Failed to load pricing data",
          loading: false,
        });
      }
    };

    initializePricing();
  }, []);

  const tPricing = (key, fallback = "") => {
    const translationKey = `pricing.${key}`;
    const translation = t(translationKey);
    return translation === translationKey ? fallback : translation;
  };

  const tHas = (key) => {
    const translationKey = `pricing.${key}`;
    return t(translationKey) !== translationKey;
  };

  const getFeaturesByPlan = (selectedPlan) => {
    const planColors = {
      pro: "#557bf4",
      super: "#ff66c4",
      life: "#fab115",
    };

    return {
      pro: [
        {
          requiredKey: "plans.pro.features.floatingReminders",
          component: (
            <SvgIcon
              name="Notification"
              size={48}
              color={selectedPlan === "pro" ? planColors.pro : "#FFCC00"}
            />
          ),
          label: tPricing(
            "plans.pro.features.floatingReminders",
            "Unlimited unique reminders"
          ),
          description: tPricing(
            "plans.pro.features.remainVisible",
            "Reminders remain visible on screen"
          ),
        },
        {
          requiredKey: "plans.pro.features.unlimitedReminders",
          component: (
            <SvgIcon
              name="Calendar"
              size={48}
              color={selectedPlan === "pro" ? planColors.pro : "#FFCC00"}
            />
          ),
          label: tPricing(
            "plans.pro.features.unlimitedReminders",
            "Unlimited recurring reminders"
          ),
          description: tPricing(
            "plans.pro.features.createManageReminders",
            "Create and manage reminders without limits"
          ),
        },
        {
          requiredKey: "plans.pro.features.mirrorMode",
          component: (
            <SvgIcon
              name="List"
              size={48}
              color={selectedPlan === "pro" ? planColors.pro : "#FFCC00"}
            />
          ),
          label: tPricing("plans.pro.features.mirrorMode", "Custom lists"),
          description: tPricing(
            "plans.pro.features.mirrorDescription",
            "Create and organize your task lists, shopping lists, and notes without limits."
          ),
        },
        {
          requiredKey: "plans.pro.features.voiceNotes",
          component: (
            <SvgIcon
              name="VoiceNotes"
              size={48}
              color={selectedPlan === "pro" ? planColors.pro : "#FFCC00"}
            />
          ),
          label: tPricing(
            "plans.pro.features.voiceNotes",
            "Unlimited voice notes"
          ),
          description: tPricing(
            "plans.pro.features.voiceDescription",
            "Create and organize your task lists, shopping lists, and notes without limits."
          ),
        },
        {
          requiredKey: "plans.pro.features.supportedLanguages",
          component: (
            <SvgIcon
              name="SupportedLanguages"
              size={48}
              color={selectedPlan === "pro" ? planColors.pro : "#FFCC00"}
            />
          ),
          label: tPricing(
            "plans.pro.features.supportedLanguages",
            "Support in 100+ languages"
          ),
          description: tPricing(
            "plans.pro.features.supportedLanguagesDescription",
            "Advanced search functionality"
          ),
        },
        {
          requiredKey: "plans.pro.features.multiCalendarSync",
          component: (
            <SvgIcon
              name="MultiCalendarSync"
              size={48}
              color={selectedPlan === "pro" ? planColors.pro : "#FFCC00"}
            />
          ),
          label: tPricing(
            "plans.pro.features.multiCalendarSync",
            "Support in 100+ languages"
          ),
          description: tPricing(
            "plans.pro.features.multiCalendarSyncDescription",
            "Sync your reminders and notes with all your calendars from WhatsApp."
          ),
        },
      ].filter((f) => tHas(f.requiredKey)),
      super: [
        {
          component: (
            <SvgIcon
              name="Notification"
              size={48}
              color={selectedPlan === "super" ? planColors.super : "#FFCC00"}
            />
          ),
          label: tPricing(
            "plans.supernova.features.floatingReminders",
            "Unlimited unique reminders"
          ),
          description: tPricing(
            "plans.supernova.features.remainVisible",
            "Reminders remain visible on screen"
          ),
        },
        {
          component: (
            <SvgIcon
              name="Calendar"
              size={48}
              color={selectedPlan === "super" ? planColors.super : "#FFCC00"}
            />
          ),
          label: tPricing(
            "plans.supernova.features.unlimitedReminders",
            "Unlimited recurring reminders"
          ),
          description: tPricing(
            "plans.supernova.features.createManageReminders",
            "Set up daily, weekly, or custom reminders for your routines and commitments."
          ),
        },

        {
          component: (
            <SvgIcon
              name="PremiumSupport"
              size={48}
              color={selectedPlan === "super" ? planColors.super : "#FFCC00"}
            />
          ),
          label: tPricing(
            "plans.supernova.features.premiumSupport",
            "Premium Support"
          ),
          description: tPricing(
            "plans.supernova.features.priorityAttention",
            "Priority customer support attention"
          ),
        },
        {
          component: (
            <SvgIcon
              name="VoiceNotes"
              size={48}
              color={selectedPlan === "super" ? planColors.super : "#FFCC00"}
            />
          ),
          label: tPricing(
            "plans.supernova.features.voiceNotes",
            "Unlimited voice notes"
          ),
          description: tPricing(
            "plans.supernova.features.voiceDescription",
            "Advanced voice recording"
          ),
        },
        {
          component: (
            <CdnImage
              src="https://cdn.memorae.ai/mem-next/homepage/chatGpt.svg"
              alt="ChatGPT"
              width={48}
              height={48}
            />
          ),
          label: tPricing(
            "plans.supernova.features.chatGptIntegrated",
            "ChatGPT Integration"
          ),
          description: tPricing(
            "plans.supernova.features.aiAssistantPlatform",
            "AI assistant platform integration"
          ),
        },
        {
          component: (
            <SvgIcon
              name="List"
              size={48}
              color={selectedPlan === "super" ? planColors.super : "#FFCC00"}
            />
          ),
          label: tPricing(
            "plans.supernova.features.mirrorMode",
            "Custom lists"
          ),
          description: tPricing(
            "plans.supernova.features.mirrorDescription",
            "Create and organize your task lists, shopping lists, and notes without limits."
          ),
        },
        {
          component: (
            <SvgIcon
              name="ImageAnalysis"
              size={48}
              color={selectedPlan === "super" ? planColors.super : "#FFCC00"}
            />
          ),
          label: tPricing(
            "plans.supernova.features.imageAnalysis",
            "Image Analysis"
          ),
          description: tPricing(
            "plans.supernova.features.imageAnalysisDescription",
            "Create and organize your task lists, shopping lists, and notes without limits."
          ),
        },
        {
          component: (
            <SvgIcon
              name="MultiCalendarSync"
              size={48}
              color={selectedPlan === "super" ? planColors.super : "#FFCC00"}
            />
          ),
          label: tPricing(
            "plans.supernova.features.multiCalendarSync",
            "Multi-Calendar Sync"
          ),
          description: tPricing(
            "plans.supernova.features.multiCalendarSyncDescription",
            "Create and organize your task lists, shopping lists, and notes without limits."
          ),
        },
        {
          component: (
            <SvgIcon
              name="SupportedLanguages"
              size={48}
              color={selectedPlan === "super" ? planColors.super : "#FFCC00"}
            />
          ),
          label: tPricing(
            "plans.supernova.features.supportedLanguages",
            "Support in 100+ languages"
          ),
          description: tPricing(
            "plans.supernova.features.supportedLanguagesDescription",
            "Create and organize your task lists, shopping lists, and notes without limits."
          ),
        },
        {
          component: (
            <SvgIcon
              name="Dashboard"
              size={48}
              color={selectedPlan === "super" ? planColors.super : "#FFCC00"}
            />
          ),
          label: tPricing("plans.supernova.features.dashboard", "Dashboard"),
          description: tPricing(
            "plans.supernova.features.dashboardDescription",
            "Comprehensive dashboard view"
          ),
        },
        {
          component: (
            <SvgIcon
              name="Search"
              size={48}
              color={selectedPlan === "super" ? planColors.super : "#FFCC00"}
            />
          ),
          label: tPricing("plans.supernova.features.search", "Search"),
          description: tPricing(
            "plans.supernova.features.searchDescription",
            "Advanced search functionality"
          ),
        },
      ],
      life: [
        {
          component: (
            <SvgIcon
              name="Calendar"
              size={48}
              color={selectedPlan === "life" ? planColors.life : "#FFCC00"}
            />
          ),
          label: tPricing(
            "plans.lifetime.features.unlimitedReminders",
            "Unlimited recurring reminders"
          ),
          description: tPricing(
            "plans.lifetime.features.createManageReminders",
            "Set up daily, weekly, or custom reminders for your routines and commitments."
          ),
        },
        {
          component: (
            <SvgIcon
              name="Notification"
              size={48}
              color={selectedPlan === "life" ? planColors.life : "#FFCC00"}
            />
          ),
          label: tPricing(
            "plans.lifetime.features.floatingReminders",
            "Unlimited recurring reminders"
          ),
          description: tPricing(
            "plans.lifetime.features.createManageReminders",
            "Set up daily, weekly, or custom reminders for your routines and commitments."
          ),
        },
        {
          component: (
            <SvgIcon
              name="VoiceNotes"
              size={48}
              color={selectedPlan === "life" ? planColors.life : "#FFCC00"}
            />
          ),
          label: tPricing(
            "plans.lifetime.features.voiceNotes",
            "Unlimited recurring reminders"
          ),
          description: tPricing(
            "plans.lifetime.features.voiceDescription",
            "Advanced voice recording"
          ),
        },
        {
          component: (
            <SvgIcon
              name="SupportedLanguages"
              size={48}
              color={selectedPlan === "life" ? planColors.life : "#FFCC00"}
            />
          ),
          label: tPricing(
            "plans.lifetime.features.supportedLanguages",
            "Unlimited recurring reminders"
          ),
          description: tPricing(
            "plans.lifetime.features.supportedLanguagesDescription",
            "Interact and receive reminders in your preferred language, without border limits."
          ),
        },
        {
          component: (
            <SvgIcon
              name="MultiCalendarSync"
              size={48}
              color={selectedPlan === "life" ? planColors.life : "#FFCC00"}
            />
          ),
          label: tPricing(
            "plans.lifetime.features.multiCalendarSync",
            "Unlimited recurring reminders"
          ),
          description: tPricing(
            "plans.lifetime.features.multiCalendarSyncDescription",
            "Sync your reminders and notes with all your calendars from WhatsApp."
          ),
        },
        {
          component: (
            <SvgIcon
              name="List"
              size={48}
              color={selectedPlan === "life" ? planColors.life : "#FFCC00"}
            />
          ),
          label: tPricing(
            "plans.lifetime.features.mirrorMode",
            "Unlimited recurring reminders"
          ),
          description: tPricing(
            "plans.lifetime.features.mirrorDescription",
            "Create and organize your task lists, shopping lists, and notes without limits."
          ),
        },
        {
          component: (
            <SvgIcon
              name="Dashboard"
              size={48}
              color={selectedPlan === "life" ? planColors.life : "#FFCC00"}
            />
          ),
          label: tPricing(
            "plans.lifetime.features.dashboard",
            "Unlimited recurring reminders"
          ),
          description: tPricing(
            "plans.lifetime.features.dashboardDescription",
            "Comprehensive dashboard view"
          ),
        },
        {
          component: (
            <SvgIcon
              name="PremiumSupport"
              size={48}
              color={selectedPlan === "life" ? planColors.life : "#FFCC00"}
            />
          ),
          label: tPricing(
            "plans.lifetime.features.premiumSupport",
            "Unlimited recurring reminders"
          ),
          description: tPricing(
            "plans.lifetime.features.premiumSupportDescription",
            "Priority 24/7 customer support"
          ),
        },
        {
          component: (
            <SvgIcon
              name="Search"
              size={48}
              color={selectedPlan === "life" ? planColors.life : "#FFCC00"}
            />
          ),
          label: tPricing(
            "plans.lifetime.features.search",
            "Unlimited unique reminders"
          ),
          description: tPricing(
            "plans.lifetime.features.searchDescription",
            "Reminders remain visible on screen"
          ),
        },
        {
          component: (
            <SvgIcon
              name="Search"
              size={48}
              color={selectedPlan === "life" ? planColors.life : "#FFCC00"}
            />
          ),
          label: tPricing("plans.lifetime.features.search", "Search"),
          description: tPricing(
            "plans.lifetime.features.searchDescription",
            "Advanced search functionality"
          ),
        },
        {
          component: (
            <SvgIcon
              name="GuaranteedAccess"
              size={48}
              color={selectedPlan === "life" ? planColors.life : "#FFCC00"}
            />
          ),
          label: tPricing(
            "plans.lifetime.features.guaranteedAccess",
            "Guaranteed Access to Future Features"
          ),
          description: tPricing(
            "plans.lifetime.features.guaranteedAccessDescription",
            "All new features and improvements we launch will be yours automatically, at no additional cost."
          ),
        },
        {
          component: (
            <SvgIcon
              name="RecurringPayments"
              size={48}
              color={selectedPlan === "life" ? planColors.life : "#FFCC00"}
            />
          ),
          label: tPricing(
            "plans.lifetime.features.recurringPayments",
            "No subscriptions or recurring payments"
          ),
          description: tPricing(
            "plans.lifetime.features.recurringPaymentsDescription",
            "One payment and lifetime access. No automatic renewals, no surprises, no worries."
          ),
        },
      ],
    };
  };

  const model = useMemo(() => {
    if (!state.userTimezone) return null;

    // Use existing timezone utilities to determine content type
    const shouldShowIndianContent = isIndianTimezone(state.userTimezone);
    const shouldShowLatinContent = isLatinAmericanTimezone(state.userTimezone);
    const shouldShowROWContent = isRestOfTheWorld(state.userTimezone);
    const timezoneConfig = getTimezoneConfig(
      state.userTimezone,
      state.packages
    );

    return {
      currentLanguage: shouldShowIndianContent
        ? "hi-IN"
        : shouldShowLatinContent
        ? "es"
        : "en-US",
      userTimezone: state.userTimezone,
      shouldShowIndianContent,
      shouldShowLatinContent,
      shouldShowROWContent,
      timezoneConfig,
      packages: state.packages,
      subscription: state.subscription,
      loading: state.loading,
      error: state.error,
      billingCycle: tPricing("billingCycle", "Billing Cycle"),
      interval: {
        monthly: tPricing("interval.monthly", "Monthly"),
        annual: tPricing("interval.annual", "Annual"),
        discount: tPricing("interval.discount", "Save 40%"),
        perMonth: tPricing("interval.perMonth", "/month"),
      },
      planPrefix: tPricing("planPrefix", "Memorae"),
      unlockWithPlan: tPricing("unlockWithPlan", "Unlock with"),
      selectPlanFeatures: tPricing(
        "selectPlanFeatures",
        "Select a plan to see features"
      ),
      refundGuaranteeTitle: tPricing("refundGuaranteeTitle"),
      refundGuaranteeDescription: tPricing(
        "refundGuaranteeDescription",
        "Try risk-free with full refund"
      ),
      annually: tPricing("annually", "12 months for"),
      lifetimeSavings: tPricing(
        "lifetimeSavings",
        "Save more than {{amount}} in 5 years compared to monthly subscription"
      ),
      plans: {
        pro: {
          name: tPricing("plans.pro.name", "Pro"),
          badge: tPricing("plans.pro.badge", "Best Value"),
          cta: {
            viewDemo: tPricing("plans.pro.cta.viewDemo", "View Demo"),
            try: tPricing("plans.pro.cta.try", "Try Pro"),
          },
        },
        supernova: {
          name: tPricing("plans.supernova.name", "Supernova"),
          badge: tPricing("plans.supernova.badge", "Most Popular"),
          mostPopular: tPricing("plans.supernova.mostPopular", "Most Popular"),
          cta: {
            viewDemo: tPricing("plans.supernova.cta.viewDemo", "View Demo"),
            try: tPricing("plans.supernova.cta.try", "Try Supernova"),
          },
        },
        lifetime: {
          name: tPricing("plans.lifetime.name", "Lifetime"),
          badge: tPricing("plans.lifetime.badge", "One-time Payment"),
          cta: {
            viewDemo: tPricing("plans.lifetime.cta.viewDemo", "View Demo"),
            try: tPricing("plans.lifetime.cta.try", "Get Lifetime"),
          },
        },
      },
    };
  }, [t, state]);

  // Return loading state while timezone is being detected
  if (!model) {
    return (
      <div className="pricing-loading">
        <div className="pricing-loading-text">Loading pricing...</div>
      </div>
    );
  }

  return (
    <PricingView
      model={model}
      getFeaturesByPlan={getFeaturesByPlan}
      priceUtils={{
        getPriceForInterval: (amount, duration, plan, showOriginal) =>
          getPriceForInterval(amount, duration, plan, showOriginal),
        getOriginalPrice: (amount, plan) => getOriginalPrice(amount, plan),
        getOriginalAnnualPrice: (amount, plan) =>
          getOriginalAnnualPrice(amount, plan),
        getSavingsAmount: (amount, plan) =>
          getSavingsAmount(amount, plan, state.userTimezone),
        getLifetimeSavings: (plan) => getLifetimeSavings(plan),
        getCoffeePrice: (plan) => getCoffeePrice(plan),
      }}
      {...props}
    />
  );
}
