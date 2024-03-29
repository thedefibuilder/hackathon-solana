import '../styles/globals.css';
import '../styles/globals.scss';

import React from 'react';

import type { Metadata, Viewport } from 'next';

import config from '_config';

import Footer from '@/components/footer';
import Navbar from '@/components/navbar';
import { Toaster } from '@/components/ui/toast/toaster';
import NextAuthProvider from '@/providers/next-auth-provider';

export const metadata: Metadata = {
  title: config.metadata.title,
  description: config.metadata.description,
  keywords: config.metadata.keywords,
  icons: 'favicon.svg',
  manifest: 'app.webmanifest'
};

export const viewport: Viewport = {
  themeColor: '#000'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en' suppressHydrationWarning>
      <NextAuthProvider>
        <body>
          <Navbar />

          {children}

          <Footer />

          <Toaster />
        </body>
      </NextAuthProvider>
    </html>
  );
}
