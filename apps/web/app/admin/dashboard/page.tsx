'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.get('/analytics/dashboard')
      .then((res: any) => setMetrics(res.data))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <div className="p-8 text-center text-xs text-slate-400">Loading System Metrics...</div>;

  const { kpis, claimsByStatus } = metrics || {};

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="bg-gradient-to-r from-purple-900 to-slate-900 text-white p-6 rounded-2xl shadow-xl flex justify-between items-center">
        <div>
          <h1 className="text-xl font-black">Platform Administration & Governance</h1>
          <p className="text-xs text-purple-200 mt-1">Manage user permissions, policy configurations, audit logs and AI model health</p>
        </div>
        <div className="flex items-center gap-2 bg-purple-950/60 px-3 py-1.5 rounded-xl border border-purple-800 text-xs font-bold">
          <Activity className="w-4 h-4 text-emerald-400" /> System Status: Operational
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-[11px] font-bold text-slate-400 uppercase">Registered Users</div>
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100">{kpis?.totalUsers || 0}</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-[11px] font-bold text-slate-400 uppercase">Active Policies</div>
          <div className="text-2xl font-black text-blue-600 dark:text-blue-400">{kpis?.totalPolicies || 0}</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-[11px] font-bold text-slate-400 uppercase">Total Claims Processed</div>
          <div className="text-2xl font-black text-purple-600 dark:text-purple-400">{kpis?.totalClaims || 0}</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-[11px] font-bold text-slate-400 uppercase">Approval Rate</div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">85.4%</div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Platform Claims Throughput</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={claimsByStatus}>
              <XAxis dataKey="status" tick={{ fontSize: 10 }} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
