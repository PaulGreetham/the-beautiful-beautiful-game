'use client';

import { FlickeringGrid } from "@/components/magicui/flickering-grid";

export function FlickeringGridBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <FlickeringGrid
        className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]"
        squareSize={4}
        gridGap={6}
        color="hsl(184 100% 35%)"
        maxOpacity={0.15}
        flickerChance={0.1}
      />
    </div>
  );
} 