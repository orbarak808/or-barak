import { useTranslations } from "next-intl";
import { SectionHeading } from "@/components/home/section-heading";

const PhotographyHeader = () => {
  const t = useTranslations();

  return (
    <div className='space-y-5'>
      <SectionHeading
        as='h1'
        eyebrow={t("photography_title")}
        title={t("photography_collection_title")}
      />
      <p className='max-w-2xl text-[17px] leading-[1.65] text-[#B5AD9F]'>
        {t("photography_collection_description")}
      </p>
    </div>
  );
};

export default PhotographyHeader;
