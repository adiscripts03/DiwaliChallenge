'use client';

import React, { useRef, useState, useEffect } from 'react';
import {
  X,
  Download,
  Copy,
  Check,
  Trophy,
  Flame,
  Sparkles,
  Sun,
  Moon,
  ShieldCheck,
  Code2,
  ExternalLink,
  Image as ImageIcon,
} from 'lucide-react';
import { toPng, toBlob } from 'html-to-image';
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
   Crisp Inline SVGs (Zero CORS / External Asset Issues)
   ===================================================================== */
function LeetCodeSVG({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-label="LeetCode">
      <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z" />
    </svg>
  );
}

function CodeforcesSVG({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-label="Codeforces">
      <rect x="2" y="10" width="5" height="11" rx="1.5" fill="#FFD400" />
      <rect x="9.5" y="4" width="5" height="17" rx="1.5" fill="#2188FF" />
      <rect x="17" y="7" width="5" height="14" rx="1.5" fill="#F85149" />
    </svg>
  );
}

function CodeChefSVG({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-label="CodeChef">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3 0 .75-.28 1.44-.75 1.97.94.58 1.63 1.54 1.73 2.68H8.02c.1-1.14.79-2.1 1.73-2.68A2.99 2.99 0 0 1 9 8c0-1.66 1.34-3 3-3zm5 12.5c0 .83-.67 1.5-1.5 1.5h-7c-.83 0-1.5-.67-1.5-1.5v-2h10v2z" />
    </svg>
  );
}

function LinkedInSVG({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-label="LinkedIn">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.35a1.64 1.64 0 1 0 0 3.28 1.64 1.64 0 0 0 0-3.28" />
    </svg>
  );
}

