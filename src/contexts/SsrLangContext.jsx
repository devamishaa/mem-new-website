"use client";
import { createContext, useContext } from "react";
export const SSRLangContext = createContext("en");
export const SSRLangProvider = SSRLangContext.Provider;
export const useSSRLang = () => useContext(SSRLangContext);
