"use client";

import { useRef, useState } from "react";
import { VideoItem } from "@/lib/types/videography";
import { VideoCard } from "@/components/videography/video-card";
import { VideoDialog } from "@/components/videography/video-dialog";
import { Reveal } from "@/components/ui/scroll-reveal";
import { cn } from "@/lib/utils";
import { useBoolean } from "@/hooks/use-boolean";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

/**
 * The landing page's featured films: two large and four small 16:9 cards,
 * each captioned below the image rather than over it. Large captions carry
 * the category on the right when the video has one. Below 768px the six
 * become a native swipe row instead (FilmCarousel).
 */
export function FeaturedFilms({ videos }: { videos: VideoItem[] }) {
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  const isDialogOpen = useBoolean();

  const open = (video: VideoItem) => {
    setSelectedVideo(video);
    isDialogOpen.onTrue();
  };

  const largeVideos = videos.slice(0, 2);
  const smallVideos = videos.slice(2, 6);

  return (
    <>
      <FilmCarousel videos={videos.slice(0, 6)} onOpen={open} />
      {/* md+: the 2 + 4 grid, 48px apart as before */}
      <div className='hidden md:block md:space-y-12'>
        <div className='grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-6'>
          {largeVideos.map((video, index) => (
            <Reveal key={video.url} delay={index * 0.06}>
              <figure className='flex flex-col gap-4'>
                <VideoCard
                  video={video}
                  size='large'
                  entrance={false}
                  onClick={() => open(video)}
                />
                <LargeCaption video={video} />
              </figure>
            </Reveal>
          ))}
        </div>
        <div className='grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-6 lg:grid-cols-4'>
          {smallVideos.map((video, index) => (
            <Reveal key={video.url} delay={(index % 4) * 0.06}>
              <figure className='flex flex-col gap-3'>
                <VideoCard
                  video={video}
                  size='small'
                  entrance={false}
                  onClick={() => open(video)}
                />
                <figcaption className='font-serif text-[22px] leading-tight text-[#EDE6D8]'>
                  {video.title}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
      <VideoDialog
        video={selectedVideo}
        open={isDialogOpen.value}
        onOpenChange={isDialogOpen.onToggle}
      />
    </>
  );
}

const CARD_GAP = 14;

function LargeCaption({ video }: { video: VideoItem }) {
  return (
    <figcaption className='flex items-baseline justify-between gap-4'>
      <span className='font-serif text-[26px] leading-tight text-[#EDE6D8]'>
        {video.title}
      </span>
      {video.category && (
        <span className='shrink-0 text-[13px] uppercase tracking-[0.1em] text-[#A39B8D]'>
          {video.category}
        </span>
      )}
    </figcaption>
  );
}

/**
 * Phones: one row of large 16:9 cards (~82vw, the next one peeking in from
 * the right) that snaps card by card under native touch scrolling, with
 * dots that follow the scroll and jump to a card when tapped.
 */
function FilmCarousel({
  videos,
  onOpen
}: {
  videos: VideoItem[];
  onOpen: (video: VideoItem) => void;
}) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const reducedMotion = usePrefersReducedMotion();

  const step = () => {
    const card = rowRef.current?.firstElementChild as HTMLElement | null;
    return card ? card.offsetWidth + CARD_GAP : 1;
  };

  const onScroll = () => {
    const row = rowRef.current;
    if (!row) return;
    const atEnd = row.scrollLeft >= row.scrollWidth - row.clientWidth - 2;
    const index = atEnd
      ? videos.length - 1
      : Math.round(row.scrollLeft / step());
    setActive(Math.min(videos.length - 1, Math.max(0, index)));
  };

  const goTo = (index: number) =>
    rowRef.current?.scrollTo({
      left: index * step(),
      behavior: reducedMotion ? "auto" : "smooth"
    });

  return (
    <Reveal className='md:hidden'>
      <div
        ref={rowRef}
        onScroll={onScroll}
        className='-mx-4 flex snap-x snap-mandatory scroll-px-4 overflow-x-auto px-4 [scrollbar-width:none] sm:-mx-5 sm:scroll-px-5 sm:px-5 [&::-webkit-scrollbar]:hidden'
        style={{ gap: CARD_GAP }}
      >
        {videos.map((video) => (
          <figure
            key={video.url}
            className='flex w-[82vw] shrink-0 snap-start flex-col gap-4'
          >
            <VideoCard
              video={video}
              size='large'
              entrance={false}
              onClick={() => onOpen(video)}
            />
            <LargeCaption video={video} />
          </figure>
        ))}
      </div>
      <div className='mt-6 flex justify-center gap-1'>
        {videos.map((video, index) => (
          <button
            key={video.url}
            type='button'
            onClick={() => goTo(index)}
            aria-label={`Show ${video.title}`}
            aria-current={index === active}
            className='flex h-6 w-6 items-center justify-center'
          >
            <span
              className={cn(
                "h-1.5 w-1.5 rounded-full transition-colors",
                index === active ? "bg-[#D4AF37]" : "bg-[#5A5246]"
              )}
            />
          </button>
        ))}
      </div>
    </Reveal>
  );
}
