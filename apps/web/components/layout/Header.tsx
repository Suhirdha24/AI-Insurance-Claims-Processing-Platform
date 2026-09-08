'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { useTheme } from '@/lib/theme';
import { ShieldCheck, Search, Sun, Moon, LogOut, Sparkles } from 'lucide-react';
import { api } from '@/lib/api';

export function Header({ onNLSearchResults }: { onNLSearchResults?: (results: any) => void }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [nlQuery, setNlQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleNLSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nlQuery.trim()) return;

    setIsSearching(true);
    try {
      const res: any = await api.post('/claims/natural-language-search', { query: nlQuery });
      if (onNLSearchResults && res.data) {
        onNLSearchResults(res.data);
      }
    } catch (err) {
      console.error('NL Search failed:', err);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-[#06070B]/95 backdrop-blur-xl border-b border-slate-200 dark:border-purple-500/20 px-4 md:px-6 py-3.5 shadow-sm dark:shadow-xl transition-colors">
      <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
        {/* Left: Brand logo aligned to the left */}
        <Link href="/" className="flex items-center gap-3 shrink-0 justify-start">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-fuchsia-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/30">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div className="text-left">
            <h1 className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white leading-none">
              ClaimFlow <span className="text-gradient-purple">AI</span>
            </h1>
            <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">Enterprise Insurance Platform</p>
          </div>
        </Link>

        {/* Center: Natural Language Search input */}
        <form onSubmit={handleNLSearch} className="flex-1 max-w-xl relative hidden md:block">
          <div className="relative">
            <input
              type="text"
              value={nlQuery}
              onChange={(e) => setNlQuery(e.target.value)}
              placeholder="Ask AI: 'Show high-risk vehicle damage claims above ₹2 lakh'..."
              className="w-full pl-10 pr-12 py-2 text-xs rounded-full bg-slate-100 dark:bg-slate-900/90 border border-purple-500/20 dark:border-purple-500/30 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all shadow-inner"
            />
            <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400 absolute left-3.5 top-2.5" />
            <button
              type="submit"
              disabled={isSearching}
              className="absolute right-1.5 top-1.5 px-3 py-1 text-[10px] font-bold uppercase rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 transition-colors shadow-md shadow-purple-500/20"
            >
              {isSearching ? '...' : 'Search'}
            </button>
          </div>
        </form>

        {/* Right: Role indicator & Sign Out button */}
        <div className="flex items-center gap-3">
          {user && (
            <div className="flex items-center gap-3">
              {/* User Balance Badge */}
              <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-xs font-semibold text-purple-700">
                <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse" />
                Coverage: ₹10,00,000
              </div>

              <div className="text-right hidden sm:block">
                <div className="text-xs font-extrabold text-slate-900">{user.name}</div>
                <span className="inline-block px-2 py-0.5 text-[9px] font-black tracking-wider uppercase rounded-full bg-purple-100 border border-purple-300 text-purple-700 mt-0.5">
                  {user.role}
                </span>
              </div>

              <button
                onClick={logout}
                className="p-2 text-rose-600 hover:text-rose-700 rounded-xl hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
