"use client";

import Spline from "@splinetool/react-spline";
import { CDN } from "@/lib/config";

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 h-screen w-screen overflow-hidden bg-black z-50">
      <div className="w-[90vw] h-[90vh] scale-90 sm:scale-90 mx-auto flex items-center justify-center">
        <Spline scene={CDN.glassLoaderUrl as string} />
      </div>
    </div>
  );
}
