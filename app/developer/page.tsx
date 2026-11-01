import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Github, Linkedin, Terminal, Sparkles, Flame, Code2, Coffee, Heart } from 'lucide-react';

export const metadata = {
  title: 'Developer | GDG Diwali Challenge',
  description: 'Meet Aditya Singh, the lone wolf behind the GDG Diwali Challenge platform.',
};

export default function DeveloperPage() {
  return (
    <div className="max-w-4xl mx-auto py-6 sm:py-12 space-y-10">
      {/* Hero Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#18120c]/95 via-[#140e09]/95 to-[#0d0a07]/95 border border-amber-900/40 p-8 sm:p-12 shadow-2xl backdrop-blur-md">
        {/* Warm glow accents */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-96 h-96 bg-orange-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 sm:gap-12 text-center md:text-left">
          {/* Developer Photo */}
          <div className="relative shrink-0 group">
            <div className="absolute -inset-1.5 bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-300 rounded-3xl blur-md opacity-70 group-hover:opacity-100 transition duration-500" />
            <div className="relative w-48 h-56 sm:w-56 sm:h-64 rounded-2xl overflow-hidden border-2 border-amber-400/50 shadow-2xl bg-slate-900">
              <Image
                src="/images/aditya.jpg"
                alt="Aditya Singh"
                fill
                priority
                sizes="(max-width: 768px) 192px, 224px"
                className="object-cover object-center group-hover:scale-105 transition duration-500"
              />
            </div>
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-4 px-3 py-1 bg-black/90 border border-amber-500/40 rounded-full text-[11px] font-semibold text-amber-300 shadow-lg whitespace-nowrap">
              🐺 Lone Wolf Dev
            </div>
          </div>

          {/* Details */}
          <div className="flex-1 space-y-4">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
              <Terminal className="w-3.5 h-3.5" />
              <span>Full-Stack Architect & Sole Maintainer</span>
            </div>

            <div>
              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                Aditya Singh
              </h1>
              <p className="mt-1 text-base sm:text-lg text-amber-300 font-medium italic">
                &ldquo;The Lone Wolf who built this entire platform on pure caffeine and Diwali spirit.&rdquo;
              </p>
            </div>

            <p className="text-sm sm:text-base text-amber-100/75 leading-relaxed max-w-xl">
              Solo engineered from zero to production: custom web scrapers bypassing platform firewalls, Neon PostgreSQL schema with live pooled connections, sub-second leaderboard reactivity, and festive Diwali UI for GDG IIITN.
            </p>

            {/* Social Links */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-3">
              <a
                href="https://github.com/adiscripts03"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white hover:border-amber-400 hover:text-amber-300 hover:scale-105 transition-all text-sm font-semibold shadow-md"
              >
                <Github className="w-4 h-4 text-amber-400" />
                <span>GitHub</span>
              </a>

              <a
                href="https://www.linkedin.com/in/aditya-singh-80827935a/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#0077b5]/15 border border-[#0077b5]/40 text-blue-300 hover:bg-[#0077b5]/25 hover:border-blue-400 hover:text-white hover:scale-105 transition-all text-sm font-semibold shadow-md"
              >
                <Linkedin className="w-4 h-4 text-blue-400" />
                <span>LinkedIn</span>
              </a>

              <Link
                href="/"
                className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-300 hover:bg-amber-500/25 hover:text-white hover:scale-105 transition-all text-sm font-semibold shadow-md"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Back to Leaderboard</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Behind the Scenes / Tech Stack Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#140e09]/80 border border-amber-900/30 rounded-2xl p-5 backdrop-blur-sm">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-3">
            <Code2 className="w-5 h-5" />
          </div>
          <h3 className="text-white font-bold text-base">Next.js 14 & Tailwind</h3>
          <p className="text-xs text-amber-100/60 mt-1.5 leading-relaxed">
            App Router architecture with high-performance responsive UI tailored to GDG IIITN&apos;s warm festive Diwali aesthetics.
          </p>
        </div>

        <div className="bg-[#140e09]/80 border border-amber-900/30 rounded-2xl p-5 backdrop-blur-sm">
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 mb-3">
            <Flame className="w-5 h-5" />
          </div>
          <h3 className="text-white font-bold text-base">Neon Serverless DB</h3>
          <p className="text-xs text-amber-100/60 mt-1.5 leading-relaxed">
            PostgreSQL instance with connection pooling capable of handling 500,000+ competitors with sub-millisecond query latency.
          </p>
        </div>

        <div className="bg-[#140e09]/80 border border-amber-900/30 rounded-2xl p-5 backdrop-blur-sm">
          <div className="w-10 h-10 rounded-xl bg-amber-600/10 border border-amber-600/20 flex items-center justify-center text-amber-500 mb-3">
            <Coffee className="w-5 h-5" />
          </div>
          <h3 className="text-white font-bold text-base">One-Man Army</h3>
          <p className="text-xs text-amber-100/60 mt-1.5 leading-relaxed">
            Designed, coded, debugged, deployed, and maintained single-handedly so freshers can enjoy their Diwali vacation coding sprint!
          </p>
        </div>
      </div>
    </div>
  );
}
