import { Icon } from "@/components/ui/icon";
import { Typography } from "@/components/ui/typography";
import { useTranslations } from "next-intl";
import { OR_CONSTANTS } from "@/lib/constants/or.constants";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { getEmailLink } from "@/lib/utils/links.utils";
import { cn } from "@/lib/utils";

const socialLinks = [
  {
    name: "social_instagram",
    href: OR_CONSTANTS.INSTAGRAM,
    icon: "mdi:instagram"
  },
  // {
  //   name: "social_vimeo",
  //   href: "https://vimeo.com",
  //   icon: "mdi:vimeo"
  // },
  // {
  //   name: "social_linkedin",
  //   href: "https://linkedin.com",
  //   icon: "mdi:linkedin"
  // },
  {
    name: "social_email",
    href: getEmailLink(OR_CONSTANTS.EMAIL),
    icon: "mdi:email-outline"
  }
];

type FooterProps = {
  /** Merged onto the footer; the landing page clears its fill and border */
  className?: string;
};

const Footer = async ({ className }: FooterProps) => {
  const t = await getTranslations();
  const currentYear = new Date().getFullYear();

  return (
    // Explicit role: on the landing page the footer sits inside <main>,
    // where a plain <footer> loses its contentinfo landmark
    <footer
      role='contentinfo'
      className={cn(
        "border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black overflow-x-hidden max-w-full",
        className
      )}
    >
      <div className='mx-auto max-w-7xl px-4 py-8 sm:py-10 md:py-12 sm:px-6 lg:px-8 w-full'>
        <div className='flex flex-col items-center gap-6 sm:gap-8'>
          <div className='flex items-center gap-5 sm:gap-6'>
            {socialLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                target='_blank'
                rel='noopener noreferrer'
                className='text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors p-2 min-w-[44px] min-h-[44px] flex items-center justify-center touch-manipulation'
                aria-label={t(link.name)}
              >
                <Icon name={link.icon} className='w-5 h-5 sm:w-6 sm:h-6' />
              </Link>
            ))}
          </div>

          <div className='text-center px-4'>
            <Typography
              variant='caption1'
              className='sky-text-link text-zinc-500 dark:text-zinc-500 text-sm sm:text-base'
            >
              {t("footer_copyright", { year: currentYear })}
            </Typography>
          </div>

          <Typography
            variant='caption2'
            className='sky-text-muted text-zinc-400 dark:text-zinc-600 text-xs sm:text-sm px-4 text-center'
          >
            {t("footer_tagline")}
          </Typography>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
