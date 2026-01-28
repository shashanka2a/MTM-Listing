import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Upload Photos | MTM Listings',
  description: 'Upload product photos for AI-powered listing generation',
};

export default function UploadLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
