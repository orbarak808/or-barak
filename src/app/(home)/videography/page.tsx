import Videography from "@/components/videography";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { pageMetadata } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();
  return pageMetadata(t("nav_films"));
}

const VideographyPage = () => {
  return <Videography />;
};

export default VideographyPage;
