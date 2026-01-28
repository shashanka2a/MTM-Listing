import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login | MTM Listings',
  description: 'Sign in to Model Train Market Listing Onboarding System',
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
