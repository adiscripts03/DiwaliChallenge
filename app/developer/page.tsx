import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Github, Linkedin, Sparkles, Heart } from 'lucide-react';

export const metadata = {
  title: 'The Lone Wolf | GDG Diwali Challenge',
  description: 'The one-man squad behind the GDG Diwali Challenge platform.',
};

export default function DeveloperPage() {
  return (
    <div className="max-w-2xl mx-auto py-8 sm:py-16 space-y-6">
      {/* Satirical Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#18120c]/95 via-[#140e09]/95 to-[#0d0a07]/95 border border-amber-900/40 p-8 sm:p-10 shadow-2xl backdrop-blur-md text-center">
        {/* Ambient glow */}
        <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-12 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center space-y-6">
          {/* Photo */}
          <div className="relative group">
            <div className="absolute -inset-1.5 bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-300 rounded-3xl blur-md opacity-75 group-hover:opacity-100 transition duration-300" />
            <div className="relative w-44 h-52 sm:w-52 sm:h-60 rounded-2xl overflow-hidden border-2 border-amber-400/60 shadow-2xl bg-slate-900">
              <Image
                src="/images/aditya.jpg"
                alt="Aditya Singh"
                fill
                priority
                sizes="(max-width: 768px) 176px, 208px"
                className="object-cover object-center group-hover:scale-105 transition duration-500"
              />
            </div>
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/90 border border-amber-500/40 rounded-full text-xs font-bold text-amber-300 shadow-lg whitespace-nowrap">
              🐺 The Lone Wolf
            </div>
          </div>

          {/* Name & Satirical Roast */}
          <div className="space-y-3 max-w-lg">
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Aditya Singh
            </h1>
            <p className="text-amber-400 font-semibold text-sm sm:text-base italic">
              &ldquo;I spent 14 hours automating this leaderboard so I wouldn&apos;t have to count your problems manually for 5 minutes.&rdquo;
            </p>
            <p className="text-xs sm:text-sm text-amber-100/70 leading-relaxed pt-1">
              Frontend dev, backend dev, DevOps engineer, bug creator, bug fixer, emotional support, and sole survivor. If something breaks, blame LeetCode. If it works, thank the lone wolf.
            </p>
          </div>

          {/* Socials & Back button */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <a
              href="https://github.com/adiscripts03"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white hover:border-amber-400 hover:text-amber-300 transition-all text-xs sm:text-sm font-semibold shadow-md"
            >
              <Github className="w-4 h-4 text-amber-400" />
              <span>GitHub</span>
            </a>

            <a
              href="https://www.linkedin.com/in/aditya-singh-80827935a/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-[#0077b5]/15 border border-[#0077b5]/40 text-blue-300 hover:border-blue-400 hover:text-white transition-all text-xs sm:text-sm font-semibold shadow-md"
            >
              <Linkedin className="w-4 h-4 text-blue-400" />
              <span>LinkedIn</span>
            </a>

            <Link
              href="/"
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-300 hover:bg-amber-500/25 hover:text-white transition-all text-xs sm:text-sm font-semibold shadow-md"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Leaderboard</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
