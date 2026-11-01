'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Download, Sparkles, Trophy, Calendar, RefreshCw, CheckCircle2, Flame, ArrowLeft } from 'lucide-react';
import { toPng } from 'html-to-image';

export default function PosterPage() {
  const posterRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    if (!posterRef.current) return;
    setDownloading(true);
    try {
      const dataUrl = await toPng(posterRef.current, {
        pixelRatio: 3, // Ultra crisp high-res 300dpi export for Instagram & WhatsApp
        quality: 1,
      });
      const link = document.createElement('a');
      link.download = 'GDG_IIITN_Diwali_Challenge_Poster.png';
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export poster:', err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-6">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#140e09]/90 border border-amber-900/40 p-4 sm:px-6 rounded-2xl backdrop-blur-md">
        <div className="flex items-center space-x-3">
          <Link
            href="/"
            className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-base font-bold text-white">Diwali Challenge Poster</h1>
            <p className="text-xs text-amber-200/60">High-resolution export for Instagram, WhatsApp & Campus groups</p>
          </div>
        </div>

        <button
          onClick={handleDownload}
          disabled={downloading}
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-500/20 hover:scale-105 transition-all"
        >
          {downloading ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          <span>{downloading ? 'Rendering High-Res PNG...' : 'Download Poster (PNG)'}</span>
        </button>
      </div>

      {/* Poster Canvas (Aspect Ratio 9:16 ~ 1080 x 1920 Instagram Story / Poster Size) */}
      <div className="flex justify-center overflow-x-auto pb-8">
        <div
          ref={posterRef}
          className="w-[420px] sm:w-[460px] bg-gradient-to-b from-[#fff6e6] via-[#fffdf9] to-[#fff3e0] text-slate-900 shadow-2xl rounded-3xl overflow-hidden border-4 border-[#e6b450] relative select-none font-sans"
        >
          {/* Top Festive Header Artwork */}
          <div className="relative w-full h-72 sm:h-80 overflow-hidden bg-[#0d0714]">
            <Image
              src="/poster/diwali_hero.jpg"
              alt="Diwali Challenge Illustration"
              fill
              priority
              className="object-cover object-center filter contrast-105 brightness-95"
            />
            {/* Gradient overlays to smoothly transition into the cream poster body */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#fff6e6] via-transparent to-black/40" />

            {/* Subtle corner quotes */}
            <div className="absolute top-4 left-4 max-w-[140px] text-[10px] leading-tight font-serif italic text-amber-200/90 drop-shadow">
              &ldquo;Light up your logic, illuminate your rank.&rdquo;
            </div>
            <div className="absolute top-4 right-4 text-right max-w-[140px] text-[10px] leading-tight font-serif italic text-amber-200/90 drop-shadow">
              &ldquo;Code. Compete. Celebrate.&rdquo;
            </div>
          </div>

          {/* Main Content Body */}
          <div className="px-6 sm:px-7 -mt-10 relative z-10 space-y-4 pb-6">
            {/* Club Brand Card */}
            <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border-2 border-[#e7bc66] p-4 text-center space-y-2 relative">
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-white shadow-md border-2 border-[#e7bc66] flex items-center justify-center p-1.5">
                <Image
                  src="/poster/gdg_logo.png"
                  alt="GDG Logo"
                  width={36}
                  height={36}
                  className="object-contain"
                />
              </div>

              <div className="pt-4">
                <div className="text-[10px] font-black uppercase tracking-widest text-[#b87333]">
                  GDG ON CAMPUS IIITN
                </div>
                <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                  Competitive Programming & DSA Domain
                </div>
              </div>

              <div className="pt-1">
                <h2 className="text-2xl sm:text-3xl font-black text-[#6d1313] tracking-tight font-serif">
                  Diwali Challenge
                </h2>
                <div className="inline-block mt-0.5 px-3 py-0.5 rounded-full bg-amber-100 text-[#8a3b14] text-[11px] font-bold border border-amber-300/80">
                  Vacation Coding Sprint for Freshers 🚀
                </div>
              </div>

              <p className="text-[11px] text-slate-600 leading-snug px-2">
                Make your mini Diwali vacation count! Solve problems, rise through the global ranks, and prove your algorithmic might.
              </p>
            </div>

            {/* Platforms Tracked Box */}
            <div className="bg-white rounded-xl border border-amber-200/80 p-3 shadow-sm">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 text-center mb-2">
                Solve On Your Favourite Platforms
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-amber-50/60 border border-amber-200">
                  <span className="font-black text-xs text-amber-800">LeetCode</span>
                  <span className="text-[9px] text-slate-500 mt-0.5">AC Solves</span>
                </div>
                <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-blue-50/60 border border-blue-200">
                  <span className="font-black text-xs text-blue-900">Codeforces</span>
                  <span className="text-[9px] text-slate-500 mt-0.5">AC Solves</span>
                </div>
                <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-emerald-50/60 border border-emerald-200">
                  <span className="font-black text-xs text-emerald-900">CodeChef</span>
                  <span className="text-[9px] text-slate-500 mt-0.5">100 Pts AC</span>
                </div>
              </div>
            </div>

            {/* Highlights Grid */}
            <div className="grid grid-cols-2 gap-2 text-slate-800">
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/80 rounded-xl p-3 flex items-start space-x-2.5">
                <div className="w-7 h-7 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Trophy className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-[#8a3b14]">Top 3 Freshers Awarded</div>
                  <div className="text-[9px] text-slate-500 mt-0.5">Grand prizes and bragging rights after vacations!</div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/80 rounded-xl p-3 flex items-start space-x-2.5">
                <div className="w-7 h-7 rounded-lg bg-orange-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <RefreshCw className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-[#8a3b14]">Nightly Sync Routine</div>
                  <div className="text-[9px] text-slate-500 mt-0.5">Solve daily &amp; sync your profile every night.</div>
                </div>
              </div>
            </div>

            {/* Bottom Footer Info Strip */}
            <div className="bg-[#241305] text-amber-100 rounded-xl p-3 shadow-md flex items-center justify-between">
              <div>
                <div className="text-[10px] text-amber-400 font-extrabold uppercase tracking-wider">
                  Live Leaderboard &amp; Registration
                </div>
                <div className="text-xs font-mono font-bold text-white mt-0.5">
                  diwalichallenge.onrender.com
                </div>
              </div>
              <div className="px-2.5 py-1 bg-amber-500 text-slate-950 rounded-lg text-[10px] font-black uppercase tracking-wider">
                Freshers Only
              </div>
            </div>

            {/* Micro disclaimer */}
            <div className="text-center text-[9px] text-slate-500 font-medium">
              Organized by GDG IIITN • Dedicated to First Year B.Tech Students
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
