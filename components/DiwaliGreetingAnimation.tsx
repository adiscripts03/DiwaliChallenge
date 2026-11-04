'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { Sparkles, X, Volume2, VolumeX, ArrowRight, Flame } from 'lucide-react';
import { isDiwaliDay } from '@/lib/date';

const DIWALI_SESSION_KEY = 'gdg_diwali_greeting_seen_20261108';
const COUNTDOWN_SECONDS = 6;

// Synthesize pleasant, sacred temple bell chimes using Web Audio API (no external MP3 needed)
function playSacredChime() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    // Auspicious pentatonic temple bell frequencies (E, G#, B, E, G#)
    const notes = [329.63, 415.3, 493.88, 659.25, 830.61];

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.12);

      const startTime = ctx.currentTime + idx * 0.12;
      const duration = 2.4;

      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.18 / (idx + 1), startTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
    });
  } catch {
    // Graceful fallback if Web Audio is blocked by browser policy
  }
}

export default function DiwaliGreetingAnimation() {
  const [isVisible, setIsVisible] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [timeLeft, setTimeLeft] = useState(COUNTDOWN_SECONDS);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const dismiss = useCallback(() => {
    setIsFadingOut(true);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(DIWALI_SESSION_KEY, 'true');
    }
    setTimeout(() => {
      setIsVisible(false);
      setIsFadingOut(false);
    }, 700);
  }, []);

  const openGreeting = useCallback((playSound: boolean = false) => {
    setIsFadingOut(false);
    setIsVisible(true);
    setTimeLeft(COUNTDOWN_SECONDS);
    if (playSound && soundEnabled) {
      playSacredChime();
    }
  }, [soundEnabled]);

  useEffect(() => {
    setMounted(true);

    // Check if it's Diwali Day (November 8, 2026 IST) or forced via query param
    const checkShouldOpen = () => {
      if (typeof window === 'undefined') return;

      const urlParams = new URLSearchParams(window.location.search);
      const isPreview =
        urlParams.get('diwali') === 'true' ||
        urlParams.get('preview') === 'diwali' ||
        window.location.hash === '#diwali';

      const diwaliActive = isDiwaliDay();
      const alreadySeen = sessionStorage.getItem(DIWALI_SESSION_KEY) === 'true';

      if (isPreview || (diwaliActive && !alreadySeen)) {
        // Small delay to ensure smooth page mount before playing animation
        const t = setTimeout(() => {
          setIsVisible(true);
          setTimeLeft(COUNTDOWN_SECONDS);
        }, 300);
        return () => clearTimeout(t);
      }
    };

    checkShouldOpen();

    // Global listener so other components can trigger the animation
    const handleReplay = () => openGreeting(true);
    window.addEventListener('open-diwali-greeting', handleReplay);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isVisible) {
        dismiss();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('open-diwali-greeting', handleReplay);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [dismiss, openGreeting, isVisible]);

  // Countdown timer to auto-transition to main website
  useEffect(() => {
    if (!isVisible || isFadingOut) return;

    if (timeLeft <= 0) {
      dismiss();
      return;
    }

    timerRef.current = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isVisible, isFadingOut, timeLeft, dismiss]);

  if (!mounted || !isVisible) {
    return null;
  }

  const progressPercent = ((COUNTDOWN_SECONDS - timeLeft) / COUNTDOWN_SECONDS) * 100;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Happy Diwali Greetings from GDG IIITN"
      className={`fixed inset-0 z-[9999] h-full max-h-screen flex flex-col items-center justify-between p-3 sm:p-6 overflow-hidden select-none transition-all duration-700 ${
        isFadingOut
          ? 'opacity-0 pointer-events-none scale-105'
          : 'opacity-100 pointer-events-auto scale-100'
      } bg-[#0b0805]/95 backdrop-blur-xl`}
    >
      {/* Ambient Radial Golden Glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[900px] h-[450px] sm:h-[650px] bg-gradient-to-r from-amber-600/20 via-yellow-500/25 to-amber-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-amber-950/40 to-transparent" />
        <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-[#0b0805] to-transparent" />
      </div>

      {/* Floating Sparkles & Diya Flame Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(16)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-amber-400"
            style={{
              top: `${(i * 17) % 95}%`,
              left: `${(i * 23) % 96}%`,
              width: `${(i % 3) + 2}px`,
              height: `${(i % 3) + 2}px`,
              opacity: 0.35 + (i % 5) * 0.12,
              filter: 'blur(0.5px)',
              boxShadow: '0 0 8px #fbbf24',
              animation: `floatParticle ${3 + (i % 4)}s ease-in-out infinite alternate`,
              animationDelay: `${(i * 0.25).toFixed(1)}s`,
            }}
          />
        ))}
      </div>

      {/* Top Controls: Sound Toggle & Quick Skip */}
      <header className="relative z-10 w-full max-w-4xl flex items-center justify-between shrink-0 pt-1 sm:pt-2 px-1">
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30 backdrop-blur-md shadow-sm">
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
            <span className="hidden sm:inline">GDG IIITN Diwali Challenge</span>
            <span className="sm:hidden">GDG Diwali</span>
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              const next = !soundEnabled;
              setSoundEnabled(next);
              if (next) playSacredChime();
            }}
            title={soundEnabled ? 'Mute Temple Chimes' : 'Play Sacred Temple Chimes'}
            className="p-1.5 sm:p-2 rounded-full bg-amber-950/60 hover:bg-amber-900/70 border border-amber-500/30 text-amber-300 transition-colors shadow-sm cursor-pointer"
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4 opacity-75" />}
          </button>

          <button
            onClick={dismiss}
            title="Skip to Website (Esc)"
            className="flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 text-slate-300 hover:text-white text-[11px] sm:text-xs font-medium transition-all cursor-pointer"
          >
            <span>Skip</span>
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Main Center Content: Sacred Artwork & Festive Typography */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center my-auto py-1 sm:py-3 text-center max-w-2xl w-full">
        {/* Sacred Sanskrit Invocation */}
        <div className="animate-fade-in-down mb-1 sm:mb-2">
          <p className="text-[10px] sm:text-xs font-semibold tracking-wider sm:tracking-widest text-amber-300/90 uppercase drop-shadow-[0_2px_10px_rgba(245,158,11,0.5)]">
            ॥ ॐ श्री गणेशाय नमः ॥ ॐ महालक्ष्म्यै नमः ॥
          </p>
        </div>

        {/* Sacred Artwork of Lakshmi Ji & Ganesha Ji */}
        <div className="relative group w-full max-w-[260px] xs:max-w-[320px] sm:max-w-lg aspect-[16/9] rounded-xl sm:rounded-2xl overflow-hidden border border-amber-500/40 shadow-[0_0_35px_rgba(245,158,11,0.35)] transition-transform duration-700">
          <Image
            src="/images/lakshmi_ganesha_diwali.jpg"
            alt="Divine Goddess Lakshmi and Lord Ganesha - Happy Diwali"
            fill
            priority
            sizes="(max-width: 640px) 320px, 512px"
            className="object-cover object-center"
          />
          {/* Subtle Golden Inner Border Overlay */}
          <div className="absolute inset-0 ring-1 ring-inset ring-amber-300/30 rounded-xl sm:rounded-2xl pointer-events-none" />
          {/* Soft vignette at edges */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />
        </div>

        {/* Shimmering Festive Heading */}
        <div className="mt-2 sm:mt-3.5 space-y-0.5">
          <h1 className="text-xl sm:text-4xl md:text-5xl font-black tracking-tight bg-gradient-to-r from-amber-100 via-amber-300 to-yellow-400 bg-clip-text text-transparent drop-shadow-[0_4px_24px_rgba(245,158,11,0.6)]">
            शुभ दीपावली
          </h1>
          <h2 className="text-xs sm:text-lg font-extrabold tracking-wide text-amber-200 flex items-center justify-center gap-1.5">
            <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 animate-bounce" />
            <span>HAPPY DIWALI</span>
            <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 animate-bounce" />
          </h2>
        </div>

        {/* Divine Blessings Prose */}
        <p className="mt-1 sm:mt-2 text-[10px] sm:text-xs text-amber-100/85 max-w-xs sm:max-w-md leading-relaxed font-normal px-2">
          May Lord Ganesha remove all obstacles from your path, and Goddess Lakshmi shower your journey with wisdom, radiant joy, prosperity, and triumphant success!
        </p>
      </main>

      {/* Bottom Footer: Enter Button & Progress Bar */}
      <footer className="relative z-10 w-full max-w-xs sm:max-w-md flex flex-col items-center gap-1.5 sm:gap-2 pb-1 sm:pb-2 shrink-0">
        <button
          onClick={dismiss}
          className="group w-full sm:w-auto min-w-[200px] flex items-center justify-center gap-2 px-5 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs sm:text-sm shadow-[0_0_20px_rgba(245,158,11,0.45)] hover:shadow-[0_0_30px_rgba(245,158,11,0.65)] transition-all transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
        >
          <span>Enter Challenge</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
        </button>

        {/* Auto-enter Countdown indicator */}
        <div className="flex items-center gap-2 text-[10px] sm:text-[11px] text-amber-400/80">
          <span>Entering in {timeLeft}s</span>
          <div className="w-20 sm:w-24 h-1 sm:h-1.5 bg-amber-950/80 rounded-full overflow-hidden border border-amber-500/20">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-yellow-300 transition-all duration-1000 ease-linear rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </footer>

      {/* Custom Styles for Keyframe Animations */}
      <style jsx>{`
        @keyframes floatParticle {
          0% {
            transform: translateY(0px) scale(0.9);
            opacity: 0.3;
          }
          100% {
            transform: translateY(-24px) scale(1.15);
            opacity: 0.85;
          }
        }
      `}</style>
    </div>
  );
}
