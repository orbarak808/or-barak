"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { PhotographyImage } from "@/lib/types/photography";
import {
  driveFileId,
  driveThumbnail,
  filmStripPhotos
} from "@/lib/content/photography";

/*
 * Two strips of 35mm print stock behind the contact section, one per side,
 * slightly angled and running off the top and bottom. Each strip is a
 * column of frames printed with photos from the photography set, sprocket
 * holes down both edges and edge print along the outer one. The column is
 * rendered twice and drifts up by exactly one copy, so the loop is
 * seamless. Weave, dust, scratch and light leak are separate layers; all
 * motion is transform/opacity, defined in globals.css (.film-strip*), and
 * pauses while the section is off screen. Hidden below lg.
 */

// Frames per copy of the column; the copy must be taller than the rail
const FRAMES_PER_COPY = 20;

const frameSrc = (image: PhotographyImage) => {
  const id = driveFileId(image.src);
  return id ? driveThumbnail(id, 400) : image.src;
};

type StripProps = {
  side: "left" | "right";
  photos: PhotographyImage[];
  /** Edge number of the first frame */
  firstFrame: number;
};

function StripCopy({ photos, firstFrame }: Omit<StripProps, "side">) {
  return (
    <div className='film-strip-copy'>
      {Array.from({ length: FRAMES_PER_COPY }, (_, i) => {
        const photo = photos[i % photos.length];
        const number = firstFrame + i;
        return (
          <div key={i} className='film-strip-frame'>
            <span className='film-strip-edge'>
              {i % 4 === 0 ? `OB 26 ▸ ${number}` : number}
            </span>
            {/* Through the image optimizer, like the galleries: loaded from
                this site and cached, since Google intermittently blocks
                Drive thumbnails hotlinked straight into the page */}
            <Image
              src={frameSrc(photo)}
              alt=''
              width={94}
              height={62}
              sizes='94px'
              className='film-strip-image'
            />
          </div>
        );
      })}
    </div>
  );
}

function Strip({ side, photos, firstFrame }: StripProps) {
  return (
    <div className={`film-strip-rail film-strip-rail--${side}`}>
      <div className='film-strip-weave'>
        <div className='film-strip-track'>
          <StripCopy photos={photos} firstFrame={firstFrame} />
          <StripCopy
            photos={photos}
            firstFrame={firstFrame + FRAMES_PER_COPY}
          />
        </div>
      </div>
      <div className='film-strip-dust' />
      <div className='film-strip-scratch' />
      <div className='film-strip-leak' />
    </div>
  );
}

export function FilmStrips() {
  const ref = useRef<HTMLDivElement>(null);
  const [onScreen, setOnScreen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) =>
      setOnScreen(entry.isIntersecting)
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // The second strip runs the photos in a different order so the two sides
  // never show the same frame together
  const half = Math.floor(filmStripPhotos.length / 2);
  const rightPhotos = [
    ...filmStripPhotos.slice(half),
    ...filmStripPhotos.slice(0, half)
  ].reverse();

  return (
    <div
      ref={ref}
      aria-hidden='true'
      className='film-strips'
      data-paused={onScreen ? undefined : ""}
      // Containment inline as well as in globals.css: if the stylesheet is
      // ever missing or stale, the strips stay clipped behind the content
      // instead of spilling full-size frames into the page
      style={{
        position: "absolute",
        inset: 0,
        zIndex: -1,
        overflow: "hidden",
        pointerEvents: "none"
      }}
    >
      <Strip side='left' photos={filmStripPhotos} firstFrame={14} />
      <Strip side='right' photos={rightPhotos} firstFrame={31} />
      <div className='film-strip-scrim' />
    </div>
  );
}
