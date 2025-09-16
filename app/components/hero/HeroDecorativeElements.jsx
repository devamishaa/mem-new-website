"use client";

import CdnImage from "@/app/components/common/CdnImage";

const HeroDecorativeElements = ({ imageDimensions }) => {
  return (
    <>
      {/* This element was commented out, but its classes are converted below.
        <img
          className="absolute top-[550.13px] right-[59.57px] z-50 m-0 h-auto w-[99.7px] max-h-full object-contain 
                     max-[432px]:right-[42.57px] 
                     max-[375px]:right-[17.57px] 
                     max-[320px]:right-[-9.57px] 
                     md:top-[689px] md:right-[160px] md:w-[125px] 
                     lg:top-[680px] lg:right-[232px] lg:w-[170px] 
                     xl:top-[826px] xl:right-[370.7px] xl:w-[206.3px]"
          alt="Memorae AI assistant character"
          src="/homepage/Memorae_Character 2.svg"
          data-parallax="0.22"
          data-reveal="scale"
          data-reveal-delay="0.90"
        /> 
      */}
      <CdnImage
        className="absolute top-[186px] left-[-17px] z-20 m-0 max-h-full object-cover 
                   md:top-[233px] md:left-[-21px] 
                   lg:top-[430px] lg:left-[85px] 
                   xl:top-[521px] xl:left-[104px]"
        decorative
        src="/homepage/7.png"
        priority
        width={imageDimensions.icon3}
        height={imageDimensions.icon3}
        unoptimized
        data-parallax="7.5"
        data-float
      />
      <CdnImage
        className="absolute top-[229px] right-[15px] z-20 m-0 max-h-full object-cover 
                   max-[432px]:right-[-17px] 
                   max-[375px]:right-[-25px] 
                   max-[320px]:right-[-22px] 
                   md:top-[287px] md:right-[-16px] 
                   lg:top-[295px] lg:right-[-23px] 
                   xl:top-[358px] xl:right-[-23px]"
        decorative
        src="/homepage/8.png"
        priority
        width={imageDimensions.icon4}
        height={imageDimensions.icon4}
        unoptimized
        data-parallax="10.0"
        data-float
      />
      <CdnImage
        className="absolute top-[350px] left-[-11px] z-20 m-0 max-h-full object-cover 
                   md:top-[438px] md:left-[-14px] 
                   lg:top-[720px] lg:left-[225px] 
                   xl:top-[871px] xl:left-[273px]"
        decorative
        src="/homepage/6.png"
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
