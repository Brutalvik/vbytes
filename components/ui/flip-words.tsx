"use client";

import React, { useEffect, useState, useRef } from "react";
import { AnimatePresence, motion, MotionValue } from "framer-motion";
import { cn } from "@/lib/utils";

type FlipWordsProps = {
  words: string[];
  duration?: number;
  className?: string;
};

export const FlipWords: React.FC<FlipWordsProps> = ({
  words,
  duration = 3000,
  className,
}) => {
  const [index, setIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isAnimating) {
      timeoutRef.current = setTimeout(() => {
        setIndex((prev) => (prev + 1) % words.length);
        setIsAnimating(true);
      }, duration);
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isAnimating, duration, words.length]);

  const currentWord = words[index];

  return (
    <AnimatePresence mode="wait" onExitComplete={() => setIsAnimating(false)}>
      <motion.div
        key={currentWord}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{
          opacity: 0,
          y: -40,
          x: 40,
          filter: "blur(8px)",
          scale: 2,
          position: "absolute",
        }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 10,
        }}
        className={cn(
          "z-9 inline-block relative text-left text-neutral-900 dark:text-neutral-100 text-3xl font-bold",
          className,
        )}
      >
        {currentWord.split(" ").map((word: string, wordIdx: number) => (
          <motion.span
            key={`word-${index}-${wordIdx}`}
            initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{
              delay: wordIdx * 0.3,
              duration: 0.3,
            }}
            className="inline-block whitespace-nowrap"
          >
            {word.split("").map((letter: string, letterIdx: number) => (
              <motion.span
                key={`letter-${index}-${wordIdx}-${letterIdx}`}
                initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{
                  delay: wordIdx * 0.3 + letterIdx * 0.05,
                  duration: 0.2,
                }}
                className="inline-block"
              >
                {letter}
              </motion.span>
            ))}
            <span className="inline-block">&nbsp;</span>
          </motion.span>
        ))}
      </motion.div>
    </AnimatePresence>
  );
};
