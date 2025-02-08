'use client';

import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";

interface TypewriterTextProps {
  text: string;
  speed?: number;
}

export function TypewriterText({ text, speed = 1 }: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!text) return;

    const currentIndex = displayedText.length;
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(text.slice(0, currentIndex + 1));
      }, speed);

      return () => clearTimeout(timer);
    } else {
      setIsComplete(true);
    }
  }, [text, displayedText, speed]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  return (
    <div className="relative space-y-4">
      <div className="whitespace-pre-wrap">{displayedText}</div>
      {isComplete && (
        <div className="flex justify-end">
          <Button
            variant="secondary"
            size="sm"
            className="gap-2"
            onClick={handleCopy}
          >
            <Copy className="h-4 w-4" />
            Copy Text
          </Button>
        </div>
      )}
    </div>
  );
} 