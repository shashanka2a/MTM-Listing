import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Export Queue | MTM Listings',
  description: 'Export approved listings to SixBit CSV/XML format',
};

export default function ExportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
