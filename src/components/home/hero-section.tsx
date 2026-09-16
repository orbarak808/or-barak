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
  const sectionRef = useRef<HTMLElement>(null);
  const { heroVisibility, setHeroVisibility } = useHeroVisibility();

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
      className='relative isolate flex min-h-[calc(100svh-3.5rem)] w-full flex-col justify-between overflow-hidden bg-black sm:min-h-[calc(100svh-4rem)]'
    >
      <Image
        src={heroPhoto}
        alt=''
        fill
        priority
        sizes='100vw'
        className='object-cover object-[52%_35%]'
      />

      {/* Scrims only where text sits (top-center label, bottom paragraph);
          the center of the frame stays at full brightness */}
      <div aria-hidden className='hero-scrim' />

      {/* Top-center label. Fades out once the hero scrolls away, at which
          point the navbar shows the tagline instead. */}
      <div className='relative z-10 flex w-full justify-center px-4 pt-5 sm:px-6 sm:pt-7 lg:pt-8'>
        <motion.div
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : -12 }}
          animate={{ opacity: heroVisibility === "out-of-view" ? 0 : 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className='w-fit text-center [text-shadow:0_1px_8px_rgba(0,0,0,0.7)]'
        >
          <Typewriter className='text-amber-400 font-semibold tracking-wider uppercase text-[11px] sm:text-xs md:text-sm'>
            {subtitle}
          </Typewriter>
          {subtitleDetail && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className='mt-1 text-zinc-400 tracking-wide text-[10px] sm:text-[11px] md:text-xs'
            >
              {subtitleDetail}
            </motion.p>
          )}
        </motion.div>
      </div>

      {/* Bottom: description, then the scroll indicator in normal flow so
          they can never overlap however many lines the paragraph wraps to */}
      <div className='relative z-10 flex flex-col items-center gap-6 px-5 pb-6 pt-10 sm:px-8 md:gap-8 md:pb-10'>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <p className='mx-auto max-w-3xl text-center text-balance text-zinc-200 leading-relaxed whitespace-pre-line text-sm md:text-[15px] [text-shadow:0_2px_12px_rgba(0,0,0,0.7)]'>
            {description}
          </p>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className='cursor-pointer touch-manipulation'
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
    </section>
  );
}
