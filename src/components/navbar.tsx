"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import { useBoolean } from "@/hooks/use-boolean";
import { useTranslations } from "next-intl";
import { scrollToElement } from "@/components/home/scroll-handler";
import { useHeroVisibility } from "@/components/hero-visibility";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

const linkClasses =
  "text-sm font-medium text-[#EDE6D8] transition-colors hover:text-[#D4AF37] focus-visible:text-[#D4AF37]";

const Navbar = () => {
  const t = useTranslations();
  const pathname = usePathname();
  const mobileMenuOpen = useBoolean(false);
  const { heroVisibility } = useHeroVisibility();
  const prefersReducedMotion = usePrefersReducedMotion();
  const isLanding = pathname === "/";

  // On the landing page the hero's tagline "arrives" here once the hero has
  // scrolled away; pages without a hero show it from the start
  const showTagline = isLanding ? heroVisibility === "out-of-view" : true;

  // The bar is transparent over the top of the landing hero and fades in a
  // dark glass once the page has scrolled a little (or while the mobile menu
  // is open), so hero text never slides under a bare bar. Pages without a
  // hero have the glass from the top.
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 80);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  const showGlass = !isLanding || scrolled || mobileMenuOpen.value;

  // Links target the landing page's sections, so they work from deep pages
  // too (/videography, /photography, ...) — Link navigates home and the
  // browser scrolls to the anchor. Already on the landing page, we skip the
  // navigation and smooth-scroll instead.
  const navigation = [
    { name: t("nav_home"), section: "home" },
    { name: t("nav_films"), section: "videography" },
    { name: t("nav_photography"), section: "photography" },
    { name: t("nav_about"), section: "about" },
    { name: t("nav_contact"), section: "contact" }
  ].map((item) => ({ ...item, href: `/#${item.section}` }));

  const handleNavClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    section: string
  ) => {
    if (isLanding) {
      event.preventDefault();
      scrollToElement(section);
      window.history.replaceState(null, "", `/#${section}`);
    }
  };

  return (
    <nav className='fixed top-0 left-0 right-0 z-50 overflow-x-hidden max-w-full'>
      {/* Glass, faded with opacity rather than transitioning the background */}
      <div
        aria-hidden
        className={cn(
          "absolute inset-0 -z-10 bg-[rgba(6,5,6,0.72)] backdrop-blur-[12px] transition-opacity duration-500",
          showGlass ? "opacity-100" : "opacity-0"
        )}
      />
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full'>
        <div className='relative flex h-14 sm:h-16 items-center justify-between md:justify-center'>
          {/* Wordmark, with the tagline beside it (desktop only — no room
              next to the hamburger on mobile) */}
          <div className='flex items-center md:absolute md:left-4'>
            <Link
              href='/'
              className='font-serif text-[26px] leading-none text-[#EDE6D8] transition-colors hover:text-[#D4AF37] touch-manipulation'
            >
              {t("home_hero_name")}
            </Link>
            <AnimatePresence initial={false}>
              {showTagline && (
                <motion.div
                  key='navbar-tagline'
                  initial={{ opacity: 0, x: prefersReducedMotion ? 0 : -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: prefersReducedMotion ? 0 : -8 }}
                  transition={{
                    duration: prefersReducedMotion ? 0.15 : 0.3,
                    ease: "easeOut"
                  }}
                  className='hidden md:flex items-center'
                >
                  <span aria-hidden className='mx-3 h-4 w-px bg-[#4A443B]' />
                  <span className='whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.22em] text-[#D4AF37]'>
                    {t("home_hero_subtitle")}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Desktop Navigation */}
          <div className='hidden md:flex md:items-center md:gap-10'>
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.section)}
                className={cn("py-2 touch-manipulation", linkClasses)}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            type='button'
            className='md:hidden p-2.5 min-w-[44px] min-h-[44px] rounded-md text-[#EDE6D8] hover:text-[#D4AF37] transition-colors touch-manipulation'
            onClick={mobileMenuOpen.onToggle}
            aria-label='Toggle menu'
            aria-expanded={mobileMenuOpen.value}
          >
            <Icon
              name={mobileMenuOpen.value ? "mdi:close" : "mdi:menu"}
              className='w-6 h-6'
            />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen.value && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className='md:hidden'
          >
            <div className='px-4 pt-2 pb-5 space-y-1'>
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={(e) => {
                    mobileMenuOpen.onFalse();
                    handleNavClick(e, item.section);
                  }}
                  className={cn(
                    linkClasses,
                    "block py-3 px-3 text-base touch-manipulation"
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
