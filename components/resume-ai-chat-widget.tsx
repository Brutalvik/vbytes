"use client";

import React, { useEffect, useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Bot } from "lucide-react";
import { Button } from "@heroui/button";
import { cn } from "@lib/utils";
import { LetsTalkModal } from "@components/lets-talk-modal";
import { TypingIndicator } from "@components/ui/typing-indicator";
import { Tooltip } from "@heroui/react";

const STORAGE_KEY = "resumeChatHistory";
const LIMIT_KEY = "resumeChatLimit";
const LIMIT_TIMESTAMP_KEY = "resumeChatTimestamp";
const MAX_QUESTIONS = 5;
const COOLDOWN_HOURS = 24;

export function ResumeAIChatWidget() {
  const [minimized, setMinimized] = useState(true);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    []
  );
  const [questionCount, setQuestionCount] = useState(0);
  const [cooldownActive, setCooldownActive] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedMessages = localStorage.getItem(STORAGE_KEY);
    const savedCount = localStorage.getItem(LIMIT_KEY);
    const savedTimestamp = localStorage.getItem(LIMIT_TIMESTAMP_KEY);

    if (savedMessages) setMessages(JSON.parse(savedMessages));
    if (savedCount) setQuestionCount(parseInt(savedCount));

    if (savedTimestamp) {
      const elapsed = Date.now() - parseInt(savedTimestamp);
      if (elapsed >= COOLDOWN_HOURS * 3600 * 1000) {
        localStorage.removeItem(LIMIT_KEY);
        localStorage.removeItem(LIMIT_TIMESTAMP_KEY);
        setQuestionCount(0);
        setCooldownActive(false);
      } else {
        setCooldownActive(true);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem(LIMIT_KEY, questionCount.toString());
    if (questionCount >= MAX_QUESTIONS && !cooldownActive) {
      localStorage.setItem(LIMIT_TIMESTAMP_KEY, Date.now().toString());
      setCooldownActive(true);
    }
  }, [questionCount]);

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
    setQuestionCount((count) => count + 1);
    setLoading(true);

    try {
      const res = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      const data = await res.json();
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
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "❌ Something went wrong." },
      ]);
    } finally {
      setLoading(false);
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

              {cooldownActive ? (
                <div className="p-4 flex flex-col gap-4 text-sm text-neutral-600 dark:text-neutral-300">
                  <p>
                    Looks like we both have questions — let’s connect directly
                    instead.
                  </p>
                  <LetsTalkModal />
                </div>
              ) : (
                <>
                  {messages.length === 0 && (
                    <div className="text-sm text-neutral-500 italic p-4 pt-2">
                      ⚠️ Responses may not be 100% accurate. This assistant is
                      still learning. Limited to 5 questions per session.
                    </div>
                  )}

                  <div
                    className="h-[300px] px-4 py-2 space-y-2 overflow-y-auto"
                    ref={scrollRef}
                  >
                    {messages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={cn(
                          "flex flex-col gap-1",
                          msg.role === "user" ? "items-end" : "items-start"
                        )}
                      >
                        <div
                          className={cn(
                            "px-3 py-2 rounded-md text-sm max-w-[80%]",
                            {
                              "bg-neutral-100 dark:bg-neutral-800 text-black dark:text-white":
                                msg.role === "user",
                              "bg-blue-50 dark:bg-blue-900 text-blue-900 dark:text-blue-200":
                                msg.role === "assistant",
                            }
                          )}
                        >
                          <span className="font-semibold mr-2">
                            {msg.role === "user" ? "You" : "Assistant"}
                          </span>
                          {msg.content}
                        </div>
                        <span className="text-xs text-neutral-400 mt-0.5">
                          {new Date().toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    ))}
                    {loading && <TypingIndicator />}
                  </div>

                  <div className="p-4 border-t border-neutral-200 dark:border-neutral-700 flex flex-col gap-2">
                    <textarea
                      className="w-full p-2 border border-neutral-300 dark:border-neutral-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Ask something about my experience..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSend();
                        }
                      }}
                      rows={2}
                    />
                    <Button onPress={handleSend} disabled={!input.trim()}>
                      Send
                    </Button>
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <Tooltip content="AI Chat" showArrow={true} color="primary">
          <Button
            onPress={() => setMinimized((prev) => !prev)}
            className="rounded-full shadow-lg w-14 h-14 flex items-center justify-center absolute bottom-0 right-0"
            variant="solid"
          >
            <Bot className="w-10 h-10" />
          </Button>
        </Tooltip>
      </div>
    </div>
  );
}
