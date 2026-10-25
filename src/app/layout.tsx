import { Montserrat } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getLocale } from "next-intl/server";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { HeroVisibilityProvider } from "@/components/hero-visibility";

import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap"
});

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  // Set dir based on locale
  const dir = locale === "he" ? "rtl" : "ltr";

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${montserrat.variable} dark`}
      suppressHydrationWarning
    >
      <body className='antialiased bg-background text-foreground overflow-x-clip'>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <HeroVisibilityProvider>
            <Navbar />
            <main className='min-h-screen pt-14 sm:pt-16 overflow-x-clip max-w-full'>
              {children}
            </main>
            <Footer />
          </HeroVisibilityProvider>
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  );
}
