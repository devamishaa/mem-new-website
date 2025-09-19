"use client";

import { useMemo } from "react";
import FooterView from "./FooterView";
import { useTranslation } from "@/hooks/useTranslation";

export default function FooterContainer(props) {
  const { t } = useTranslation();

  const tFooter = (key, fallback = "") => {
    const translationKey = `footer.${key}`;
    const translation = t(translationKey);
    return translation === translationKey ? fallback : translation;
  };

  const model = useMemo(() => {
    return {
      footer: {
        tagline: tFooter("tagline", "You just live. Memorae remembers for you."),
        copyright: tFooter("copyright", "© 2024 Gemera Capital SLU. All rights reserved."),
        links: {
          privacy: tFooter("links.privacy", "Privacy Policy"),
          terms: tFooter("links.terms", "Terms & Conditions"),
          cookies: tFooter("links.cookies", "Cookie Settings")
        }
      }
    };
  }, [t]);

  return <FooterView model={model} {...props} />;
}
