"use client";

import { useMemo } from "react";
import PillView from "./PillView";
import { useTranslation } from "@/hooks/useTranslation";

const PillContainer = (props) => {
  const { t } = useTranslation();

  const tPills = (key, fallback = "") => {
    const translationKey = `pills.${key}`;
    const translation = t(translationKey);
    return translation === translationKey ? fallback : translation;
  };

  const model = useMemo(() => {
    return {
      pills: {
        topText: tPills("topText", 'Si no te tiembla la mano al pagar 5€ por un café "artesanal"'),
        bottomText: tPills("bottomText", "¿por qué no invertir en recordarlo todo?"),
        comparePlansButton: tPills("comparePlansButton", "Compare Plans"),
      },
    };
  }, [t]);

  return (
    <div>
      <PillView model={model} {...props} />
    </div>
  );
};

export default PillContainer;
