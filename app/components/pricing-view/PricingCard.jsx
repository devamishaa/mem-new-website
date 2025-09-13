// import styles from "@/styles/components/sections/pricing/Pricing.module.css"; // Converted to Tailwind
import Button from "@/app/components/common/Button";
import SvgIcon from "../common/svg/SvgIcon";

const PricingCard = ({ plan, className, ...props }) => {
  const formatPrice = (price) => {
    return price.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const renderLearnMoreButton = () => {
    return (
      <button
        className="w-full h-full flex flex-col items-start justify-start gap-2 text-base text-[#121723] cursor-pointer transition-all duration-200 hover:scale-105"
        data-learn-more={plan.planKey}
      >
        <div className="w-full flex flex-col items-start justify-start gap-2">
          <div className="w-full h-20 bg-gray-200 rounded-lg flex items-center justify-center relative overflow-hidden">
            {/* Placeholder for video thumbnail - would be populated by video modal system */}
            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <div className="w-12 h-12 bg-white/80 rounded-full flex items-center justify-center shadow-lg">
                <svg
                  className="w-6 h-6 text-gray-700 ml-1"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="w-full px-2">
            <p className="text-sm font-medium text-gray-800">
              {plan.demoLabel}
              <br />
              <span className="flex items-center gap-1 text-xs text-gray-600">
                Plan {plan.name}
                <SvgIcon name="RightArrow" className="w-4 h-4" size={16} />
              </span>
            </p>
          </div>
        </div>
      </button>
    );
  };

  return (
    <div
      className={`w-[383px] relative rounded-[32px] bg-[#0f1417] flex flex-col items-start justify-start p-8 min-h-fit gap-1 text-left text-2xl text-white font-figtree cursor-pointer transition-all duration-300 hover:-translate-y-1 ${
        className || ""
      }`}
      data-plan-card={plan.planKey}
      {...props}
    >
      <header className="w-full flex flex-col items-start justify-start">
        {plan.mostPopular && (
          <div className="w-full rounded-t-[200px] bg-gradient-to-r from-[#5c7bf3] to-[#ff66c4] flex flex-row items-center justify-center px-6 py-3 mb-6">
            <p className="relative leading-6 font-semibold text-white text-sm m-0">
              {plan.mostPopular}
            </p>
          </div>
        )}

        <div className="w-full flex flex-row items-center justify-between gap-0 mb-2">
          <h3 className="text-2xl font-light text-white m-0">{plan.name}</h3>
          {plan.badge && (
            <span
              className={`rounded px-1 py-0.5 text-xs font-semibold text-[#090d10] ${
                plan.planKey === "pro"
                  ? "bg-[#23cf67]"
                  : plan.planKey === "super"
                  ? "bg-[#23cf67]"
                  : plan.planKey === "life"
                  ? "bg-[#ffcc00]"
                  : "bg-gray-500"
              }`}
            >
              {plan.badge}
            </span>
          )}
        </div>

        <div className="w-full flex flex-row items-baseline justify-start gap-2.5 text-[40px]">
          <span className="font-figtree relative font-semibold" data-price>
            ${formatPrice(plan.price)}
          </span>
          {plan.oldPrice && (
            <span
              className="relative text-2xl line-through font-semibold opacity-50"
              data-old-price
            >
              ${formatPrice(plan.oldPrice)}
            </span>
          )}
          {plan.per && (
            <span
              className="w-[69px] relative text-lg leading-6 flex items-end h-[52px] flex-shrink-0"
              data-price-per
            >
              {plan.per}
            </span>
          )}
        </div>

        <p className="w-full relative text-base leading-6 text-white m-0">
          {plan.pricingNote}
        </p>
      </header>

      <div className="w-full rounded-xl bg-[#eaf2f1] min-h-[87px] overflow-visible flex-shrink-0 flex flex-col items-start justify-start box-border gap-2 text-base text-[#121723]">
        {renderLearnMoreButton()}
      </div>

      <Button
        variant={plan.ctaColor}
        className="w-full px-6 py-3 rounded-xl font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2"
        icon={<SvgIcon name="RightArrow" size={18} />}
      >
        {plan.ctaLabel}
      </Button>
    </div>
  );
};

export default PricingCard;
