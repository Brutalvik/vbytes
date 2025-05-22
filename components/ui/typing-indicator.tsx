"use client";

import React from "react";
import { cn } from "@lib/utils"; // Optional utility for class merging

interface TypingIndicatorProps {
  className?: string;
  message?: string;
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({
  className,
  message = "Assistant is typing",
}) => {
  return (
    <div
      className={cn(
        "px-3 py-2 rounded-md text-sm bg-blue-50 dark:bg-blue-900 text-blue-900 dark:text-blue-200 flex items-center gap-2",
        className,
      )}
    >
      <span>{message}</span>
      <span className="flex gap-1">
        <span className="animate-bounce [animation-delay:0ms]">.</span>
        <span className="animate-bounce [animation-delay:100ms]">.</span>
        <span className="animate-bounce [animation-delay:200ms]">.</span>
      </span>
    </div>
  );
};
