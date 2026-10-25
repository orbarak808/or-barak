"use client";

import { useRef, useState } from "react";
import { ImageCard } from "./image-card";
import { ImageLightbox } from "./image-lightbox";
import { PhotographyImage } from "@/lib/types/photography";
import { cn } from "@/lib/utils";

interface ImageGalleryProps {
  images: PhotographyImage[];
  columns?: number;
  size?: "small" | "medium" | "large" | "varied";
  className?: string;
  enableLightbox?: boolean;
  allImages?: PhotographyImage[]; // For lightbox navigation across all images
}

export function ImageGallery({
  images,
  columns = 3,
  size = "medium",
  className,
  enableLightbox = true,
  allImages
}: ImageGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  // The thumbnail that opened the lightbox gets focus back on close
  const openerRef = useRef<HTMLElement | null>(null);

  const imagesForLightbox = allImages || images;

  const handleImageClick = (index: number) => {
    if (!enableLightbox) return;
    
    // Find the index in the full images array
    const clickedImage = images[index];
    const fullIndex = imagesForLightbox.findIndex(
      (img) => img.id === clickedImage.id
    );
    
    setLightboxIndex(fullIndex >= 0 ? fullIndex : index);
    setLightboxOpen(true);
  };

  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
    5: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
  };

  return (
    <>
      <div
        className={cn(
          "grid gap-4 md:gap-6",
          gridCols[columns as keyof typeof gridCols] || gridCols[3],
          className
        )}
      >
        {images.map((image, index) => (
          <ImageCard
            key={image.id}
            image={image}
            index={index}
            size={size}
            onClick={(event) => {
              openerRef.current = event.currentTarget;
              handleImageClick(index);
            }}
          />
        ))}
      </div>

      {enableLightbox && (
        <ImageLightbox
          images={imagesForLightbox}
          initialIndex={lightboxIndex}
          open={lightboxOpen}
          onOpenChange={setLightboxOpen}
          returnFocusRef={openerRef}
        />
      )}
    </>
  );
}

