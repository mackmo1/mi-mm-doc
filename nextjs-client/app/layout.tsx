/**
 * Root Layout
 * The main layout component for the entire application
 */

import type { Metadata, Viewport } from 'next';

import { Providers } from '@/components/providers';

import '@/styles/globals.scss';

/**
 * Metadata for the application
 */
export const metadata: Metadata = {
  title: 'Kh-doc - Documentation System',
  description: 'A hierarchical documentation management system',
  keywords: ['documentation', 'docs', 'knowledge base', 'wiki'],
  authors: [{ name: 'Kh-doc Team' }],
};

/**
 * Viewport configuration (must be separate from metadata in Next.js 14+)
 */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

/**
 * Root layout component
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Font Awesome for icons */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css"
          integrity="sha512-KfkfwYDsLkIlwQp6LFnl8zNdLGxu9YAA1QvwINks4PhcElQSvqcyVLLD9aMhXd13uQjoXtEKNosOWaZqXgel0g=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
