"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { PhotographyImage } from "@/lib/types/photography";
import { useScrollReveal } from "@/components/ui/scroll-reveal";

interface ImageCardProps {
  image: PhotographyImage;
  index?: number;
  size?: "small" | "medium" | "large" | "varied";
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
}

const sizeClasses = {
  small: "aspect-[4/3]",
  medium: "aspect-[3/2]",
  large: "aspect-[16/10]",
  varied: "" // Will be handled by custom classes
};

export function ImageCard({
  image,
  index = 0,
  size = "medium",
  onClick,
  className
}: ImageCardProps) {
  // On the landing page the card rises in as it scrolls into view instead
  // of on mount; a light stagger across each row
  const reveal = useScrollReveal((index % 3) * 0.06, "image");

  return (
    // A button, so the photo can be opened from the keyboard and the
    // lightbox can hand focus back to it on close
    <motion.button
      key={reveal?.["data-reveal"]}
      type='button'
      aria-label={image.alt}
      {...(reveal ?? {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5, delay: index * 0.05 }
      })}
      className={cn(
        "group relative block w-full cursor-pointer overflow-hidden rounded-lg text-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]/60",
        className
      )}
      onClick={onClick}
    >
      <span
        className={cn(
          "relative block w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900",
          size !== "varied" && sizeClasses[size]
        )}
      >
        <Image
          src={image.src}
          alt={image.alt}
          fill
          className='object-cover transition-transform duration-700 group-hover:scale-110'
          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
        />
        {/* Overlay on hover */}
        <span className='absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300' />

        {/* Title and category overlay */}
        {/* 
          {(image.title || image.category) && (
            <div className='absolute inset-0 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
              REMOVE THIS FOR NOW - No needed.
              <div className="bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 -m-4 rounded-b-lg">
                {image.title && (
                  <Typography
                    variant="h6"
                    className="text-white font-serif italic mb-1"
                  >
                    {image.title}
                  </Typography>
                )}
                {image.category && (
                  <Typography
                    variant="body2"
                    className="text-amber-500 uppercase text-xs font-medium tracking-wider"
                  >
                    {image.category}
                  </Typography>
                )}
              </div>
            </div>
          )}
        */}
      </span>
    </motion.button>
  );
}
