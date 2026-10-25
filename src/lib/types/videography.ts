import { VideoRole } from "../enums/video-role.enum";

export interface VideoItem {
  role: VideoRole;
  title: string;
  url: string;
  featured?: boolean;
  /** Shown beside the title in the landing page's featured captions, e.g. "Short Film" */
  category?: string;
  /**
   * Bump when the thumbnail is updated on YouTube — appended as a query param
   * to bust YouTube's CDN cache, which can serve a stale maxresdefault.
   */
  thumbnailVersion?: number;
}
