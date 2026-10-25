"use client";

import { Container } from "@/components/ui/container";
import { ScrollRevealProvider } from "@/components/ui/scroll-reveal";
import { JustifiedGallery } from "./justified-gallery";
import { getAllPhotographyImages } from "@/lib/content/photography";
import PhotographyHeader from "./header";

const Photography = () => {
  const allImages = getAllPhotographyImages();

  return (
    <div className='min-h-screen bg-gradient-to-br from-white via-zinc-50 to-zinc-100 dark:from-black dark:via-zinc-950 dark:to-zinc-900 overflow-x-hidden max-w-full'>
      <Container className='py-8 sm:py-12 md:py-16 lg:py-20'>
        <div className='max-w-7xl mx-auto space-y-12 sm:space-y-16'>
          <PhotographyHeader />

          {/* Photos fade up as they enter, as on the landing page */}
          <ScrollRevealProvider>
            <JustifiedGallery images={allImages} />
          </ScrollRevealProvider>
        </div>
      </Container>
    </div>
  );
};

export default Photography;
