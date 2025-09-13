"use client";
import CdnImage from "@/app/components/common/CdnImage";

const HeroBackgroundElements = ({ imageDimensions }) => {
  return (
    <>
      {/* This element was commented out in the original JSX, 
        but its classes have been converted for completeness.
        <CdnImage
          className="absolute top-0 left-1/2 z-10 m-0 w-[463px] max-h-full object-cover -translate-x-[231.5px] lg:w-[1200px] lg:-translate-x-[600px] xl:w-[1439px] xl:-translate-x-[720px]"
          alt=""
          src="/vertical_pastel_sky_mar1 1.png"
          width={1439}
          height={2000}
          priority
        /> 
      */}
      <CdnImage
        className="absolute top-[27.56px] right-[-27.94px] z-20 m-0 max-h-full object-cover md:top-[34px] md:right-[-35px] lg:top-[30px] lg:right-[-350px] xl:top-[36px] xl:right-[-238px]"
        decorative
        src="/homepage/4.png"
        priority
        width={imageDimensions.large.width}
        height={imageDimensions.large.height}
        unoptimized
        data-parallax="4.0"
        data-float
        data-cloud
      />
      <CdnImage
        className="absolute top-[251px] right-[-25.6px] z-21 m-0 max-h-full object-cover md:top-[315px] md:right-[-32px] lg:top-[450px] lg:right-[-350px] xl:top-[548px] xl:right-[151px]"
        decorative
        src="/homepage/2.png"
        priority
        width={imageDimensions.large.width}
        height={imageDimensions.large.height}
        unoptimized
        data-parallax="3.5"
        data-float
        data-cloud
      />
      <CdnImage
        className="absolute top-[110.53px] left-[-57.86px] z-22 m-0 max-h-full object-cover md:top-[138px] md:left-[-72px] lg:top-[330px] lg:left-[-175px] xl:top-[405px] xl:left-[-212px]"
        decorative
        src="/homepage/5.png"
        priority
        width={imageDimensions.large.width}
        height={imageDimensions.large.height}
        unoptimized
        data-parallax="2.5"
        data-float
        data-cloud
      />
      <div className="absolute top-[-55px] left-[-85px] z-11 m-0 h-[320.1px] w-[298.6px] rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,#edb4ff,rgba(237,180,255,0))] opacity-40 md:top-[-69px] md:left-[-107px] md:h-[401px] md:w-[374px] lg:top-[-320px] lg:left-[-307px] lg:h-[965px] lg:w-[900px] xl:top-[-392px] xl:left-[-374px] xl:h-[1173px] xl:w-[1094px]" />
      <div className="absolute top-[-52px] left-1/2 z-12 m-0 h-[516px] w-[653px] -translate-x-[326.5px] rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,rgba(112,214,255,0.8),rgba(237,180,255,0))] opacity-50 md:top-[-65px] md:h-[646px] md:w-[818px] md:-translate-x-[409px] lg:top-[-100px] lg:left-auto lg:right-[-690px] lg:h-[1127px] lg:w-[1050px] lg:translate-x-0 xl:top-[-122px] xl:right-[-838px] xl:h-[1371px] xl:w-[1278px]" />
      <div className="absolute bottom-[-151px] left-1/2 z-13 m-0 h-[535px] w-[548px] -translate-x-[273.5px] rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,#edb4ff,rgba(237,180,255,0))] md:bottom-[-189px] md:h-[670px] md:w-[686px] md:-translate-x-[343px] lg:top-[560px] lg:right-[270px] lg:bottom-auto lg:left-auto lg:h-[595px] lg:w-[555px] lg:translate-x-0 xl:top-[679px] xl:right-[327px] xl:h-[722px] xl:w-[673px]" />
    </>
  );
};

export default HeroBackgroundElements;
