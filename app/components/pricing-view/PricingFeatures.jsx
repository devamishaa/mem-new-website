import { useState } from "react";
import SvgIcon from "../common/svg/SvgIcon";
import CdnImage from "@/app/components/common/CdnImage";

// Tailwind classes for the selected plan's text color/gradient
const planTextStyles = {
  pro: "text-[#557bf4]",
  super:
    "bg-gradient-to-r from-[#557bf4] to-[#ff48ad] bg-clip-text text-transparent",
  life: "text-[#fab115]",
};

const PricingFeatures = ({ model, featuresByPlan }) => {
  const [selectedPlan, setSelectedPlan] = useState("super");

  const currentFeatures = featuresByPlan[selectedPlan] || [];

  const renderFeatureIcon = (feature) => {
    if (feature.iconPath) {
      return (
        <CdnImage
          src={feature.iconPath}
          alt={feature.label}
          width={feature.iconSize || 38}
          height={feature.iconSize || 38}
          className="h-[30px] w-[30px] object-cover" // Corresponds to .featureIcon img
        />
      );
    }

    if (feature.icon) {
      // Note: The icon's color depends on a parent class (.proBg, .superBg, etc.)
      // This logic might need to be passed down as a prop if not already handled by context.
      return (
        <SvgIcon
          name={feature.icon}
          size={feature.iconSize || 38}
          className="flex h-[30px] w-[30px] items-center justify-center" // Corresponds to .featureIcon
        />
      );
    }

    return null;
  };

  const getPlanDisplayName = () => {
    const planNames = {
      pro: model.plans.pro.name,
      super: model.plans.supernova.name,
      life: model.plans.lifetime.name,
    };
    return planNames[selectedPlan] || "";
  };

  return (
    <div className="w-full" data-pricing-features>
      <div className="header-container">
        <p className="self-stretch m-0 text-center text-lg sm:text-xl lg:text-2xl font-semibold">
          {model.unlockWithPlan}{" "}
          <span className={planTextStyles[selectedPlan]}>
            {model.planPrefix} {getPlanDisplayName()}
          </span>
        </p>
      </div>

      <div className="self-stretch z-[3] mt-4 flex flex-col items-center justify-start gap-3.5">
        {currentFeatures.length > 0 ? (
          <div
            className="grid grid-cols-3 gap-2 p-3 justify-center overflow-visible md:p-6 lg:flex lg:flex-row lg:overflow-x-auto lg:gap-2 lg:p-1 lg:px-5"
            data-features-list
          >
            {currentFeatures.map((feature, index) => (
              <div
                key={index}
                className="flex h-24 w-28 shrink-0 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg bg-[#0f1417] p-2.5 transition-colors duration-200 ease-in-out hover:bg-white/5 lg:h-[6rem] lg:w-[7rem]"
                data-feature-item
              >
                <div>
                  {" "}
                  {/* Corresponds to featureIconContainer */}
                  {renderFeatureIcon(feature)}
                </div>
                <div>
                  {" "}
                  {/* Corresponds to featureContent */}
                  <h4 className="self-stretch m-0 text-center text-[10px] sm:text-[11px] font-semibold text-white">
                    {feature.label}
                  </h4>
                  {/* featureDescription was not in CSS, added sensible defaults */}
                  <p className="m-0 text-center text-[9px] sm:text-[10px] text-gray-400">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="p-8 text-sm sm:text-base text-gray-400">
            {model.selectPlanFeatures}
          </p>
        )}

        {/* Guarantee section styled with sensible defaults */}
        <div className="mt-6 flex items-center gap-4 rounded-xl bg-white/[.02] p-4 text-left shadow-inner">
          <CdnImage
            src="/homepage/offer_check.svg"
            alt="Guarantee"
            width={20}
            height={20}
            className="shrink-0"
          />
          <div>
            <h4 className="text-sm sm:text-base font-semibold text-white">
              {model.refundGuaranteeTitle}
            </h4>
            <p className="text-xs sm:text-sm text-gray-400">
              {model.refundGuaranteeDescription}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingFeatures;
