'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
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
  ArrowRight,
} from 'lucide-react';

const CATEGORIES = [
  { id: 'solves', label: 'Solves / Score Calculation', icon: '🔢', desc: 'Questions not counting, < 800 rating rule, etc.' },
  { id: 'sync', label: 'Platform Sync / Scraping', icon: '🔄', desc: 'LeetCode, Codeforces, or CodeChef sync issues' },
  { id: 'ui', label: 'Display / Mobile Glitch', icon: '🎨', desc: 'Layout overflow, broken cards, dark/light mode issues' },
  { id: 'auth', label: 'Login / Account Issue', icon: '🔐', desc: 'Authentication, registration, or profile problems' },
  { id: 'suggestion', label: 'Feature Suggestion', icon: '💡', desc: 'Idea to improve the GDG Diwali Challenge' },
  { id: 'other', label: 'Other Issue', icon: '❓', desc: 'Anything else' },
];

export default function BugReportForm() {
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [coderHandle, setCoderHandle] = useState('');
  const [category, setCategory] = useState('solves');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [submittedReport, setSubmittedReport] = useState<any | null>(null);

  // Autofill user information if logged in
  useEffect(() => {
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
  }, []);

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

  if (submittedReport) {
    return (
      <div className="text-center py-10 space-y-6 animate-in fade-in">
        <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/10 animate-bounce">
          <CheckCircle2 className="w-12 h-12" />
        </div>

        <div className="space-y-2 max-w-lg mx-auto">
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Message Delivered to Aditya!
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Your bug report has been successfully recorded and is now waiting in Aditya’s admin inbox. Thanks for helping us keep the competition fair and smooth!
          </p>
          <div className="pt-2">
            <span className="inline-block px-4 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-xs text-amber-400 font-mono">
              Report Tracking ID: #{submittedReport.id.slice(0, 8)}
            </span>
          </div>
        </div>

        {/* Quick direct communication buttons */}
        <div className="pt-6 border-t border-slate-800 max-w-xl mx-auto space-y-3">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Want to follow up or chat in real-time?
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <a
              href={constructWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center space-x-2.5 px-6 py-3.5 rounded-2xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 font-bold text-sm transition-all hover:scale-[1.02] shadow-lg"
            >
              <MessageSquare className="w-5 h-5 text-emerald-400" />
              <span>Ping on WhatsApp</span>
            </a>

            <a
              href={constructMailtoUrl()}
              className="flex items-center justify-center space-x-2.5 px-6 py-3.5 rounded-2xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 font-bold text-sm transition-all hover:scale-[1.02] shadow-lg"
            >
              <Mail className="w-5 h-5 text-amber-400" />
              <span>Send via Email</span>
            </a>
          </div>
        </div>

        <div className="pt-4 flex items-center justify-center space-x-4">
          <button
            onClick={() => {
              setSubmittedReport(null);
              setMessage('');
            }}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors"
          >
            Submit Another Report
          </button>
          <Link
            href="/"
            className="inline-flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-colors shadow-md"
          >
            <span>Back to Leaderboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Category selector */}
      <div>
        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5 flex items-center gap-2">
          <Tag className="w-4 h-4 text-amber-400" />
          <span>Select Issue Category</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {CATEGORIES.map((cat) => {
            const isSelected = category === cat.id;
            return (
              <button
                type="button"
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`text-left p-3.5 rounded-2xl border text-xs transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-amber-500/20 border-amber-400 text-amber-200 shadow-lg shadow-amber-500/10 scale-[1.02]'
                    : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center space-x-2 mb-1.5">
                  <span className="text-xl">{cat.icon}</span>
                  <span className="font-bold text-sm text-slate-200">{cat.label}</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-normal">{cat.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Explanation Textarea */}
      <div>
        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-amber-400" />
            <span>Explain the Bug / Issue in Detail *</span>
          </span>
          <span className="text-xs text-slate-500 font-mono">{message.length}/3000</span>
        </label>
        <textarea
          required
          rows={5}
          maxLength={3000}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Please explain what happened. Example: 'I solved 3 problems on LeetCode with rating > 1000 today at 8:00 PM, but my count only shows +1' or 'The podium cards overflow on iPhone screen'."
          className="w-full bg-slate-950/90 border border-slate-700 rounded-2xl p-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50 resize-y"
        />
      </div>

      {/* Grid of contact details */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-slate-400" />
            <span>Your Name</span>
          </label>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="e.g. Aditya Singh"
            className="w-full bg-slate-950/90 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>Platform Handle(s)</span>
          </label>
          <input
            type="text"
            value={coderHandle}
            onChange={(e) => setCoderHandle(e.target.value)}
            placeholder="e.g. adiscripts03"
            className="w-full bg-slate-950/90 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <AtSign className="w-3.5 h-3.5 text-slate-400" />
            <span>Email / WhatsApp (Optional)</span>
          </label>
          <input
            type="text"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            placeholder="For fix updates"
            className="w-full bg-slate-950/90 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
          />
        </div>
      </div>

      {/* Submit footer */}
      <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800">
        <div className="text-xs text-slate-400 flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-amber-400/80 shrink-0" />
          <span>Delivered straight to Aditya&apos;s admin dashboard with one click.</span>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full sm:w-auto px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center space-x-2 hover:scale-[1.02]"
        >
          {submitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
          <span>{submitting ? 'Submitting Report...' : 'Send Message to Aditya'}</span>
        </button>
      </div>
    </form>
  );
}
