import { AtmosphereSky } from "@/components/atmosphere-sky";
import Contact from "@/components/contact";
import Footer from "@/components/footer";
import { HeroSection } from "@/components/home";
import { ImageGallery } from "@/components/photography/image-gallery";
import ImageSectionTitle from "@/components/photography/image-section-title";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { VideoGrid } from "@/components/videography/video-grid";
import { featuredPhotos } from "@/lib/content/photography";
import { featuredVideos } from "@/lib/content/videography";
import { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();

  return {
    title: t("site_title"),
    description: t("site_description"),
    openGraph: {
      title: t("site_title"),
      description: t("site_description"),
      type: "website",
      images: [
        {
          url: "/images/or-2.jpg",
          alt: t("site_title")
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: `${t("about_title")} | ${t("site_title")}`,
      description: t("about_description"),
      images: ["/images/or-2.jpg"]
    }
  };
}

export default async function Home() {
  const t = await getTranslations();

  return (
    <div className='relative isolate overflow-clip max-w-full'>
      <AtmosphereSky />
      <section
        id='home'
        data-sky='hero'
        className='scroll-mt-14 sm:scroll-mt-16'
      >
        <HeroSection
          subtitle={t("home_hero_subtitle")}
          subtitleDetail={t("home_hero_subtitle_detail")}
          description={t("home_hero_description")}
        />
      </section>

      <section
        id='videography'
        data-sky='films'
        className='relative isolate scroll-mt-14 sm:scroll-mt-16'
      >
        <div aria-hidden='true' className='cinema-screening' />
        <div
          aria-hidden='true'
          className='cinema-curtain cinema-curtain--left'
        />
        <div
          aria-hidden='true'
          className='cinema-curtain cinema-curtain--right'
        />
        <Container className='py-8 sm:py-12 md:py-16 lg:py-20'>
          <div className='relative max-w-7xl mx-auto space-y-8 sm:space-y-12'>
            <VideoGrid
              videos={featuredVideos}
              title={t("videography_subtitle")}
            />
            <div className='flex flex-col sm:flex-row justify-center gap-3 sm:gap-4'>
              <Button asChild variant='outline' size='lg'>
                <Link href='/videography'>
                  {t("home_videography_view_all")}
                </Link>
              </Button>
              <Button asChild variant='outline' size='lg'>
                <Link href='/videography#credits'>
                  {t("home_videography_credits")}
                </Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>

      <section
        id='photography'
        data-sky='photography'
        className='relative isolate scroll-mt-14 sm:scroll-mt-16'
      >
        <div aria-hidden='true' className='camera-viewfinder' />
        <Container className='py-8 sm:py-12 md:py-16 lg:py-20'>
          <div className='relative max-w-7xl mx-auto space-y-8 sm:space-y-12'>
            <ImageSectionTitle>{t("home_photography_title")}</ImageSectionTitle>
            <ImageGallery images={featuredPhotos} columns={3} />
            <div className='flex justify-center'>
              <Button asChild variant='outline' size='lg'>
                <Link href='/photography'>
                  {t("home_photography_view_all")}
                </Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>

      <section
        id='about'
        data-sky='about'
        className='scroll-mt-14 sm:scroll-mt-16'
      >
        <Container size='narrow' className='py-8 sm:py-12 md:py-16 lg:py-20'>
          <div className='max-w-2xl mx-auto space-y-8 sm:space-y-12'>
            <ImageSectionTitle>{t("home_about_title")}</ImageSectionTitle>
            <p className='text-base sm:text-lg leading-relaxed text-zinc-600 dark:text-zinc-300 text-center sm:text-start'>
              {t("home_about_content")}
            </p>
            <div className='space-y-5 sm:space-y-6'>
              {[
                {
                  verb: t("home_about_skill_create"),
                  detail: t("home_about_skill_create_detail")
                },
                {
                  verb: t("home_about_skill_lead"),
                  detail: t("home_about_skill_lead_detail")
                },
                {
                  verb: t("home_about_skill_build"),
                  detail: t("home_about_skill_build_detail")
                }
              ].map(({ verb, detail }) => (
                <div
                  key={verb}
                  className='flex flex-col items-center gap-1 text-center sm:flex-row sm:items-baseline sm:gap-4 sm:text-start'
                >
                  <span className='w-20 shrink-0 text-sm font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400'>
                    {verb}
                  </span>
                  <span className='text-sm sm:text-base text-zinc-500 dark:text-zinc-400'>
                    {detail}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section
        id='contact'
        data-sky='contact'
        className='scroll-mt-14 sm:scroll-mt-16'
      >
        <Contact className='bg-transparent dark:bg-transparent' />
      </section>

      {/* The landing page's footer lives inside the sky (the root layout
          skips it here); it ends on the contact stop */}
      <Footer className='border-t-0 bg-transparent dark:bg-transparent' />
    </div>
  );
}
