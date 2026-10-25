"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { VideoItem } from "@/lib/types/videography";
import { Typography } from "@/components/ui/typography";
import {
  getYouTubeVideoId,
  getYouTubeThumbnail,
  getYouTubeThumbnailFallback,
  isYouTubeUrl
} from "@/lib/utils/youtube.utils";
import { Icon } from "@/components/ui/icon";
import { useScrollReveal } from "@/components/ui/scroll-reveal";

interface VideoCardProps {
  video: VideoItem;
  index?: number;
  size?: "small" | "large";
  /**
   * Render the title/label overlay. Off for the featured grid, whose
   * thumbnails carry designed titles; on for carousel cards, whose plain
   * thumbnails are unidentifiable without it.
   */
  showTitle?: boolean;
  onClick?: () => void;
  className?: string;
  /**
   * Off when a parent animates the card in together with its caption, so
   * the card doesn't animate twice
   */
  entrance?: boolean;
}

export function VideoCard({
  video,
  index = 0,
  size = "small",
  showTitle = false,
  onClick,
  className,
  entrance = true
}: VideoCardProps) {
  const isYouTube = isYouTubeUrl(video.url);
  const youtubeId = isYouTube ? getYouTubeVideoId(video.url) : null;
  const thumbnail = youtubeId
    ? getYouTubeThumbnail(youtubeId, video.thumbnailVersion)
    : "";
  const [thumbnailSrc, setThumbnailSrc] = useState(thumbnail);
  // On the landing page the card rises in as it scrolls into view instead
  // of on mount; a light stagger across each row
  const reveal = useScrollReveal((index % 4) * 0.06);

  // Extract year and type from title if available
  // Handle formats like "ABF 2025 (Short Documentary)" or "Title (Type)"
  const titleMatch = video.title.match(/^(.+?)\s*\((.+?)\)$/);
  const displayTitle = titleMatch ? titleMatch[1].trim() : video.title;
  const type = titleMatch ? titleMatch[2].trim() : null;
  // Extract year from anywhere in the title
  const yearMatch = video.title.match(/\b(20\d{2})\b/);
  const year = yearMatch ? yearMatch[1] : null;

  return (
    <motion.div
      {...(entrance
        ? (reveal ?? {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.5, delay: index * 0.05 }
          })
        : {})}
      className={cn(
        // 16:9 matches YouTube thumbnails exactly, so object-cover never crops
        "group relative cursor-pointer overflow-hidden rounded-lg border border-zinc-800 bg-black transition-all duration-300 hover:border-zinc-600 hover:shadow-xl",
        "aspect-video",
        className
      )}
      onClick={onClick}
    >
      <div className="relative h-full w-full overflow-hidden bg-zinc-900">
        {thumbnailSrc ? (
          <>
            <Image
              src={thumbnailSrc}
              alt={video.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes={
                size === "large"
                  ? "(max-width: 768px) 100vw, 50vw"
                  : "(max-width: 768px) 100vw, 33vw"
              }
              unoptimized
              onLoad={(e) => {
                // YouTube returns a gray 120x90 placeholder (HTTP 200) when a
                // video has no maxresdefault, so onError never fires. Detect the
                // placeholder by its width and fall back to mqdefault, which
                // always exists for public and unlisted videos and is clean
                // 16:9 (hqdefault has letterbox bars baked in).
                const img = e.currentTarget;
                const fallback = youtubeId
                  ? getYouTubeThumbnailFallback(youtubeId, video.thumbnailVersion)
                  : "";
                if (
                  fallback &&
                  thumbnailSrc !== fallback &&
                  img.naturalWidth <= 120
                ) {
                  setThumbnailSrc(fallback);
                }
              }}
              onError={() => {
                const fallback = youtubeId
                  ? getYouTubeThumbnailFallback(youtubeId, video.thumbnailVersion)
                  : "";
                if (fallback && thumbnailSrc !== fallback) {
                  setThumbnailSrc(fallback);
                }
              }}
            />
            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300" />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-zinc-900">
            <Icon name="lucide:video" className="w-16 h-16 text-zinc-700" />
          </div>
        )}

        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-16 h-16 rounded-full bg-amber-500/90 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg backdrop-blur-sm">
            <Icon name="lucide:play" className="w-8 h-8 text-white ml-1" />
          </div>
        </div>

        {/* Title overlay — carousel cards only */}
        {showTitle && (
          <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-6">
            <div className="bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 -m-4 rounded-b-lg">
              <Typography
                variant="h5"
                className="text-white font-sans font-bold mb-2 line-clamp-2 text-sm sm:text-base md:text-lg lg:text-lg"
              >
                {displayTitle}
              </Typography>
              {(year || type) && (
                <div className="flex items-center gap-2 text-xs text-amber-500 dark:text-amber-400 font-medium uppercase tracking-wider">
                  {year && <span>{year}</span>}
                  {year && type && <span>·</span>}
                  {type && <span>{type}</span>}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

