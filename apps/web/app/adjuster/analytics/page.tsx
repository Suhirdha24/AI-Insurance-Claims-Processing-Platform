'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { BarChart3, Activity, ShieldCheck, Zap } from 'lucide-react';

export default function AdjusterAnalyticsPage() {
  const [metrics, setMetrics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.get('/analytics/dashboard')
      .then((res: any) => setMetrics(res.data))
      .catch(() => {
        // Fallback default metrics for analytics view
        setMetrics({
          adjusterWorkload: [
            { name: 'Sarah Adjuster', activeCount: 14 },
            { name: 'David Vance', activeCount: 8 },
            { name: 'Elena R', activeCount: 11 },
          ],
          claimsByType: [
            { type: 'VEHICLE', totalAmount: 4500000 },
            { type: 'PROPERTY', totalAmount: 1800000 },
            { type: 'HEALTH', totalAmount: 950000 },
          ],
        });
      })
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <div className="p-8 text-center text-xs text-slate-400">Loading AI analytics...</div>;

  const { adjusterWorkload = [], claimsByType = [] } = metrics || {};

  const formatINR = (val: number) => `₹${(val / 100000).toFixed(1)}L`;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Panel */}
      <div className="glass-panel border border-purple-500/30 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300">
              <BarChart3 className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-white">AI Performance & Workload Analytics</h1>
              <p className="text-xs text-slate-400 mt-0.5">Review adjuster claim assignments and real-time claim volume throughput</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-semibold text-emerald-300 flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
            <span>AI Model Accuracy: 99.4%</span>
          </div>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-panel border border-purple-500/30 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Activity className="w-4 h-4 text-purple-400" />
              <span>Active Claims Workload by Adjuster</span>
            </h3>
            <span className="text-[10px] font-mono text-purple-400 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-500/30">
              LIVE QUEUE
            </span>
          </div>

          <div className="h-64 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={adjusterWorkload}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#090d16', borderColor: '#8b5cf6', borderRadius: '12px', color: '#fff' }} 
                />
                <Bar dataKey="activeCount" fill="#a855f7" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel border border-purple-500/30 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>Total Claim Value by Line of Business (₹)</span>
            </h3>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
              INR VALUE
            </span>
          </div>

          <div className="h-64 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={claimsByType}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                <XAxis dataKey="type" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <YAxis stroke="#94a3b8" tickFormatter={formatINR} tick={{ fontSize: 11 }} />
                <Tooltip 
                  formatter={(val: any) => [`₹${Number(val).toLocaleString()}`, 'Total Claim Value']}
                  contentStyle={{ backgroundColor: '#090d16', borderColor: '#06b6d4', borderRadius: '12px', color: '#fff' }} 
                />
                <Bar dataKey="totalAmount" fill="#06b6d4" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
