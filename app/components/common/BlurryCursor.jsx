"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import gsap from "gsap";

export default function BlurryCursor({ targetRef, isActive = true }) {
  const mouse = useRef({ x: 0, y: 0 });
  const delayedMouse = useRef({ x: 0, y: 0 });
  const rafId = useRef(null);
  const circle = useRef();
  const [isInside, setIsInside] = useState(false);

  const lerp = (x, y, a) => x * (1 - a) + y * a;

  const manageMouseMove = (e) => {
    if (!targetRef.current) return;

    const rect = targetRef.current.getBoundingClientRect();
    const { clientX, clientY, target } = e;

    const inside =
      clientX >= rect.left &&
      clientX <= rect.right &&
      clientY >= rect.top &&
      clientY <= rect.bottom;

    // Hide cursor when hovering over any link or button.
    const isOnLinkOrButton = target.closest("a, button") !== null;

    if (inside && !isOnLinkOrButton && isActive) {
      if (!isInside) setIsInside(true);
      mouse.current = { x: clientX, y: clientY };
      gsap.to(circle.current, {
        scale: 1,
        opacity: 1,
        display: "flex",
        duration: 0.5,
        ease: "back.out(1.7)",
        onComplete: () => {
          // Add the class to make it interactive
          circle.current.classList.add("pointer-events-auto");
        },
      });
    } else {
      if (isInside) setIsInside(false);
      // Remove the class to make it non-interactive
      circle.current.classList.remove("pointer-events-auto");
      gsap.to(circle.current, {
        scale: 0.1,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out",
        onComplete: () => {
          gsap.set(circle.current, { display: "none" });
        },
      });
    }
  };

  const animate = () => {
    const { x, y } = delayedMouse.current;
    delayedMouse.current = {
      x: lerp(x, mouse.current.x, 0.075),
      y: lerp(y, mouse.current.y, 0.075),
    };
    gsap.set(circle.current, {
      x: delayedMouse.current.x,
      y: delayedMouse.current.y,
      xPercent: -50,
      yPercent: -50,
    });
    rafId.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (!targetRef.current) return;

    gsap.set(circle.current, { opacity: 0, scale: 0.1, display: "none" });
    animate();
    window.addEventListener("mousemove", manageMouseMove);
    return () => {
      window.removeEventListener("mousemove", manageMouseMove);
      cancelAnimationFrame(rafId.current);
    };
  }, [targetRef, isActive]);

  return (
    <div
      className="fixed top-0 left-0 hidden h-[150px] w-[150px] origin-center cursor-pointer items-center justify-center rounded-full border border-white/60 bg-[#434343]/10 pointer-events-none transition-all duration-300 ease-in-out z-50"
      ref={circle}
    >
      <div className="flex h-full w-full items-center justify-center">
        <div className="cursor-pointer text-center text-sm font-bold text-[#01214f]">
          <Link
            href="/contact"
            className="block select-none rounded-md px-2.5 py-1.5 font-normal text-[#010101] no-underline transition-all duration-300 ease-in-out hover:scale-110 active:scale-95 active:duration-100"
          >
            Contact
          </Link>
        </div>
      </div>
    </div>
  );
}
