import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import DiyaBackground from '@/components/DiyaBackground';

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
      <body className="bg-[#0d0a07] text-[#fef3c7] min-h-screen flex flex-col selection:bg-amber-500/30 selection:text-amber-200 relative overflow-x-hidden">
        <DiyaBackground />
        <div className="relative z-10 flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
          <footer className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-400">
            <p>© {new Date().getFullYear()} GDG Diwali Challenge. Daily Competitive Programming Leaderboard.</p>
          </footer>
        </div>
      </body>
    </html>
  );
}

