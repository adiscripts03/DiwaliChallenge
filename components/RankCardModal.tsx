'use client';

import React, { useRef, useState, useEffect } from 'react';
import {
  X,
  Download,
  Copy,
  Share2,
  Check,
  Trophy,
  Flame,
  Award,
  Sparkles,
  Sun,
  Moon,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import { toPng } from 'html-to-image';
import GDGLogo from '@/components/GDGLogo';

interface UserData {
  id: string;
  name: string;
  email: string;
  rank?: number;
  totalParticipants?: number;
  handles: {
    leetcode: string;
    codeforces: string;
    codechef: string;
  };
  stats: {
    totalSolved?: number;
    todaySolved: number;
    leetcode: number;
    codeforces: number;
    codechef: number;
    lastUpdated: string;
  };
}

interface RankCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserData;
}

/* =====================================================================
   Crisp Inline Platform SVGs (Ensures zero CORS / external asset issues)
   ===================================================================== */
function LeetCodeSVG({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-label="LeetCode">
      <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z" />
    </svg>
  );
}

function CodeforcesSVG({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-label="Codeforces">
      <rect x="2" y="10" width="5" height="11" rx="1.5" fill="#FFD400" />
      <rect x="9.5" y="4" width="5" height="17" rx="1.5" fill="#2188FF" />
      <rect x="17" y="7" width="5" height="14" rx="1.5" fill="#F85149" />
    </svg>
  );
}

function CodeChefSVG({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-label="CodeChef">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3 0 .75-.28 1.44-.75 1.97.94.58 1.63 1.54 1.73 2.68H8.02c.1-1.14.79-2.1 1.73-2.68A2.99 2.99 0 0 1 9 8c0-1.66 1.34-3 3-3zm5 12.5c0 .83-.67 1.5-1.5 1.5h-7c-.83 0-1.5-.67-1.5-1.5v-2h10v2z" />
    </svg>
  );
}

