"use client";

import { useMemo } from "react";
import TestimonialsView from "./TestimonialsView";
import { useTranslation } from "@/hooks/useTranslation";

export default function TestimonialsContainer(props) {
  const { t } = useTranslation();

  const tTestimonials = (key, fallback = "") => {
    const translationKey = `testimonials.${key}`;
    const translation = t(translationKey);
    return translation === translationKey ? fallback : translation;
  };

  const model = useMemo(() => {
    return {
      testimonials: {
        label: tTestimonials("label", "+20k people have forgotten to forget"),
        tagline: tTestimonials(
          "tagline",
          "You just live. Memorae remembers for you."
        ),
        testimonials: t("testimonials.testimonials", []),
      },
    };
  }, [t]);

  return <TestimonialsView model={model} {...props} />;
}
