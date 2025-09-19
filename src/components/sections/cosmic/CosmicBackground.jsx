'use client';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import styles from '@/styles/components/sections/cosmic/Cosmic.module.css';

const Star = ({ top, left, size, duration, delay }) => {
  const starRef = useRef(null);

  useEffect(() => {
    if (starRef.current) {
      gsap.to(starRef.current, {
        x: `${(Math.random() - 0.5) * 120}px`,
        y: `${(Math.random() - 0.5) * 120}px`,
        duration,
        delay,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }
  }, [duration, delay]);

  return (
    <div
      ref={starRef}
      className={styles.star}
      style={{
        top,
        left,
        width: size,
        height: size,
        background: 'white',
        position: 'absolute',
        borderRadius: '50%',
        opacity: Math.random() * 0.2 + 0.2,
        filter: 'drop-shadow(0 0 2px white)',
        animation: `twinkle ${1 + Math.random() * 1}s infinite alternate`,
      }}
    />
  );
};

const HorizonStar = ({ index, onComplete }) => {
  const starRef = useRef(null);

  useEffect(() => {
    const left = Math.random() * 100;
    const size = Math.random() * 6 + 1;
    const duration = 4 + Math.random() * 2;
    const delay = Math.random() * 1;

    if (starRef.current) {
      gsap.set(starRef.current, { 
        opacity: 0,
        left: `${left}%`,
        width: `${size}px`,
        height: `${size}px`,
       });
      gsap
        .timeline({
          onComplete: () => onComplete(index),
        })
        .to(starRef.current, {
          opacity: 1,
          duration: 0.5,
          delay,
          ease: 'power1.out',
        })
        .to(
          starRef.current,
          {
            y: -150,
            x: (Math.random() - 0.5) * 100,
            duration: duration * 0.7,
            ease: 'power1.out',
          },
          delay
        )
        .to(
          starRef.current,
          {
            opacity: 0,
            duration: 0.8,
            ease: 'power1.out',
          },
          duration * 0.7 + delay
        );
    }
  }, [index, onComplete]);

  return (
    <div
      ref={starRef}
      className={styles.horizonStar}
      style={{
        position: 'absolute',
        bottom: '20vh',
        background: 'rgba(255, 215, 0, 0.9)',
        borderRadius: '50%',
        filter: 'drop-shadow(0 0 4px rgba(255, 215, 0, 0.8))',
        zIndex: 3,
      }}
    />
  );
};

export default function CosmicBackground() {
  const [stars, setStars] = useState([]);
  const [horizonStars, setHorizonStars] = useState([]);

  useEffect(() => {
    const generated = Array.from({ length: 250 }).map((_, i) => ({
      id: `star-${i}`,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: Math.random() > 0.5 ? '3px' : '0.8px',
      duration: 10 + Math.random() * 20,
      delay: Math.random() * 5,
    }));
    setStars(generated);

    let starIndex = 0;
    const interval = setInterval(() => {
      setHorizonStars((prev) => [...prev, { id: starIndex++ }]);
    }, 200);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const handleHorizonStarComplete = (id) => {
    setHorizonStars((prev) => prev.filter((star) => star.id !== id));
  };

  return (
    <>
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        {stars.map((star) => (
          <Star key={star.id} {...star} />
        ))}
      </div>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 3,
          pointerEvents: 'none',
        }}
      >
        {horizonStars.map((star) => (
          <HorizonStar key={star.id} index={star.id} onComplete={handleHorizonStarComplete} />
        ))}
      </div>
    </>
  );
}
