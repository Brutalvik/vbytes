"use client";

import React, { useEffect, useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Bot } from "lucide-react";
import { Button } from "@heroui/button";
import { cn } from "@lib/utils";
import { LetsTalkModal } from "@components/lets-talk-modal";

const STORAGE_KEY = "resumeChatHistory";
const LIMIT_KEY = "resumeChatLimit";
const LIMIT_TIMESTAMP_KEY = "resumeChatTimestamp";
const MAX_QUESTIONS = 30;
const COOLDOWN_HOURS = 24;

export function ResumeAIChatWidget() {
  const [minimized, setMinimized] = useState(true);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    []
  );
  const [questionCount, setQuestionCount] = useState(0);
  const [cooldownActive, setCooldownActive] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Load history on mount
  useEffect(() => {
    const savedMessages = localStorage.getItem(STORAGE_KEY);
    const savedCount = localStorage.getItem(LIMIT_KEY);
    const savedTimestamp = localStorage.getItem(LIMIT_TIMESTAMP_KEY);

    if (savedMessages) setMessages(JSON.parse(savedMessages));
    if (savedCount) setQuestionCount(parseInt(savedCount));
    if (savedTimestamp) {
      const elapsed = Date.now() - parseInt(savedTimestamp);
      if (elapsed < COOLDOWN_HOURS * 3600 * 1000) {
        setCooldownActive(true);
      }
    }
  }, []);

  // Save messages to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  // Track usage and activate cooldown
  useEffect(() => {
    localStorage.setItem(LIMIT_KEY, questionCount.toString());
    if (questionCount >= MAX_QUESTIONS && !cooldownActive) {
      localStorage.setItem(LIMIT_TIMESTAMP_KEY, Date.now().toString());
      setCooldownActive(true);
    }
  }, [questionCount, cooldownActive]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");

    try {
      const res = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      const data = await res.json();
      console.log("Response from AI:", data);

      if (data.error) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: `❌ ${data.error}` },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.response },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "❌ Something went wrong." },
      ]);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 w-[350px]">
      <div className="relative">
        <AnimatePresence>
          {!minimized && (
            <motion.div
              initial={{ opacity: 0, scale: 0.6, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.6, y: 50 }}
              transition={{ duration: 0.3 }}
              className="absolute bottom-16 right-0 w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 shadow-lg rounded-xl overflow-hidden flex flex-col"
            >
              <div className="flex justify-between items-center px-4 py-2 border-b border-neutral-200 dark:border-neutral-700">
                <span className="font-semibold">Ask About My Resume</span>
                <button onClick={() => setMinimized(true)}>
                  <X className="w-5 h-5" />
                </button>
              </div>

              {messages.length === 0 && (
                <div className="text-sm text-neutral-500 italic">
                  ⚠️ Responses may not be 100% accurate. This assistant is still
                  learning.
                </div>
              )}

              <div
                className="h-[300px] px-4 py-2 space-y-2 overflow-y-auto"
                ref={scrollRef}
              >
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={cn("px-3 py-2 rounded-md text-sm", {
                      "bg-neutral-100 dark:bg-neutral-800 text-black dark:text-white":
                        msg.role === "user",
                      "bg-blue-50 dark:bg-blue-900 text-blue-900 dark:text-blue-200":
                        msg.role === "assistant",
                    })}
                  >
                    {msg.content}
                  </div>
                ))}
              </div>

              <div className="p-4 border-t border-neutral-200 dark:border-neutral-700 flex flex-col gap-2">
                {cooldownActive ? (
                  <div className="text-sm text-neutral-500">
                    You’ve reached your daily limit of 3 questions. Let’s keep
                    the conversation going!
                    <div className="mt-2">
                      <LetsTalkModal />
                    </div>
                  </div>
                ) : (
                  <>
                    <textarea
                      className="w-full p-2 border border-neutral-300 dark:border-neutral-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Ask something about my experience..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      rows={2}
                    />
                    <Button onPress={handleSend} disabled={!input.trim()}>
                      Send
                    </Button>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <Button
          onPress={() => setMinimized((prev) => !prev)}
          className="rounded-full shadow-lg w-14 h-14 flex items-center justify-center absolute bottom-0 right-0"
          variant="solid"
        >
          <Bot className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
