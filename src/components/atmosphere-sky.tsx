"use client";

import { useEffect, useRef } from "react";
import { skyStops, type SkyStop } from "@/lib/content/sky";

/*
 * One sky behind the whole landing page. The layer is sticky inside the page
 * wrapper (which must clip, never hide, its overflow) and sections paint no
 * background of their own. On scroll it finds the two stops around the
 * viewport centre, blends them with smootherstep in OKLab (so warm to cool
 * never passes through grey) and glides toward that target with exponential
 * smoothing. Ported from the LightVision scroll-light engine; the maths is
 * kept as-is.
 */

// --- colour: sRGB hex <-> OKLab ---
function hex(h: string) {
  return [
    parseInt(h.slice(1, 3), 16),
    parseInt(h.slice(3, 5), 16),
    parseInt(h.slice(5, 7), 16)
  ];
}
function lin(c: number) {
  c /= 255;
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}
function gam(c: number) {
  c = c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
  return Math.max(0, Math.min(255, Math.round(c * 255)));
}
function toLab(h: string) {
  const c = hex(h);
  const r = lin(c[0]);
  const g = lin(c[1]);
  const b = lin(c[2]);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s
  ];
}
function toRgb(L: number[]) {
  const l = Math.pow(L[0] + 0.3963377774 * L[1] + 0.2158037573 * L[2], 3);
  const m = Math.pow(L[0] - 0.1055613458 * L[1] - 0.0638541728 * L[2], 3);
  const s = Math.pow(L[0] - 0.0894841775 * L[1] - 1.291485548 * L[2], 3);
  return (
    gam(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s) +
    "," +
    gam(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s) +
    "," +
    gam(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s)
  );
}

// Flatten a stop to one numeric vector: 3 sky colours (9) + two lights (2 x 8).
// alphaScale multiplies both lights' alphas (phones get a brighter sky).
function vec(s: SkyStop, alphaScale = 1) {
  const v: number[] = [];
  s.sky.forEach((h) => v.push(...toLab(h)));
  [s.g1, s.g2].forEach((g) => {
    v.push(...toLab(g[0]));
    v.push(g[1] * alphaScale, g[2], g[3], g[4], g[5]);
  });
  return v;
}

// Below 768px the warm lights are ~40% stronger, so the atmosphere still
// reads on a small, bright screen
const PHONE_QUERY = "(max-width: 767px)";
const PHONE_ALPHA_SCALE = 1.4;

// Eased falloff: many stops along a smooth curve, so a glow has no visible
// edge or banding
const FALL = [
  [0, 1],
  [12, 0.86],
  [24, 0.66],
  [36, 0.46],
  [48, 0.29],
  [60, 0.15],
  [72, 0.06],
  [84, 0.015],
  [100, 0]
];

function glow(cur: number[], o: number, a: number) {
  const c = toRgb([cur[o], cur[o + 1], cur[o + 2]]);
  const al = cur[o + 3] * a;
  return (
    "radial-gradient(" +
    cur[o + 6].toFixed(1) +
    "% " +
    cur[o + 7].toFixed(1) +
    "% at " +
    cur[o + 4].toFixed(1) +
    "% " +
    cur[o + 5].toFixed(1) +
    "%," +
    FALL.map(
      (f) => "rgba(" + c + "," + (al * f[1]).toFixed(4) + ") " + f[0] + "%"
    ).join(",") +
    ")"
  );
}

function background(cur: number[], lift: number) {
  const sky =
    "linear-gradient(180deg,rgb(" +
    toRgb(cur.slice(0, 3)) +
    ") 0%,rgb(" +
    toRgb(cur.slice(3, 6)) +
    ") 55%,rgb(" +
    toRgb(cur.slice(6, 9)) +
    ") 100%)";
  return glow(cur, 9, lift) + "," + glow(cur, 17, 1) + "," + sky;
}

// Glide time constant: the sky doesn't jump to the scroll position, it moves
// toward it, so fast scrolls and anchor jumps still feel like light moving
const TAU = 260;

