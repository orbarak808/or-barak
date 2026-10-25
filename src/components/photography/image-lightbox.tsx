"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Icon } from "@/components/ui/icon";
import { PhotographyImage } from "@/lib/types/photography";
import { lightboxSrc } from "@/lib/content/photography";

interface ImageLightboxProps {
  images: PhotographyImage[];
  initialIndex: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  /** Focus goes back here on close (the thumbnail that opened it) */
  returnFocusRef?: React.RefObject<HTMLElement | null>;
}

const arrowClasses =
  "absolute top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[#D4AF37] bg-[rgba(6,5,6,0.7)] text-[#EDE6D8] transition-colors hover:bg-[#D4AF37]/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]/60 sm:h-12 sm:w-12";

// A horizontal drag longer than this (px) on touch screens flips the photo
const SWIPE_THRESHOLD = 50;

/**
 * Full-viewport photo viewer. The photo sizes to its own aspect ratio
 * (contain, at most 92vw x 86vh), so landscape and portrait shots both fill
 * the screen without bars. Radix supplies the modal behaviour: focus is
 * moved in and trapped, body scroll is locked, Escape closes.
 */
export function ImageLightbox({
  images,
  initialIndex,
  open,
  onOpenChange,
  title,
  returnFocusRef
}: ImageLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const touchStartX = useRef<number | null>(null);

  // Each opening starts on the photo that was clicked
  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) setCurrentIndex(initialIndex);
  }

  const count = images.length;
  const goToPrevious = useCallback(
    () => setCurrentIndex((i) => (i - 1 + count) % count),
    [count]
  );
  const goToNext = useCallback(
    () => setCurrentIndex((i) => (i + 1) % count),
    [count]
  );

  useEffect(() => {
    if (!open || count < 2) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goToPrevious();
      else if (e.key === "ArrowRight") goToNext();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, count, goToPrevious, goToNext]);

  // Lock page scroll while open. Radix locks <body>, but this site scrolls
  // the viewport through <html> (its overflow is clipped, not visible), so
  // the lock has to sit on the root element.
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = previous;
    };
  }, [open]);

  // Warm the cache with the neighbours so stepping through is instant
  useEffect(() => {
    if (!open || count < 2) return;
    for (const offset of [-1, 1]) {
      const neighbour = images[(currentIndex + offset + count) % count];
      const img = new window.Image();
      img.src = lightboxSrc(neighbour);
    }
  }, [open, currentIndex, count, images]);

  const currentImage = images[currentIndex];
  if (!currentImage) return null;

  const close = () => onOpenChange(false);

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Content
          aria-describedby={undefined}
          onCloseAutoFocus={(e) => {
            const target = returnFocusRef?.current;
            if (target) {
              e.preventDefault();
              target.focus({ preventScroll: true });
            }
          }}
          onTouchStart={(e) => {
            touchStartX.current = e.touches[0].clientX;
          }}
          onTouchEnd={(e) => {
            const start = touchStartX.current;
            touchStartX.current = null;
            if (start === null || count < 2) return;
            const dx = e.changedTouches[0].clientX - start;
            if (dx > SWIPE_THRESHOLD) goToPrevious();
            else if (dx < -SWIPE_THRESHOLD) goToNext();
          }}
          // A click on the backdrop (anything but the photo and controls)
          // closes the viewer
          onClick={(e) => {
            if (e.target === e.currentTarget) close();
          }}
          className='fixed inset-0 z-50 flex items-center justify-center bg-[rgba(4,4,5,0.96)] outline-none data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 duration-200'
        >
          <DialogPrimitive.Title className='sr-only'>
            {title || currentImage.title || currentImage.alt}
          </DialogPrimitive.Title>

          {/* eslint-disable-next-line @next/next/no-img-element -- the large
              Drive rendition is shown as-is (Next's optimizer can't process
              the big originals) and must size to its own aspect ratio */}
          <img
            key={currentImage.id}
            src={lightboxSrc(currentImage)}
            alt={currentImage.alt}
            className='block h-auto max-h-[86vh] w-auto max-w-[92vw] object-contain select-none animate-in fade-in-0 duration-300'
            draggable={false}
          />

          {count > 1 && (
            <p className='absolute left-5 top-5 text-sm tabular-nums tracking-[0.12em] text-[#B5AD9F] sm:left-8 sm:top-6'>
              {currentIndex + 1} / {count}
            </p>
          )}

          <DialogPrimitive.Close
            className='absolute right-3 top-3 flex h-11 w-11 items-center justify-center text-[#B5AD9F] transition-colors hover:text-[#EDE6D8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]/60 rounded-full sm:right-6 sm:top-4'
            aria-label='Close'
          >
            <Icon name='lucide:x' className='h-6 w-6' />
          </DialogPrimitive.Close>

          {count > 1 && (
            <>
              <button
                type='button'
                onClick={goToPrevious}
                aria-label='Previous image'
                className={`${arrowClasses} left-3 sm:left-6`}
              >
                <Icon name='lucide:arrow-left' className='h-5 w-5' />
              </button>
              <button
                type='button'
                onClick={goToNext}
                aria-label='Next image'
                className={`${arrowClasses} right-3 sm:right-6`}
              >
                <Icon name='lucide:arrow-right' className='h-5 w-5' />
              </button>
            </>
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
