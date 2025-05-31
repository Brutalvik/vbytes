"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import Loader from "@/components/ui/ui-loader/loader";

// Lazy load HeroContent with loader
const HeroContent = dynamic(() => import("@components/hero-content"), {
  ssr: false,
  loading: () => <Loader />,
});

const ResumeAIChatWidget = dynamic(
  () => import("@components/resume-ai-chat-widget").then((mod) => mod.ResumeAIChatWidget),
  {
    ssr: false,
    loading: () => null,
  }
);

const Home: React.FC = () => {
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setShowChat(true), 1500);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      <HeroContent />
      {showChat && <ResumeAIChatWidget />}
    </>
  );
};

export default Home;
