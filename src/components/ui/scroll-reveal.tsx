"use client";

import { createContext, useContext, useSyncExternalStore } from "react";
import { motion, type MotionProps } from "framer-motion";
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

// Element-agnostic, so the same entrance spreads onto any motion element.
// data-reveal carries the layout ("phone" or "wide"); callers also use it
// as the element's key (see useIsPhone).
type RevealMotionProps = MotionProps & { "data-reveal": string };

/**
 * What is entering: text rises, a heading rises a little further, and on
 * phones an image fades up from a slight scale instead of moving.
 */
export type RevealKind = "text" | "heading" | "image";

const phoneQuery = "(max-width: 767px)";
const subscribePhone = (onChange: () => void) => {
  const query = window.matchMedia(phoneQuery);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};

/**
 * Below 768px. false on the server and during hydration, then the real
 * value. framer-motion applies `initial` only on mount, so an element whose
 * entrance differs by layout is keyed on this and remounts once, right
 * after hydration, before it has animated.
 */
function useIsPhone() {
  return useSyncExternalStore(
    subscribePhone,
    () => window.matchMedia(phoneQuery).matches,
    () => false
  );
}

function revealStates(kind: RevealKind, phone: boolean) {
  const shown = { opacity: 1, y: 0, scale: 1 };
  if (!phone) return { hidden: { opacity: 0, y: 18 }, shown };
  if (kind === "image") return { hidden: { opacity: 0, scale: 0.96 }, shown };
  return { hidden: { opacity: 0, y: kind === "heading" ? 24 : 18 }, shown };
}

/**
 * Motion props for a scroll entrance, or null outside ScrollRevealProvider
 * (callers then keep their own entrance, if any). Phones use a shorter
 * 0.9s entrance; wider screens keep the 1s rise.
 */
export function useScrollReveal(
  delay = 0,
  kind: RevealKind = "text"
): RevealMotionProps | null {
  const active = useContext(ScrollRevealContext);
  const reduced = usePrefersReducedMotion();
  const phone = useIsPhone();
  if (!active) return null;

  const { hidden, shown } = revealStates(kind, phone);
  const layout = phone ? "phone" : "wide";
  if (reduced) {
    return {
      "data-reveal": layout,
      initial: hidden,
      animate: shown,
      transition: { duration: 0 }
    };
  }
  return {
    "data-reveal": layout,
    initial: hidden,
    whileInView: shown,
    viewport: { once: true, margin: "0px 0px -8% 0px" },
    transition: { duration: phone ? 0.9 : 1, ease: [0.22, 1, 0.36, 1], delay }
  };
}

/** A div that rises in on the landing page and is a plain div elsewhere. */
export function Reveal({
  children,
  className,
  delay,
  kind
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  kind?: RevealKind;
}) {
  const reveal = useScrollReveal(delay, kind);
  if (!reveal) return <div className={className}>{children}</div>;
  return (
    <motion.div key={reveal["data-reveal"]} className={className} {...reveal}>
      {children}
    </motion.div>
  );
}
