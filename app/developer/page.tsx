import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Github, Linkedin, Sparkles, Layout, Database, Palette, ShieldCheck, Flame } from 'lucide-react';

export const metadata = {
  title: 'Website Team (Lone Wolf) | GDG Diwali Challenge',
  description: 'Meet the entire website team — all one of him.',
};

export default function DeveloperPage() {
  const wings = [
    {
      title: 'Frontend Wing',
      icon: Layout,
      desc: 'Next.js 14, responsive mobile design, dynamic real-time podium, zero-slop dark Diwali aesthetic.',
    },
    {
      title: 'Backend Wing',
      icon: Database,
      desc: 'Neon Serverless PostgreSQL, Prisma ORM, sub-second query caching, pooled connections.',
    },
    {
      title: 'Design & UI Wing',
      icon: Palette,
      desc: 'Custom SVG Diya graphics, warm obsidian/amber palette, micro-interactions, clean typography.',
    },
    {
      title: 'Scraper & DevOps Wing',
      icon: ShieldCheck,
      desc: 'Custom scrapers for LeetCode, Codeforces & CodeChef bypassing bot walls with strict AC-only verification.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto py-8 sm:py-14 space-y-8">
      {/* Expanded Hero Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#18120c]/95 via-[#140e09]/95 to-[#0d0a07]/95 border border-amber-900/40 p-8 sm:p-12 shadow-2xl backdrop-blur-md">
        {/* Ambient warm glows */}
        <div className="absolute top-0 right-0 -translate-y-16 translate-x-16 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 translate-y-16 -translate-x-16 w-96 h-96 bg-orange-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 sm:gap-12">
          {/* Photo with Glowing Halo */}
          <div className="relative shrink-0 group">
            <div className="absolute -inset-2 bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-300 rounded-3xl blur-md opacity-75 group-hover:opacity-100 transition duration-300" />
            <div className="relative w-52 h-64 sm:w-60 sm:h-72 rounded-2xl overflow-hidden border-2 border-amber-400/60 shadow-2xl bg-slate-900">
              <Image
                src="/images/aditya.jpg"
                alt="Aditya Singh"
                fill
                priority
                sizes="(max-width: 768px) 208px, 240px"
                className="object-cover object-center group-hover:scale-105 transition duration-500"
              />
            </div>
            <div className="absolute -bottom-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-black/95 border border-amber-500/60 rounded-full text-xs font-bold text-amber-300 shadow-xl whitespace-nowrap">
              🐺 The Entire Website Team
            </div>
          </div>

          {/* Details & Meme Banter */}
          <div className="flex-1 space-y-4 text-center md:text-left">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold mb-2">
                <Flame className="w-3.5 h-3.5" />
                <span>Solo Architect & Developer</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight flex items-center justify-center md:justify-start gap-2 flex-wrap">
                <span>&ldquo;Tech team ko bulao!&rdquo; 🗣️📢</span>
              </h1>
            </div>

            <p className="text-amber-400 font-bold text-base sm:text-lg">
              Plot twist: Bhai poori team main hi hoon. 😭💀
            </p>

            <p className="text-sm sm:text-base text-amber-100/80 leading-relaxed max-w-xl">
              Agar website mast chal rahi hai toh credit <strong className="text-white">Aditya Singh</strong> ko, aur agar crash ho gayi toh LeetCode aur CodeChef ke servers pe case kar dena.
            </p>

            {/* Social Links */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-3">
              <a
                href="https://github.com/adiscripts03"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white hover:border-amber-400 hover:text-amber-300 transition-all text-xs sm:text-sm font-semibold shadow-md"
              >
                <Github className="w-4 h-4 text-amber-400" />
                <span>GitHub</span>
              </a>

              <a
                href="https://www.linkedin.com/in/aditya-singh-80827935a/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#0077b5]/15 border border-[#0077b5]/40 text-blue-300 hover:border-blue-400 hover:text-white transition-all text-xs sm:text-sm font-semibold shadow-md"
              >
                <Linkedin className="w-4 h-4 text-blue-400" />
                <span>LinkedIn</span>
              </a>

              <Link
                href="/"
                className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-300 hover:bg-amber-500/25 hover:text-white transition-all text-xs sm:text-sm font-semibold shadow-md"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Leaderboard</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Wings of the Website Section */}
      <div className="space-y-4">
        <div className="text-center md:text-left">
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center justify-center md:justify-start gap-2">
            <span>The 4 Wings of the Platform</span>
            <span className="text-xs font-semibold text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
              All Managed by 1 Guy
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Every layer from pixels to database queries — built solo from scratch.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {wings.map((wing) => {
            const Icon = wing.icon;
            return (
              <div
                key={wing.title}
                className="relative overflow-hidden rounded-2xl bg-[#140e09]/80 border border-amber-900/30 p-5 backdrop-blur-sm hover:border-amber-500/40 transition-colors group"
              >
                <div className="flex items-start space-x-3.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0 group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">{wing.title}</h3>
                    <p className="text-xs text-amber-100/70 mt-1 leading-relaxed">
                      {wing.desc}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
