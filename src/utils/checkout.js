/**
 * Checkout utility functions for handling Stripe payment flow
 */

import { pricingApi } from "@/utils/api";

/**
 * Creates a Stripe checkout session and redirects to checkout
 * @param {Object} planData - The selected plan data
 * @param {Object} options - Additional options
 * @param {string} options.billingInterval - 'month', 'year', or 'forever'
 * @param {string} options.successUrl - URL to redirect after successful payment
 * @param {string} options.cancelUrl - URL to redirect after cancelled payment
 */
export async function createCheckoutSession(planData, options = {}) {
  const {
    billingInterval,
    successUrl = window.location.origin + '/payment-success',
    cancelUrl = window.location.href + '?success=false',
  } = options;

  try {
    // Get timezone
    const timezone = typeof window !== 'undefined' ?
      Intl.DateTimeFormat().resolvedOptions().timeZone : 'UTC';

    // Prepare checkout data
    const checkoutData = {
      success_url: successUrl + `?plan=${planData.name}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl,
      packageId: planData.id,
      promotekit_referral: (typeof window !== 'undefined' && window.promotekit_referral) || '',
      timezone: timezone,
      // Add userId if available (from auth context)
      ...(typeof window !== 'undefined' && localStorage.getItem('token') ? { userId: 'current-user' } : {}),
      metadata: {
        source_page: typeof window !== 'undefined' ? window.location.pathname : '',
      }
    };

    // Create checkout session via API
    const response = await pricingApi.createCheckoutSession(checkoutData);

    const checkoutUrl = response.data?.sessionUrl ||
                       response.data?.data?.sessionUrl ||
                       response.data?.checkout_url ||
                       response.data?.url ||
                       response.checkout_url ||
                       response.url;

    if (checkoutUrl) {
      // Redirect to Stripe checkout
      window.location.href = checkoutUrl;
      return response;
    } else {
      throw new Error('No checkout URL received from API');
    }
  } catch (error) {
    console.error('Checkout creation failed:', error);

    // Show user-friendly error
    const errorMessage = error.response?.data?.message ||
                        error.message ||
                        'Failed to create checkout session. Please try again.';

    // You could integrate with your notification system here
    alert(errorMessage); // Temporary - replace with your notification component

    throw error;
  }
}

/**
 * Handles the checkout process for a pricing plan
 * This is the main function to be called from pricing cards
 * @param {Object} planData - The plan data from the pricing API
 * @param {string} planKey - The plan key ('pro', 'super', 'life')
 * @param {string} billing - The billing cycle ('mensual', 'anual')
 */
/**
 * Gets the appropriate success URL based on influencer and page context
 */
function getConfirmationUrl() {
  if (typeof window === 'undefined') return '/payment-success';

  const currentLang = window.location.pathname.split('/')[1] || 'en';
  const influencer = localStorage.getItem('referral_source');
  const path = window.location.pathname;

  let baseUrl;
  if (influencer === 'inma-saez') {
    baseUrl = `${window.location.origin}/${currentLang}/payment/confirmation-home-page`;
  } else if (path.includes('/l2/') || path.includes('/t2/')) {
    baseUrl = `${window.location.origin}/${currentLang}/payment/confirmation`;
  } else {
    baseUrl = `${window.location.origin}/${currentLang}/payment/confirmation-home-page`;
  }

  return baseUrl;
}

export function handlePlanCheckout(planData, planKey, billing = 'anual') {
  if (!planData) {
    console.error('No plan data provided for checkout');
    return;
  }

  // Map billing to duration if needed
  let duration = planData.duration;
  if (!duration) {
    duration = billing === 'mensual' ? 'month' :
               billing === 'anual' ? 'year' : 'forever';
  }

  // Get proper success URL
  const successUrl = getConfirmationUrl();

  // Create checkout session
  createCheckoutSession(planData, {
    billingInterval: duration,
    successUrl: successUrl,
    cancelUrl: window.location.href + '?success=false',
  });
}

/**
 * Quick checkout function specifically for "Try for Free" buttons
 * @param {Object} planData - The plan data
 * @param {string} planKey - The plan identifier
 */
export function tryPlanForFree(planData, planKey) {
  // For free trials, we might want to handle differently
  // For now, redirect to checkout with the plan
  handlePlanCheckout(planData, planKey);
}