import React from 'react';
import Link from 'next/link';
import { Bug, ArrowLeft, Shield, Sparkles } from 'lucide-react';
import BugReportForm from '@/components/BugReportForm';

export const metadata = {
  title: 'Report a Bug | GDG Diwali Challenge',
  description: 'Report an issue, score discrepancy, or glitch directly to Aditya Singh.',
};

export default function ReportBugPage() {
  return (
    <div className="w-full max-w-4xl mx-auto py-6 sm:py-10 space-y-6">
      {/* Breadcrumb / Back button */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center space-x-2 text-xs sm:text-sm font-semibold text-slate-400 hover:text-amber-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Leaderboard</span>
        </Link>

        <div className="flex items-center space-x-2 text-xs text-amber-400/90 font-medium">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Direct to Lead Developer</span>
        </div>
      </div>

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-600/10 border border-amber-500/30 p-6 sm:p-8 backdrop-blur-md shadow-2xl">
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <Bug className="w-3.5 h-3.5" />
              <span>Feedback & Bug Desk</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Report an Issue or Bug
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Found a problem with your solves, the rating cutoff rule (&lt; 800), platform scrapers, or layout? Explain it below and it will land straight in Aditya’s admin inbox.
            </p>
          </div>

          <div className="hidden lg:flex flex-col items-center p-3.5 rounded-2xl bg-slate-900/80 border border-amber-500/20 text-center shrink-0">
            <span className="text-2xl">⚡</span>
            <span className="text-xs font-bold text-amber-300 mt-1">Quick Fixes</span>
            <span className="text-[10px] text-slate-400">Owner-Reviewed</span>
          </div>
        </div>
      </div>

      {/* Form Container */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xl backdrop-blur-md">
        <BugReportForm />
      </div>
    </div>
  );
}

