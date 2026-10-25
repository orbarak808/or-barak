import * as React from "react";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

type ArrowButtonProps = React.ComponentProps<"button"> & {
  direction: "previous" | "next";
};

/**
 * Previous/next arrow shared by the carousels and the photo lightbox: a
 * dark circle with a 1px gold border and a gold chevron, brightening on
 * hover. Position it with className.
 */
export const ArrowButton = React.forwardRef<
  HTMLButtonElement,
  ArrowButtonProps
>(({ direction, className, ...props }, ref) => (
  <button
    ref={ref}
    type='button'
    aria-label={direction === "previous" ? "Previous" : "Next"}
    className={cn(
      "flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#D4AF37] bg-[rgba(6,5,6,0.8)] text-[#D4AF37] transition-colors hover:bg-[rgba(48,40,26,0.92)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]/60 disabled:pointer-events-none disabled:opacity-40 touch-manipulation sm:h-12 sm:w-12",
      className
    )}
    {...props}
  >
    <Icon
      name={
        direction === "previous"
          ? "lucide:chevron-left"
          : "lucide:chevron-right"
      }
      className='h-5 w-5'
    />
  </button>
));
ArrowButton.displayName = "ArrowButton";
