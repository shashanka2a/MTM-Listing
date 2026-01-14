import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Listing Onboarding Screen',
  description: 'Streamline your product listing onboarding process',
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'Listing Onboarding Screen',
    description: 'Streamline your product listing onboarding process',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
