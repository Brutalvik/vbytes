"use client";

import { motion } from "framer-motion";
import Spline from "@splinetool/react-spline";
import { CDN } from "@/lib/config";

export default function LoadingScreen() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="fixed inset-0 z-50 bg-black flex items-center justify-center"
    >
      <Spline scene={CDN.glassLoaderUrl as string} />
    </motion.div>
  );
}
