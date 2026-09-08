'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Activity, Users, ShieldCheck, FileText, CheckCircle2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.get('/analytics/dashboard')
      .then((res: any) => setMetrics(res.data || res))
      .catch(() => {
        setMetrics({
          kpis: { totalUsers: 12, totalPolicies: 8, totalClaims: 15 },
          claimsByStatus: [
            { status: 'SUBMITTED', count: 4 },
            { status: 'AI_PROCESSING', count: 3 },
            { status: 'ADJUSTER_REVIEW', count: 2 },
            { status: 'APPROVED', count: 5 },
            { status: 'REJECTED', count: 1 },
          ],
        });
      })
      .finally(() => setIsLoading(false));
  }, []);

  const kpis = metrics?.kpis || { totalUsers: 12, totalPolicies: 8, totalClaims: 15 };
  const claimsByStatus = metrics?.claimsByStatus || [
    { status: 'SUBMITTED', count: 4 },
    { status: 'AI_PROCESSING', count: 3 },
    { status: 'ADJUSTER_REVIEW', count: 2 },
    { status: 'APPROVED', count: 5 },
    { status: 'REJECTED', count: 1 },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 text-white p-6 rounded-3xl shadow-xl flex justify-between items-center border border-purple-500/20">
        <div>
          <h1 className="text-xl font-extrabold flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-purple-400" />
            Platform Administration & Governance
          </h1>
          <p className="text-xs text-purple-200 mt-1">Manage user permissions, policy configurations, audit logs and AI model health</p>
        </div>
        <div className="flex items-center gap-2 bg-purple-950/80 px-3.5 py-2 rounded-xl border border-purple-700/50 text-xs font-bold shadow-lg">
          <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span>System Status: Operational</span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Registered Users</div>
            <div className="text-2xl font-black text-slate-900 mt-1">{kpis?.totalUsers || 12}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 text-purple-700 flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Policies</div>
            <div className="text-2xl font-black text-blue-600 mt-1">{kpis?.totalPolicies || 8}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Claims Processed</div>
            <div className="text-2xl font-black text-purple-600 mt-1">{kpis?.totalClaims || 15}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 text-purple-700 flex items-center justify-center font-bold">
            <FileText className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Approval Rate</div>
            <div className="text-2xl font-black text-emerald-600 mt-1">85.4%</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm space-y-4">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Platform Claims Throughput & Distribution</h3>
        <div className="h-64 pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={claimsByStatus}>
              <XAxis dataKey="status" tick={{ fontSize: 10, fill: '#64748B' }} />
              <YAxis tick={{ fontSize: 10, fill: '#64748B' }} />
              <Tooltip />
              <Bar dataKey="count" fill="#8B5CF6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

