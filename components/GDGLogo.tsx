import React from 'react';

export default function GDGLogo({ className = 'w-8 h-8' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 192 192"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Google Developer Groups Logo"
    >
      {/* Left Bracket `<` */}
      {/* Top Left - Blue */}
      <path
        d="M68.5 45.5L25 89l12 12L92.5 45.5h-24z"
        fill="#4285F4"
      />
      {/* Bottom Left - Yellow */}
      <path
        d="M37 101l-12 12 43.5 43.5h24L37 101z"
        fill="#FBBC04"
      />

      {/* Right Bracket `>` */}
      {/* Top Right - Red */}
      <path
        d="M123.5 45.5L167 89l-12 12-55.5-55.5h24z"
        fill="#EA4335"
      />
      {/* Bottom Right - Green */}
      <path
        d="M155 101l12 12-43.5 43.5h-24L155 101z"
        fill="#34A853"
      />
    </svg>
  );
}

