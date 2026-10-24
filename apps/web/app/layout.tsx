import type { Metadata } from 'next';
import { Newsreader } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

const newsreader = Newsreader({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-newsreader',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'The Gathering Co. — Anantapur Event Marketplace',
  description: 'Discover, compare, shortlist and book venues, caterers, decorators & photographers in Anantapur with The Gathering Co.',
  keywords: ['Anantapur wedding venues', 'Anantapur caterers', 'Anantapur photographers', 'The Gathering Co.', 'The Gathering Co Anantapur', 'Rayalaseema event planning'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={newsreader.variable} suppressHydrationWarning>
      <body
        className="antialiased min-h-screen flex flex-col justify-between selection:bg-rose-100 selection:text-rose-900"
        suppressHydrationWarning
      >
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
