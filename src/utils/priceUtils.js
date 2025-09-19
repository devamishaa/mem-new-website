import {
  INDIAN_TIMEZONES,
  LATIN_AMERICAN_TIMEZONES,
} from "@/constants/time-zone-constants";
import {
  LIFETIME_SAVINGS_BY_CURRENCY,
  COFFEE_PRICES_BY_CURRENCY,
  DEFAULT_CURRENCY_SYMBOL,
  DEFAULT_COFFEE_PRICE,
  DEFAULT_LIFETIME_SAVINGS,
  DEFAULT_PRICE_FALLBACK,
} from "@/constants/currency-constants";

// Helper function for checking if timezone is Indian
export const isIndianTimezone = (timezone) => {
  if (!timezone) return false;
  const tz = timezone.toLowerCase();
  return INDIAN_TIMEZONES.some((city) => tz.includes(city));
};

// Helper function for checking if timezone is Latin American
export const isLatinAmericanTimezone = (timezone) => {
  if (!timezone) return false;
  return LATIN_AMERICAN_TIMEZONES.has(timezone);
};

// Helper function for checking if timezone is Rest of the World (not Indian or Latin American)
export const isRestOfTheWorld = (timezone) => {
  if (!timezone) return true; // Default to Rest of World if timezone is unknown
  return !isIndianTimezone(timezone) && !isLatinAmericanTimezone(timezone);
};

// Get timezone-based pricing configuration
export const getTimezoneConfig = (timezone, packages = []) => {
  // Find the first package to get currency info
  const samplePackage = packages.find((pkg) => pkg.symbol) || {};

  return {
    isIndian: isIndianTimezone(timezone),
    isLatinAmerican: isLatinAmericanTimezone(timezone),
    currencySymbol: samplePackage.symbol || DEFAULT_CURRENCY_SYMBOL,
    isCommaDecimalSeparator:
      samplePackage.isCommaDecimalSeparator !== undefined
        ? samplePackage.isCommaDecimalSeparator
        : true,
    timezone: timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
  };
};

// Helper function for formatting numbers
function formatNumber(value, locale, options) {
  if (value == null || isNaN(value)) {
    return "0.00";
  }

  const safeOptions = options || {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  };
  return value.toLocaleString(locale, safeOptions);
}

// Helper function for formatting savings
function formatSavings(value, locale, separator, currencySymbol) {
  if (value == null || isNaN(value)) {
    return `${currencySymbol} 0`;
  }

  let formatted;

  if (separator) {
    formatted = Math.round(value)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, separator);
  } else if (locale) {
    formatted = Math.round(value).toLocaleString(locale);
  } else {
    formatted = Math.round(value).toLocaleString();
  }

  return `${currencySymbol} ${formatted}`;
}

// Format price based on timezone and plan configuration
export function formatPlanPrice(value, plan, timezone, options = {}) {
  if (value == null || isNaN(value)) {
    return DEFAULT_PRICE_FALLBACK;
  }

  const { isSavings = false } = options;
  const currencySymbol = plan.symbol || DEFAULT_CURRENCY_SYMBOL;
  const isCommaDecimalSeparator =
    plan.isCommaDecimalSeparator !== undefined
      ? plan.isCommaDecimalSeparator
      : true;

  if (isIndianTimezone(timezone)) {
    return isSavings
      ? formatSavings(value, "en-IN", null, currencySymbol)
      : `${currencySymbol} ${formatNumber(value, "en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`;
  }

  if (isCommaDecimalSeparator) {
    return isSavings
      ? formatSavings(value, null, ".", currencySymbol)
      : `${currencySymbol} ${value.toFixed(2).replace(".", ",")}`;
  } else {
    return isSavings
      ? formatSavings(value, "en-US", null, currencySymbol)
      : `${currencySymbol} ${value.toFixed(2)}`;
  }
}

