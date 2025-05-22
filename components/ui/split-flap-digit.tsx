"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function SplitFlapDigit({ value }: { value: string }) {
  const [prev, setPrev] = useState(value);

  useEffect(() => {
    if (value !== prev) {
      const timeout = setTimeout(() => setPrev(value), 600);
      return () => clearTimeout(timeout);
    }
  }, [value, prev]);

  return (
    <div className="relative w-12 sm:w-14 md:w-16 h-16 sm:h-20 md:h-24 bg-neutral-900 text-white font-mono text-3xl sm:text-4xl md:text-5xl rounded shadow-inner overflow-hidden flex items-center justify-center">
      <AnimatePresence mode="wait">
        <motion.span
          key={value}
          initial={{ rotateX: -90, opacity: 0 }}
          animate={{ rotateX: 0, opacity: 1 }}
          exit={{ rotateX: 90, opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="absolute"
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}
