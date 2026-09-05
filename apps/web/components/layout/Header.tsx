'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { useTheme } from '@/lib/theme';
import { ShieldCheck, Search, Sun, Moon, LogOut, User as UserIcon, Sparkles } from 'lucide-react';
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
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-200 dark:border-slate-800 px-6 py-3">
      <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
        {/* Left: Brand logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-base font-extrabold tracking-tight text-slate-900 dark:text-slate-100 leading-none">
              SHIELD <span className="text-blue-600 dark:text-blue-400">AI</span>
            </h1>
            <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Enterprise Claims Platform</p>
          </div>
        </div>

        {/* Center: Natural Language Search input */}
        <form onSubmit={handleNLSearch} className="flex-1 max-w-xl relative hidden md:block">
          <div className="relative">
            <input
              type="text"
              value={nlQuery}
              onChange={(e) => setNlQuery(e.target.value)}
              placeholder="Ask AI: 'Show high-risk vehicle claims above ₹2 lakh'..."
              className="w-full pl-10 pr-12 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
            <Sparkles className="w-4 h-4 text-blue-500 absolute left-3 top-2.5" />
            <button
              type="submit"
              disabled={isSearching}
              className="absolute right-1.5 top-1.5 px-2.5 py-1 text-[10px] font-bold uppercase rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {isSearching ? '...' : 'Search'}
            </button>
          </div>
        </form>

        {/* Right: Theme toggle, Role indicator, User dropdown */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Toggle Light/Dark Theme"
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
          </button>

          {user && (
            <div className="flex items-center gap-3 pl-3 border-l border-slate-200 dark:border-slate-800">
              <div className="text-right hidden sm:block">
                <div className="text-xs font-bold text-slate-900 dark:text-slate-100">{user.name}</div>
                <span className="inline-block px-1.5 py-0.5 text-[9px] font-black tracking-wider uppercase rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {user.role}
                </span>
              </div>
              <button
                onClick={logout}
                className="p-2 text-rose-500 hover:text-rose-700 dark:text-rose-400 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
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
