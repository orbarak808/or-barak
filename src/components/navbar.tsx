"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@/components/ui/icon";
import { Typography } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { useBoolean } from "@/hooks/use-boolean";
import { useTranslations } from "next-intl";
import { scrollToElement } from "@/components/home/scroll-handler";
import { useHeroVisibility } from "@/components/hero-visibility";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

const Navbar = () => {
  const t = useTranslations();
  const pathname = usePathname();
  const mobileMenuOpen = useBoolean(false);
  const { heroVisibility } = useHeroVisibility();
  const prefersReducedMotion = usePrefersReducedMotion();
  // The hero's tagline "arrives" here once the hero has scrolled away
  const showTagline = heroVisibility === "out-of-view";
  // Landing page: the bar is transparent over the hero and fades in a dark
  // glass once the hero has scrolled away (or while the mobile menu is open)
  const isLanding = pathname === "/";
  const showGlass = heroVisibility === "out-of-view" || mobileMenuOpen.value;

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
    if (pathname === "/") {
      event.preventDefault();
      scrollToElement(section);
      window.history.replaceState(null, "", `/#${section}`);
    }
  };

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 overflow-x-hidden max-w-full",
        !isLanding &&
          "bg-white/95 backdrop-blur-md border-b border-zinc-200 dark:bg-card/95 dark:border-border"
      )}
    >
      {isLanding && (
        // Faded with opacity rather than transitioning the background itself
        <div
          aria-hidden
          className={cn(
            "absolute inset-0 -z-10 bg-[rgba(6,5,6,0.72)] backdrop-blur-[12px] transition-opacity duration-500",
            showGlass ? "opacity-100" : "opacity-0"
          )}
        />
      )}
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full'>
        <div className='relative flex h-14 sm:h-16 items-center justify-between md:justify-center'>
          {/* Logo / Name, with the hero tagline beside it once the hero has
              scrolled out of view (desktop only — no room next to the
              hamburger on mobile) */}
          <div className='flex items-center md:absolute md:left-4'>
            <Link href='/' className='flex items-center touch-manipulation'>
              <Typography
                variant='h6'
                className={cn(
                  "font-serif transition-colors",
                  isLanding
                    ? "text-[26px] sm:text-[26px] md:text-[26px] lg:text-[26px] leading-none text-[#EDE6D8] hover:text-[#D4AF37] dark:text-[#EDE6D8] dark:hover:text-[#D4AF37]"
                    : "text-zinc-900 dark:text-zinc-50 hover:text-amber-700 dark:hover:text-amber-600 text-base sm:text-lg"
                )}
              >
                {t("home_hero_name")}
              </Typography>
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
                  <span
                    aria-hidden
                    className='mx-3 h-4 w-px bg-zinc-300 dark:bg-zinc-600'
                  />
                  <span className='whitespace-nowrap text-[11px] font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400'>
                    {t("home_hero_subtitle")}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Desktop Navigation */}
          <div
            className={cn(
              "hidden md:flex md:items-center",
              isLanding ? "md:gap-10" : "md:gap-6"
            )}
          >
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.section)}
                  className='relative py-2 touch-manipulation'
                >
                  <Typography
                    variant='body2'
                    className={cn(
                      "font-medium transition-colors",
                      isLanding
                        ? "text-sm sm:text-sm md:text-sm lg:text-sm text-[#EDE6D8] hover:text-[#D4AF37] dark:text-[#EDE6D8] dark:hover:text-[#D4AF37]"
                        : isActive
                          ? "text-base text-zinc-900 dark:text-zinc-50"
                          : "text-base text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50"
                    )}
                  >
                    {item.name}
                  </Typography>
                  {isActive && (
                    <motion.div
                      layoutId='navbar-indicator'
                      className='absolute -bottom-[1px] left-0 right-0 h-[2px] bg-amber-700 dark:bg-amber-600'
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30
                      }}
                    />
                  )}
                </Link>
              );
            })}
            {/* <LanguageSwitcher /> */}
          </div>

          {/* Mobile: Language Switcher & Menu Button */}
          <div className='flex items-center gap-2 md:hidden'>
            {/* <LanguageSwitcher /> */}
            {/* Mobile Menu Button */}
            <button
              type='button'
              className={cn(
                "p-2.5 min-w-[44px] min-h-[44px] rounded-md transition-colors touch-manipulation active:bg-zinc-100 dark:active:bg-zinc-800",
                isLanding
                  ? "text-[#EDE6D8] hover:text-[#D4AF37]"
                  : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
              )}
              onClick={mobileMenuOpen.onToggle}
              aria-label='Toggle menu'
            >
              <Icon
                name={mobileMenuOpen.value ? "mdi:close" : "mdi:menu"}
                className='w-6 h-6'
              />
            </button>
          </div>
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
            className='md:hidden border-t border-zinc-200 dark:border-border bg-white dark:bg-card shadow-lg'
          >
            <div className='px-4 py-4 space-y-1'>
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={(e) => {
                      mobileMenuOpen.onFalse();
                      handleNavClick(e, item.section);
                    }}
                    className={cn(
                      "block py-3 px-3 rounded-lg transition-colors touch-manipulation",
                      isActive
                        ? "bg-amber-50 dark:bg-amber-900/20 text-zinc-900 dark:text-zinc-50"
                        : "hover:bg-zinc-50 dark:hover:bg-zinc-900/50 text-zinc-600 dark:text-zinc-400"
                    )}
                  >
                    <Typography
                      variant='body2'
                      className={cn(
                        "text-base font-medium",
                        isActive
                          ? "text-zinc-900 dark:text-zinc-50"
                          : "text-zinc-600 dark:text-zinc-400"
                      )}
                    >
                      {item.name}
                    </Typography>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
