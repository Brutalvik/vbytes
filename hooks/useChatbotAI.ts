// hooks/useVikramAI.ts
import { useState, useEffect } from "react";

const MAX_QUESTIONS_PER_DAY = 3;
const STORAGE_KEY = "vbytes-ai-chat";

export function useVikramAI() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    [],
  );
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);

  // Load chat + limit state from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Date.now() - parsed.timestamp < 24 * 60 * 60 * 1000) {
        setMessages(parsed.messages || []);
        if ((parsed.usage || 0) >= MAX_QUESTIONS_PER_DAY) {
          setDisabled(true);
        }
      } else {
        localStorage.removeItem(STORAGE_KEY); // Expired
      }
    }
  }, []);

  async function askQuestion(content: string) {
    if (disabled || loading) return;

    const updated = [...messages, { role: "user", content }];
    setMessages(updated);
    setLoading(true);

    const res = await fetch("/api/ai-chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: updated }),
    });

    const data = await res.json();

    if (data.reply) {
      const finalMessages = [
        ...updated,
        { role: "assistant", content: data.reply },
      ];
      const usage = (getUsage() || 0) + 1;

      setMessages(finalMessages);
      setDisabled(usage >= MAX_QUESTIONS_PER_DAY);
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          messages: finalMessages,
          usage,
          timestamp: Date.now(),
        }),
      );
    }

    setLoading(false);
  }

  function getUsage() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return 0;
    return JSON.parse(stored).usage || 0;
  }

  return {
    messages,
    askQuestion,
    loading,
    disabled,
  };
}
