import Image from "next/image";
import memorae from "../../../../public/homepage/smily_memorae.png";
import styles from "@/styles/components/sections/cosmic/Cosmic.module.css";

const CosmicContent = () => {
  return (
    <div className={styles.cosmicContent} data-cosmic-content>
      <div className={styles.titleContainer}>
        <h1 className={styles.glowText} data-cosmic-text-1>
          <span>Tu caos</span>
        </h1>
        <Image
          src={memorae}
          alt="Memorae Orb"
          className={styles.orbFloating}
          data-cosmic-orb
        />
        <h1 className={styles.glowTextTwo} data-cosmic-text-2>
          Tu plan
        </h1>
      </div>

      <p className={styles.glowTextThree} data-cosmic-text-3>
        Elige cómo quieres que Memorae te ayude a<br />
        no perder la cabeza.
      </p>
    </div>
  );
};

export default CosmicContent;