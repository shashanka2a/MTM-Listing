import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Review Listings | MTM Listings',
  description: 'Review and approve AI-generated listings',
};

export default function ReviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
