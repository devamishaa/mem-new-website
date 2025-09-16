"use client";

import Button from "@/app/components/common/Button";

const HeroTextContent = ({ model, ctaHref }) => {
  return (
    <div className="relative z-40 flex w-full flex-col items-center justify-start gap-6 self-stretch text-center text-[63px] text-white md:gap-7 md:text-[80px] lg:text-[100px] xl:text-[132px]">
      <div className="sm:mt-24 flex flex-col items-center justify-start md:mt-0">
        <div className="relative sm:mt-[50px] mt-0 inline-block w-[331.9px] leading-[1.01] md:w-[420px] md:leading-[1.05] lg:w-auto lg:leading-[1.1]">
          {/* Mobile view uses a single span with a line break for better text flow */}
          <span
            className="font-figtree font-semibold lg:hidden"
            data-text-reveal
          >
            {model.heading.line1}{" "}
            <b className="font-bold">{model.heading.line2}</b>
          </span>

          {/* Desktop view uses separate paragraphs */}
          <p
            className="hidden font-figtree font-semibold lg:block"
            data-text-reveal
          >
            {model.heading.line1}
          </p>
          <p
            className="hidden font-figtree font-bold lg:block"
            data-text-reveal
          >
            <b>{model.heading.line2}</b>
          </p>
        </div>
      </div>
      <div className="relative inline-block w-[243px] font-figtree text-base font-medium leading-[1.33] text-[#01214f] md:w-[320px] md:text-xl md:leading-[1.35] lg:w-[500px] xl:w-[638px] xl:text-2xl">
        <p className="m-0" data-text-reveal>
          {model.subtitle}{" "}
        </p>
        <p className="m-0" data-text-reveal>
          {model.subtitle2}
        </p>
      </div>
      <div data-reveal="scale" data-reveal-delay="0.60">
        <Button
          variant="primary"
          href={ctaHref}
          icon={<img src="/homepage/east.svg" alt="arrow icon" />}
          className="h-[57px] self-stretch px-6 py-3 text-left text-2xl md:mx-auto md:h-16 md:w-[323px] md:self-center"
        >
          {model.ctaLabel}
        </Button>
      </div>
    </div>
  );
};

export default HeroTextContent;
