import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Github, Linkedin, Sparkles, Flame, Bug } from 'lucide-react';

export const metadata = {
  title: 'Meet the Man Behind | GDG Diwali Challenge',
  description: 'Meet the solo developer behind the GDG Diwali Challenge platform.',
};

export default function DeveloperPage() {
  return (
    <div className="w-full flex-1 flex flex-col justify-center min-h-[calc(100vh-14rem)] py-2 sm:py-6">
      {/* Full-Page Hero Card */}
      <div className="developer-hero-card w-full mx-auto flex-1 flex flex-col justify-center relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#18120c]/95 via-[#140e09]/95 to-[#0d0a07]/95 border border-amber-900/40 p-8 sm:p-14 lg:p-20 shadow-2xl backdrop-blur-md">
        {/* Ambient warm glows */}
        <div className="absolute top-0 right-0 -translate-y-16 translate-x-16 w-[600px] h-[600px] bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 translate-y-16 -translate-x-16 w-[600px] h-[600px] bg-orange-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10 sm:gap-14 lg:gap-20 my-auto">
          {/* Photo with Glowing Halo */}
          <div className="relative shrink-0 group">
            <div className="absolute -inset-3 bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-300 rounded-3xl blur-xl opacity-80 group-hover:opacity-100 transition duration-500" />
            <div className="relative w-72 h-88 sm:w-88 sm:h-[440px] md:w-[380px] md:h-[500px] lg:w-[460px] lg:h-[580px] xl:w-[500px] xl:h-[640px] rounded-3xl overflow-hidden border-2 border-amber-400/70 shadow-2xl shadow-amber-500/20 bg-slate-900">
              <Image
                src="/images/aditya.webp"
                alt="Aditya Singh"
                fill
                priority
                unoptimized
                sizes="(max-width: 768px) 320px, (max-width: 1200px) 460px, 500px"
                className="object-cover object-center group-hover:scale-105 transition duration-500"
              />
            </div>
            <div className="dev-team-pill absolute -bottom-5 left-1/2 -translate-x-1/2 px-6 py-2.5 bg-black/95 border border-amber-400/80 rounded-full text-sm sm:text-base font-black text-amber-300 shadow-2xl whitespace-nowrap tracking-wide">
              🐺 The Entire Website Team
            </div>
          </div>

          {/* Details & Meme Banter */}
          <div className="flex-1 space-y-7 text-center lg:text-left">
            <div>
              <div className="inline-flex items-center space-x-2.5 px-4 py-2 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-sm sm:text-base font-bold mb-4 shadow-sm">
                <Flame className="w-5 h-5 text-amber-400" />
                <span>Solo Architect & Developer</span>
              </div>
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight flex items-center justify-center lg:justify-start gap-3 flex-wrap leading-tight">
                <span>&ldquo;Tech team ko bulao!&rdquo; 🗣️📢</span>
              </h1>
              <div className="mt-3 text-2xl sm:text-4xl lg:text-5xl font-black text-amber-400 tracking-tight">
                Aditya Singh
              </div>
            </div>

            <p className="text-base sm:text-xl lg:text-2xl text-amber-100/90 leading-relaxed max-w-3xl font-medium">
              Agar website mast chal rahi hai toh credit <strong className="text-white font-black underline decoration-amber-400 decoration-2 underline-offset-4">Aditya Singh</strong> ko, aur agar crash ho gayi toh LeetCode aur CodeChef ke servers pe case kar dena.
            </p>

            {/* Quick badges of solo execution */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 pt-2 text-xs sm:text-sm font-bold text-amber-200/90">
              <span className="px-4 py-2 rounded-xl bg-amber-950/60 border border-amber-500/30 shadow-sm">Frontend</span>
              <span className="text-amber-500/40">•</span>
              <span className="px-4 py-2 rounded-xl bg-amber-950/60 border border-amber-500/30 shadow-sm">Backend</span>
              <span className="text-amber-500/40">•</span>
              <span className="px-4 py-2 rounded-xl bg-amber-950/60 border border-amber-500/30 shadow-sm">Design</span>
              <span className="text-amber-500/40">•</span>
              <span className="px-4 py-2 rounded-xl bg-amber-950/60 border border-amber-500/30 shadow-sm">Platform Scrapers</span>
            </div>

            {/* Social Links */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
              <a
                href="https://github.com/adiscripts03"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2.5 px-7 py-4 rounded-2xl bg-slate-900/90 border border-slate-700/80 text-white hover:border-amber-400 hover:text-amber-300 hover:scale-105 transition-all text-base sm:text-lg font-bold shadow-lg"
              >
                <Github className="w-5 h-5 text-amber-400" />
                <span>GitHub</span>
              </a>

              <a
                href="https://www.linkedin.com/in/aditya-singh-80827935a/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2.5 px-7 py-4 rounded-2xl bg-[#0077b5]/15 border border-[#0077b5]/40 text-blue-300 hover:border-blue-400 hover:text-white hover:scale-105 transition-all text-base sm:text-lg font-bold shadow-lg"
              >
                <Linkedin className="w-5 h-5 text-blue-400" />
                <span>LinkedIn</span>
              </a>

              <Link
                href="/"
                className="inline-flex items-center space-x-2.5 px-7 py-4 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-amber-300 hover:bg-amber-500/25 hover:text-white hover:scale-105 transition-all text-base sm:text-lg font-bold shadow-lg"
              >
                <Sparkles className="w-5 h-5 text-amber-400" />
                <span>Leaderboard</span>
              </Link>

              <Link
                href="/report-bug"
                className="inline-flex items-center space-x-2.5 px-7 py-4 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-rose-300 hover:bg-rose-500/25 hover:text-white hover:scale-105 transition-all text-base sm:text-lg font-bold shadow-lg"
              >
                <Bug className="w-5 h-5 text-rose-400" />
                <span>Report a Bug</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
