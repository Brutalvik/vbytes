"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import LoadingScreen from "@/components/ui/loading-screen";
import { motion, AnimatePresence } from "framer-motion";
import { FlipWords } from "@/components/ui/flip-words";
import DownloadButton from "@/components/ui/download-button";
import { CDN } from "@/lib/config";
import { LetsTalkModal } from "@/components/lets-talk-modal";
import { ResumeAIChatWidget } from "@/components/resume-ai-chat-widget";


// Lazy load heavy 3D component (Robot) with SSR disabled
const Robot = dynamic(() => import("@components/ui/robot"), {
  ssr: false,
  loading: () => null, // or skeleton fallback
});

const words = [
  "Scalable-Systems",
  "Cloud-Solutions",
  "Signed-APIs",
  "Serverless-Apps",
  "AI-Integration",
];

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
        <>
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
            <div className="relative z-9 flex flex-col md:flex-row items-center justify-between w-full px-6 md:px-16">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.3 }}
                className="w-full md:w-1/2 flex flex-col justify-center items-start gap-4 py-20"
              >
                <h1 className="text-4xl md:text-5xl font-bold leading-tight text-white drop-shadow-lg">
                  Crafting Code. Empowering Ideas.
                </h1>
                <div className="w-10 h-10">
                  <FlipWords words={words} className="text-xl" />
                </div>

                <p className="text-lg md:text-xl text-white/80 drop-shadow">
                  Build with precision. Launch with confidence.
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-8 sm:gap-4 h-auto sm:h-10">
                  <LetsTalkModal />
                  <DownloadButton url={CDN.pdfUrl as string} />
                </div>
              </motion.div>
            </div>
          </motion.section>
          {/* chat widget */}

          <ResumeAIChatWidget />
        </>
      )}
    </>
  );
}
