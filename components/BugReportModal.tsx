'use client';

import React, { useState, useEffect } from 'react';
import {
  Bug,
  X,
  Send,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Mail,
  Loader2,
  Flame,
  HelpCircle,
  User,
  AtSign,
  Tag,
} from 'lucide-react';

interface BugReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCategory?: string;
}

const CATEGORIES = [
  { id: 'solves', label: 'Solves / Score Calculation', icon: '🔢', desc: 'Questions not counting, < 800 rating rule, etc.' },
  { id: 'sync', label: 'Platform Sync / Scraping', icon: '🔄', desc: 'LeetCode, Codeforces, or CodeChef sync issues' },
  { id: 'ui', label: 'Display / Mobile Glitch', icon: '🎨', desc: 'Layout overflow, broken cards, dark/light mode issues' },
  { id: 'auth', label: 'Login / Account Issue', icon: '🔐', desc: 'Authentication, registration, or profile problems' },
  { id: 'suggestion', label: 'Feature Suggestion', icon: '💡', desc: 'Idea to improve the GDG Diwali Challenge' },
  { id: 'other', label: 'Other Issue', icon: '❓', desc: 'Anything else' },
];

export default function BugReportModal({ isOpen, onClose, defaultCategory = 'solves' }: BugReportModalProps) {
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [coderHandle, setCoderHandle] = useState('');
  const [category, setCategory] = useState(defaultCategory);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [submittedReport, setSubmittedReport] = useState<any | null>(null);

  // Autofill user information if logged in
  useEffect(() => {
    if (!isOpen) return;
    setError('');
    setSubmittedReport(null);

    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) {
          if (!userName) setUserName(data.user.name || '');
          if (!userEmail) setUserEmail(data.user.email || '');
          if (!coderHandle && data.user.handles) {
            const handles = [];
            if (data.user.handles.leetcode) handles.push(`LC:${data.user.handles.leetcode}`);
            if (data.user.handles.codeforces) handles.push(`CF:${data.user.handles.codeforces}`);
            if (data.user.handles.codechef) handles.push(`CC:${data.user.handles.codechef}`);
            setCoderHandle(handles.join(', '));
          }
        }
      })
      .catch(() => {});
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!message.trim() || message.trim().length < 5) {
      setError('Please provide at least a short description (5+ characters) of what went wrong.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/bugs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName: userName.trim(),
          userEmail: userEmail.trim(),
          coderHandle: coderHandle.trim(),
          category,
          message: message.trim(),
          pageUrl: typeof window !== 'undefined' ? window.location.href : '',
          deviceInfo: typeof navigator !== 'undefined' ? navigator.userAgent : '',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit bug report');
      }

      setSubmittedReport(data.report);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'mejustaditya03@gmail.com';
  const adminWhatsApp = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP || '';

  const constructWhatsAppUrl = () => {
    const text = encodeURIComponent(
      `*GDG Diwali Challenge - Bug Report*\n` +
      `*From:* ${userName || 'A Coder'}\n` +
      `*Category:* ${category}\n` +
      `*Handle:* ${coderHandle || 'N/A'}\n\n` +
      `*Details:*\n${message}`
    );
    if (adminWhatsApp) {
      const cleanPhone = adminWhatsApp.replace(/[^0-9]/g, '');
      return `https://wa.me/${cleanPhone}?text=${text}`;
    }
    return `https://wa.me/?text=${text}`;
  };

  const constructMailtoUrl = () => {
    const subject = encodeURIComponent(`[Bug Report] GDG Diwali Challenge - ${category.toUpperCase()}`);
    const body = encodeURIComponent(
      `Hello Aditya,\n\nI encountered an issue on the GDG Diwali Challenge website:\n\n` +
      `Category: ${category}\n` +
      `Coder Name: ${userName || 'Anonymous'}\n` +
      `Contact: ${userEmail || 'Not provided'}\n` +
      `Handles: ${coderHandle || 'Not provided'}\n\n` +
      `Bug Description:\n${message}\n\n` +
      `Submitted from: ${typeof window !== 'undefined' ? window.location.href : ''}`
    );
    return `mailto:${adminEmail}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-amber-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="relative px-6 py-5 border-b border-amber-500/20 bg-slate-900/60 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner">
              <Bug className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <span>Report a Bug</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30 uppercase tracking-wide">
                  To Developer
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Spotted a score mismatch or glitch? Send a direct message to Aditya.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {submittedReport ? (
            /* Success Screen */
            <div className="text-center py-6 space-y-5">
              <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/10 animate-bounce">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-black text-white">Message Delivered to Owner!</h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                  Your bug report has been logged to Aditya’s Admin Control Center. We’ll investigate and fix it promptly!
                </p>
                <div className="inline-block px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs text-amber-400 font-mono">
                  Report ID: #{submittedReport.id.slice(0, 8)}
                </div>
              </div>

              {/* Quick direct-message options */}
              <div className="pt-4 border-t border-slate-800/80 space-y-3">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Want an instant reply? Ping Aditya directly:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto">
                  <a
                    href={constructWhatsAppUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center space-x-2 px-4 py-3 rounded-2xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 font-bold text-xs transition-all hover:scale-[1.02] shadow-lg"
                  >
                    <MessageSquare className="w-4 h-4 text-emerald-400" />
                    <span>Open in WhatsApp</span>
                  </a>

                  <a
                    href={constructMailtoUrl()}
                    className="flex items-center justify-center space-x-2 px-4 py-3 rounded-2xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 font-bold text-xs transition-all hover:scale-[1.02] shadow-lg"
                  >
                    <Mail className="w-4 h-4 text-amber-400" />
                    <span>Send via Email</span>
                  </a>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors"
                >
                  Done & Close
                </button>
              </div>
            </div>
          ) : (
            /* Input Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Category Picker */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-amber-400" />
                  <span>Issue Category</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {CATEGORIES.map((cat) => {
                    const isSelected = category === cat.id;
                    return (
                      <button
                        type="button"
                        key={cat.id}
                        onClick={() => setCategory(cat.id)}
                        className={`text-left p-2.5 rounded-xl border text-xs font-semibold transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-md shadow-amber-500/10 scale-[1.02]'
                            : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                        }`}
                      >
                        <span className="text-base mb-1">{cat.icon}</span>
                        <span className="leading-tight">{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Bug Explanation */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                    <span>Explain the Bug *</span>
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {message.length}/3000
                  </span>
                </label>
                <textarea
                  required
                  rows={4}
                  maxLength={3000}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Explain what happened, which problem or contest handle is affected, what you expected vs what you saw..."
                  className="w-full bg-slate-950/90 border border-slate-700 rounded-2xl p-3.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50 resize-y"
                />
              </div>

              {/* Two Column details: Name & Handle */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>Your Name</span>
                  </label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="e.g. Aditya Singh"
                    className="w-full bg-slate-950/90 border border-slate-700 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-amber-400" />
                    <span>Platform Handle(s)</span>
                  </label>
                  <input
                    type="text"
                    value={coderHandle}
                    onChange={(e) => setCoderHandle(e.target.value)}
                    placeholder="e.g. aditya_singh (LeetCode / CF)"
                    className="w-full bg-slate-950/90 border border-slate-700 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <AtSign className="w-3.5 h-3.5 text-slate-400" />
                  <span>Email / WhatsApp (Optional, for updates)</span>
                </label>
                <input
                  type="text"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="your.email@example.com or phone"
                  className="w-full bg-slate-950/90 border border-slate-700 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Actions */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-800">
                <div className="text-[11px] text-slate-400 flex items-center gap-1">
                  <HelpCircle className="w-3.5 h-3.5 text-amber-400/80" />
                  <span>Logged directly into Aditya&apos;s admin board.</span>
                </div>

                <div className="flex items-center space-x-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-md shadow-amber-500/20 transition-all flex items-center justify-center space-x-2 hover:scale-[1.02]"
                  >
                    {submitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    <span>{submitting ? 'Sending...' : 'Send to Aditya'}</span>
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