// Helper function for internal price formatting (matches old version)
const formatPriceInternal = (price, planData) => {
  const currencySymbol = planData.symbol || DEFAULT_CURRENCY_SYMBOL;
  const isCommaDecimalSeparator =
    planData.isCommaDecimalSeparator !== undefined
      ? planData.isCommaDecimalSeparator
      : true;

  if (isCommaDecimalSeparator) {
    // Use comma as decimal separator (European style) - symbol before amount
    return `${currencySymbol} ${price.toLocaleString("es-UY", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  } else {
    // Use dot as decimal separator (US/International style) - symbol before amount
    return `${currencySymbol} ${price.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }
};

// Get price for interval - matches old version signature
export const getPriceForInterval = (
  amount,
  duration,
  plan,
  showOriginalPrice = false
) => {
  if (!plan || amount == null || isNaN(amount)) {
    return DEFAULT_PRICE_FALLBACK;
  }

  const basePrice = amount / 100;
  const monthlyPrice =
    duration === "year" && showOriginalPrice ? basePrice / 12 : basePrice;

  return formatPriceInternal(monthlyPrice, plan);
};

// Get price for interval with timezone formatting (new version for timezone-aware calls)
export const getPriceForIntervalWithTimezone = (
  amount,
  duration,
  plan,
  timezone,
  showOriginalPrice = false
) => {
  if (!plan || amount == null || isNaN(amount)) {
    return DEFAULT_PRICE_FALLBACK;
  }

  const basePrice = amount / 100;
  const monthlyPrice =
    duration === "year" && showOriginalPrice ? basePrice / 12 : basePrice;

  return formatPlanPrice(monthlyPrice, plan, timezone);
};

// Get the original monthly price (without yearly discount) - matches old version
export const getOriginalPrice = (amount, plan) => {
  return getPriceForInterval(amount, "year", plan, true);
};

// Get the original annual price (what they would pay without discount) - matches old version
export const getOriginalAnnualPrice = (amount, plan) => {
  if (!plan) {
    return DEFAULT_PRICE_FALLBACK;
  }

  const originalPrice = (amount / 100) * 1.67; // Calculate original annual price (amount stores discounted price)
  const currencySymbol = plan.symbol || DEFAULT_CURRENCY_SYMBOL;
  const isCommaDecimalSeparator =
    plan.isCommaDecimalSeparator !== undefined
      ? plan.isCommaDecimalSeparator
      : true;

  if (isCommaDecimalSeparator) {
    // Use comma as decimal separator (European style) - symbol before amount
    return `${currencySymbol} ${originalPrice.toFixed(2).replace(".", ",")}`;
  } else {
    // Use dot as decimal separator (US/International style) - symbol before amount
    return `${currencySymbol} ${originalPrice.toFixed(2)}`;
  }
};

// Get savings amount with timezone formatting
export const getSavingsAmount = (amount, plan, timezone) => {
  if (!plan || amount == null || isNaN(amount)) {
    return DEFAULT_PRICE_FALLBACK;
  }

  const savings = (amount / 100) * 0.67;
  return formatPlanPrice(savings, plan, timezone, { isSavings: true });
};

// Get lifetime savings by currency
const getSavingsAmountByCurrency = (currencySymbol) => {
  const trimmedSymbol = currencySymbol.trim();
  return LIFETIME_SAVINGS_BY_CURRENCY.hasOwnProperty(trimmedSymbol)
    ? LIFETIME_SAVINGS_BY_CURRENCY[trimmedSymbol]
    : LIFETIME_SAVINGS_BY_CURRENCY[DEFAULT_CURRENCY_SYMBOL];
};

// Get lifetime savings with currency formatting
export const getLifetimeSavings = (plan) => {
  if (!plan) {
    return DEFAULT_LIFETIME_SAVINGS;
  }

  const currencySymbol = plan.symbol || DEFAULT_CURRENCY_SYMBOL;
  const isCommaDecimalSeparator =
    plan.isCommaDecimalSeparator !== undefined
      ? plan.isCommaDecimalSeparator
      : true;
  const savingsAmount = getSavingsAmountByCurrency(currencySymbol);

  // For USD and similar currencies, put symbol before amount
  const shouldPrefixSymbol = currencySymbol === "$" || currencySymbol === "PAB";

  if (shouldPrefixSymbol) {
    // USD style: $900
    return `${currencySymbol}${parseInt(savingsAmount).toLocaleString(
      "en-US"
    )}`;
  } else if (isCommaDecimalSeparator) {
    // European style: € 800 (symbol before amount)
    return `${currencySymbol} ${savingsAmount.replace(
      /\B(?=(\d{3})+(?!\d))/g,
      "."
    )}`;
  } else {
    // Other currencies: $ 900 (symbol before amount)
    return `${currencySymbol} ${parseInt(savingsAmount).toLocaleString(
      "en-US"
    )}`;
  }
};

// Get coffee price comparison
export const getCoffeePrice = (plan) => {
  if (!plan) return DEFAULT_COFFEE_PRICE;

  const currencySymbol = (plan.symbol || DEFAULT_CURRENCY_SYMBOL).trim();
  return COFFEE_PRICES_BY_CURRENCY[currencySymbol] || DEFAULT_COFFEE_PRICE;
};

// Create mock packages with timezone-based pricing
export const createTimezoneBasedPricingPlans = (timezone) => {
  const config = getTimezoneConfig(timezone);

  // Base pricing in USD
  const basePricing = {
    pro: { monthly: 4.99, annual: 2.99 },
    supernova: { monthly: 12.49, annual: 7.49 },
    lifetime: { oneTime: 399 },
  };

  // Currency conversions and adjustments based on timezone
  const currencyMultiplier = config.isIndian
    ? 83
    : config.isLatinAmerican
    ? 20
    : 0.85; // Rough conversions
  const currencySymbol = config.isIndian
    ? "INR"
    : config.isLatinAmerican
    ? "$"
    : "€";

  return {
    pro: {
      id: 2,
      name: "Pro",
      duration: "month",
      amount: Math.round(basePricing.pro.monthly * currencyMultiplier * 100), // in cents
      symbol: currencySymbol,
      isCommaDecimalSeparator: !config.isIndian && !config.isLatinAmerican,
    },
    proAnnual: {
      id: 3,
      name: "Pro",
      duration: "year",
      amount: Math.round(
        basePricing.pro.annual * currencyMultiplier * 12 * 100
      ), // in cents
      symbol: currencySymbol,
      isCommaDecimalSeparator: !config.isIndian && !config.isLatinAmerican,
    },
    supernova: {
      id: 4,
      name: "Supernova",
      duration: "month",
      amount: Math.round(
        basePricing.supernova.monthly * currencyMultiplier * 100
      ), // in cents
      symbol: currencySymbol,
      isCommaDecimalSeparator: !config.isIndian && !config.isLatinAmerican,
    },
    supernovaAnnual: {
      id: 5,
      name: "Supernova",
      duration: "year",
      amount: Math.round(
        basePricing.supernova.annual * currencyMultiplier * 12 * 100
      ), // in cents
      symbol: currencySymbol,
      isCommaDecimalSeparator: !config.isIndian && !config.isLatinAmerican,
    },
    lifetime: {
      id: 6,
      name: "Supernova Lifetime",
      duration: "forever",
      amount: Math.round(
        basePricing.lifetime.oneTime * currencyMultiplier * 100
      ), // in cents
      symbol: currencySymbol,
      isCommaDecimalSeparator: !config.isIndian && !config.isLatinAmerican,
    },
  };
};
