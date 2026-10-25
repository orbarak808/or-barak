import { cn } from "@/lib/utils";
import { Reveal } from "@/components/ui/scroll-reveal";

/** Gold eyebrow shared by the hero and the landing section headings */
export const eyebrowClasses =
  "text-[13px] font-semibold uppercase tracking-[0.22em] text-[#D4AF37]";

/** Text link used in landing headers: no box, a 1px gold underline */
export const textLinkClasses =
  "inline-block border-b border-[#D4AF37] pb-[6px] text-sm text-[#EDE6D8] transition-colors hover:text-[#D4AF37] focus-visible:text-[#D4AF37]";

/** Italic accent inside a heading (pass to t.rich as `em`) */
export const headingEm = (chunks: React.ReactNode) => (
  <em className='italic text-[#E8D9B0]'>{chunks}</em>
);

type SectionHeadingProps = {
  eyebrow?: string;
  title: React.ReactNode;
  /** Links on the right of the heading (below it on phones) */
  aside?: React.ReactNode;
  align?: "start" | "center";
  /** h1 for a page's own header, h2 for a section within a page */
  as?: "h1" | "h2";
  className?: string;
};

/**
 * Landing-page section heading: gold eyebrow over an Instrument Serif H2,
 * optionally with links aligned to the right.
 */
export function SectionHeading({
  eyebrow,
  title,
  aside,
  align = "start",
  as: Heading = "h2",
  className
}: SectionHeadingProps) {
  return (
    <Reveal
      kind='heading'
      className={cn(
        "flex flex-col gap-6",
        align === "center"
          ? "items-center text-center"
          : "md:flex-row md:items-end md:justify-between",
        className
      )}
    >
      <div
        className={cn(
          "flex flex-col gap-4",
          align === "center" && "items-center"
        )}
      >
        {eyebrow && <p className={eyebrowClasses}>{eyebrow}</p>}
        <Heading className='font-serif text-[44px] leading-[1.05] tracking-[-0.01em] text-[#EDE6D8] md:text-[64px]'>
          {title}
        </Heading>
      </div>
      {aside && (
        <div className='flex flex-wrap items-center gap-7 md:pb-3'>{aside}</div>
      )}
    </Reveal>
  );
}
