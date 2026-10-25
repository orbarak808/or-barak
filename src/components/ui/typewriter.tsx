"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface TypewriterProps {
  children: React.ReactNode;
  className?: string;
  speed?: number; // ms per character
  blinkCursor?: boolean;
  startDelay?: number; // ms to wait before starting animation
}

// Helper function to extract text from React children
const extractText = (children: React.ReactNode): string => {
  if (typeof children === "string") {
    return children;
  }
  if (typeof children === "number") {
    return String(children);
  }
  if (Array.isArray(children)) {
    return children.map(extractText).join("");
  }
  if (React.isValidElement(children)) {
    const props = children.props as { children?: React.ReactNode };
    if (props.children) {
      return extractText(props.children);
    }
  }
  return "";
};

// Helper function to inject displayed text back into children
const injectText = (
  children: React.ReactNode,
  displayedText: string
): React.ReactNode => {
  if (typeof children === "string") {
    return displayedText;
  }
  if (typeof children === "number") {
    return displayedText;
  }
  if (Array.isArray(children)) {
    // For arrays, just return the first element with injected text
    return injectText(children[0], displayedText);
  }
  if (React.isValidElement(children)) {
    const props = children.props as { children?: React.ReactNode };
    if (props.children) {
      // Clone the element and inject the text into its children
      return React.cloneElement(
        children,
        children.props as Record<string, unknown>,
        injectText(props.children, displayedText)
      );
    }
  }
  return children;
};

export const Typewriter: React.FC<TypewriterProps> = ({
  children,
  className = "",
  speed = 50,
  blinkCursor = false,
  startDelay = 0
}) => {
  // How many characters have been typed so far
  const [typed, setTyped] = useState(0);
  const [shouldStart, setShouldStart] = useState(false);
  const text = extractText(children);

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Add delay before starting animation
          if (startDelay > 0) {
            const timer = setTimeout(() => {
              setShouldStart(true);
            }, startDelay);
            return () => clearTimeout(timer);
          } else {
            setShouldStart(true);
          }
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [startDelay]);

  useEffect(() => {
    if (!shouldStart) return;
    const interval = setInterval(() => {
      setTyped((count) => {
        if (count < text.length) return count + 1;
        clearInterval(interval);
        return count;
      });
    }, speed);
    return () => clearInterval(interval);
  }, [shouldStart, text, speed]);

  const displayed = text.slice(0, typed);

  return (
    <div ref={ref} className={cn("inline-block", className)}>
      {injectText(children, displayed)}
      {blinkCursor && <span className='typewriter-cursor'>|</span>}
    </div>
  );
};
