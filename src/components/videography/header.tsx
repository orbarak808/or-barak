import { getTranslations } from "next-intl/server";
import { SectionHeading, headingEm } from "@/components/home/section-heading";

const VideographyHeader = async () => {
  const t = await getTranslations();

  return (
    <SectionHeading
      as='h1'
      eyebrow={t("videography_title")}
      title={t.rich("home_films_heading", { em: headingEm })}
    />
  );
};

export default VideographyHeader;
