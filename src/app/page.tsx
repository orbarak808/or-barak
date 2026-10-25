import { AtmosphereSky } from "@/components/atmosphere-sky";
import Contact from "@/components/contact";
import Footer from "@/components/footer";
import { HeroSection } from "@/components/home";
import { FeaturedFilms } from "@/components/home/featured-films";
import { ViewMoreButton } from "@/components/home/view-more-button";
import {
  SectionHeading,
  headingEm,
  textLinkClasses
} from "@/components/home/section-heading";
import { ImageGallery } from "@/components/photography/image-gallery";
import { Container } from "@/components/ui/container";
import { Reveal, ScrollRevealProvider } from "@/components/ui/scroll-reveal";
import {
  featuredPhotos,
  getAllPhotographyImages
} from "@/lib/content/photography";
import { featuredVideos, videographyVideos } from "@/lib/content/videography";
import { VideoRole } from "@/lib/enums/video-role.enum";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

// "All films" are the ones Or directed, filmed and edited; producer and crew
// work is listed under Selected Credits
const filmCount = videographyVideos.filter(
  (video) => video.role === VideoRole.Directed_Filmed_Edited
).length;
const photoCount = getAllPhotographyImages().length;

export default async function Home() {
  const t = await getTranslations();

  return (
    // Pulled up under the fixed navbar: the hero is full-bleed from the top
    // of the window and the navbar sits transparent over it
    <div
      data-sky-root
      className='relative isolate -mt-14 sm:-mt-16 overflow-clip max-w-full'
    >
      <AtmosphereSky />
      <ScrollRevealProvider>
        <section
          id='home'
          data-sky='hero'
          className='scroll-mt-14 sm:scroll-mt-16'
        >
          <HeroSection />
        </section>

        <section
          id='videography'
          data-sky='films'
          className='relative isolate scroll-mt-14 sm:scroll-mt-16'
        >
          <div
            aria-hidden='true'
            className='cinema-curtain cinema-curtain--left'
          />
          <div
            aria-hidden='true'
            className='cinema-curtain cinema-curtain--right'
          />
          <Container className='py-12 md:py-16 lg:py-20'>
            <div className='relative max-w-7xl mx-auto space-y-10 md:space-y-12'>
              <div className='space-y-5'>
                <SectionHeading
                  eyebrow={t("videography_subtitle")}
                  title={t.rich("home_films_heading", { em: headingEm })}
                />
                <Reveal>
                  <p className='max-w-2xl text-base leading-[1.65] text-[#B5AD9F]'>
                    {t("videography_description")}
                  </p>
                </Reveal>
              </div>
              <FeaturedFilms videos={featuredVideos} />
            </div>
            {/* The way deeper: one clear primary action, credits beside it */}
            <Reveal className='mt-12 flex flex-col items-stretch gap-5 sm:flex-row sm:items-center sm:justify-center sm:gap-8'>
              <ViewMoreButton href='/videography'>
                {t("home_videography_view_all")} ({filmCount})
              </ViewMoreButton>
              <Link
                href='/videography#credits'
                className={`${textLinkClasses} self-center`}
              >
                {t("home_videography_credits")}
              </Link>
            </Reveal>
          </Container>
        </section>

        <section
          id='photography'
          data-sky='photography'
          className='relative isolate scroll-mt-14 sm:scroll-mt-16'
        >
          <div aria-hidden='true' className='camera-viewfinder' />
          <Container className='py-12 md:py-16 lg:py-20'>
            <div className='relative max-w-7xl mx-auto space-y-10 md:space-y-12'>
              <SectionHeading
                eyebrow={t("photography_title")}
                title={t("home_photography_title")}
              />
              <ImageGallery images={featuredPhotos} columns={3} />
            </div>
            <Reveal className='mt-12 flex justify-center'>
              <ViewMoreButton href='/photography'>
                {t("home_photography_view_all")} ({photoCount})
              </ViewMoreButton>
            </Reveal>
          </Container>
        </section>

        <section
          id='about'
          data-sky='about'
          className='scroll-mt-14 sm:scroll-mt-16'
        >
          <Container size='narrow' className='py-12 md:py-16 lg:py-20'>
            <div className='max-w-2xl mx-auto space-y-8 sm:space-y-10'>
              <SectionHeading title={t("home_about_title")} />
              <Reveal>
                <p className='text-[17px] sm:text-lg leading-[1.65] text-[#CFC7B8]'>
                  {t("home_about_content")}
                </p>
              </Reveal>
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
                ].map(({ verb, detail }, i) => (
                  <Reveal
                    key={verb}
                    delay={i * 0.08}
                    className='flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-4'
                  >
                    <span className='w-20 shrink-0 text-[13px] font-semibold uppercase tracking-[0.22em] text-[#D4AF37]'>
                      {verb}
                    </span>
                    <span className='text-[15px] sm:text-base text-[#B5AD9F]'>
                      {detail}
                    </span>
                  </Reveal>
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
      </ScrollRevealProvider>
    </div>
  );
}
