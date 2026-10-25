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

export const skyStops: SkyStop[] = [
  {
    id: "hero",
    sky: ["#101113", "#0A0A0C", "#08080A"],
    g1: ["#F2EDE4", 0.27, 25, 25, 50, 45],
    g2: ["#D4AF37", 0.35, 50, 100, 62, 45]
  },
  {
    id: "films",
    sky: ["#0B0708", "#080607", "#060506"],
    g1: ["#E8B878", 0.36, 50, 0, 60, 80],
    g2: ["#6E1F2A", 0.45, 50, 90, 70, 50]
  },
  {
    id: "photography",
    sky: ["#0B0C0E", "#0A0B0D", "#09090B"],
    g1: ["#9FB3C8", 0.32, 50, 45, 55, 55],
    g2: ["#D4AF37", 0.25, 85, 85, 45, 40]
  },
  {
    id: "about",
    sky: ["#08080A", "#08080A", "#09080A"],
    g1: ["#D4AF37", 0.25, 50, 50, 50, 50],
    g2: ["#F2EDE4", 0.12, 50, 30, 40, 40]
  },
  {
    id: "contact",
    sky: ["#0B0907", "#0C0906", "#0E0A06"],
    g1: ["#D4AF37", 0.4, 50, 100, 70, 70],
    g2: ["#E4A248", 0.2, 50, 60, 60, 40]
  }
];
