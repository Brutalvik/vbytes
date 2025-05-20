"use client";

import dynamic from "next/dynamic";
import { CDN } from "@lib/config";
import Spline from "@splinetool/react-spline";

// Lazy load Spline with SSR disabled and a fallback loader scene
const LazySpline = dynamic<{ scene: string }>(
  () => import("@splinetool/react-spline").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => <Spline scene={CDN.glassLoaderUrl as string} />,
  }
);

export default function Robot() {
  return <LazySpline scene={CDN.robotUrl as string} />;
}
