import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

/**
 * The landing sections' primary "view all" action, centred under a grid:
 * a gold-outlined button that fills gold on hover, with an arrow that
 * slides right. Full width on phones.
 */
export function ViewMoreButton({
  href,
  children,
  className
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex w-full items-center justify-center gap-3 rounded-[2px] border border-[#D4AF37] px-8 py-4 text-[15px] font-medium text-[#EDE6D8] transition-colors hover:bg-[#D4AF37] hover:text-[#060506] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#060506] sm:w-auto",
        className
      )}
    >
      {children}
      <Icon
        name='lucide:arrow-right'
        className='h-4 w-4 transition-transform duration-300 group-hover:translate-x-1'
      />
    </Link>
  );
}
