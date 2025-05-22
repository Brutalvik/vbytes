"use client";

import Spline from "@splinetool/react-spline";
import { CDN } from "@lib/config";

export default function Robot() {
  return <Spline scene={CDN.robotUrl as string} />;
}
