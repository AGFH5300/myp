import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/features/auth/AuthProvider';

export const metadata: Metadata = {
  title: 'MYP eAssessment Practice',
  description: 'MYP eAssessment practice platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
