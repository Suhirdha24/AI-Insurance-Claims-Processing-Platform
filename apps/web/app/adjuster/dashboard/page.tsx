'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { StatusBadge, RiskBadge } from '@/components/ui/Badge';
import { AlertTriangle, ArrowUpRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function AdjusterDashboardPage() {
  const [metrics, setMetrics] = useState<any>(null);
  const [highRiskClaims, setHighRiskClaims] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/analytics/dashboard'),
      api.get('/claims?riskLevel=HIGH&limit=5'),
    ])
      .then(([analyticsRes, claimsRes]: any) => {
        setMetrics(analyticsRes.data);
        setHighRiskClaims(claimsRes.claims || []);
      })
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <div className="p-8 text-center text-xs text-slate-400">Loading Adjuster Operations Dashboard...</div>;

  const { kpis, claimsByStatus, claimsByRisk } = metrics || {};
  const COLORS = ['#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center bg-gradient-to-r from-navy-800 to-slate-900 text-white p-6 rounded-2xl shadow-xl">
        <div>
          <h1 className="text-xl font-black">Claims Adjuster Command Center</h1>
          <p className="text-xs text-slate-300 mt-1">Review AI extraction signals, cross-doc mismatches, and render decisions</p>
        </div>
        <Link
          href="/adjuster/queue"
          className="py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-xs flex items-center gap-1.5 transition-all shadow-lg shadow-blue-500/20"
        >
          View Full Claims Queue <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-[11px] font-bold text-slate-400 uppercase">Pending Review</div>
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100">{kpis?.pendingClaims || 0}</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-[11px] font-bold text-slate-400 uppercase">High Risk Alerts</div>
          <div className="text-2xl font-black text-rose-600 dark:text-rose-400">{kpis?.highRiskClaims || 0}</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-[11px] font-bold text-slate-400 uppercase">Approved Claims</div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{kpis?.approvedClaims || 0}</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-[11px] font-bold text-slate-400 uppercase">Avg Resolution Time</div>
          <div className="text-2xl font-black text-blue-600 dark:text-blue-400">{kpis?.avgProcessingDays || 1.8} Days</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Claims by Risk Tier</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={claimsByRisk} dataKey="count" nameKey="riskLevel" cx="50%" cy="50%" outerRadius={80} label>
                  {claimsByRisk?.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Claims Distribution by Status</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={claimsByStatus}>
                <XAxis dataKey="status" tick={{ fontSize: 10 }} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <h2 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-500" />
            High Risk Priority Queue
          </h2>
          <Link href="/adjuster/queue?riskLevel=HIGH" className="text-xs font-bold text-blue-500 hover:underline">
            View All High Risk
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-400 font-bold uppercase text-[10px]">
              <tr>
                <th className="p-4">Claim #</th>
                <th className="p-4">Type</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Risk Level</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Review Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {highRiskClaims.map((c: any) => (
                <tr key={c.id || c._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="p-4 font-bold text-slate-900 dark:text-slate-100">{c.claimNumber}</td>
                  <td className="p-4 font-semibold text-slate-600 dark:text-slate-400">{c.claimType}</td>
                  <td className="p-4 font-extrabold text-slate-900 dark:text-slate-100">₹{c.estimatedAmount?.toLocaleString()}</td>
                  <td className="p-4"><RiskBadge level={c.riskLevel} score={c.riskScore} /></td>
                  <td className="p-4"><StatusBadge status={c.status} /></td>
                  <td className="p-4 text-right">
                    <Link
                      href={`/adjuster/claims/${c.id || c._id}`}
                      className="py-1.5 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px]"
                    >
                      Open Workspace
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
