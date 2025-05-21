"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@heroui/button";
import { Download, Loader2, CheckCircle2 } from "lucide-react";
import { downloadFileWithProgress } from "@/utils/downloadFileWithProgress"; // Adjust path accordingly

export default function DownloadButton({
  duration = 2000,
  url,
}: {
  duration?: number;
  url: string;
}) {
  const [progress, setProgress] = useState(0);
  const [state, setState] = useState<"idle" | "active" | "done">("idle");

  const handleClick = async () => {
    if (state === "active") return;
    setProgress(0);
    setState("active");

    try {
      await downloadFileWithProgress(url, (percent) => {
        setProgress(percent);
      });
      setTimeout(() => setState("done"), 300); // small delay to show 100%
    } catch (err) {
      console.error("Download failed", err);
      setState("idle");
    }
  };

  return (
    <Button
      onPress={handleClick}
      disabled={state === "active"}
      style={{
        width: state === "active" ? "auto" : "180px",
        transition: "width 0.5s ease-in-out",
      }}
    >
      {/* Icon wrapper - 30% with slight left offset */}
      <div className="flex items-center justify-center w-[30%] translate-x-[-5px]">
        <div className="relative w-7 h-7">
          <AnimatePresence mode="wait">
            {state === "idle" && (
              <motion.div
                key="download-icon"
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 90 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <Download className="w-7 h-7" />
              </motion.div>
            )}
            {state === "active" && (
              <motion.div
                key="loader-icon"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <Loader2 className="w-7 h-7 animate-spin" />
              </motion.div>
            )}
            {state === "done" && (
              <motion.div
                key="check-icon"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <CheckCircle2 className="w-7 h-7 text-white" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Text wrapper - 70% */}
      <div className="relative w-[80%] h-full flex items-center justify-center">
        <AnimatePresence mode="wait">
          {state === "idle" && (
            <motion.span
              key="label-idle"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{
                duration: 0.1,
                ease: "easeOut",
                exit: { duration: 0.0, ease: "easeIn" },
              }}
              className="absolute"
            >
              Download CV
            </motion.span>
          )}
          {state === "active" && (
            <motion.span
              key="label-progress"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{
                duration: 0.1,
                ease: "easeOut",
                exit: { duration: 0.0, ease: "easeIn" },
              }}
              className="absolute"
            >
              {progress} %
            </motion.span>
          )}
          {state === "done" && (
            <motion.span
              key="label-done"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{
                duration: 0.1,
                ease: "easeOut",
                exit: { duration: 0.0, ease: "easeIn" },
              }}
              className="absolute"
            >
              Download Again
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </Button>
  );
}
