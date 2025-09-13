import { useEffect, useCallback } from "react";
import { useNavbarTheme } from "@/contexts/NavbarThemeContext";

export function useNavbarColor(sections) {
  const { setTheme } = useNavbarTheme();

  const handleIntersection = useCallback(
    (theme) => {
      return ([entry]) => {
        if (entry.isIntersecting) {
          setTheme(theme);
        }
      };
    },
    [setTheme]
  );

  useEffect(() => {
    const sectionsArray = Array.isArray(sections) ? sections : [sections];
    const observerRefs = [];

    sectionsArray.forEach(({ ref, theme }) => {
      if (!ref?.current) return;

      const observer = new IntersectionObserver(handleIntersection(theme), {
        threshold: 0.1,
      });

      observer.observe(ref.current);
      observerRefs.push({ observer, element: ref.current });
    });

    return () => {
      observerRefs.forEach(({ observer, element }) => {
        if (observer && element) {
          observer.unobserve(element);
        }
        observer?.disconnect();
      });
    };
  }, [sections, handleIntersection]);
}
