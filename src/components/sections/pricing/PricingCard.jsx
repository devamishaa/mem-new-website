import styles from "@/styles/components/sections/pricing/Pricing.module.css";
import Button from "@/components/common/button/Button";
import SvgIcon from "@/components/common/svg/SvgIcon";

const PricingCard = ({ plan, className, ...props }) => {
  const formatPrice = (price) => {
    return price.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const renderLearnMoreButton = () => {
    return (
      <button className={styles.learnMoreBtn} data-learn-more={plan.planKey}>
        <div className={styles.learnMoreContent}>
          <div className={styles.learnMoreThumbnail}>
            {/* Placeholder for video thumbnail - would be populated by video modal system */}
            <div className={styles.thumbnailPlaceholder}>
              <div className={styles.playButton}>
                <svg
                  className={styles.playIcon}
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </div>
          <div className={styles.learnMoreText}>
            <p>
              {plan.demoLabel}
              <br />
              <span className={styles.planName}>
                Plan {plan.name}
                <SvgIcon
                  name="RightArrow"
                  className={styles.chevron}
                  size={16}
                />
              </span>
            </p>
          </div>
        </div>
      </button>
    );
  };

  return (
    <div
      className={`${styles.pricingCard} ${className || ""}`}
      data-plan-card={plan.planKey}
      {...props}
    >
      <header className={styles.cardHeader}>
        {plan.mostPopular && (
          <div className={styles.mostPopularBadge}>
            <p className={styles.mostPopularText}>{plan.mostPopular}</p>
          </div>
        )}

        <div className={styles.titleRow}>
          <h3 className={styles.cardTitle}>{plan.name}</h3>
          {plan.badge && (
            <span className={`${styles.pill} ${styles[`pill${plan.planKey}`]}`}>
              {plan.badge}
            </span>
          )}
        </div>

        <div className={styles.priceContainer}>
          <span className={styles.price} data-price>
            ${formatPrice(plan.price)}
          </span>
          {plan.oldPrice && (
            <span className={styles.oldPrice} data-old-price>
              ${formatPrice(plan.oldPrice)}
            </span>
          )}
          {plan.per && (
            <span className={styles.pricePer} data-price-per>
              {plan.per}
            </span>
          )}
        </div>

        <p className={styles.pricingNote}>{plan.pricingNote}</p>
      </header>

      <div className={styles.cardDemo}>{renderLearnMoreButton()}</div>

      <Button
        variant={plan.ctaColor}
        className={styles.planCta}
        icon={<SvgIcon name="RightArrow" size={18} />}
      >
        {plan.ctaLabel}
      </Button>
    </div>
  );
};

export default PricingCard;
