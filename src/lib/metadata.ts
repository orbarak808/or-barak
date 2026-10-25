import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export const SITE_URL = "https://www.orbarak.net";

/**
 * Metadata for a page below the landing page: "<Page> | Or Barak" as the
 * title, the site description, and the shared Open Graph / Twitter card
 * (the image comes from app/opengraph-image.tsx). Child segments replace
 * the layout's openGraph and twitter objects wholesale (dropping the
 * file-based image too), so they are built in full here, pointing at the
 * same generated card.
 */
export async function pageMetadata(pageTitle?: string): Promise<Metadata> {
  const t = await getTranslations();
  const title = pageTitle
    ? `${pageTitle} | ${t("home_hero_name")}`
    : t("site_title");
  const description = t("site_description");
  // The landing page gets the card from the opengraph-image/twitter-image
  // files directly; pages below it have to name it
  const shareImage = pageTitle
    ? {
        og: [
          {
            url: "/opengraph-image",
            width: 1200,
            height: 630,
            alt: `${t("home_hero_name")}, ${t("home_hero_subtitle")}`
          }
        ],
        twitter: ["/twitter-image"]
      }
    : null;

  return {
    title: { absolute: title },
    description,
    openGraph: {
      type: "website",
      siteName: t("home_hero_name"),
      title,
      description,
      ...(shareImage && { images: shareImage.og })
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(shareImage && { images: shareImage.twitter })
    }
  };
}
