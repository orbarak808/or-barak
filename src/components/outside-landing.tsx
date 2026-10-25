"use client";

import { usePathname } from "next/navigation";

/**
 * Renders its children on every route except the landing page. The landing
 * page renders its own copy of the footer inside the shared sky, so the page
 * ends in the sky instead of on a separately filled band.
 */
export function OutsideLanding({ children }: { children: React.ReactNode }) {
  return usePathname() === "/" ? null : children;
}
