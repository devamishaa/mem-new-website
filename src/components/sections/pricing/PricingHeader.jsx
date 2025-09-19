import styles from "@/styles/components/sections/pricing/Pricing.module.css";

const PricingHeader = ({ model }) => {
  return (
    <div className={styles.pricingHeader}>
      <h2 className={styles.pricingTitle}>{model.header}</h2>
      <div className={styles.billingToggle}>
        <div
          className={styles.toggle}
          role="tablist"
          aria-label={model.billingCycle}
        >
          <button
            className={`${styles.toggleBtn} ${styles.monthlyBtn}`}
            data-billing-type="monthly"
            role="tab"
            aria-selected="false"
          >
            {model.interval.monthly}
          </button>
          <button
            className={`${styles.toggleBtn} ${styles.annualBtn} ${styles.active}`}
            data-billing-type="annual"
            role="tab"
            aria-selected="true"
          >
            {model.interval.annual}
            <span className={styles.discount}>{model.interval.discount}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PricingHeader;
