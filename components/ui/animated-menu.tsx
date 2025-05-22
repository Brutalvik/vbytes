"use client";

import React, { useEffect, useRef, useState } from "react";
import { Orbitron } from "next/font/google";

const orbitron = Orbitron({ subsets: ["latin"], weight: "400" });

const randomLetters = "QWERTYUIOPASDFGHJKLZXCVBNM".split("");

// Ensures only one label is active at a time
let currentActiveRef: React.RefObject<HTMLSpanElement> | null = null;

type AnimatedMenuProps = {
  item: string;
  className?: string;
};

export const AnimatedMenu: React.FC<AnimatedMenuProps> = ({ item, className }) => {
  const spanRef = useRef<HTMLSpanElement>(null);
  const originalText = useRef(item);
  const [displayText, setDisplayText] = useState(item);
  const animationFrame = useRef<number>();

  const resetText = () => {
    setDisplayText(originalText.current);
    if (animationFrame.current) cancelAnimationFrame(animationFrame.current);
  };

  const animateScramble = () => {
    let frame = 0;
    const textArray = originalText.current.split("");

    const animate = () => {
      if (frame < 15) {
        if (frame % 3 === 0) {
          const scrambled = textArray.map(
            () =>
              randomLetters[Math.floor(Math.random() * randomLetters.length)]
          );
          setDisplayText(scrambled.join(""));
        }
        frame++;
        animationFrame.current = requestAnimationFrame(animate);
      } else {
        setDisplayText(`[ ${originalText.current} ]`);
      }
    };

    animate();
  };

  const handleMouseEnter = () => {
    if (
      currentActiveRef &&
      currentActiveRef.current &&
      currentActiveRef !== spanRef
    ) {
      currentActiveRef.current.dispatchEvent(new Event("force-reset"));
    }
    currentActiveRef = spanRef;
    animateScramble();
  };

  const handleMouseLeave = () => {
    resetText();
    currentActiveRef = null;
  };

  useEffect(() => {
    const el = spanRef.current;
    if (!el) return;

    el.addEventListener("mouseenter", handleMouseEnter);
    el.addEventListener("mouseleave", handleMouseLeave);
    el.addEventListener("force-reset", resetText);

    return () => {
      el.removeEventListener("mouseenter", handleMouseEnter);
      el.removeEventListener("mouseleave", handleMouseLeave);
      el.removeEventListener("force-reset", resetText);
      if (animationFrame.current) cancelAnimationFrame(animationFrame.current);
    };
  }, []);

  return (
    <span
      ref={spanRef}
      className={`
        inline-block
        min-w-[120px]     
        text-center
        tracking-wide
        select-none
        cursor-pointer
        transition-all
        ${orbitron.className}
      ${className}}
      `}
    >
      {displayText}
    </span>
  );
};
