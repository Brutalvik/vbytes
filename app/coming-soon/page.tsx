"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@heroui/button";
import { MailIcon } from "lucide-react";

export default function ComingSoon() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) =>
    date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });

  return (
    <div className="min-h-full overflow-hidden bg-black flex flex-col items-center justify-center text-white px-4">
      {/* Digital Clock */}
      <motion.div
        className="mb-10 text-6xl sm:text-7xl md:text-8xl font-mono tracking-widest text-white"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        {formatTime(time)}
      </motion.div>

      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="text-center"
      >
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-8 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
          Something Stunning is Coming
        </h1>
        <p className="text-base sm:text-lg md:text-xl max-w-xl mx-auto mb-8 text-gray-400">
          I’m working on something amazing. Sign up to be the first to know!
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
          type="email"
          required
          placeholder="Enter your email"
          className="w-full p-3 rounded-md bg-neutral-800 border border-neutral-600 text-white"
        />
        <Button type="submit" color="primary" variant="solid" className="flex items-center gap-2">
          <MailIcon className="w-5 h-5" /> Notify Me
        </Button>
      </motion.form>

      {/* Footer */}
      <motion.div
        className="mt-10 text-sm text-gray-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.6 }}
      >
        Launching Soon — Stay Tuned
      </motion.div>
    </div>
  );
}
