"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Typewriter } from "../ui/typewriter";
import { videosSectionId } from "@/lib/content/homepage";
import { scrollToElement } from "@/components/home/scroll-handler";
import { useHeroVisibility } from "@/components/hero-visibility";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

const heroPhoto = "/images/herophoto.jpg";
/** Photography revealed behind the text where the drifting light falls */
const revealImages = [
  "/images/1y4a1193.jpg",
  "/images/la1-01.jpg",
  "/images/washington-048.jpg",
  "/images/washington-053.jpg"
];

interface HeroSectionProps {
  subtitle: string;
  /** Muted supporting line under the gold tagline */
  subtitleDetail?: string;
  description: string;
}

export function HeroSection({
  subtitle,
  subtitleDetail,
  description
}: HeroSectionProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const entranceY = prefersReducedMotion ? 0 : 30;
  const sectionRef = useRef<HTMLElement>(null);
  const { setHeroVisibility } = useHeroVisibility();

  // Report whether the hero is still on screen. The navbar shows the tagline
  // once the hero's bottom edge scrolls up under the fixed navbar. The top
  // margin is the navbar height plus a few px: an element touching the
  // boundary still counts as intersecting, and the section anchors' scroll
  // margin parks the hero's bottom edge exactly on the navbar's.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      ([entry]) =>
        setHeroVisibility(entry.isIntersecting ? "in-view" : "out-of-view"),
      { rootMargin: "-72px 0px 0px 0px", threshold: 0 }
    );
    observer.observe(section);
    return () => {
      observer.disconnect();
      setHeroVisibility("absent");
    };
  }, [setHeroVisibility]);

  return (
    <section
      ref={sectionRef}
      className='relative w-full overflow-hidden bg-black md:h-[calc(100svh-4rem)]'
    >
      <div className='flex h-full flex-col md:flex-row'>
        {/* Portrait — top on mobile, right column on desktop */}
        <div className='relative order-1 h-[50svh] w-full md:order-2 md:h-full md:w-[55%]'>
          <Image
            src={heroPhoto}
            alt='Portrait of Or Barak'
            fill
            priority
            sizes='(min-width: 768px) 55vw, 100vw'
            className='object-cover object-[52%_35%]'
          />
          {/* Fade into the dark text panel below (mobile only) */}
          <div className='pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-black md:hidden' />
        </div>

        {/* Text — below on mobile, left column on desktop. Layers bottom to
            top: black panel, light-masked photo collage, the light itself. */}
        <div className='relative isolate order-2 flex w-full items-center bg-black px-6 pt-10 pb-32 sm:px-10 md:order-1 md:w-[45%] md:px-12 md:py-0 lg:px-16'>
          <div aria-hidden className='hero-reveal'>
            <div className='grid h-full w-full grid-cols-2 grid-rows-2'>
              {revealImages.map((src) => (
                <div key={src} className='relative overflow-hidden'>
                  <Image
                    src={src}
                    alt=''
                    fill
                    // Cells are ~quarter-panel but portrait-shaped, so cover
                    // scales the landscape shots to ~2x the cell width;
                    // size for that or they upscale soft.
                    sizes='(min-width: 768px) 50vw, 100vw'
                    className='object-cover'
                    // Always in the first screen; lazy left the lower row unloaded
                    loading='eager'
                  />
                </div>
              ))}
            </div>
          </div>
          <div aria-hidden className='hero-light' />
          {/* Stacked: fade the light's clipped top edge into the portrait's fade */}
          <div aria-hidden className='pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black to-transparent md:hidden' />

          <div className='relative max-w-xl'>
            <motion.div
              initial={{ opacity: 0, y: entranceY }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Typewriter
                className={`${
                  subtitleDetail ? "mb-2" : "mb-4 sm:mb-5"
                } text-amber-400 font-semibold tracking-wider uppercase text-xs sm:text-sm md:text-base`}
              >
                {subtitle}
              </Typewriter>
            </motion.div>

            {subtitleDetail && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className='mb-5 sm:mb-6 text-zinc-400 tracking-wide text-[11px] sm:text-xs md:text-sm'
              >
                {subtitleDetail}
              </motion.p>
            )}

            <motion.div
              initial={{ opacity: 0, y: entranceY }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <p className='text-zinc-200 leading-relaxed whitespace-pre-line sm:text-base md:text-lg'>
                {description}
              </p>
            </motion.div>
          </div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className='absolute bottom-6 left-1/2 -translate-x-1/2 cursor-pointer touch-manipulation md:bottom-10'
            onClick={() => scrollToElement(videosSectionId)}
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className='flex flex-col items-center gap-2'
            >
              <span className='text-white/70 text-xs sm:text-sm md:text-base'>
                Scroll
              </span>
              <div className='w-5 h-8 sm:w-6 sm:h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-1.5 sm:p-2'>
                <motion.div
                  animate={{ y: [0, 12, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className='w-1 h-1.5 sm:h-2 bg-white/70 rounded-full'
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
