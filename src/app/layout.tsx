import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { TooltipProvider } from '@/components/ui/tooltip';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'VYOMAI — AI Predictive Hardware Intelligence',
  description: 'Enterprise-grade AI platform for predictive hardware failure detection. Built for Dell AI Hackathon.',
  keywords: 'predictive maintenance, hardware failure, AI, enterprise, Dell, VYOMAI',
};

import { ThemeProvider } from '@/components/ThemeProvider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className={`${inter.className} antialiased selection:bg-blue-500/30`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <TooltipProvider>{children}</TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
