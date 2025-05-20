"use client";

import dynamic from "next/dynamic";

// Lazy load Spline with SSR disabled
const LazySpline = dynamic<{ scene: string }>(
  () => import("@splinetool/react-spline").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => <div>Loading animation...</div>, // Optional fallback
  }
);

export default function Robot() {
  return (
    <main>
      <LazySpline scene="https://prod.spline.design/hvUEXfRkyjn1yz4y/scene.splinecode" />
    </main>
  );
}
