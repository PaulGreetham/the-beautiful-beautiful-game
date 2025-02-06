'use client';

import React, { useEffect, useState } from 'react';

interface TypewriterTextProps {
  text: string;
  speed?: number;
}

export function TypewriterText({ text, speed = 4 }: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    if (!text) return;

    const currentIndex = displayedText.length;
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(text.slice(0, currentIndex + 1));
      }, speed);

      return () => clearTimeout(timer);
    }
  }, [text, displayedText, speed]);

  return <div className="whitespace-pre-wrap">{displayedText}</div>;
} 