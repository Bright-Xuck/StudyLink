import type { Metadata } from "next";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import NextTopLoader from "nextjs-toploader";
import { ThemeProvider } from "@/lib/contexts/ThemeProvider";
import TanstackProvider from "@/lib/contexts/tanstackProvider";
import { AuthProvider } from "@/lib/contexts/AuthProvider";

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-poppins',
  weight: '700'
});

export const metadata: Metadata = {
  title: 'ResearchEthics Platform - Learn Research Skills',
  description: 'Master research methodology, ethics, and academic writing with our comprehensive training platform',
  keywords: ['ResearchEthics', 'research ethics', 'btverse'],
  authors: [{ name: 'ResearchEthics' }],
  creator: 'BiotecUniverse',
  publisher: 'botecuniverse.org',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_APP_URL,
    title: 'ResearchEthics Platform - Learn Research Skills',
    description: 'Your trusted marketplace for digital accounts, social media services, and virtual contacts.',
    siteName: 'ResearchEthics',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ResearchEthics Platform - Learn Research Skills',
    description: 'Your trusted marketplace for digital accounts, social media services, and virtual contacts.',
  },
}

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    locale: string;
  }>;
}

export default async function LocaleLayout({
  children,
  params
}: LocaleLayoutProps) {
  const { locale } = await params;

  // Validate that the incoming `locale` is valid
  if (!routing.locales.includes(locale as 'en' | 'fr')) {
    notFound();
  }

  // Get messages for the locale
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={`${inter.variable} ${poppins.variable} ${inter.className} ${poppins.className} antialiased`}>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <ThemeProvider>
            <AuthProvider>
              <TanstackProvider>
                <NextTopLoader
                  shadow="0 0 10px #059669,0 0 5px #059669"
                  color="#1B57B0"
                  height={4}
                />
                <Toaster position="top-center" richColors />
                {children}
              </TanstackProvider>
            </AuthProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}