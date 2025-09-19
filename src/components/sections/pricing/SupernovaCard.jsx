"use client";

import styles from "@/styles/components/sections/pricing/SupernovaCard.module.css";
import CdnImage from "@/components/common/images/CdnImage";

const SupernovaCard = ({ plan, model, isActive, onSelect, onOpenVideo }) => {
  const { name, badge, price, old, per, pricingNote, cta, mostPopular } = plan;

  return (
    <div
      className={styles.supernovaCard}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onSelect();
      }}
      role="button"
      tabIndex={0}
      aria-pressed={isActive}
    >
      <div className={styles.popularBanner}>
        <div className={styles.popularBannerText}>{mostPopular}</div>
      </div>
      <div className={styles.cardBody}>
        <div className={styles.header}>
          <div className={styles.titleRow}>
            <div className={styles.planName}>{name}</div>
            <div className={styles.badge}>{badge}</div>
          </div>
          <div className={styles.priceRow}>
            <div className={styles.price}>${price.toFixed(2)}</div>
            {old && <div className={styles.oldPrice}>${old.toFixed(2)}</div>}
            <div className={styles.pricePer}>{per}</div>
          </div>
          <div className={styles.billingNote}>{pricingNote}</div>
        </div>

        <div
          className={styles.demoSection}
          onClick={() => onOpenVideo("super")}
        >
          <div className={styles.thumbnailContainer}>
            <CdnImage
              src="https://cdn.memorae.ai/Supernova-row.gif"
              alt="View Demo"
              className={styles.thumbnail}
              width={151}
              height={87}
            />
            <img className={styles.playButton} alt="" src="/Play Button.svg" />
          </div>
          <div className={styles.demoText}>
            Ver demostración del{" "}
            <span className={styles.demoTextPlanName}>Plan Supernova</span>
          </div>
        </div>

        <button className={styles.ctaButton}>
          <SvgIcon name="ArrowRight" size={18} />
        </button>
      </div>
    </div>
  );
};

export default SupernovaCard;
