import type { Metadata } from 'next';
import { ReactNode } from 'react';
import '@/styles/globals.css';
import { AppProvider } from '@/context/AppContext';

export const metadata: Metadata = {
  title: 'StudyLink - Learn with Excellence',
  description: 'StudyLink provides quality education for students across Cameroon',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body>
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
