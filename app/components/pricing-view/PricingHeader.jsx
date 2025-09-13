const PricingHeader = ({ model }) => {
  // Base classes for the toggle buttons
  const toggleBtnBase =
    "flex min-w-[80px] cursor-pointer items-center justify-center gap-1 whitespace-nowrap rounded-[19px] border-0 bg-transparent px-3 py-[7px] text-xs sm:text-sm font-medium text-white/70 transition-all duration-200 ease-in-out";

  // Classes for the active state of a toggle button
  const toggleBtnActive =
    "bg-gradient-to-r from-[#5c7bf3] to-[#ff66c4] font-bold text-white hover:text-white";

  // Classes for the inactive state
  const toggleBtnInactive = "hover:text-white/90";

  return (
    <div className="flex flex-col items-center gap-4">
      {/* The CSS for .pricingTitle was not provided, so using standard heading styles */}
      <h2 className="text-center text-3xl sm:text-4xl md:text-5xl font-bold text-white">
        {model.header}
      </h2>

      <div className="relative z-10 mx-auto mb-3 flex h-11 w-[190px] items-center justify-center">
        <div
          className="flex h-[34px] w-[192px] items-center justify-center rounded-[34px] border border-white/10 bg-white/5 p-1 shadow-[6px_8px_12px_rgba(0,0,0,0.05)] backdrop-blur-md"
          role="tablist"
          aria-label={model.billingCycle}
        >
          <button
            className={`${toggleBtnBase} ${toggleBtnInactive}`} // Inactive state
            data-billing-type="monthly"
            role="tab"
            aria-selected="false"
          >
            {model.interval.monthly}
          </button>
          <button
            className={`${toggleBtnBase} ${toggleBtnActive}`} // Active state
            data-billing-type="annual"
            role="tab"
            aria-selected="true"
          >
            {model.interval.annual}
            <span className="ml-1 rounded-[15px] bg-[#23cf67] px-1 py-0.5 text-[11px] sm:text-[13px] font-semibold text-[#090d10]">
              {model.interval.discount}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PricingHeader;