function DiyaBadgeSVG({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className}>
      {/* Flame Outer */}
      <path
        d="M32 6C32 6 22 18 22 26C22 31.5 26.5 36 32 36C37.5 36 42 31.5 42 26C42 18 32 6 32 6Z"
        fill="url(#diyaFlameOuter)"
      />
      {/* Flame Core */}
      <path
        d="M32 16C32 16 26 23 26 27C26 30.3 28.7 33 32 33C35.3 33 38 30.3 38 27C38 23 32 16 32 16Z"
        fill="#FEF08A"
      />
      {/* Diya Base Clay Bowl */}
      <path
        d="M12 36C12 36 14 54 32 54C50 54 52 36 52 36H12Z"
        fill="url(#diyaClay)"
        stroke="#92400E"
        strokeWidth="2"
      />
      {/* Diya Rim */}
      <ellipse cx="32" cy="36" rx="20" ry="3.5" fill="#D97706" />
      <ellipse cx="32" cy="36" rx="17" ry="2" fill="#FBBF24" />
      {/* Defs */}
      <defs>
        <linearGradient id="diyaFlameOuter" x1="32" y1="6" x2="32" y2="36" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F59E0B" />
          <stop offset="0.6" stopColor="#EA580C" />
          <stop offset="1" stopColor="#B91C1C" />
        </linearGradient>
        <linearGradient id="diyaClay" x1="32" y1="36" x2="32" y2="54" gradientUnits="userSpaceOnUse">
          <stop stopColor="#B45309" />
          <stop offset="1" stopColor="#78350F" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function RankCardModal({ isOpen, onClose, user }: RankCardModalProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = useState<'card' | 'certificate'>('card');
  const [themeMode, setThemeMode] = useState<'dark' | 'ivory'>('ivory'); // 'ivory' matches user reference
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [computedRank, setComputedRank] = useState<number>(user.rank || 1);
  const [computedTotal, setComputedTotal] = useState<number>(user.totalParticipants || 12);

  // If rank is missing or not provided, fetch from leaderboard API as fallback
  useEffect(() => {
    if (!user.rank) {
      fetch('/api/leaderboard')
        .then((r) => r.json())
        .then((d) => {
          if (d.leaderboard && Array.isArray(d.leaderboard)) {
            const foundIndex = d.leaderboard.findIndex((u: any) => u.id === user.id || u.name === user.name);
            if (foundIndex !== -1) {
              setComputedRank(foundIndex + 1);
            }
            setComputedTotal(d.leaderboard.length || 12);
          }
        })
        .catch(() => {});
    } else {
      setComputedRank(user.rank);
      if (user.totalParticipants) {
        setComputedTotal(user.totalParticipants);
      }
    }
  }, [user]);

  if (!isOpen) return null;

  const totalSolved = user.stats?.totalSolved ?? user.stats?.todaySolved ?? 0;
  const primaryHandle =
    user.handles?.leetcode?.trim() ||
    user.handles?.codeforces?.trim() ||
    user.handles?.codechef?.trim() ||
    user.name.toLowerCase().replace(/\s+/g, '');

  const cleanUserId = (user.id || '2026').replace(/^user_/, '').slice(-5).toUpperCase();
  const credentialId = `GDG-${cleanUserId}-DIWALI`;

  // Pre-fill LinkedIn share caption
  const generateLinkedInText = () => {
    return `🚀 Proud to share my achievement in the GDG Diwali Challenge organized by GDG IIITN! 🪔⚡

Over this vacation competitive programming sprint, I dedicated my break to leveling up my problem solving skills:
🏆 Final Leaderboard Rank: #${computedRank} (out of ${computedTotal} coders)
🔥 Total Questions Solved: ${totalSolved}
💻 Verified Platform Solves:
   • LeetCode: ${user.stats?.leetcode || 0}
   • Codeforces: ${user.stats?.codeforces || 0}
   • CodeChef: ${user.stats?.codechef || 0}

Huge thanks to GDG IIITN and Aditya Singh for organizing this engaging challenge and keeping our coding momentum strong!

Check out my verified rank card attached! 🎯

#GDGIIITN #CompetitiveProgramming #LeetCode #Codeforces #CodeChef #DSA #DiwaliChallenge #CodingSprint #IIITNagpur`;
  };

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(generateLinkedInText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy LinkedIn post:', err);
    }
  };

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setDownloading(true);

    try {
      // 2x pixel ratio for retina crystal clarity on LinkedIn & Twitter
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: false,
        pixelRatio: 2.5,
        backgroundColor: themeMode === 'ivory' ? '#faf7f2' : '#0d0a07',
      });

      const fileName = `${user.name.replace(/\s+/g, '_')}_GDG_Diwali_${
        viewMode === 'card' ? 'Rank_Card' : 'Certificate'
      }.png`;

      const link = document.createElement('a');
      link.download = fileName;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Error generating image:', err);
      alert('Unable to export image automatically. Please take a screenshot of your card!');
    } finally {
      setDownloading(false);
    }
  };

  const handleShareLinkedIn = () => {
    const url = 'https://diwalichallenge.onrender.com';
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    window.open(linkedinUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/80 backdrop-blur-md overflow-hidden animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[94vh] my-auto bg-[#140e0a] border border-amber-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-amber-900/40 bg-gradient-to-r from-[#1c130c] via-[#160f09] to-[#1c130c]">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <span>LinkedIn Rank Card & Certificate</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-wider">
                  Official
                </span>
              </h2>
              <p className="text-xs text-amber-200/70">
                Shareable achievement card for LinkedIn, Twitter, and WhatsApp
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar: View Switcher (Card vs Certificate) & Theme Switcher */}
        <div className="px-6 py-3 bg-[#110b07] border-b border-amber-900/30 flex flex-wrap items-center justify-between gap-3 text-xs font-bold">
          {/* Format selector */}
          <div className="flex items-center bg-black/40 p-1 rounded-xl border border-amber-900/40">
            <button
              onClick={() => setViewMode('card')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'card'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                  : 'text-amber-200/70 hover:text-white'
              }`}
            >
              <span>🪪 Codolio Rank Card</span>
            </button>
            <button
              onClick={() => setViewMode('certificate')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'certificate'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                  : 'text-amber-200/70 hover:text-white'
              }`}
            >
              <span>📜 Official Certificate</span>
            </button>
          </div>

          {/* Theme selector */}
          <div className="flex items-center bg-black/40 p-1 rounded-xl border border-amber-900/40">
            <button
              onClick={() => setThemeMode('ivory')}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg transition-all ${
                themeMode === 'ivory'
                  ? 'bg-white text-slate-900 shadow font-black'
                  : 'text-amber-200/70 hover:text-white'
              }`}
            >
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              <span>Ivory Light (Codolio Style)</span>
            </button>
            <button
              onClick={() => setThemeMode('dark')}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg transition-all ${
                themeMode === 'dark'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-black'
                  : 'text-amber-200/70 hover:text-white'
              }`}
            >
              <Moon className="w-3.5 h-3.5 text-amber-400" />
              <span>Diwali Dark Gold</span>
            </button>
          </div>
        </div>

        {/* Card Preview Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex items-center justify-center bg-[#090604] min-h-[520px]">
          {/* =========================================================================
              VIEW 1: CODOLIO-STYLE VERTICAL RANK CARD (Based exactly on user's image)
              ========================================================================= */}
          {viewMode === 'card' && (
            <div
              ref={cardRef}
              className={`w-full max-w-[430px] rounded-[36px] p-5 sm:p-6 transition-all shadow-2xl relative select-none ${
                themeMode === 'ivory'
                  ? 'bg-[#faf7f2] text-slate-900 border-2 border-[#ebdccb]'
                  : 'bg-gradient-to-b from-[#1b130c] via-[#120d09] to-[#0a0705] text-[#fef3c7] border-2 border-amber-500/40'
              }`}
              style={{
                boxShadow:
                  themeMode === 'ivory'
                    ? '0 25px 60px -15px rgba(217, 119, 6, 0.18), 0 0 0 1px #ebdccb'
                    : '0 25px 60px -15px rgba(245, 158, 11, 0.25), 0 0 30px rgba(245, 158, 11, 0.15)',
              }}
            >
              {/* Subtle Background Geometric Lines (like Codolio) */}
              <div
                className={`absolute inset-0 rounded-[36px] pointer-events-none opacity-40 ${
                  themeMode === 'ivory' ? 'bg-[radial-gradient(#ebdccb_1px,transparent_1px)]' : 'bg-[radial-gradient(#b45309_1px,transparent_1px)]'
                }`}
                style={{ backgroundSize: '18px 18px' }}
              />

              <div className="relative z-10 flex flex-col items-center">
                {/* Header: GDG IIITN Wordmark + CARD Subtitle */}
                <div className="w-full flex items-center justify-between pb-4">
                  <div className="flex flex-col">
                    <div className="flex items-center space-x-2">
                      <GDGLogo className="w-5 h-5 shrink-0" />
                      <span
                        className={`text-base font-black tracking-tight ${
                          themeMode === 'ivory' ? 'text-slate-900' : 'text-white'
                        }`}
                      >
                        GDG <span className="text-amber-500">IIITN</span>
                      </span>
                    </div>
                    <span
                      className={`text-[10px] font-black uppercase tracking-[0.25em] ml-7 ${
                        themeMode === 'ivory' ? 'text-slate-500' : 'text-amber-400/80'
                      }`}
                    >
                      CHALLENGE CARD
                    </span>
                  </div>

                  {/* Challenge Badge */}
                  <div
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold tracking-wide ${
                      themeMode === 'ivory'
                        ? 'bg-[#fef3c7] text-[#92400e] border border-[#fcd34d]'
                        : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    <span>Diwali 2026</span>
                  </div>
                </div>

                {/* Hero Avatar with Diya Badge (Codolio Owl Motif equivalent) */}
                <div className="relative mt-2 mb-3">
                  <div
                    className={`w-28 h-28 sm:w-32 sm:h-32 rounded-full p-1.5 shadow-xl flex items-center justify-center ${
                      themeMode === 'ivory'
                        ? 'bg-gradient-to-tr from-amber-400 via-orange-400 to-amber-200'
                        : 'bg-gradient-to-tr from-amber-500 via-orange-600 to-yellow-300'
                    }`}
                  >
                    <div
                      className={`w-full h-full rounded-full flex items-center justify-center font-black text-4xl sm:text-5xl shadow-inner ${
                        themeMode === 'ivory'
                          ? 'bg-gradient-to-tr from-amber-100 to-white text-amber-800'
                          : 'bg-gradient-to-tr from-[#25170d] to-[#160e08] text-amber-400'
                      }`}
                    >
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  </div>

                  {/* Overlapping Diya Mascot Sticker Badge (Bottom-Right of Avatar) */}
                  <div
                    className={`absolute -bottom-1 -right-1 w-10 h-10 rounded-full flex items-center justify-center shadow-lg border-2 ${
                      themeMode === 'ivory'
                        ? 'bg-[#fef3c7] border-white'
                        : 'bg-[#2a170b] border-amber-500/60'
                    }`}
                    title="Diwali Challenge Mascot"
                  >
                    <DiyaBadgeSVG className="w-7 h-7" />
                  </div>
                </div>

                {/* Participant Name & Verified Check */}
                <div className="flex items-center justify-center space-x-1.5 text-center mt-1">
                  <h3
                    className={`text-2xl sm:text-3xl font-black tracking-tight ${
                      themeMode === 'ivory' ? 'text-slate-900' : 'text-white'
                    }`}
                  >
                    {user.name}
                  </h3>
                  <div
                    className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-white shrink-0 shadow-sm"
                    title="Verified GDG IIITN Competitor"
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                </div>

                {/* Handle Pill (Codolio Style: @siddharthsingh) */}
                <div className="mt-1.5">
                  <span
                    className={`inline-block px-3.5 py-1 rounded-full text-xs sm:text-sm font-bold tracking-wide ${
                      themeMode === 'ivory'
                        ? 'bg-[#f5e6d3] text-[#854d0e] border border-[#ebdccb]'
                        : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    @{primaryHandle}
                  </span>
                </div>

                {/* Two Primary Metric Cards (Side by Side like Codolio) */}
                <div className="grid grid-cols-2 gap-3 w-full mt-5">
                  {/* Card 1: Questions Solved */}
                  <div
                    className={`p-4 rounded-2xl border text-center transition-all ${
                      themeMode === 'ivory'
                        ? 'bg-white border-[#ebdccb] shadow-sm'
                        : 'bg-[#18110b]/90 border-amber-500/25 shadow-lg'
                    }`}
                  >
                    <div
                      className={`text-[11px] sm:text-xs font-bold uppercase tracking-wider pb-1.5 border-b ${
                        themeMode === 'ivory'
                          ? 'text-[#b45309] border-[#f3e6d8]'
                          : 'text-amber-400 border-amber-900/40'
                      }`}
                    >
                      Questions Solved
                    </div>
                    <div
                      className={`text-3xl sm:text-4xl font-black mt-2 tracking-tight tabular-nums flex items-center justify-center gap-1.5 ${
                        themeMode === 'ivory' ? 'text-slate-900' : 'text-white'
                      }`}
                    >
                      <Flame className="w-6 h-6 text-amber-500 shrink-0" />
                      <span>{totalSolved}</span>
                    </div>
                  </div>

                  {/* Card 2: Challenge Rank */}
                  <div
                    className={`p-4 rounded-2xl border text-center transition-all ${
                      themeMode === 'ivory'
                        ? 'bg-white border-[#ebdccb] shadow-sm'
                        : 'bg-[#18110b]/90 border-amber-500/25 shadow-lg'
                    }`}
                  >
                    <div
                      className={`text-[11px] sm:text-xs font-bold uppercase tracking-wider pb-1.5 border-b ${
                        themeMode === 'ivory'
                          ? 'text-[#059669] border-[#e2efe9]'
                          : 'text-emerald-400 border-amber-900/40'
                      }`}
                    >
                      Challenge Rank
                    </div>
                    <div
                      className={`text-3xl sm:text-4xl font-black mt-2 tracking-tight tabular-nums flex items-center justify-center gap-1.5 ${
                        themeMode === 'ivory' ? 'text-slate-900' : 'text-amber-400'
                      }`}
                    >
                      <Trophy className="w-6 h-6 text-amber-500 shrink-0" />
                      <span>#{computedRank}</span>
                    </div>
                  </div>
                </div>

                {/* "You can find me on ..." Section (Codolio Style) */}
                <div
                  className={`w-full mt-3 p-3.5 rounded-2xl border ${
                    themeMode === 'ivory'
                      ? 'bg-white border-[#ebdccb]'
                      : 'bg-[#18110b]/70 border-amber-500/20'
                  }`}
                >
                  <div
                    className={`text-[11px] font-bold text-center mb-2.5 ${
                      themeMode === 'ivory' ? 'text-slate-600' : 'text-amber-200/80'
                    }`}
                  >
                    You can find me on ...
                  </div>

                  <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
                    {/* LeetCode */}
                    {user.handles?.leetcode?.trim() ? (
                      <div
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold ${
                          themeMode === 'ivory'
                            ? 'bg-[#fef3c7] text-[#92400e] border border-[#fde68a]'
                            : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        <LeetCodeSVG className="w-3.5 h-3.5 text-amber-500" />
                        <span>LC:</span>
                        <span className="font-mono">{user.stats?.leetcode || 0}</span>
                      </div>
                    ) : null}

                    {/* Codeforces */}
                    {user.handles?.codeforces?.trim() ? (
                      <div
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold ${
                          themeMode === 'ivory'
                            ? 'bg-[#eff6ff] text-[#1e40af] border border-[#bfdbfe]'
                            : 'bg-blue-500/15 text-blue-300 border border-blue-500/30'
                        }`}
                      >
                        <CodeforcesSVG className="w-3.5 h-3.5" />
                        <span>CF:</span>
                        <span className="font-mono">{user.stats?.codeforces || 0}</span>
                      </div>
                    ) : null}

                    {/* CodeChef */}
                    {user.handles?.codechef?.trim() ? (
                      <div
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold ${
                          themeMode === 'ivory'
                            ? 'bg-[#ecfdf5] text-[#065f46] border border-[#a7f3d0]'
                            : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                        }`}
                      >
                        <CodeChefSVG className="w-3.5 h-3.5 text-emerald-600" />
                        <span>CC:</span>
                        <span className="font-mono">{user.stats?.codechef || 0}</span>
                      </div>
                    ) : null}

                    {!user.handles?.leetcode && !user.handles?.codeforces && !user.handles?.codechef && (
                      <span className="text-xs text-slate-400">Competitive Programmer • GDG IIITN</span>
                    )}
                  </div>
                </div>

                {/* Hashtag Pills Section (Codolio Style: #JAVA #C++ #DSA #CP) */}
                <div className="flex flex-wrap gap-1.5 justify-center w-full mt-3">
                  {['#GDGIIITN', '#DiwaliSprint', '#CompetitiveProgramming', '#DSA', '#LeetCode', '#Codeforces', '#CodeChef'].map(
                    (tag) => (
                      <span
                        key={tag}
                        className={`px-2.5 py-0.5 rounded-lg text-[10px] sm:text-[11px] font-bold ${
                          themeMode === 'ivory'
                            ? 'bg-[#f1ebe1] text-[#715c48]'
                            : 'bg-[#22160d] text-amber-300/80 border border-amber-900/50'
                        }`}
                      >
                        {tag}
                      </span>
                    )
                  )}
                </div>

                {/* Verified Footer */}
                <div
                  className={`w-full mt-4 pt-3 border-t flex items-center justify-between text-[10px] font-semibold ${
                    themeMode === 'ivory'
                      ? 'border-[#ebdccb] text-slate-500'
                      : 'border-amber-900/40 text-amber-400/60'
                  }`}
                >
                  <div className="flex items-center space-x-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                    <span>GDG IIITN Verified</span>
                  </div>
                  <span className="font-mono">{credentialId}</span>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              VIEW 2: OFFICIAL LANDSCAPE CERTIFICATE OF MERIT & PARTICIPATION
              ========================================================================= */}
          {viewMode === 'certificate' && (
            <div
              ref={cardRef}
              className={`w-full max-w-[680px] aspect-[16/10] sm:aspect-[16/10] rounded-3xl p-6 sm:p-8 relative select-none flex flex-col justify-between shadow-2xl ${
                themeMode === 'ivory'
                  ? 'bg-[#fffdf9] text-slate-900 border-8 border-double border-[#d97706]'
                  : 'bg-gradient-to-br from-[#1c1209] via-[#100a06] to-[#0d0805] text-[#fef3c7] border-8 border-double border-amber-500/60'
              }`}
              style={{
                boxShadow:
                  themeMode === 'ivory'
                    ? '0 20px 50px -10px rgba(180, 83, 9, 0.2)'
                    : '0 20px 50px -10px rgba(245, 158, 11, 0.3), 0 0 40px rgba(245, 158, 11, 0.1)',
              }}
            >
              {/* Certificate Inner Border */}
              <div
                className={`absolute inset-3 rounded-2xl border pointer-events-none ${
                  themeMode === 'ivory' ? 'border-[#ecd2b0]' : 'border-amber-500/25'
                }`}
              />

              {/* Certificate Top Header */}
              <div className="relative z-10 flex items-center justify-between border-b pb-3 border-amber-500/20">
                <div className="flex items-center space-x-3">
                  <GDGLogo className="w-8 h-8 shrink-0" />
                  <div>
                    <h4 className="text-sm sm:text-base font-black tracking-tight uppercase">
                      Google Developer Groups • IIIT Nagpur
                    </h4>
                    <p className="text-[10px] text-amber-500 font-bold tracking-wider uppercase">
                      Diwali Vacation Long Challenge (2026)
                    </p>
                  </div>
                </div>

                <div
                  className={`text-right text-[10px] font-mono font-bold ${
                    themeMode === 'ivory' ? 'text-slate-500' : 'text-amber-300/70'
                  }`}
                >
                  <div>ID: {credentialId}</div>
                  <div>Status: Verified Final</div>
                </div>
              </div>

              {/* Certificate Main Body */}
              <div className="relative z-10 text-center my-auto py-2">
                <div
                  className={`text-[11px] sm:text-xs font-black uppercase tracking-[0.3em] mb-1 ${
                    themeMode === 'ivory' ? 'text-[#b45309]' : 'text-amber-400'
                  }`}
                >
                  Certificate of Achievement & Merit
                </div>
                <div className="text-xs text-slate-500 italic mb-2">This is proudly presented to</div>

                {/* Candidate Name */}
                <h2
                  className={`text-3xl sm:text-4xl font-black tracking-tight ${
                    themeMode === 'ivory' ? 'text-slate-900' : 'text-white'
                  }`}
                >
                  {user.name}
                </h2>

                <p
                  className={`mt-2 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed ${
                    themeMode === 'ivory' ? 'text-slate-700' : 'text-amber-100/80'
                  }`}
                >
                  for exceptional performance in the vacation competitive programming challenge, securing{' '}
                  <strong className="text-amber-500 font-black">Rank #{computedRank}</strong> with{' '}
                  <strong className="text-amber-500 font-black">{totalSolved} verified problems solved</strong> across
                  LeetCode, Codeforces, and CodeChef.
                </p>

                {/* Stat Badges in Certificate */}
                <div className="flex items-center justify-center gap-4 mt-3">
                  <div
                    className={`px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 ${
                      themeMode === 'ivory' ? 'bg-[#fef3c7] text-[#92400e]' : 'bg-amber-500/20 text-amber-300'
                    }`}
                  >
                    <Trophy className="w-3.5 h-3.5 text-amber-500" />
                    <span>Rank #{computedRank}</span>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 ${
                      themeMode === 'ivory' ? 'bg-[#ffedd5] text-[#9a3412]' : 'bg-orange-500/20 text-orange-300'
                    }`}
                  >
                    <Flame className="w-3.5 h-3.5 text-orange-500" />
                    <span>{totalSolved} Solved</span>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 ${
                      themeMode === 'ivory' ? 'bg-[#ecfdf5] text-[#065f46]' : 'bg-emerald-500/20 text-emerald-300'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>100% Verified</span>
                  </div>
                </div>
              </div>

              {/* Certificate Bottom Signatures & Seal */}
              <div className="relative z-10 flex items-end justify-between border-t pt-3 border-amber-500/20 text-xs">
                {/* Signature 1 */}
                <div className="text-left">
                  <div className="font-serif italic text-base sm:text-lg text-amber-500 font-bold tracking-wide">
                    Aditya Singh
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium">Lead Organizer • GDG IIITN</div>
                </div>

                {/* Center Golden Seal */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full border-2 border-dashed flex items-center justify-center shadow-lg ${
                      themeMode === 'ivory'
                        ? 'bg-[#fef3c7] border-[#d97706] text-[#b45309]'
                        : 'bg-amber-500/20 border-amber-400 text-amber-300'
                    }`}
                  >
                    <Award className="w-6 h-6 text-amber-500" />
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-wider text-amber-500 mt-1">
                    Official Merit Seal
                  </span>
                </div>

                {/* Date & Campus */}
                <div className="text-right text-[10px] text-slate-500">
                  <div className="font-bold text-slate-400">November 2026</div>
                  <div>IIIT Nagpur Campus</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Action Footer */}
        <div className="p-4 sm:p-6 bg-[#160f0a] border-t border-amber-900/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2 text-xs text-amber-200/80 text-center sm:text-left">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>High-resolution PNG export, optimized for LinkedIn feed and mobile sharing!</span>
          </div>

          <div className="flex items-center flex-wrap justify-end gap-2.5 w-full sm:w-auto">
            {/* Copy LinkedIn Text */}
            <button
              onClick={handleCopyText}
              type="button"
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm border transition-all ${
                copied
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                  : 'bg-white/5 border-amber-500/30 text-amber-300 hover:bg-white/10'
              }`}
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied Caption!' : 'Copy LinkedIn Post Text'}</span>
            </button>

            {/* Direct LinkedIn Share */}
            <button
              onClick={handleShareLinkedIn}
              type="button"
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-[#0077b5]/20 hover:bg-[#0077b5]/30 text-[#38bdf8] border border-[#0077b5]/40 transition-all"
            >
              <Share2 className="w-4 h-4" />
              <span>Share on LinkedIn</span>
            </button>

            {/* Download HD Image Button */}
            <button
              onClick={handleDownload}
              disabled={downloading}
              type="button"
              className="flex items-center space-x-2 px-6 py-2.5 rounded-xl font-black text-xs sm:text-sm bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-lg shadow-amber-500/25 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              <Download className={`w-4 h-4 ${downloading ? 'animate-bounce' : ''}`} />
              <span>{downloading ? 'Exporting HD PNG...' : 'Download HD Image (PNG)'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
