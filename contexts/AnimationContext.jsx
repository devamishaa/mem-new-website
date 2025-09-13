"use client";
import { createContext, useContext, useState, useMemo, useCallback } from "react";

const AnimationContext = createContext({
  isLoadingComplete: false,
  setLoadingComplete: () => {},
});

export const AnimationProvider = ({ children }) => {
  const [isLoadingComplete, setIsLoadingComplete] = useState(false);

  const setLoadingComplete = useCallback((complete) => {
    setIsLoadingComplete(complete);
  }, []);

  const contextValue = useMemo(() => ({
    isLoadingComplete,
    setLoadingComplete
  }), [isLoadingComplete, setLoadingComplete]);

  return (
    <AnimationContext.Provider value={contextValue}>
      {children}
    </AnimationContext.Provider>
  );
};

export const useAnimationContext = () => {
  return useContext(AnimationContext);
};
