import Photography from "@/components/photography";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { pageMetadata } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();
  return pageMetadata(t("photography_title"));
}

const PhotographyPage = () => {
  return <Photography />;
};

export default PhotographyPage;
