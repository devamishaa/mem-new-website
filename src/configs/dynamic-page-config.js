// Map section type -> variant name -> dynamic importer (+metadata)
export const COMPONENT_VARIANTS = {
  hero: {
    // keys are variant names
    default: {
      importer: () => import("@/components/sections/hero/HeroContainer"),
      // optional per-variant flags
      // clientOnly: false,
      // ssr: true,
      // suspense: false,
      // loading: () => <div className="h-40" />,
    },
  },

  superpower: {
    default: {
      importer: () =>
        import("@/components/sections/superpower/SuperpowerContainer"),
    },
  },

  cosmic: {
    default: {
      importer: () => import("@/components/sections/cosmic/CosmicContainer"),
    },
  },

  pricing: {
    default: {
      importer: () => import("@/components/sections/pricing/PricingContainer"),
    },
  },
  pills: {
    default: {
      importer: () => import("@/components/sections/pills/PillContainer"),
    },
  },

  testimonials: {
    default: {
      importer: () =>
        import("@/components/sections/testimonial/TestimonialsContainer"),
    },
  },

  footer: {
    default: {
      importer: () => import("@/components/sections/footer/FooterContainer"),
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
