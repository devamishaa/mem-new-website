// Map section type -> variant name -> dynamic importer (+metadata)
export const COMPONENT_VARIANTS = {
  hero: {
    default: {
      importer: () => import("@/app/components/hero/HeroContainer"),
    },
  },

  // superpower: {
  //   default: {
  //     importer: () => import("@/app/components/superpower-ui/SuperpowerView"),
  //   },
  // },

  cosmic: {
    default: {
      importer: () => import("@/app/components/cosmic-view/Emotion"),
    },
  },

  pricing: {
    default: {
      importer: () => import("@/app/components/pricing-view/PricingContainer"),
    },
  },
  // pills: {
  //   default: {
  //     importer: () => import("@/app/components/pill-view/PillView"),
  //   },
  // },

  testimonials: {
    default: {
      importer: () => import("@/app/components/testimonial-view/Testimonial"),
    },
  },

  footer: {
    default: {
      importer: () => import("@/app/components/footer/Footer"),
    },
  },

  // Add more sections here (features, cosmic, testimonials, etc.)
  // features: { Fancy: { importer: () => import('...') } },
};

// Page composition manifest: pageId -> { order, components, props? }
export const PAGES_MANIFEST = {
  HOME: {
    order: [
      "hero",
      "superpower",
      "cosmic",
      "pricing",
      "pills",
      "testimonials",
      "footer",
    ],
    components: {
      hero: "default",
      superpower: "default",
      cosmic: "default",
      pricing: "default",
      pills: "default",
      testimonials: "default",
      footer: "default",
    },
    // Optional: pass props to blocks
    // props: { hero: { eyebrow: 'New', ctaText: 'Start' } },
  },

  Landing5: {
    order: ["hero"],
    components: {
      hero: "default",
    },
  },
};
