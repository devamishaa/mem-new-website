import styles from "@/styles/components/sections/pricing/Pricing.module.css";
import PricingCard from "./PricingCard";

const PricingCards = ({ model, priceUtils }) => {
  if (!model.packages || model.packages.length === 0) {
    return <div className={styles.loading}>Loading pricing...</div>;
  }

  // Filter packages similar to old version
  const filteredPackages = model.packages
    .filter((pkg) => pkg.id !== 1) // Remove free plan
    .filter((pkg) => pkg.name !== "Essential") // Remove Essential plan
    .sort((a, b) => a.amount - b.amount);

  // Find plans by name and duration
  const findPlan = (name, duration = null) => {
    return filteredPackages.find((pkg) => {
      if (duration) {
        return pkg.name === name && pkg.duration === duration;
      }
      return pkg.name === name;
    });
  };

  const proPlan = findPlan("Pro", "year") || findPlan("Pro", "month");
  const supernovaPlan =
    findPlan("Supernova", "year") || findPlan("Supernova", "month");
  const lifetimePlan = findPlan("Supernova Lifetime", "forever");

  // Build plans object using API data
  const plans = {};

  if (proPlan) {
    plans.pro = {
      name: model.plans.pro.name,
      badge: model.plans.pro.badge,
      price: priceUtils.getPriceForInterval(
        proPlan.amount,
        proPlan.duration,
        proPlan,
        false
      ),
      oldPrice:
        proPlan.duration === "year"
          ? priceUtils.getOriginalPrice(proPlan.amount, proPlan)
          : null,
      per: model.interval.perMonth,
      ctaColor: "primary",
      demoLabel: model.plans.pro.cta.viewDemo,
      pricingNote: model.plans.pro.pricingNote,
      ctaLabel: model.plans.pro.cta.try,
      planKey: "pro",
      planData: proPlan,
    };
  }

  if (supernovaPlan) {
    plans.super = {
      name: model.plans.supernova.name,
      badge: model.plans.supernova.badge,
      price: priceUtils.getPriceForInterval(
        supernovaPlan.amount,
        supernovaPlan.duration,
        supernovaPlan,
        false
      ),
      oldPrice:
        supernovaPlan.duration === "year"
          ? priceUtils.getOriginalPrice(supernovaPlan.amount, supernovaPlan)
          : null,
      per: model.interval.perMonth,
      ctaColor: "gradient",
      demoLabel: model.plans.supernova.cta.viewDemo,
      pricingNote: model.plans.supernova.pricingNote,
      ctaLabel: model.plans.supernova.cta.try,
      mostPopular: model.plans.supernova.mostPopular,
      planKey: "super",
      planData: supernovaPlan,
    };
  }

  if (lifetimePlan) {
    plans.life = {
      name: model.plans.lifetime.name,
      badge: model.plans.lifetime.badge,
      price: priceUtils.getPriceForInterval(
        lifetimePlan.amount,
        lifetimePlan.duration,
        lifetimePlan,
        false
      ),
      oldPrice: null,
      per: "",
      ctaColor: "yellow",
      demoLabel: model.plans.lifetime.cta.viewDemo,
      pricingNote: model.plans.lifetime.pricingNote,
      ctaLabel: model.plans.lifetime.cta.try,
      planKey: "life",
      planData: lifetimePlan,
    };
  }

  return (
    <div className={styles.pricingCards} data-pricing-cards>
      <div className={styles.cardsGrid}>
        <PricingCard
          plan={plans.pro}
          className={styles.proPlan}
          data-plan="pro"
        />

        <div className={styles.popularWrapper}>
          <PricingCard
            plan={plans.super}
            className={`${styles.superPlan} ${styles.popular}`}
            data-plan="super"
          />
        </div>

        <PricingCard
          plan={plans.life}
          className={styles.lifetimePlan}
          data-plan="life"
        />
      </div>
    </div>
  );
};

export default PricingCards;
