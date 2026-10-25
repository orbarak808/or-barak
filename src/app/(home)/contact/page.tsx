import Contact from "@/components/contact";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { pageMetadata } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();
  return pageMetadata(t("contact_title"));
}

const ContactPage = () => {
  return <Contact />;
};

export default ContactPage;
