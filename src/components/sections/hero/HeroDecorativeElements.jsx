import styles from "@/styles/components/sections/hero/Hero.module.css";
import CdnImage from "@/components/common/images/CdnImage";

const HeroDecorativeElements = ({ imageDimensions }) => {
  return (
    <>
      {/* <img
        className={styles.memoraeCharacter2Icon}
        alt="Memorae AI assistant character"
        src="https://cdn.memorae.ai/mem-next/homepage/Memorae_Character 2.svg"
        data-parallax="0.22"
        data-reveal="scale"
        data-reveal-delay="0.90"
      /> */}
      <CdnImage
        className={styles.icon3}
        decorative
        src="https://cdn.memorae.ai/mem-next/homepage/7.png"
        priority
        width={imageDimensions.icon3}
        height={imageDimensions.icon3}
        unoptimized
        data-parallax="7.5"
        data-float
      />
      <CdnImage
        className={styles.icon4}
        decorative
        src="https://cdn.memorae.ai/mem-next/homepage/8.png"
        priority
        width={imageDimensions.icon4}
        height={imageDimensions.icon4}
        unoptimized
        data-parallax="10.0"
        data-float
      />
      <CdnImage
        className={styles.icon5}
        decorative
        src="https://cdn.memorae.ai/mem-next/homepage/6.png"
        priority
        width={imageDimensions.icon5}
        height={imageDimensions.icon5}
        unoptimized
        data-parallax="5.5"
        data-float
      />
    </>
  );
};

export default HeroDecorativeElements;
