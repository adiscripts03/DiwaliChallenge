import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Github, Linkedin, Sparkles, Flame } from 'lucide-react';

export const metadata = {
  title: 'Website Team (Lone Wolf) | GDG Diwali Challenge',
  description: 'Meet the entire website team — all one of him.',
};

export default function DeveloperPage() {
  return (
    <div className="w-full flex-1 flex flex-col justify-center min-h-[calc(100vh-14rem)] py-2 sm:py-6">
      {/* Full-Page Hero Card */}
      <div className="w-full max-w-6xl mx-auto flex-1 flex flex-col justify-center relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#18120c]/95 via-[#140e09]/95 to-[#0d0a07]/95 border border-amber-900/40 p-8 sm:p-14 lg:p-16 shadow-2xl backdrop-blur-md">
        {/* Ambient warm glows */}
        <div className="absolute top-0 right-0 -translate-y-16 translate-x-16 w-[500px] h-[500px] bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 translate-y-16 -translate-x-16 w-[500px] h-[500px] bg-orange-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 sm:gap-14 lg:gap-16 my-auto">
          {/* Photo with Glowing Halo */}
          <div className="relative shrink-0 group">
            <div className="absolute -inset-2.5 bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-300 rounded-3xl blur-lg opacity-75 group-hover:opacity-100 transition duration-500" />
            <div className="relative w-60 h-72 sm:w-72 sm:h-88 md:w-80 md:h-[420px] rounded-3xl overflow-hidden border-2 border-amber-400/60 shadow-2xl bg-slate-900">
              <Image
                src="/images/aditya.jpg"
                alt="Aditya Singh"
                fill
                priority
                sizes="(max-width: 768px) 240px, 320px"
                className="object-cover object-center group-hover:scale-105 transition duration-500"
              />
            </div>
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-black/95 border border-amber-500/60 rounded-full text-xs sm:text-sm font-bold text-amber-300 shadow-xl whitespace-nowrap">
              🐺 The Entire Website Team
            </div>
          </div>

          {/* Details & Meme Banter */}
          <div className="flex-1 space-y-6 text-center md:text-left">
            <div>
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs sm:text-sm font-semibold mb-3">
                <Flame className="w-4 h-4 text-amber-400" />
                <span>Solo Architect & Developer</span>
              </div>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight flex items-center justify-center md:justify-start gap-3 flex-wrap">
                <span>&ldquo;Tech team ko bulao!&rdquo; 🗣️📢</span>
              </h1>
              <div className="mt-2 text-xl sm:text-2xl font-black text-amber-400">
                Aditya Singh
              </div>
            </div>

            <p className="text-sm sm:text-base lg:text-lg text-amber-100/80 leading-relaxed max-w-2xl">
              Agar website mast chal rahi hai toh credit <strong className="text-white font-extrabold">Aditya Singh</strong> ko, aur agar crash ho gayi toh LeetCode aur CodeChef ke servers pe case kar dena.
            </p>

            {/* Quick badges of solo execution */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-1 text-xs text-amber-200/70">
              <span className="px-3 py-1 rounded-lg bg-amber-950/40 border border-amber-900/40">Frontend</span>
              <span className="text-amber-500/40">•</span>
              <span className="px-3 py-1 rounded-lg bg-amber-950/40 border border-amber-900/40">Backend</span>
              <span className="text-amber-500/40">•</span>
              <span className="px-3 py-1 rounded-lg bg-amber-950/40 border border-amber-900/40">Design</span>
              <span className="text-amber-500/40">•</span>
              <span className="px-3 py-1 rounded-lg bg-amber-950/40 border border-amber-900/40">Platform Scrapers</span>
            </div>

            {/* Social Links */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3.5 pt-4">
              <a
                href="https://github.com/adiscripts03"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white hover:border-amber-400 hover:text-amber-300 hover:scale-105 transition-all text-sm font-semibold shadow-md"
              >
                <Github className="w-4 h-4 text-amber-400" />
                <span>GitHub</span>
              </a>

              <a
                href="https://www.linkedin.com/in/aditya-singh-80827935a/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-[#0077b5]/15 border border-[#0077b5]/40 text-blue-300 hover:border-blue-400 hover:text-white hover:scale-105 transition-all text-sm font-semibold shadow-md"
              >
                <Linkedin className="w-4 h-4 text-blue-400" />
                <span>LinkedIn</span>
              </a>

              <Link
                href="/"
                className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-300 hover:bg-amber-500/25 hover:text-white hover:scale-105 transition-all text-sm font-semibold shadow-md"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Leaderboard</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
