import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';
import Navbar from '@/components/Navbar';
import DailySyncReminderBanner from '@/components/DailySyncReminderBanner';
import DiyaBackground from '@/components/DiyaBackground';
import FooterViewCounter from '@/components/FooterViewCounter';
import DiwaliGreetingAnimation from '@/components/DiwaliGreetingAnimation';

export const metadata: Metadata = {
  title: 'GDG Diwali Challenge | Competitive Programming Leaderboard',
  description: 'Real-time daily coding tracker across LeetCode, Codeforces, and CodeChef for GDG Diwali Challenge.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="preload"
          as="image"
          href="/images/lakshmi_ganesha_diwali.webp"
          type="image/webp"
          fetchPriority="high"
        />
        <link
          rel="preload"
          as="image"
          href="/images/aditya.webp"
          type="image/webp"
        />
      </head>
      <body className="bg-[#0d0a07] text-[#fef3c7] min-h-screen flex flex-col selection:bg-amber-500/30 selection:text-amber-200 relative overflow-x-hidden">
        <DiyaBackground />
        <DiwaliGreetingAnimation />
        <div className="relative z-10 flex flex-col min-h-screen">
          <Navbar />
          <DailySyncReminderBanner />
          <main className="flex-1 w-full max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-10 py-8">
            {children}
          </main>
          <footer className="border-t border-slate-800/80 py-8 text-center text-xs text-slate-400">
            <div className="flex flex-col items-center justify-center gap-3">
              <FooterViewCounter />
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-slate-400">
                <span>© {new Date().getFullYear()} GDG Diwali Challenge.</span>
                <span className="hidden sm:inline text-slate-600">•</span>
                <Link
                  href="/developer"
                  className="font-medium text-amber-400/90 hover:text-amber-300 underline decoration-dotted transition-colors"
                >
                  Made with love by Website Team (Lone wolf btw)
                </Link>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}

