"use client";
import { useMemo } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import SuperpowerView from "./SuperpowerView";

const SuperpowerContainer = () => {
  return (
    <>
      <SuperpowerView model={model} />
    </>
  );
};

export default SuperpowerContainer;
