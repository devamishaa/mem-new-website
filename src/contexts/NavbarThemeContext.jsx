"use client";
import React, { createContext, useState, useContext, useMemo, useCallback } from "react";

const NavbarThemeContext = createContext();

export function NavbarThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");

  const handleSetTheme = useCallback((newTheme) => {
    setTheme(newTheme);
  }, []);

  const contextValue = useMemo(() => ({
    theme,
    setTheme: handleSetTheme
  }), [theme, handleSetTheme]);

  return (
    <NavbarThemeContext.Provider value={contextValue}>
      {children}
    </NavbarThemeContext.Provider>
  );
}

export function useNavbarTheme() {
  return useContext(NavbarThemeContext);
}
