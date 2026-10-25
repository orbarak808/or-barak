import { Instrument_Sans, Instrument_Serif } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getLocale } from "next-intl/server";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { OutsideLanding } from "@/components/outside-landing";
import { HeroVisibilityProvider } from "@/components/hero-visibility";

import "./globals.css";

// Display: headings, wordmark, film titles. Only one weight exists, so
// globals.css turns off synthesized bold for it.
const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap"
});

// UI and body text
const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  weight: ["400", "500", "600"],
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
      className={`${instrumentSerif.variable} ${instrumentSans.variable} dark`}
      suppressHydrationWarning
    >
      <body className='antialiased bg-background text-foreground overflow-x-clip'>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <HeroVisibilityProvider>
            <Navbar />
            <main className='min-h-screen pt-14 sm:pt-16 overflow-x-clip max-w-full'>
              {children}
            </main>
            <OutsideLanding>
              <Footer />
            </OutsideLanding>
          </HeroVisibilityProvider>
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  );
}
