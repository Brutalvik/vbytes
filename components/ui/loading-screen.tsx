"use client";

import Spline from "@splinetool/react-spline";
import { CDN } from "@/lib/config";
import { motion } from "framer-motion";

export default function LoadingScreen() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="fixed inset-0 z-50 bg-black flex items-center justify-center"
    >
      <div className="w-full h-full scale-110 sm:scale-110">
        <Spline scene={CDN.glassLoaderUrl as string} />
      </div>
    </motion.div>
  );
}
