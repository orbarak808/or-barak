/**
 * Stops for the landing page's shared sky (AtmosphereSky). Each landing
 * section declares which stop it belongs to with data-sky="<id>"; the sky
 * blends between neighbouring stops as the page scrolls. Order matters: it
 * is the order the stops are visited top to bottom.
 *
 * sky: three colours, top / middle (55%) / bottom of the viewport.
 * g1, g2: [colour, alpha, x%, y%, width%, height%] — two soft lights placed
 * in viewport percentages. g1 dims slightly between stops (the lift);
 * g1's colour also tints the slow breath drift.
 */
export type SkyLight = [
  color: string,
  alpha: number,
  x: number,
  y: number,
  width: number,
  height: number
];

export interface SkyStop {
  id: string;
  sky: [top: string, middle: string, bottom: string];
  g1: SkyLight;
  g2: SkyLight;
}

// One warm light travels down the page over near-neutral skies; each stop's
// second light is the same colour, much fainter and wider, as a halo.
const sky: SkyStop["sky"] = ["#070607", "#060506", "#050405"];

export const skyStops: SkyStop[] = [
  {
    id: "hero",
    sky,
    g1: ["#E8B878", 0.1, 50, 100, 60, 40],
    g2: ["#E8B878", 0.03, 50, 100, 96, 64]
  },
  {
    id: "films",
    sky,
    g1: ["#E8B878", 0.13, 50, 30, 42, 38],
    g2: ["#E8B878", 0.03, 50, 30, 68, 60]
  },
  {
    id: "photography",
    sky,
    g1: ["#E8B878", 0.08, 50, 40, 50, 45],
    g2: ["#E8B878", 0.03, 50, 40, 80, 72]
  },
  {
    id: "about",
    sky,
    g1: ["#E8B878", 0.06, 50, 50, 45, 45],
    g2: ["#E8B878", 0.02, 50, 50, 72, 72]
  },
  {
    id: "contact",
    sky,
    g1: ["#D4AF37", 0.14, 50, 100, 70, 60],
    g2: ["#D4AF37", 0.03, 50, 100, 100, 90]
  }
];
