"use client";

import { useTranslations } from "next-intl";
import { useState, useMemo } from "react";
import { VideoItem } from "@/lib/types/videography";
import { VideoRole } from "@/lib/enums/video-role.enum";
import { Typography } from "@/components/ui/typography";
import { VideoDialog } from "./video-dialog";
import { cn } from "@/lib/utils";

interface VideoRolesSectionProps {
  videos: VideoItem[];
}

export function VideoRolesSection({ videos }: VideoRolesSectionProps) {
  const t = useTranslations();
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Helper function to get translation key for role
  const getRoleTranslationKey = (role: VideoRole): string => {
    const roleMap: Record<VideoRole, string> = {
      [VideoRole.Directed_Filmed_Edited]:
        "videography_role_directed_filmed_edited",
      [VideoRole.Head_Producer]: "videography_role_head_producer",
      [VideoRole.Executive_Producer]: "videography_role_executive_producer",
      [VideoRole.BTS_PA]: "videography_role_bts_pa"
    };
    return roleMap[role];
  };

  // Group videos by role
  const videosByRole = useMemo(() => {
    const grouped: Record<VideoRole, VideoItem[]> = {
      [VideoRole.Directed_Filmed_Edited]: [],
      [VideoRole.Head_Producer]: [],
      [VideoRole.Executive_Producer]: [],
      [VideoRole.BTS_PA]: []
    };

    videos.forEach((video) => {
      if (grouped[video.role]) {
        grouped[video.role].push(video);
      }
    });

    // Filter out empty roles and return as array
    return Object.entries(grouped)
      .filter(([, videos]) => videos.length > 0)
      .map(([role, videos]) => ({
        role: role as VideoRole,
        videos
      }));
  }, [videos]);

  const handleVideoClick = (video: VideoItem) => {
    setSelectedVideo(video);
    setIsDialogOpen(true);
  };

  if (videosByRole.length === 0) {
    return null;
  }

  return (
    <>
      <div className='space-y-8 md:space-y-12'>
        <div className='h-px w-full bg-zinc-800 mx-auto sm:mx-0 my-6' />
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12'>
          {videosByRole.map(({ role, videos }) => (
            <div key={role} className='space-y-4 text-center md:text-left'>
              <Typography
                variant='subtitle1'
                className='font-serif text-xl md:text-2xl text-zinc-400'
              >
                {t(getRoleTranslationKey(role))}
              </Typography>

              <div className='h-px w-24 bg-zinc-800 mx-auto md:mx-0' />

              <div className='space-y-0'>
                {videos.map((video, index) => (
                  <div key={index}>
                    <button
                      onClick={() => handleVideoClick(video)}
                      className={cn(
                        "w-full text-left py-3 text-zinc-400 hover:text-zinc-200",
                        "transition-colors duration-200 cursor-pointer",
                        "border-b border-zinc-800 last:border-b-0 hover:text-zinc-100",
                        "transition-colors duration-200 hover:scale-105 hover:font-bold"
                      )}
                    >
                      <Typography variant='body2' className='font-sans'>
                        {video.title}
                      </Typography>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <VideoDialog
        video={selectedVideo}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </>
  );
}
