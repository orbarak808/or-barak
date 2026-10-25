"use client";

import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";
import { VideoItem } from "@/lib/types/videography";
import { VideoCard } from "./video-card";
import { VideoDialog } from "./video-dialog";
import { Typography } from "@/components/ui/typography";
import { useBoolean } from "@/hooks/use-boolean";

interface VideoCarouselProps {
  videos: VideoItem[];
  title?: string;
}

export function VideoCarousel({ videos, title }: VideoCarouselProps) {
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  const isDialogOpen = useBoolean();

  const [api, setApi] = useState<CarouselApi>();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  useEffect(() => {
    if (!api) {
      return;
    }

    const onSelect = () => {
      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());
    };

    onSelect();
    api.on("select", onSelect);
    api.on("reInit", onSelect);

    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api]);

  const handleVideoClick = (video: VideoItem) => {
    setSelectedVideo(video);
    isDialogOpen.onTrue();
  };

  return (
    <>
      <div className='space-y-6'>
        {title && (
          <Typography
            variant='h4'
            className='uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-medium
          text-center sm:text-left'
          >
            {title}
          </Typography>
        )}
        <Carousel
          setApi={setApi}
          opts={{
            align: "start",
            loop: false
          }}
          className='w-full max-w-full'
        >
          <CarouselContent className='-ml-2 md:-ml-4'>
            {videos.map((video, index) => (
              <CarouselItem
                key={index}
                className='pl-2 md:pl-4 basis-[85%] sm:basis-[45%] md:basis-[31%] lg:basis-[23%]'
              >
                <VideoCard
                  video={video}
                  index={index}
                  size='small'
                  showTitle
                  onClick={() => handleVideoClick(video)}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          {canScrollPrev && (
            <CarouselPrevious
              className='hidden md:flex left-2 top-1/2 -translate-y-1/2'
            />
          )}
          {canScrollNext && (
            <CarouselNext
              className='hidden md:flex right-2 top-1/2 -translate-y-1/2'
            />
          )}
        </Carousel>
      </div>
      <VideoDialog
        video={selectedVideo}
        open={isDialogOpen.value}
        onOpenChange={isDialogOpen.onToggle}
      />
    </>
  );
}
