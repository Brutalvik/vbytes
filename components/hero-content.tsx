import { CDN } from "@/lib/config";
import { motion } from "framer-motion";
import React from "react";
import { LetsTalkModal } from "@components/lets-talk-modal";
import DownloadButton from "@components/ui/download-button";
import { FlipWords } from "@components/ui/flip-words";

const words = [
  "Scalable-Systems",
  "Cloud-Solutions",
  "Signed-APIs",
  "Serverless-Apps",
  "AI-Integration",
];

const HeroContent: React.FC = () => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2.0 }}
      className="relative w-full h-full overflow-hidden"
    >
      {/* Foreground Content */}
      <div className="relative z-9 flex flex-col md:flex-row items-center justify-between w-full px-6 md:px-16">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="w-full md:w-1/2 flex flex-col justify-center items-start gap-4 py-20"
        >
          <h1 className="text-4xl md:text-5xl font-bold leading-tight text-default-500 drop-shadow-lg">
            Crafting Code. Empowering Ideas.
          </h1>
          <div className="w-10 h-10">
            <FlipWords words={words} className="text-xl text-default-500" />
          </div>

          <p className="text-lg md:text-xl text-default-500 drop-shadow">
            Build with precision. Launch with confidence.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-8 sm:gap-4 h-auto sm:h-10">
            <LetsTalkModal />
            <DownloadButton url={CDN.pdfUrl as string} />
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default HeroContent;
