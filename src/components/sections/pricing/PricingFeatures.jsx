import { useState } from "react";
import styles from "@/styles/components/sections/pricing/Pricing.module.css";
import SvgIcon from "@/components/common/svg/SvgIcon";
import CdnImage from "@/components/common/images/CdnImage";

const PricingFeatures = ({ model, featuresByPlan }) => {
  const [selectedPlan, setSelectedPlan] = useState("super");

  const currentFeatures = featuresByPlan[selectedPlan] || [];
  const orderedFeatures = [...currentFeatures].sort((a, b) => {
    const target = "Unlimited unique reminders";
    const aIsTarget = (a?.label || "").trim() === target;
    const bIsTarget = (b?.label || "").trim() === target;
    if (aIsTarget && !bIsTarget) return -1;
    if (!aIsTarget && bIsTarget) return 1;
    return 0;
  });

  const renderFeatureIcon = (feature) => {
    if (feature.iconPath) {
      return (
        <CdnImage
          src={feature.iconPath}
          alt={feature.label}
          width={feature.iconSize || 38}
          height={feature.iconSize || 38}
          className={styles.featureIconImage}
        />
      );
    }

    if (feature.icon) {
      return (
        <SvgIcon
          name={feature.icon}
          size={feature.iconSize || 38}
          className={styles.featureIcon}
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
    <div className={styles.pricingFeatures} data-pricing-features>
      <div className={styles.featuresHeader}>
        <p className={styles.featuresSubtitle}>
          {model.unlockWithPlan}{" "}
          <span className={styles.selectedPlan}>
            {model.planPrefix} {getPlanDisplayName()}
          </span>
        </p>
      </div>

      <div className={styles.featuresContent}>
        {currentFeatures.length > 0 ? (
          <div className={styles.featuresList} data-features-list>
            {orderedFeatures.map((feature, index) => (
              <div key={index} className={styles.featureItem} data-feature-item>
                <div className={styles.featureIconContainer}>
                  {renderFeatureIcon(feature)}
                </div>
                <div className={styles.featureContent}>
                  <h4 className={styles.featureLabel}>{feature.label}</h4>
                  <p className={styles.featureDescription}>
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className={styles.selectPlanPrompt}>{model.selectPlanFeatures}</p>
        )}

        <div className={styles.guarantee}>
          <CdnImage
            src="https://cdn.memorae.ai/mem-next/homepage/offer_check.svg"
            alt="Guarantee"
            width={20}
            height={20}
            className={styles.guaranteeIcon}
          />
          <div className={styles.guaranteeContent}>
            <h4 className={styles.guaranteeTitle}>
              {model.refundGuaranteeTitle}
            </h4>
            <p className={styles.guaranteeDescription}>
              {model.refundGuaranteeDescription}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingFeatures;
