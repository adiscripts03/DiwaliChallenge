import React from 'react';

export function DiyaGraphic({ className = 'w-48 h-32', glowIntensity = 'high' }: { className?: string; glowIntensity?: 'normal' | 'high' }) {
  return (
    <svg
      viewBox="0 0 200 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        {/* Warm Ambient Radial Radiance */}
        <radialGradient id="flameGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#fbbf24" stopOpacity={glowIntensity === 'high' ? '0.9' : '0.6'} />
          <stop offset="45%" stopColor="#f97316" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
        </radialGradient>

        {/* Outer Flame Gradient */}
        <linearGradient id="outerFlameGrad" x1="100" y1="6" x2="100" y2="70" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fffbeb" />
          <stop offset="20%" stopColor="#fef08a" />
          <stop offset="50%" stopColor="#f59e0b" />
          <stop offset="85%" stopColor="#ea580c" />
          <stop offset="100%" stopColor="#b91c1c" />
        </linearGradient>

        {/* Inner Bright Flame Core */}
        <linearGradient id="innerFlameGrad" x1="100" y1="20" x2="100" y2="65" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="50%" stopColor="#fef08a" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>

        {/* Earthen Terracotta Diya Clay */}
        <linearGradient id="clayBaseGrad" x1="20" y1="74" x2="180" y2="120" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#b45309" />
          <stop offset="40%" stopColor="#d97706" />
          <stop offset="80%" stopColor="#92400e" />
          <stop offset="100%" stopColor="#78350f" />
        </linearGradient>

        {/* Traditional Brass / Golden Rim */}
        <linearGradient id="clayRimGrad" x1="20" y1="75" x2="180" y2="75" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#92400e" />
          <stop offset="25%" stopColor="#f59e0b" />
          <stop offset="50%" stopColor="#fbbf24" />
          <stop offset="75%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#92400e" />
        </linearGradient>
      </defs>

      {/* Flame Aura Glow */}
      <circle cx="100" cy="45" r="42" fill="url(#flameGlow)" />

      {/* Outer Flame */}
      <path
        d="M100 6 C114 26, 124 44, 117 62 C111 75, 89 75, 83 62 C76 44, 86 26, 100 6 Z"
        fill="url(#outerFlameGrad)"
        filter="drop-shadow(0 0 10px rgba(251, 191, 36, 0.8))"
      />

      {/* Inner Flame Core */}
      <path
        d="M100 22 C108 36, 113 48, 109 59 C106 67, 94 67, 91 59 C87 48, 92 36, 100 22 Z"
        fill="url(#innerFlameGrad)"
      />

      {/* Diya Clay Base Body */}
      <path
        d="M20 74 C20 74, 52 118, 100 118 C148 118, 180 74, 180 74 C162 98, 136 108, 100 108 C64 108, 38 98, 20 74 Z"
        fill="url(#clayBaseGrad)"
        stroke="#78350f"
        strokeWidth="1.5"
      />

      {/* Traditional Decorative Diya Rim */}
      <ellipse
        cx="100"
        cy="75"
        rx="80"
        ry="12"
        fill="url(#clayRimGrad)"
        stroke="#fde68a"
        strokeWidth="0.8"
      />

      {/* Diya Stand Base */}
      <path
        d="M74 118 C74 118, 80 128, 100 128 C120 128, 126 118, 126 118 Z"
        fill="#78350f"
      />
    </svg>
  );
}

export default function DiyaBackground() {
  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none"
      aria-hidden="true"
    >
      {/* Soft warm ambient lighting only — no extra Diyas in background */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[140px]" />
      <div className="absolute top-1/3 left-0 w-[450px] h-[450px] bg-orange-600/10 rounded-full blur-[140px]" />
    </div>
  );
}
