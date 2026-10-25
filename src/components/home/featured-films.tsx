"use client";

import { useState } from "react";
import { VideoItem } from "@/lib/types/videography";
import { VideoCard } from "@/components/videography/video-card";
import { VideoDialog } from "@/components/videography/video-dialog";
import { Reveal } from "@/components/ui/scroll-reveal";
import { useBoolean } from "@/hooks/use-boolean";

/**
 * The landing page's featured films: two large and four small 16:9 cards,
 * each captioned below the image rather than over it. Large captions carry
 * the category on the right when the video has one.
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
      <VideoDialog
        video={selectedVideo}
        open={isDialogOpen.value}
        onOpenChange={isDialogOpen.onToggle}
      />
    </>
  );
}
