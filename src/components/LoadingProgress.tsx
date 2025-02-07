'use client';

import { useEffect, useState } from "react";
import { AnimatedCircularProgressBar } from "@/components/magicui/animated-circular-progress-bar";

export function LoadingProgress() {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const duration = 12000;
    const interval = 25;
    const steps = duration / interval;
    const increment = 100 / steps;

    const timer = setInterval(() => {
      setValue((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return Math.min(prev + increment, 100);
      });
    }, interval);

    return () => clearInterval(timer);
  }, []);

  return (
    <AnimatedCircularProgressBar
      max={100}
      min={0}
      value={value}
      gaugePrimaryColor="hsl(184 100% 35%)"
      gaugeSecondaryColor="rgba(0, 0, 0, 0.1)"
      suffix="%"
    />
  );
} 