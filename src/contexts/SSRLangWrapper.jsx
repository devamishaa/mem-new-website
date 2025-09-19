"use client";

import { SSRLangProvider } from "./SsrLangContext";

export default function SSRLangWrapper({ children, lang }) {
  return <SSRLangProvider value={lang}>{children}</SSRLangProvider>;
}
