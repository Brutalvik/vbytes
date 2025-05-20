"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { motion, AnimatePresence } from "framer-motion";

// Lazy load heavy 3D component (Robot) with SSR disabled
const Robot = dynamic(() => import("@components/ui/robot"), {
  ssr: false,
  loading: () => null, // or skeleton fallback
});

export default function Home() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const onPageReady = () => {
      // Delay to ensure assets + animations have rendered
      requestAnimationFrame(() => {
        setTimeout(() => setIsReady(true), 1000);
      });
    };

    if (document.readyState === "complete") {
      onPageReady();
    } else {
      window.addEventListener("load", onPageReady);
      return () => window.removeEventListener("load", onPageReady);
    }
  }, []);

  return (
    <>
      {/* Loading animation while assets load */}
      <AnimatePresence>{!isReady && <LoadingScreen />}</AnimatePresence>

      {/* Show main content when ready */}
      {isReady && (
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2.0 }}
          className="relative w-full h-full overflow-hidden"
        >
          {/* Background Robot */}
          <div className="fixed inset-0 z-0 w-screen h-screen pointer-events-none">
            <div className="w-full h-full scale-125 translate-x-10 md:translate-x-32">
              <Robot />
            </div>
          </div>

          {/* Foreground Content */}
          <div className="relative z-20 flex flex-col md:flex-row items-center justify-between w-full px-6 md:px-16">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="w-full md:w-1/2 flex flex-col justify-center items-start gap-4 py-20"
            >
              <h1 className="text-4xl md:text-5xl font-bold leading-tight text-white drop-shadow-lg">
                Crafting Code. Empowering Ideas.
              </h1>
              <p className="text-lg md:text-xl text-white/80 drop-shadow">
                Deploying Scalable Systems · Cloud Solutions · APIs · Serverless
                Apps
              </p>
              <p className="text-lg md:text-xl text-white/80 drop-shadow">
                Build with precision. Launch with confidence.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-4 px-6 py-2 bg-primary text-white rounded-xl shadow-md hover:bg-primary/90 transition"
              >
                Let’s Connect
              </motion.button>
            </motion.div>
          </div>
        </motion.section>
      )}
    </>
  );
}
