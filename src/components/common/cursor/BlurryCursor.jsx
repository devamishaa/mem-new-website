"use client";
import React, { useEffect, useRef, useState } from "react";
import { gsap } from "@/utils/gsap";
import Link from "next/link";
import styles from "@/styles/components/common/cursor/BlurryCursor.module.css";

export default function BlurryCursor({ targetRef, isActive = true }) {
  const mouse = useRef({ x: 0, y: 0 });
  const delayedMouse = useRef({ x: 0, y: 0 });
  const rafId = useRef(null);
  const circle = useRef();
  const [isInside, setIsInside] = useState(false);

  const lerp = (x, y, a) => x * (1 - a) + y * a;

  const manageMouseMove = (e) => {
    const rect = targetRef.current.getBoundingClientRect();
    const { clientX, clientY, target } = e;

    const inside =
      clientX >= rect.left &&
      clientX <= rect.right &&
      clientY >= rect.top &&
      clientY <= rect.bottom;

    // 👇 Hide cursor when hovering links/buttons
    const isOnLink =
      target.closest("a, button, .footerLink, .socialIconLink") !== null &&
      !target.closest(`.${styles.link}`);

    if (inside && !isOnLink && isActive) {
      if (!isInside) setIsInside(true);
      mouse.current = { x: clientX, y: clientY };
      gsap.to(circle.current, {
        scale: 1,
        opacity: 1,
        display: "flex",
        duration: 0.5,
        ease: "back.out(1.7)",
        onComplete: () => {
          circle.current.classList.add(styles.active);
        },
      });
    } else {
      if (isInside) setIsInside(false);
      circle.current.classList.remove(styles.active);
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
    gsap.set(circle.current, { opacity: 0, scale: 0.1, display: "none" });
    animate();
    window.addEventListener("mousemove", manageMouseMove);
    return () => {
      window.removeEventListener("mousemove", manageMouseMove);
      cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <div className={styles.blurryCursor} ref={circle}>
      <div className={styles.container}>
        <div className={styles.content}>
          <Link href="https://memorae.ai/" className={styles.link}>
            Contact
          </Link>
        </div>
      </div>
    </div>
  );
}
