import styles from "@/styles/components/sections/hero/Hero.module.css";
import Button from "@/components/common/button/Button";

const HeroTextContent = ({ model, ctaHref }) => {
  return (
    <div className={styles.frameGroup}>
      <div className={styles.memoraeCharacter1Parent}>
        <div className={styles.tuSegundaCabezaContainer}>
          <span
            className={`${styles.tuSegundaCabeza} ${styles.mobileOnly}`}
            data-text-reveal
          >
            {model.heading.line1}{" "}
          </span>
          <b
            className={`${styles.enWhatsapp} ${styles.mobileOnly}`}
            data-text-reveal
          >
            {model.heading.line2}
          </b>
          <p
            className={`${styles.tuSegundaCabeza} ${styles.desktopOnly}`}
            data-text-reveal
          >
            {model.heading.line1}
          </p>
          <p
            className={`${styles.enWhatsapp} ${styles.desktopOnly}`}
            data-text-reveal
          >
            <b>{model.heading.line2}</b>
          </p>
        </div>
      </div>
      <div className={styles.porqueVivirAlContainer}>
        <p className={styles.porqueVivirAl} data-text-reveal>
          {model.subtitle}{" "}
        </p>
        <p className={styles.porqueVivirAl} data-text-reveal>
          {model.subtitle2}
        </p>
      </div>
      <div data-reveal="scale" data-reveal-delay="0.60">
        <Button
          variant="primary"
          onClick={() => {
            const pricingSection = document.getElementById("pricing");
            if (pricingSection)
              pricingSection.scrollIntoView({ behavior: "smooth" });
          }}
          icon={
            <img
              src="https://cdn.memorae.ai/mem-next/homepage/east.svg"
              alt=""
            />
          }
          className={styles.button}
        >
          {model.ctaLabel}
        </Button>
      </div>
    </div>
  );
};

export default HeroTextContent;
