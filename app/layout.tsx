import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'Model Train Market - Listing Onboarding',
    template: '%s | MTM Listings',
  },
  description: 'AI-powered model train listing onboarding system for SixBit export',
  keywords: ['model trains', 'listing', 'eBay', 'SixBit', 'inventory', 'AI'],
  authors: [{ name: 'Model Train Market' }],
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
  openGraph: {
    title: 'Model Train Market - Listing Onboarding',
    description: 'AI-powered model train listing onboarding system',
    type: 'website',
    siteName: 'MTM Listings',
  },
  robots: {
    index: false,
    follow: false,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#800000',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
