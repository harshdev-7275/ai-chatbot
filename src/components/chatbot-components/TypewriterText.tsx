"use client";

import React, { useState, useEffect } from "react";

// Custom hook for typewriter effect
function useTypewriter(
  text: string,
  typingSpeed: number,
  deletingSpeed: number,
  delayBeforeDelete: number,
  delayBeforeRestart: number
) {
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isTyping) {
      if (displayText.length < text.length) {
        timer = setTimeout(() => {
          setDisplayText(text.slice(0, displayText.length + 1));
        }, typingSpeed);
      } else {
        timer = setTimeout(() => setIsTyping(false), delayBeforeDelete);
      }
    } else {
      if (displayText.length > 0) {
        timer = setTimeout(() => {
          setDisplayText(displayText.slice(0, -1));
        }, deletingSpeed);
      } else {
        timer = setTimeout(() => setIsTyping(true), delayBeforeRestart);
      }
    }

    return () => clearTimeout(timer);
  }, [
    displayText,
    isTyping,
    text,
    typingSpeed,
    deletingSpeed,
    delayBeforeDelete,
    delayBeforeRestart,
  ]);

  return displayText;
}

interface TypewriterTextProps {
  text?: string;
  typingSpeed?: number;
  deletingSpeed?: number;
  delayBeforeDelete?: number;
  delayBeforeRestart?: number;
}

export default function TypewriterText({
  text = "What can I help with?",
  typingSpeed = 100,
  deletingSpeed = 50,
  delayBeforeDelete = 2000,
  delayBeforeRestart = 1000,
}: TypewriterTextProps) {
  const displayText = useTypewriter(
    text,
    typingSpeed,
    deletingSpeed,
    delayBeforeDelete,
    delayBeforeRestart
  );

  return (
    <div className="flex items-center justify-center">
      <h1 className="text-4xl font-bold text-white">
        {displayText}
        <span className="animate-blink">|</span>
      </h1>
    </div>
  );
}
