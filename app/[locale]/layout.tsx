import { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { AppProvider } from '@/context/AppContext';
import { Layout } from '@/components/Layouts/Layout';
import { getMessages } from 'next-intl/server';

interface LocaleLayoutProps {
  children: ReactNode;
  params: {
    locale: string;
  };
}

export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'fr' }];
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: LocaleLayoutProps) {
  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <AppProvider>
        <Layout>
          {children}
        </Layout>
      </AppProvider>
    </NextIntlClientProvider>
  );
}

