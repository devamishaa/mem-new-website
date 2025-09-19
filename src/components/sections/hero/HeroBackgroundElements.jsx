import styles from "@/styles/components/sections/hero/Hero.module.css";
import CdnImage from "@/components/common/images/CdnImage";

const HeroBackgroundElements = ({ imageDimensions }) => {
  return (
    <>
      {/* <CdnImage
        className={styles.verticalPastelSkyMar11Icon}
        alt=""
        src="/vertical_pastel_sky_mar1 1.png"
        width={1439}
        height={2000}
        priority
      /> */}
      <CdnImage
        className={styles.icon}
        decorative
        src="https://cdn.memorae.ai/mem-next/homepage/4.png"
        priority
        width={imageDimensions.large.width}
        height={imageDimensions.large.height}
        unoptimized
        data-parallax="4.0"
        data-float
        data-cloud
      />
      <CdnImage
        className={styles.icon1}
        decorative
        src="https://cdn.memorae.ai/mem-next/homepage/2.png"
        priority
        width={imageDimensions.large.width}
        height={imageDimensions.large.height}
        unoptimized
        data-parallax="3.5"
        data-float
        data-cloud
      />
      <CdnImage
        className={styles.icon2}
        decorative
        src="https://cdn.memorae.ai/mem-next/homepage/5.png"
        priority
        width={imageDimensions.large.width}
        height={imageDimensions.large.height}
        unoptimized
        data-parallax="2.5"
        data-float
        data-cloud
      />
      <div className={styles.HeroChild} />
      <div className={styles.HeroItem} />
      <div className={styles.ellipseDiv} />
    </>
  );
};

export default HeroBackgroundElements;
