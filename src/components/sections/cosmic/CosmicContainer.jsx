"use client";

import { useMemo } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import CosmicView from "./CosmicView";

export default function CosmicContainer(props) {
  const { t } = useTranslation();

  const tCosmic = (key, fallback = "") => {
    const translationKey = `cosmic.${key}`;
    const translation = t(translationKey);
    return translation === translationKey ? fallback : translation;
  };

  const model = useMemo(() => {
    return {
      cosmic: {
        title: tCosmic("title"),
        subtitle: tCosmic("subtitle"),
        description: tCosmic("description"),
      },
    };
  }, [t]);

  return <CosmicView model={model} {...props} />;
}
