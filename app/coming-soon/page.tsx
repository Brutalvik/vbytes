"use client";

import { useEffect, useState } from "react";
import { Button } from "@heroui/button";
import { MailIcon } from "lucide-react";
import { motion } from "framer-motion";
import SplitFlapDigit from "@/components/ui/split-flap-digit";

export default function ComingSoon() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) =>
    date
      .toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      })
      .replace(/:/g, " : ");

  function getTimeDigits(date: Date): string[] {
        const timeStr = date
          .toLocaleTimeString("en-US", { hour12: false })
          .replace(/:/g, "")
          .padStart(6, "0");
        return timeStr.split(""); // ["0", "9", "3", "4", "5", "6"]
      }

      const digits = getTimeDigits(time);

  return (
    <div className="overflow-hidden bg-black flex flex-col items-center justify-center text-white px-4">
      {/* Flip-style digital clock */}
      <motion.div
        className="flex items-center justify-center gap-1 sm:gap-2 mb-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        {digits.map((digit, i) => (
          <div key={i} className="flex items-center">
            <SplitFlapDigit value={digit} />
            {[1, 3].includes(i) && <span className="text-4xl text-white mx-1 sm:mx-2">:</span>}
          </div>
        ))}
      </motion.div>

      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="text-center"
      >
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold mb-10 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
          Something Stunning is Coming
        </h1>
        <p className="text-base sm:text-lg md:text-2xl max-w-xl mx-auto mb-8 text-gray-400">
          I am working on something amazing. Sign up to be the first to know!
        </p>
      </motion.div>

      {/* Email Signup */}
      <motion.form
        onSubmit={(e) => {
          e.preventDefault();
          alert("Thanks for signing up!");
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.4 }}
        className="w-full max-w-md flex flex-col sm:flex-row items-center gap-4"
      >
        <input
          id="email"
          type="email"
          required
          placeholder="Enter your email"
          className="w-full mt-1 p-2 border rounded-md dark:bg-neutral-800 dark:border-neutral-600 dark:text-white"
        />
        <Button type="submit" color="primary" variant="solid" className="flex items-center gap-2">
          <MailIcon className="w-5 h-5" /> Notify Me
        </Button>
      </motion.form>

      {/* Footer message */}
      <motion.div
        className="mt-8 text-sm text-gray-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.6 }}
      >
        Launching Soon — Stay Tuned
      </motion.div>
    </div>
  );
}