export function AtmosphereSky({ stops = skyStops }: { stops?: SkyStop[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const breathRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const atmo = ref.current;
    const root = atmo?.parentElement;
    if (!atmo || !root) return;
    const breath = breathRef.current;

    const phoneQuery = window.matchMedia(PHONE_QUERY);
    const alphaScale = () => (phoneQuery.matches ? PHONE_ALPHA_SCALE : 1);

    // Sections are found by their data-sky id, in config order
    const S = stops
      .map((s) => ({
        stop: s,
        node: root.querySelector<HTMLElement>(`[data-sky="${s.id}"]`),
        v: vec(s, alphaScale())
      }))
      .filter(
        (s): s is { stop: SkyStop; node: HTMLElement; v: number[] } => !!s.node
      );
    if (S.length < 2) return;

    const N = S[0].v.length;
    const cur = S[0].v.slice();
    const tgt = S[0].v.slice();
    let lift = 1;
    let liftT = 1;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reduced = motionQuery.matches;

    function paint() {
      atmo!.style.backgroundImage = background(cur, lift);
      if (breath) breath.style.setProperty("--bc", toRgb(cur.slice(9, 12)));
    }

    function target() {
      const vh = innerHeight;
      const mid = vh / 2;
      const n = S.length;
      const cs = S.map((s, k) => {
        const r = s.node.getBoundingClientRect();
        let c = r.top + r.height / 2;
        // The last stop is reached when the page bottom is reached
        if (k === n - 1) c = Math.min(c, r.bottom - vh / 2);
        return c;
      });
      let i = 0;
      let t = 0;
      if (mid <= cs[0]) {
        i = 0;
        t = 0;
      } else if (mid >= cs[n - 1]) {
        i = n - 2;
        t = 1;
      } else {
        for (let k = 0; k < n - 1; k++) {
          if (mid >= cs[k] && mid <= cs[k + 1]) {
            i = k;
            t = (mid - cs[k]) / (cs[k + 1] - cs[k]);
            break;
          }
        }
      }
      // smootherstep: each light holds on its own section and hands over gently
      t = t * t * t * (t * (t * 6 - 15) + 10);
      const a = S[i].v;
      const b = S[i + 1].v;
      for (let j = 0; j < N; j++) tgt[j] = a[j] + (b[j] - a[j]) * t;
      // Lights never go fully dark between sections
      liftT = 0.82 + 0.18 * Math.abs(1 - 2 * t);
    }

    function snap() {
      for (let j = 0; j < N; j++) cur[j] = tgt[j];
      lift = liftT;
      paint();
    }

    // rAF runs only while values are moving
    let raf = 0;
    let last = 0;
    function frame(now: number) {
      const dt = last ? Math.min(64, now - last) : 16;
      last = now;
      const k = 1 - Math.exp(-dt / TAU);
      let moving = false;
      for (let j = 0; j < N; j++) {
        const d = tgt[j] - cur[j];
        if (Math.abs(d) > 1e-4) {
          cur[j] += d * k;
          moving = true;
        } else cur[j] = tgt[j];
      }
      const dl = liftT - lift;
      if (Math.abs(dl) > 1e-4) {
        lift += dl * k;
        moving = true;
      }
      paint();
      if (moving) raf = requestAnimationFrame(frame);
      else {
        raf = 0;
        last = 0;
      }
    }

    function kick() {
      target();
      // Reduced motion: no glide, the sky is simply where the scroll is
      if (reduced) {
        snap();
        return;
      }
      if (!raf) raf = requestAnimationFrame(frame);
    }

    // Crossing 768px re-weights the lights; the sky glides to the new target
    function onPhoneChange() {
      const scale = alphaScale();
      S.forEach((s) => (s.v = vec(s.stop, scale)));
      kick();
    }

    function onMotionChange() {
      reduced = motionQuery.matches;
      if (reduced) {
        cancelAnimationFrame(raf);
        raf = 0;
        last = 0;
      }
      kick();
    }

    addEventListener("scroll", kick, { passive: true });
    addEventListener("resize", kick);
    motionQuery.addEventListener("change", onMotionChange);
    phoneQuery.addEventListener("change", onPhoneChange);
    const ro = new ResizeObserver(kick);
    S.forEach((s) => ro.observe(s.node));

    target();
    snap();

    return () => {
      removeEventListener("scroll", kick);
      removeEventListener("resize", kick);
      motionQuery.removeEventListener("change", onMotionChange);
      phoneQuery.removeEventListener("change", onPhoneChange);
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [stops]);

  // Server render starts on the first stop so the first paint already has
  // the sky; the effect takes over from there
  const initial = background(vec(stops[0]), 1);

  return (
    <div
      ref={ref}
      aria-hidden='true'
      className='atmosphere-sky'
      style={{ backgroundImage: initial }}
    >
      <div
        ref={breathRef}
        className='atmosphere-breath'
        style={{ "--bc": toRgb(toLab(stops[0].g1[0])) } as React.CSSProperties}
      />
    </div>
  );
}
