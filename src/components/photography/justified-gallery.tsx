"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { PhotographyImage } from "@/lib/types/photography";
import { PhotoTag } from "@/lib/enums/photo-tags.enum";
import { useScrollReveal } from "@/components/ui/scroll-reveal";
import { ImageLightbox } from "./image-lightbox";

/*
 * Justified rows: every photo keeps its true aspect ratio, uncropped, and
 * each row fills the content width exactly, all photos in a row at one
 * height. The target row height is --row-h in globals.css
 * (.justified-gallery), per breakpoint.
 *
 * Once the gallery's width is known, rows are laid out here: photos are
 * added to a row until it would be shorter than the target, then the row
 * breaks either before or after the last photo, whichever lands closer to
 * the target height. The last row stays left-aligned at the target height.
 * Before that (server render, first paint) the same rows come from CSS
 * flex-wrap, which can only break greedily, so rows run a little taller.
 */

const GAP = 8;

const aspect = (image: PhotographyImage) =>
  image.width && image.height ? image.width / image.height : 1.5;

type Row = { images: PhotographyImage[]; height: number; justify: boolean };

function layoutRows(
  images: PhotographyImage[],
  width: number,
  target: number
): Row[] {
  const rows: Row[] = [];
  let row: PhotographyImage[] = [];
  let sum = 0;
  const fit = (n: number, s: number) => (width - GAP * (n - 1)) / s;
  for (const image of images) {
    const ar = aspect(image);
    const withIt = fit(row.length + 1, sum + ar);
    if (withIt > target) {
      row.push(image);
      sum += ar;
      continue;
    }
    // Adding this photo takes the row below the target height: keep it in
    // the row or start the next row with it, whichever is closer
    const without = row.length ? fit(row.length, sum) : Infinity;
    if (Math.abs(without - target) < Math.abs(withIt - target)) {
      rows.push({ images: row, height: without, justify: true });
      row = [image];
      sum = ar;
    } else {
      rows.push({ images: [...row, image], height: withIt, justify: true });
      row = [];
      sum = 0;
    }
  }
  if (row.length) rows.push({ images: row, height: target, justify: false });
  return rows;
}

/** The gallery's content width and target row height, once mounted */
function useGalleryBox(ref: React.RefObject<HTMLDivElement | null>) {
  const [box, setBox] = useState<{ width: number; target: number } | null>(
    null
  );
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const target = parseFloat(
        getComputedStyle(el).getPropertyValue("--row-h")
      );
      const width = el.clientWidth;
      setBox((b) =>
        b && b.width === width && b.target === target ? b : { width, target }
      );
    };
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
  return box;
}

export function JustifiedGallery({ images }: { images: PhotographyImage[] }) {
  const t = useTranslations();
  const [filter, setFilter] = useState<string | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const openerRef = useRef<HTMLElement | null>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const box = useGalleryBox(galleryRef);

  // Only the tags that are actually used, in the tag list's order
  const tags = useMemo(() => {
    const used = new Set(images.map((image) => image.category));
    return Object.values(PhotoTag).filter((tag) => used.has(tag));
  }, [images]);

  const visible = useMemo(
    () =>
      filter ? images.filter((image) => image.category === filter) : images,
    [images, filter]
  );

  const rows = useMemo(
    () => (box ? layoutRows(visible, box.width, box.target) : null),
    [visible, box]
  );

  const open = (image: PhotographyImage, element: HTMLElement) => {
    openerRef.current = element;
    setLightboxIndex(visible.indexOf(image));
    setLightboxOpen(true);
  };

  return (
    <div className='space-y-8'>
      <div
        role='group'
        aria-label={t("photography_filter_label")}
        className='flex flex-wrap gap-x-7 gap-y-3'
      >
        {[null, ...tags].map((tag) => {
          const active = filter === tag;
          return (
            <button
              key={tag ?? "all"}
              type='button'
              aria-pressed={active}
              onClick={() => setFilter(tag)}
              className={cn(
                "border-b pb-[6px] text-sm transition-colors focus-visible:outline-none focus-visible:text-[#D4AF37]",
                active
                  ? "border-[#D4AF37] text-[#EDE6D8]"
                  : "border-transparent text-[#B5AD9F] hover:text-[#EDE6D8]"
              )}
            >
              {tag ?? t("photography_filter_all")}
            </button>
          );
        })}
      </div>

      <div
        ref={galleryRef}
        className={cn(
          "justified-gallery",
          rows && "justified-gallery--laid-out"
        )}
      >
        {rows
          ? rows.map((row) => (
              <div
                key={row.images[0].id}
                className='flex'
                style={{ gap: GAP, height: row.height }}
              >
                {row.images.map((image) => (
                  <JustifiedTile
                    key={image.id}
                    image={image}
                    onOpen={(element) => open(image, element)}
                    style={
                      row.justify
                        ? { flex: `${aspect(image)} 1 0` }
                        : { width: aspect(image) * row.height }
                    }
                  />
                ))}
              </div>
            ))
          : visible.map((image) => (
              <JustifiedTile
                key={image.id}
                image={image}
                onOpen={(element) => open(image, element)}
                className='justified-tile--wrap'
              />
            ))}
      </div>

      {/* Scoped to the current filter */}
      <ImageLightbox
        images={visible}
        initialIndex={lightboxIndex}
        open={lightboxOpen}
        onOpenChange={setLightboxOpen}
        returnFocusRef={openerRef}
      />
    </div>
  );
}

function JustifiedTile({
  image,
  onOpen,
  className,
  style
}: {
  image: PhotographyImage;
  onOpen: (element: HTMLElement) => void;
  className?: string;
  style?: React.CSSProperties;
}) {
  const [loaded, setLoaded] = useState(false);
  const reveal = useScrollReveal();
  const ratio = aspect(image);

  return (
    <motion.button
      type='button'
      aria-label={image.alt}
      onClick={(event) => onOpen(event.currentTarget)}
      {...reveal}
      className={cn(
        "justified-tile group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]/60",
        className
      )}
      style={{ "--ar": ratio, ...style } as React.CSSProperties}
    >
      <Image
        src={image.src}
        alt={image.alt}
        fill
        // Tiles are about row height x aspect ratio wide; the 1.4 leaves room
        // for rows that stretch above the target height
        sizes={`(max-width: 767px) ${Math.round(180 * ratio * 1.4)}px, (max-width: 1023px) ${Math.round(260 * ratio * 1.4)}px, ${Math.round(340 * ratio * 1.4)}px`}
        onLoad={() => setLoaded(true)}
        className={cn(
          "object-cover transition-[opacity,filter] duration-500 group-hover:brightness-110",
          loaded ? "opacity-100" : "opacity-0"
        )}
      />
    </motion.button>
  );
}
