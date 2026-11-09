import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';
import Navbar from '@/components/Navbar';
import DailySyncReminderBanner from '@/components/DailySyncReminderBanner';
import DiyaBackground from '@/components/DiyaBackground';
import FooterViewCounter from '@/components/FooterViewCounter';
import DiwaliGreetingAnimation from '@/components/DiwaliGreetingAnimation';
import { ThemeProvider } from '@/components/ThemeProvider';
import BugReportButton from '@/components/BugReportButton';

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
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){
              try {
                var saved = localStorage.getItem('gdg_theme');
                var theme = saved === 'light' ? 'light' : 'dark';
                document.documentElement.classList.toggle('light', theme === 'light');
                document.documentElement.classList.toggle('dark', theme !== 'light');
                document.documentElement.setAttribute('data-theme', theme);
              } catch(e) {}
            })()`
          }}
        />
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
        <ThemeProvider>
          <DiyaBackground />
          <DiwaliGreetingAnimation />
          <div className="relative z-10 flex flex-col min-h-screen">
            <Navbar />
            <DailySyncReminderBanner />
            <main className="flex-1 w-full max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-10 py-8 pb-12 sm:pb-16">
              {children}
            </main>
            <footer className="footer-container border-t border-slate-800/80 py-6 sm:py-8 text-xs text-slate-400 transition-colors">
              <div className="w-full max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-10 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
                {/* Left: Copyright & Developer Link */}
                <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-slate-400 order-2 sm:order-1 text-center sm:text-left">
                  <span>© {new Date().getFullYear()} GDG Diwali Challenge.</span>
                  <span className="hidden sm:inline text-slate-600">•</span>
                  <Link
                    href="/developer"
                    className="font-medium text-amber-400/90 hover:text-amber-300 underline decoration-dotted transition-colors"
                  >
                    Meet the Man Behind
                  </Link>
                </div>

                {/* Center: Live FooterViewCounter */}
                <div className="order-3 sm:order-2">
                  <FooterViewCounter />
                </div>

                {/* Right: Bug Report Button (Bottom Right) */}
                <div className="order-1 sm:order-3 flex items-center justify-center sm:justify-end">
                  <BugReportButton />
                </div>
              </div>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}

