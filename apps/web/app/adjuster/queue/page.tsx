'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import { StatusBadge, RiskBadge } from '@/components/ui/Badge';
import { Search, ArrowUpRight, Filter, AlertTriangle } from 'lucide-react';
import { ClaimStatus, RiskLevel, ClaimType } from '@ai-insurance/shared';

function ClaimsQueueContent() {
  const searchParams = useSearchParams();
  const initialRiskParam = searchParams.get('riskLevel') || '';

  const [claims, setClaims] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [riskLevel, setRiskLevel] = useState(initialRiskParam);
  const [claimType, setClaimType] = useState('');

  useEffect(() => {
    const paramRisk = searchParams.get('riskLevel') || '';
    if (paramRisk) {
      setRiskLevel(paramRisk);
    }
  }, [searchParams]);

  const fetchClaims = () => {
    setIsLoading(true);
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (status) params.append('status', status);
    if (riskLevel) params.append('riskLevel', riskLevel);
    if (claimType) params.append('claimType', claimType);

    api.get(`/claims?${params.toString()}`)
      .then((res: any) => setClaims(res.claims || []))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchClaims();
  }, [status, riskLevel, claimType]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchClaims();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-purple-500/30 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-white">Claims Queue & Workload Dispatch</h1>
            {riskLevel === 'HIGH' && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-rose-400" />
                HIGH RISK FILTER ACTIVE
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-1">Filter, sort, and inspect submitted insurance claim files</p>
        </div>
      </div>

      <div className="glass-panel p-4 rounded-2xl border border-purple-500/30 shadow-xl flex flex-col md:flex-row items-center gap-3">
        <form onSubmit={handleSearchSubmit} className="flex-1 w-full relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search claim #, description, vehicle reg..."
            className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl bg-slate-900/90 border border-purple-500/30 text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
          />
          <Search className="w-4 h-4 text-purple-400 absolute left-3 top-3" />
        </form>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto text-xs">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="p-2.5 rounded-xl bg-slate-900/90 border border-purple-500/30 text-white font-bold outline-none cursor-pointer"
          >
            <option value="">All Statuses</option>
            {Object.values(ClaimStatus).map((s) => (
              <option key={s} value={s} className="bg-slate-900">{s}</option>
            ))}
          </select>

          <select
            value={riskLevel}
            onChange={(e) => setRiskLevel(e.target.value)}
            className="p-2.5 rounded-xl bg-slate-900/90 border border-purple-500/30 text-white font-bold outline-none cursor-pointer"
          >
            <option value="">All Risk Tiers</option>
            {Object.values(RiskLevel).map((r) => (
              <option key={r} value={r} className="bg-slate-900">{r}</option>
            ))}
          </select>

          <select
            value={claimType}
            onChange={(e) => setClaimType(e.target.value)}
            className="p-2.5 rounded-xl bg-slate-900/90 border border-purple-500/30 text-white font-bold outline-none cursor-pointer"
          >
            <option value="">All Types</option>
            {Object.values(ClaimType).map((t) => (
              <option key={t} value={t} className="bg-slate-900">{t}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="glass-panel border border-purple-500/30 rounded-3xl shadow-xl overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-xs text-slate-400">Loading claims queue...</div>
        ) : claims.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">No claims match the specified filter criteria.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-purple-300 font-bold uppercase text-[10px] border-b border-purple-500/20">
                <tr>
                  <th className="p-4">Claim #</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Risk</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-500/10">
                {claims.map((c: any) => (
                  <tr key={c.id || c._id} className="hover:bg-purple-600/10 transition-colors">
                    <td className="p-4 font-bold text-white">{c.claimNumber}</td>
                    <td className="p-4 font-semibold text-slate-300">{c.customerId?.name || 'Customer'}</td>
                    <td className="p-4 text-slate-400 font-mono">{c.claimType}</td>
                    <td className="p-4 font-extrabold text-emerald-400">₹{c.estimatedAmount?.toLocaleString()}</td>
                    <td className="p-4"><RiskBadge level={c.riskLevel} score={c.riskScore} /></td>
                    <td className="p-4"><StatusBadge status={c.status} /></td>
                    <td className="p-4 text-right">
                      <Link
                        href={`/adjuster/claims/${c.id || c._id}`}
                        className="inline-flex items-center gap-1 py-1.5 px-3 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-[11px] shadow-md shadow-purple-500/20"
                      >
                        Review <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ClaimsQueuePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading queue parameters...</div>}>
      <ClaimsQueueContent />
    </Suspense>
  );
}
