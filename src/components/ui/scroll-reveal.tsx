"use client";

import { createContext, useContext } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

/*
 * Scroll entrance for the landing page: content rises in (opacity from 0,
 * 18px lift, ~1s ease-out) as it enters the viewport, once. Only active
 * inside ScrollRevealProvider, so shared components (cards, the contact
 * form) keep their usual behaviour on other pages. With reduced motion the
 * content is simply visible; globals.css also forces [data-reveal] visible
 * under that preference before hydration.
 */

const ScrollRevealContext = createContext(false);

export function ScrollRevealProvider({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <ScrollRevealContext.Provider value={true}>
      {children}
    </ScrollRevealContext.Provider>
  );
}

/**
 * Motion props for a scroll entrance, or null outside ScrollRevealProvider
 * (callers then keep their own entrance, if any).
 */
export function useScrollReveal(delay = 0): HTMLMotionProps<"div"> | null {
  const active = useContext(ScrollRevealContext);
  const reduced = usePrefersReducedMotion();
  if (!active) return null;

  const hidden = { opacity: 0, y: 18 };
  const shown = { opacity: 1, y: 0 };
  if (reduced) {
    return {
      "data-reveal": "",
      initial: hidden,
      animate: shown,
      transition: { duration: 0 }
    } as HTMLMotionProps<"div">;
  }
  return {
    "data-reveal": "",
    initial: hidden,
    whileInView: shown,
    viewport: { once: true, margin: "0px 0px -8% 0px" },
    transition: { duration: 1, ease: [0.22, 1, 0.36, 1], delay }
  } as HTMLMotionProps<"div">;
}

/** A div that rises in on the landing page and is a plain div elsewhere. */
export function Reveal({
  children,
  className,
  delay
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const reveal = useScrollReveal(delay);
  if (!reveal) return <div className={className}>{children}</div>;
  return (
    <motion.div className={className} {...reveal}>
      {children}
    </motion.div>
  );
}