function DiyaBadgeSVG({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className}>
      <path
        d="M32 6C32 6 22 18 22 26C22 31.5 26.5 36 32 36C37.5 36 42 31.5 42 26C42 18 32 6 32 6Z"
        fill="url(#diyaFlameOuterModal)"
      />
      <path
        d="M32 16C32 16 26 23 26 27C26 30.3 28.7 33 32 33C35.3 33 38 30.3 38 27C38 23 32 16 32 16Z"
        fill="#FEF08A"
      />
      <path
        d="M12 36C12 36 14 54 32 54C50 54 52 36 52 36H12Z"
        fill="url(#diyaClayModal)"
        stroke="#92400E"
        strokeWidth="2"
      />
      <ellipse cx="32" cy="36" rx="20" ry="3.5" fill="#D97706" />
      <ellipse cx="32" cy="36" rx="17" ry="2" fill="#FBBF24" />
      <defs>
        <linearGradient id="diyaFlameOuterModal" x1="32" y1="6" x2="32" y2="36" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F59E0B" />
          <stop offset="0.6" stopColor="#EA580C" />
          <stop offset="1" stopColor="#B91C1C" />
        </linearGradient>
        <linearGradient id="diyaClayModal" x1="32" y1="36" x2="32" y2="54" gradientUnits="userSpaceOnUse">
          <stop stopColor="#B45309" />
          <stop offset="1" stopColor="#78350F" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function RankCardModal({ isOpen, onClose, user }: RankCardModalProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [themeMode, setThemeMode] = useState<'ivory' | 'dark'>('ivory');
  const [downloading, setDownloading] = useState(false);
  const [sharingLinkedIn, setSharingLinkedIn] = useState(false);
  const [copyingImage, setCopyingImage] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [copiedImageSuccess, setCopiedImageSuccess] = useState(false);
  const [showShareGuide, setShowShareGuide] = useState(false);
  const [computedRank, setComputedRank] = useState<number>(user.rank || 1);
  const [computedTotal, setComputedTotal] = useState<number>(user.totalParticipants || 12);

  // Fallback rank calculation from leaderboard if missing
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
  const rawLc = user.stats?.leetcode || 0;
  const rawCf = user.stats?.codeforces || 0;
  const rawCc = user.stats?.codechef || 0;

  const hasLc = Boolean(user.handles?.leetcode?.trim());
  const hasCf = Boolean(user.handles?.codeforces?.trim());
  const hasCc = Boolean(user.handles?.codechef?.trim());

  // Resolve platform solve counts:
  // If only 1 platform is connected and totalSolved > 0 while breakdown is 0, all solves belong to that platform!
  let resolvedLc = rawLc;
  let resolvedCf = rawCf;
  let resolvedCc = rawCc;

  const connectedList = [
    hasLc ? 'leetcode' : null,
    hasCf ? 'codeforces' : null,
    hasCc ? 'codechef' : null,
  ].filter(Boolean);

  if (resolvedLc === 0 && resolvedCf === 0 && resolvedCc === 0 && totalSolved > 0) {
    if (connectedList.length === 1) {
      if (hasLc) resolvedLc = totalSolved;
      else if (hasCf) resolvedCf = totalSolved;
      else if (hasCc) resolvedCc = totalSolved;
    }
  }

  // Active connected platforms to display on card
  const platformsToDisplay = [
    hasLc
      ? {
          key: 'leetcode',
          name: 'LeetCode',
          handle: user.handles.leetcode.trim(),
          count: resolvedLc,
          icon: LeetCodeSVG,
          color: 'text-amber-500',
          border: themeMode === 'ivory' ? 'border-[#fde68a]' : 'border-amber-500/30',
          bg: themeMode === 'ivory' ? 'bg-[#fef9f2]' : 'bg-[#22170f]',
        }
      : null,
    hasCf
      ? {
          key: 'codeforces',
          name: 'Codeforces',
          handle: user.handles.codeforces.trim(),
          count: resolvedCf,
          icon: CodeforcesSVG,
          color: 'text-blue-500',
          border: themeMode === 'ivory' ? 'border-[#bfdbfe]' : 'border-blue-500/30',
          bg: themeMode === 'ivory' ? 'bg-[#f0f6ff]' : 'bg-[#121c29]',
        }
      : null,
    hasCc
      ? {
          key: 'codechef',
          name: 'CodeChef',
          handle: user.handles.codechef.trim(),
          count: resolvedCc,
          icon: CodeChefSVG,
          color: 'text-emerald-500',
          border: themeMode === 'ivory' ? 'border-[#a7f3d0]' : 'border-emerald-500/30',
          bg: themeMode === 'ivory' ? 'bg-[#f0fdf4]' : 'bg-[#0f241a]',
        }
      : null,
  ].filter(Boolean) as Array<{
    key: string;
    name: string;
    handle: string;
    count: number;
    icon: (props: { className?: string }) => React.JSX.Element;
    color: string;
    border: string;
    bg: string;
  }>;

  // Platform question data is available if at least one platform count is > 0
  const hasPlatformSolvesData = platformsToDisplay.some((p) => p.count > 0);

  const primaryHandle =
    user.handles?.leetcode?.trim() ||
    user.handles?.codeforces?.trim() ||
    user.handles?.codechef?.trim() ||
    user.name.toLowerCase().replace(/\s+/g, '');

  const cleanUserId = (user.id || '2026').replace(/^user_/, '').slice(-5).toUpperCase();
  const credentialId = `GDG-${cleanUserId}-FINAL`;

  // Pre-fill LinkedIn share caption with platform-by-platform question breakdown (if available) and rank after challenge
  const generateLinkedInText = () => {
    let platformLines = '';
    if (hasPlatformSolvesData) {
      const lines: string[] = [];
      platformsToDisplay.forEach((p) => {
        if (p.count > 0) {
          lines.push(`   • ${p.name}: ${p.count} questions solved (@${p.handle})`);
        }
      });
      if (lines.length > 0) {
        platformLines = `\n📊 Platform Breakdown:\n${lines.join('\n')}\n`;
      }
    } else if (platformsToDisplay.length > 0) {
      const handlesList = platformsToDisplay.map((p) => `${p.name} (@${p.handle})`).join(', ');
      platformLines = `\n🎯 Active Platforms: ${handlesList}\n`;
    }

    return `🚀 Proud to share my final standing in the GDG Diwali Challenge organized by GDG IIITN! 🪔⚡

The vacation competitive programming challenge has officially concluded:
🏆 Rank After Challenge: #${computedRank} (out of ${computedTotal} coders)
🔥 Total Questions Solved: ${totalSolved}
${platformLines}
Huge thanks to GDG IIITN and Aditya Singh for organizing such an engaging competitive programming challenge and keeping our coding momentum strong!

Check out my verified rank card attached below! 🎯

#GDGIIITN #CompetitiveProgramming #LeetCode #Codeforces #CodeChef #DSA #DiwaliChallenge #CodingSprint #IIITNagpur`;
  };

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(generateLinkedInText());
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2500);
    } catch (err) {
      console.error('Failed to copy LinkedIn post:', err);
    }
  };

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setDownloading(true);

    try {
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: false,
        pixelRatio: 2.5,
        backgroundColor: themeMode === 'ivory' ? '#faf7f2' : '#0d0a07',
      });

      const fileName = `${user.name.replace(/\s+/g, '_')}_GDG_Diwali_Rank_Card.png`;
      const link = document.createElement('a');
      link.download = fileName;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Error generating image:', err);
      alert('Unable to export image automatically. Please take a screenshot of your card!');
    } finally {
      setDownloading(false);
    }
  };

  const handleCopyImage = async () => {
    if (!cardRef.current) return;
    setCopyingImage(true);

    try {
      const blob = await toBlob(cardRef.current, {
        pixelRatio: 2.5,
        backgroundColor: themeMode === 'ivory' ? '#faf7f2' : '#0d0a07',
      });

      if (!blob) throw new Error('Blob generation failed');

      if (typeof ClipboardItem !== 'undefined' && navigator.clipboard && navigator.clipboard.write) {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob }),
        ]);
        setCopiedImageSuccess(true);
        setTimeout(() => setCopiedImageSuccess(false), 3000);
      } else {
        // Fallback: download the image
        handleDownload();
      }
    } catch (err) {
      console.error('Copy image error:', err);
      handleDownload();
    } finally {
      setCopyingImage(false);
    }
  };

  // Direct LinkedIn Sharing:
  // Instead of passing website URL to LinkedIn offsite sharer (which attaches website preview),
  // this flow downloads the rank card image, copies the caption text, and opens LinkedIn's post composer!
  const handleShareLinkedIn = async () => {
    if (!cardRef.current) return;
    setSharingLinkedIn(true);

    try {
      const blob = await toBlob(cardRef.current, {
        pixelRatio: 2.5,
        backgroundColor: themeMode === 'ivory' ? '#faf7f2' : '#0d0a07',
      });

      if (!blob) throw new Error('Blob generation failed');

      const fileName = `${user.name.replace(/\s+/g, '_')}_GDG_Diwali_Rank_Card.png`;
      const file = new File([blob], fileName, { type: 'image/png' });

      // 1. Mobile & Web Share API support:
      // If browser can share files directly, open native share sheet (attaches actual image)
      if (
        typeof navigator !== 'undefined' &&
        navigator.canShare &&
        navigator.canShare({ files: [file] })
      ) {
        try {
          await navigator.share({
            title: `${user.name}'s GDG Diwali Challenge Rank Card`,
            text: generateLinkedInText(),
            files: [file],
          });
          return;
        } catch (shareErr: any) {
          if (shareErr.name === 'AbortError') return;
        }
      }

      // 2. Desktop Flow:
      // A. Auto-download the high-res card PNG so user has it immediately
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = fileName;
      link.href = downloadUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(downloadUrl), 5000);

      // B. Copy celebration post text to clipboard
      await navigator.clipboard.writeText(generateLinkedInText());

      // C. Also copy image blob to clipboard if supported (allows direct Cmd+V / Ctrl+V in LinkedIn!)
      try {
        if (typeof ClipboardItem !== 'undefined' && navigator.clipboard && navigator.clipboard.write) {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob }),
          ]);
        }
      } catch {}

      // D. Open LinkedIn post composer (Start a Post dialog, NOT the website preview URL!)
      window.open('https://www.linkedin.com/feed/?shareActive=true', '_blank', 'noopener,noreferrer');

      // E. Show guide banner in modal
      setShowShareGuide(true);
    } catch (err) {
      console.error('LinkedIn share error:', err);
      handleDownload();
      handleCopyText();
      window.open('https://www.linkedin.com/feed/?shareActive=true', '_blank', 'noopener,noreferrer');
      setShowShareGuide(true);
    } finally {
      setSharingLinkedIn(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md overflow-hidden animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[94vh] my-auto bg-[#140e0a] border border-amber-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-amber-900/40 bg-gradient-to-r from-[#1c130c] via-[#160f09] to-[#1c130c]">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <span>LinkedIn Rank Card</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-wider">
                  Final Standing
                </span>
              </h2>
              <p className="text-xs text-amber-200/70">
                Official shareable achievement card with verified platform question counts
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

        {/* Toolbar: Theme Switcher */}
        <div className="px-6 py-3 bg-[#110b07] border-b border-amber-900/30 flex items-center justify-between text-xs font-bold">
          <div className="text-amber-200/80 font-medium">Card Theme:</div>
          <div className="flex items-center bg-black/40 p-1 rounded-xl border border-amber-900/40">
            <button
              onClick={() => setThemeMode('ivory')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all ${
                themeMode === 'ivory'
                  ? 'bg-white text-slate-900 shadow font-black'
                  : 'text-amber-200/70 hover:text-white'
              }`}
            >
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              <span>Ivory Light</span>
            </button>
            <button
              onClick={() => setThemeMode('dark')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all ${
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
        <div className="flex-1 overflow-y-auto p-3 sm:p-5 flex items-start justify-center bg-[#090604]">
          <div
            ref={cardRef}
            className={`w-full max-w-[390px] sm:max-w-[405px] rounded-[28px] p-4 sm:p-5 transition-all shadow-2xl relative select-none my-auto ${
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
            {/* Subtle Background Pattern */}
            <div
              className={`absolute inset-0 rounded-[28px] pointer-events-none opacity-40 ${
                themeMode === 'ivory'
                  ? 'bg-[radial-gradient(#ebdccb_1px,transparent_1px)]'
                  : 'bg-[radial-gradient(#b45309_1px,transparent_1px)]'
              }`}
              style={{ backgroundSize: '18px 18px' }}
            />

            <div className="relative z-10 flex flex-col items-center">
              {/* Header: GDG IIITN Wordmark + CHALLENGE RANK CARD Subtitle */}
              <div className="w-full flex items-center justify-between pb-2.5 border-b border-amber-500/20">
                <div className="flex flex-col">
                  <div className="flex items-center space-x-2">
                    <GDGLogo className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                    <span
                      className={`text-sm sm:text-base font-black tracking-tight ${
                        themeMode === 'ivory' ? 'text-slate-900' : 'text-white'
                      }`}
                    >
                      GDG <span className="text-amber-500">IIITN</span>
                    </span>
                  </div>
                  <span
                    className={`text-[9px] font-black uppercase tracking-[0.25em] ml-6 ${
                      themeMode === 'ivory' ? 'text-slate-500' : 'text-amber-400/80'
                    }`}
                  >
                    CHALLENGE CARD
                  </span>
                </div>

                {/* Challenge Status Badge */}
                <div
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-extrabold tracking-wide ${
                    themeMode === 'ivory'
                      ? 'bg-[#fef3c7] text-[#92400e] border border-[#fcd34d]'
                      : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                  }`}
                >
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <span>Diwali 2026</span>
                </div>
              </div>

              {/* Hero Avatar with Diya Badge */}
              <div className="relative mt-2 mb-2">
                <div
                  className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full p-1 shadow-xl flex items-center justify-center ${
                    themeMode === 'ivory'
                      ? 'bg-gradient-to-tr from-amber-400 via-orange-400 to-amber-200'
                      : 'bg-gradient-to-tr from-amber-500 via-orange-600 to-yellow-300'
                  }`}
                >
                  <div
                    className={`w-full h-full rounded-full flex items-center justify-center font-black text-2xl sm:text-3xl shadow-inner ${
                      themeMode === 'ivory'
                        ? 'bg-gradient-to-tr from-amber-100 to-white text-amber-800'
                        : 'bg-gradient-to-tr from-[#25170d] to-[#160e08] text-amber-400'
                    }`}
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                </div>

                {/* Overlapping Diya Mascot Sticker Badge */}
                <div
                  className={`absolute -bottom-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center shadow-lg border-2 ${
                    themeMode === 'ivory'
                      ? 'bg-[#fef3c7] border-white'
                      : 'bg-[#2a170b] border-amber-500/60'
                  }`}
                  title="Diwali Challenge Mascot"
                >
                  <DiyaBadgeSVG className="w-5 h-5" />
                </div>
              </div>

              {/* Participant Name & Verified Check */}
              <div className="flex items-center justify-center space-x-1.5 text-center">
                <h3
                  className={`text-xl sm:text-2xl font-black tracking-tight ${
                    themeMode === 'ivory' ? 'text-slate-900' : 'text-white'
                  }`}
                >
                  {user.name}
                </h3>
                <div
                  className="w-4 h-4 sm:w-4.5 sm:h-4.5 rounded-full bg-emerald-500 flex items-center justify-center text-white shrink-0 shadow-sm"
                  title="Verified GDG IIITN Competitor"
                >
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              </div>

              {/* Handle Pill */}
              <div className="mt-0.5">
                <span
                  className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide ${
                    themeMode === 'ivory'
                      ? 'bg-[#f5e6d3] text-[#854d0e] border border-[#ebdccb]'
                      : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                  }`}
                >
                  @{primaryHandle}
                </span>
              </div>

              {/* Two Primary Metric Cards (Side by Side) */}
              <div className="grid grid-cols-2 gap-2.5 w-full mt-3">
                {/* Card 1: Total Questions Solved */}
                <div
                  className={`p-2.5 sm:p-3 rounded-2xl border text-center transition-all ${
                    themeMode === 'ivory'
                      ? 'bg-white border-[#ebdccb] shadow-sm'
                      : 'bg-[#18110b]/90 border-amber-500/25 shadow-lg'
                  }`}
                >
                  <div
                    className={`text-[10px] font-bold uppercase tracking-wider pb-1 border-b ${
                      themeMode === 'ivory'
                        ? 'text-[#b45309] border-[#f3e6d8]'
                        : 'text-amber-400 border-amber-900/40'
                    }`}
                  >
                    Questions Solved
                  </div>
                  <div
                    className={`text-2xl sm:text-3xl font-black mt-1 tracking-tight tabular-nums flex items-center justify-center gap-1.5 ${
                      themeMode === 'ivory' ? 'text-slate-900' : 'text-white'
                    }`}
                  >
                    <Flame className="w-5 h-5 text-amber-500 shrink-0" />
                    <span>{totalSolved}</span>
                  </div>
                  <div
                    className={`text-[9px] font-semibold mt-0.5 ${
                      themeMode === 'ivory' ? 'text-slate-500' : 'text-amber-300/70'
                    }`}
                  >
                    Total Challenge Solves
                  </div>
                </div>

                {/* Card 2: Rank After Challenge */}
                <div
                  className={`p-2.5 sm:p-3 rounded-2xl border text-center transition-all ${
                    themeMode === 'ivory'
                      ? 'bg-white border-[#ebdccb] shadow-sm'
                      : 'bg-[#18110b]/90 border-amber-500/25 shadow-lg'
                  }`}
                >
                  <div
                    className={`text-[10px] font-bold uppercase tracking-wider pb-1 border-b ${
                      themeMode === 'ivory'
                        ? 'text-[#059669] border-[#e2efe9]'
                        : 'text-emerald-400 border-amber-900/40'
                    }`}
                  >
                    Rank After Challenge
                  </div>
                  <div
                    className={`text-2xl sm:text-3xl font-black mt-1 tracking-tight tabular-nums flex items-center justify-center gap-1.5 ${
                      themeMode === 'ivory' ? 'text-slate-900' : 'text-amber-400'
                    }`}
                  >
                    <Trophy className="w-5 h-5 text-amber-500 shrink-0" />
                    <span>#{computedRank}</span>
                  </div>
                  <div
                    className={`text-[9px] font-semibold mt-0.5 ${
                      themeMode === 'ivory' ? 'text-slate-500' : 'text-amber-300/70'
                    }`}
                  >
                    Out of {computedTotal} Coders
                  </div>
                </div>
              </div>

              {/* Platform-wise Questions Solved Section (Displayed if platform data is available or active) */}
              {platformsToDisplay.length > 0 && (
                <div
                  className={`w-full mt-2.5 p-2.5 sm:p-3 rounded-2xl border ${
                    themeMode === 'ivory'
                      ? 'bg-white border-[#ebdccb] shadow-sm'
                      : 'bg-[#18110b]/80 border-amber-500/25 shadow-md'
                  }`}
                >
                  <div
                    className={`text-[10px] font-extrabold uppercase tracking-wider text-center mb-2 flex items-center justify-center gap-1.5 ${
                      themeMode === 'ivory' ? 'text-[#b45309]' : 'text-amber-400'
                    }`}
                  >
                    <Code2 className="w-3 h-3" />
                    <span>
                      {hasPlatformSolvesData
                        ? 'Questions Solved by Platform'
                        : 'Connected Coding Platforms'}
                    </span>
                  </div>

                  <div
                    className={`grid gap-1.5 text-center ${
                      platformsToDisplay.length === 1
                        ? 'grid-cols-1'
                        : platformsToDisplay.length === 2
                        ? 'grid-cols-2'
                        : 'grid-cols-3'
                    }`}
                  >
                    {platformsToDisplay.map((p) => {
                      const IconComponent = p.icon;
                      return (
                        <div
                          key={p.key}
                          className={`p-2 rounded-xl border flex flex-col items-center justify-between ${p.bg} ${p.border}`}
                        >
                          <div className={`flex items-center gap-1 text-[10px] font-bold ${p.color}`}>
                            <IconComponent className="w-3 h-3" />
                            <span>{p.name}</span>
                          </div>

                          {/* If platform question count data is available, mention exact number */}
                          {hasPlatformSolvesData ? (
                            <div className="my-0.5">
                              <div
                                className={`text-base sm:text-lg font-black tabular-nums ${
                                  themeMode === 'ivory' ? 'text-slate-900' : 'text-white'
                                }`}
                              >
                                {p.count}
                              </div>
                              <div className="text-[8px] font-semibold text-slate-400 uppercase tracking-tight">
                                Solved
                              </div>
                            </div>
                          ) : (
                            <div className="my-1">
                              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500 border border-emerald-500/30">
                                Verified
                              </span>
                            </div>
                          )}

                          <div className="text-[9px] text-slate-400 truncate max-w-full font-mono">
                            @{p.handle}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {!hasPlatformSolvesData && (
                    <div
                      className={`text-[9px] font-medium text-center mt-2 pt-1.5 border-t ${
                        themeMode === 'ivory'
                          ? 'border-[#f3e6d8] text-slate-500'
                          : 'border-amber-900/30 text-amber-300/70'
                      }`}
                    >
                      All <strong className="text-amber-500">{totalSolved} questions</strong> verified across connected platforms
                    </div>
                  )}
                </div>
              )}

              {/* Hashtag Pills Section */}
              <div className="flex flex-wrap gap-1 justify-center w-full mt-2.5">
                {['#GDGIIITN', '#DiwaliSprint', '#CompetitiveProgramming', '#DSA', '#LeetCode', '#Codeforces', '#CodeChef'].map(
                  (tag) => (
                    <span
                      key={tag}
                      className={`px-2 py-0.5 rounded-lg text-[9px] sm:text-[10px] font-bold ${
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
                className={`w-full mt-2.5 pt-2 border-t flex items-center justify-between text-[9px] font-semibold ${
                  themeMode === 'ivory'
                    ? 'border-[#ebdccb] text-slate-500'
                    : 'border-amber-900/40 text-amber-400/60'
                }`}
              >
                <div className="flex items-center space-x-1">
                  <ShieldCheck className="w-3 h-3 text-amber-500" />
                  <span>GDG IIITN Verified</span>
                </div>
                <span className="font-mono">{credentialId}</span>
              </div>
            </div>
          </div>
        </div>

        {/* LinkedIn Share Helper Guide Toast */}
        {showShareGuide && (
          <div className="mx-4 sm:mx-6 mb-3 p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/15 border-2 border-amber-500/40 text-xs sm:text-sm text-amber-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xl animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="space-y-1">
              <div className="font-black text-amber-300 flex items-center gap-1.5 text-sm">
                <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
                <span>Rank Card Downloaded & Caption Copied!</span>
              </div>
              <p className="text-amber-100/90 text-xs leading-relaxed max-w-xl">
                In LinkedIn&apos;s post creator: <strong>1)</strong> Click the photo icon to attach your downloaded Rank Card (or press <kbd className="px-1.5 py-0.5 rounded bg-black/60 border border-amber-500/40 text-[10px] font-mono text-amber-300">Cmd+V</kbd> / <kbd className="px-1.5 py-0.5 rounded bg-black/60 border border-amber-500/40 text-[10px] font-mono text-amber-300">Ctrl+V</kbd> to paste the image directly!). <strong>2)</strong> Paste your celebration text.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
              <button
                onClick={() => window.open('https://www.linkedin.com/feed/?shareActive=true', '_blank', 'noopener,noreferrer')}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs hover:scale-105 transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <LinkedInSVG className="w-3.5 h-3.5" />
                <span>Open LinkedIn</span>
                <ExternalLink className="w-3 h-3" />
              </button>
              <button
                onClick={() => setShowShareGuide(false)}
                className="p-1.5 rounded-lg text-amber-300/60 hover:text-white hover:bg-white/10 transition-colors"
                title="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Modal Action Footer */}
        <div className="p-4 sm:p-5 bg-[#160f0a] border-t border-amber-900/40 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2 text-xs text-amber-200/80 text-center md:text-left">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Official GDG IIITN Rank Card ready for LinkedIn post & celebration!</span>
          </div>

          <div className="flex items-center flex-wrap justify-end gap-2 w-full md:w-auto">
            {/* Copy Card Image to Clipboard */}
            <button
              onClick={handleCopyImage}
              disabled={copyingImage}
              type="button"
              className={`flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl font-bold text-xs border transition-all cursor-pointer ${
                copiedImageSuccess
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                  : 'bg-white/5 border-amber-500/30 text-amber-300 hover:bg-white/10'
              }`}
              title="Copy card image directly to clipboard to paste (Cmd+V) in LinkedIn or chat"
            >
              {copiedImageSuccess ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <ImageIcon className="w-3.5 h-3.5" />
              )}
              <span>{copiedImageSuccess ? 'Card Image Copied!' : 'Copy Image'}</span>
            </button>

            {/* Copy Caption Text */}
            <button
              onClick={handleCopyText}
              type="button"
              className={`flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl font-bold text-xs border transition-all cursor-pointer ${
                copiedText
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                  : 'bg-white/5 border-amber-500/30 text-amber-300 hover:bg-white/10'
              }`}
              title="Copy LinkedIn celebration post text"
            >
              {copiedText ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              <span>{copiedText ? 'Caption Copied!' : 'Copy Caption'}</span>
            </button>

            {/* Direct LinkedIn Share */}
            <button
              onClick={handleShareLinkedIn}
              disabled={sharingLinkedIn}
              type="button"
              className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl font-black text-xs sm:text-sm bg-[#0a66c2] hover:bg-[#084e96] text-white shadow-lg shadow-[#0a66c2]/25 transition-all hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-50"
              title="Download Rank Card image and open LinkedIn post composer"
            >
              <LinkedInSVG className="w-4 h-4" />
              <span>{sharingLinkedIn ? 'Preparing Card...' : 'Share on LinkedIn'}</span>
            </button>

            {/* Download HD Image Button */}
            <button
              onClick={handleDownload}
              disabled={downloading}
              type="button"
              className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl font-black text-xs sm:text-sm bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 shadow-lg shadow-amber-500/25 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <Download className={`w-4 h-4 ${downloading ? 'animate-bounce' : ''}`} />
              <span>{downloading ? 'Exporting...' : 'Download Card'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
