'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { StatusBadge, RiskBadge } from '@/components/ui/Badge';
import { 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Calendar, 
  MessageSquare, 
  ChevronRight, 
  TrendingUp, 
  Bot, 
  Send, 
  X,
  FileEdit,
  PhoneCall,
  Activity
} from 'lucide-react';

export default function AdjusterDashboardPage() {
  const [metrics, setMetrics] = useState<any>(null);
  const [highRiskClaims, setHighRiskClaims] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ role: string; content: string }[]>([
    { role: 'assistant', content: 'Good morning! I have pre-processed 4 claims and flagged 1 high-risk vehicle mismatch. How can I assist your review today?' }
  ]);
  const [chatInput, setChatInput] = useState('');

  useEffect(() => {
    Promise.all([
      api.get('/analytics/dashboard'),
      api.get('/claims?limit=6'),
    ])
      .then(([analyticsRes, claimsRes]: any) => {
        setMetrics(analyticsRes.data);
        setHighRiskClaims(claimsRes.claims || []);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput;
    setChatMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setChatInput('');

    setTimeout(() => {
      setChatMessages(prev => [
        ...prev,
        { role: 'assistant', content: `ClaimFlow AI Analysis: Query "${userMsg}" executed. Claim #CLM-8902 policy coverage confirmed up to ₹10,00,000 with 0 document mismatches.` }
      ]);
    }, 600);
  };

  const { kpis } = metrics || {};

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 relative">
      {/* Top Greeting Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Good morning, <span className="text-gradient-purple">Adjuster Sarah</span>
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-light mt-1">
            ClaimFlow AI has handled <span className="text-purple-700 dark:text-purple-300 font-bold">47 automated claim tasks</span> this morning. Here's today at a glance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
            All systems operational
          </div>

          <button 
            onClick={() => setIsAiChatOpen(!isAiChatOpen)}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs shadow-lg shadow-purple-500/30 hover:from-purple-500 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            Ask ClaimFlow AI
          </button>
        </div>
      </div>

      {/* Dark AI Agent Live Banner - Vibrant Dark Gradient Card */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-950 via-purple-950 to-indigo-950 p-6 md:p-8 text-white border border-purple-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/20 blur-[100px] pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          {/* Left: Orb & Live Status */}
          <div className="lg:col-span-6 flex items-center gap-5">
            <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 via-fuchsia-500 to-indigo-500 flex items-center justify-center shadow-xl shadow-purple-500/40 shrink-0">
              <Sparkles className="w-8 h-8 text-white animate-pulse" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[10px] font-extrabold uppercase tracking-widest flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-fuchsia-400 animate-ping" />
                  AI AGENT • LIVE
                </span>
                <span className="text-xs font-mono text-purple-300">||||||||</span>
              </div>

              <h2 className="text-lg md:text-xl font-bold">
                ClaimFlow AI is handling 4 claims right now
              </h2>

              <div className="flex items-center gap-2 text-xs">
                <span className="px-3 py-1 rounded-full bg-slate-900/60 border border-purple-500/20 text-slate-300">
                  Calling 2 claimants
                </span>
                <span className="px-3 py-1 rounded-full bg-slate-900/60 border border-purple-500/20 text-slate-300">
                  Drafting 2 claims
                </span>
              </div>
            </div>
          </div>

          {/* Right: 3 Mini Bar Chart Counters */}
          <div className="lg:col-span-6 grid grid-cols-3 gap-4 border-t lg:border-t-0 lg:border-l border-purple-500/20 pt-4 lg:pt-0 lg:pl-8">
            <div className="p-3.5 rounded-2xl bg-slate-900/40 border border-purple-500/20">
              <div className="text-[10px] font-semibold text-slate-400 uppercase">Tasks Today</div>
              <div className="text-2xl font-extrabold text-white mt-1">47</div>
              <div className="text-[10px] text-purple-300 mt-1 font-light">12 done • 12 to go</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/40 border border-purple-500/20">
              <div className="text-[10px] font-semibold text-slate-400 uppercase">Time Saved</div>
              <div className="text-2xl font-extrabold text-white mt-1">8.4h</div>
              <div className="text-[10px] text-cyan-300 mt-1 font-light">AI reminders active</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/40 border border-purple-500/20">
              <div className="text-[10px] font-semibold text-slate-400 uppercase">Confirmed</div>
              <div className="text-2xl font-extrabold text-white mt-1">98%</div>
              <div className="text-[10px] text-emerald-300 mt-1 font-light">Awaiting Sarah</div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Theme Responsive KPI Cards with Progress Bars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1 */}
        <div className="bg-white dark:bg-slate-900/90 p-6 rounded-3xl border border-slate-200 dark:border-purple-500/20 shadow-sm dark:shadow-xl space-y-3">
          <div className="flex justify-between items-center text-xs font-bold text-slate-500 dark:text-slate-400">
            <span>Claims Processed Today</span>
            <CheckCircle2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">24</div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">12 done • 12 to go</div>
          <div className="w-full bg-slate-100 dark:bg-slate-950 h-2 rounded-full overflow-hidden">
            <div className="bg-purple-600 dark:bg-purple-500 h-full w-[18%]" />
          </div>
          <div className="text-[10px] font-bold text-purple-700 dark:text-purple-300 text-right">Progress 18%</div>
        </div>

        {/* Card 2 */}
        <div className="bg-white dark:bg-slate-900/90 p-6 rounded-3xl border border-slate-200 dark:border-rose-500/20 shadow-sm dark:shadow-xl space-y-3">
          <div className="flex justify-between items-center text-xs font-bold text-slate-500 dark:text-slate-400">
            <span>AI Risk Flag Rate</span>
            <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
          </div>
          <div className="text-3xl font-extrabold text-rose-600 dark:text-rose-400">3.2%</div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">AI reminders active</div>
          <div className="w-full bg-slate-100 dark:bg-slate-950 h-2 rounded-full overflow-hidden">
            <div className="bg-rose-600 dark:bg-rose-500 h-full w-[3.2%]" />
          </div>
          <div className="text-[10px] font-bold text-rose-700 dark:text-rose-300 text-right">Progress 3.2%</div>
        </div>

        {/* Card 3 */}
        <div className="bg-white dark:bg-slate-900/90 p-6 rounded-3xl border border-slate-200 dark:border-amber-500/20 shadow-sm dark:shadow-xl space-y-3">
          <div className="flex justify-between items-center text-xs font-bold text-slate-500 dark:text-slate-400">
            <span>Claims Pending Review</span>
            <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-amber-600 dark:text-amber-400">{kpis?.pendingClaims || 3}</div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">awaiting Sarah</div>
          <div className="w-full bg-slate-100 dark:bg-slate-950 h-2 rounded-full overflow-hidden">
            <div className="bg-amber-600 dark:bg-amber-500 h-full w-[12%]" />
          </div>
          <div className="text-[10px] font-bold text-amber-700 dark:text-amber-300 text-right">Progress 12%</div>
        </div>

        {/* Card 4 */}
        <div className="bg-white dark:bg-slate-900/90 p-6 rounded-3xl border border-slate-200 dark:border-emerald-500/20 shadow-sm dark:shadow-xl space-y-3">
          <div className="flex justify-between items-center text-xs font-bold text-slate-500 dark:text-slate-400">
            <span>Claim Payouts MTD</span>
            <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">₹48.2K</div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">on track for ₹62k</div>
          <div className="w-full bg-slate-100 dark:bg-slate-950 h-2 rounded-full overflow-hidden">
            <div className="bg-indigo-600 dark:bg-indigo-500 h-full w-[24%]" />
          </div>
          <div className="text-[10px] font-bold text-indigo-700 dark:text-indigo-300 text-right">Progress 24%</div>
        </div>
      </div>

      {/* Main Content 2-Column Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Panel: AI Agent Activity */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900/90 rounded-3xl p-6 border border-slate-200 dark:border-purple-500/20 shadow-sm dark:shadow-xl space-y-5">
          <div className="flex justify-between items-center">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-ping" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">AI Agent Activity</h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Live telemetry • last 24 hours</p>
            </div>
            <button className="px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30 text-xs font-semibold hover:bg-purple-100 dark:hover:bg-purple-500/20">
              View All
            </button>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-purple-500/10 flex items-start gap-3.5 text-xs">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-500/10 border border-emerald-300 dark:border-emerald-500/30 flex items-center justify-center text-emerald-700 dark:text-emerald-400 shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="font-bold text-slate-900 dark:text-white">Confirmed Sophia M. via SMS for tomorrow 14:30</div>
                <div className="text-[11px] text-purple-700 dark:text-purple-300 mt-1">AI agent • 2 min ago</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-purple-500/10 flex items-start gap-3.5 text-xs">
              <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-500/10 border border-purple-300 dark:border-purple-500/30 flex items-center justify-center text-purple-700 dark:text-purple-400 shrink-0">
                <FileEdit className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="font-bold text-slate-900 dark:text-white">Drafted claim for Michael C. • auto body repair estimate</div>
                <div className="text-[11px] text-purple-700 dark:text-purple-300 mt-1">AI agent • 18 min ago</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-purple-500/10 flex items-start gap-3.5 text-xs">
              <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-500/10 border border-amber-300 dark:border-amber-500/30 flex items-center justify-center text-amber-700 dark:text-amber-400 shrink-0">
                <Calendar className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="font-bold text-slate-900 dark:text-white">Rescheduled 1 claim from Tue 14:00 → Wed 10:30 (adjuster conflict)</div>
                <div className="text-[11px] text-purple-700 dark:text-purple-300 mt-1">AI agent • 1 hour ago</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-purple-500/10 flex items-start gap-3.5 text-xs">
              <div className="w-8 h-8 rounded-xl bg-cyan-100 dark:bg-cyan-500/10 border border-cyan-300 dark:border-cyan-500/30 flex items-center justify-center text-cyan-700 dark:text-cyan-400 shrink-0">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="font-bold text-slate-900 dark:text-white">Follow-up sent to Olivia P. — "No damage escalation, thanks ClaimFlow."</div>
                <div className="text-[11px] text-purple-700 dark:text-purple-300 mt-1">AI agent • 2 hours ago</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel: Today's Schedule & Claims Queue */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900/90 rounded-3xl p-6 border border-slate-200 dark:border-purple-500/20 shadow-sm dark:shadow-xl space-y-5">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Today's Claims Queue</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">12 of 24 appointments & claim reviews completed</p>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold">
              <span className="px-3 py-1 rounded-full bg-purple-600 text-white">Today 18</span>
              <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400">Tomorrow 18</span>
            </div>
          </div>

          <div className="space-y-3">
            {highRiskClaims.slice(0, 4).map((claim: any, idx: number) => {
              const times = ['09:30', '10:00', '11:45', '14:15'];
              return (
                <div key={claim.id || claim._id || idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-purple-500/10 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-4">
                    <div className="text-center font-mono pr-3 border-r border-slate-200 dark:border-purple-500/10">
                      <div className="font-bold text-slate-900 dark:text-white">{times[idx % times.length]}</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">30 min</div>
                    </div>

                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">{claim.claimNumber} • {claim.claimType}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Estimated: ₹{claim.estimatedAmount?.toLocaleString()}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <StatusBadge status={claim.status} />
                    <Link href={`/adjuster/claims/${claim.id || claim._id}`} className="p-1.5 rounded-lg bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-500/20">
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Collapsible Ask ClaimFlow AI Floating Chat Drawer */}
      {isAiChatOpen && (
        <div className="fixed bottom-6 right-6 w-96 rounded-3xl bg-white dark:bg-[#0A0B10]/95 border border-slate-200 dark:border-purple-500/40 shadow-2xl z-50 flex flex-col h-[480px] overflow-hidden backdrop-blur-2xl animate-in slide-in-from-bottom-5">
          <div className="p-4 bg-gradient-to-r from-slate-900 to-purple-950 border-b border-purple-500/20 flex justify-between items-center text-white">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-fuchsia-400" />
              <span className="font-bold text-sm">Ask ClaimFlow AI Assistant</span>
            </div>
            <button onClick={() => setIsAiChatOpen(false)} className="text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-3 rounded-2xl max-w-[80%] ${
                  msg.role === 'user' 
                    ? 'bg-purple-600 text-white rounded-br-none' 
                    : 'bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-purple-500/20 text-slate-800 dark:text-slate-200 rounded-bl-none'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendChat} className="p-3 border-t border-slate-200 dark:border-purple-500/20 flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask AI about claim risk or policy limits..."
              className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-purple-500/30 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
            />
            <button type="submit" className="p-2.5 rounded-xl bg-purple-600 text-white hover:bg-purple-500">
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
