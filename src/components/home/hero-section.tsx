"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Typewriter } from "../ui/typewriter";
import { videosSectionId } from "@/lib/content/homepage";
import { scrollToElement } from "@/components/home/scroll-handler";
import { useHeroVisibility } from "@/components/hero-visibility";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

const heroPhoto = "/images/herophoto.jpg";

export function HeroSection() {
  const t = useTranslations();
  const prefersReducedMotion = usePrefersReducedMotion();
  const entranceY = prefersReducedMotion ? 0 : 30;
  const sectionRef = useRef<HTMLElement>(null);
  const { setHeroVisibility } = useHeroVisibility();

  // Report whether the hero is still on screen. The navbar shows the tagline
  // once the hero's bottom edge scrolls up under
  // the fixed navbar. The top margin is the navbar height plus a few px: an
  // element touching the boundary still counts as intersecting.
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
      className='relative h-[100svh] min-h-[640px] w-full overflow-hidden md:h-[940px]'
    >
      {/* Full-bleed portrait; on phones the face is centred in the frame.
          The scrims darken behind the text, then the whole stack fades out
          at the bottom into the shared sky. */}
      <div className='hero-media'>
        <Image
          src={heroPhoto}
          alt='Portrait of Or Barak'
          fill
          priority
          sizes='100vw'
          className='object-cover object-[51%_30%] md:object-[62%_30%]'
        />
        <div aria-hidden className='hero-scrim-side' />
        <div aria-hidden className='hero-scrim-fall' />
      </div>

      <div className='relative flex h-full flex-col justify-end px-6 pb-28 sm:px-10 md:justify-center md:pb-[6%] md:pl-[72px] md:pr-10'>
        <div className='flex max-w-[760px] flex-col gap-5 md:gap-7'>
          <motion.div
            initial={{ opacity: 0, y: entranceY }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Typewriter className='text-[13px] font-semibold uppercase tracking-[0.22em] text-[#D4AF37]'>
              {t("home_hero_subtitle")}
            </Typewriter>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: entranceY }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className='font-serif text-[52px] leading-none tracking-[-0.01em] text-[#EDE6D8] md:text-[72px] lg:text-[92px]'
          >
            {t.rich("home_hero_headline", {
              em: (chunks) => (
                <em className='italic text-[#E8D9B0]'>{chunks}</em>
              )
            })}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: entranceY }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.55 }}
            className='font-serif text-[24px] leading-[1.25] text-[#D9D1C2] md:text-[34px]'
          >
            {t("home_hero_goal")}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: entranceY }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className='max-w-[520px] text-[17px] leading-[1.65] text-[#B5AD9F]'
          >
            {t("home_hero_description")}
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.85 }}
            className='text-[13px] tracking-[0.12em] text-[#9C9588]'
          >
            {t("home_hero_subtitle_detail")}
          </motion.p>
        </div>
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
    </section>
  );
}
