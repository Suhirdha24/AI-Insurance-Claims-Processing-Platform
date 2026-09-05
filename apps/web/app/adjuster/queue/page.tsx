'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { StatusBadge, RiskBadge } from '@/components/ui/Badge';
import { Search, ArrowUpRight } from 'lucide-react';
import { ClaimStatus, RiskLevel, ClaimType } from '@ai-insurance/shared';

export default function ClaimsQueuePage() {
  const [claims, setClaims] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [riskLevel, setRiskLevel] = useState('');
  const [claimType, setClaimType] = useState('');

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm">
        <div>
          <h1 className="text-xl font-black text-slate-900 dark:text-slate-100">Claims Queue & Workload Dispatch</h1>
          <p className="text-xs text-slate-400 mt-1">Filter, sort, and inspect submitted insurance claim files</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm flex flex-col md:flex-row items-center gap-3">
        <form onSubmit={handleSearchSubmit} className="flex-1 w-full relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search claim #, description, vehicle reg..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </form>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto text-xs">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold"
          >
            <option value="">All Statuses</option>
            {Object.values(ClaimStatus).map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <select
            value={riskLevel}
            onChange={(e) => setRiskLevel(e.target.value)}
            className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold"
          >
            <option value="">All Risk Tiers</option>
            {Object.values(RiskLevel).map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>

          <select
            value={claimType}
            onChange={(e) => setClaimType(e.target.value)}
            className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold"
          >
            <option value="">All Types</option>
            {Object.values(ClaimType).map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-xs text-slate-400">Loading claims queue...</div>
        ) : claims.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">No claims match the specified filter criteria.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-400 font-bold uppercase text-[10px]">
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
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {claims.map((c: any) => (
                  <tr key={c.id || c._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="p-4 font-bold text-slate-900 dark:text-slate-100">{c.claimNumber}</td>
                    <td className="p-4 font-semibold text-slate-700 dark:text-slate-300">{c.customerId?.name || 'Customer'}</td>
                    <td className="p-4 text-slate-500">{c.claimType}</td>
                    <td className="p-4 font-extrabold text-slate-900 dark:text-slate-100">₹{c.estimatedAmount?.toLocaleString()}</td>
                    <td className="p-4"><RiskBadge level={c.riskLevel} score={c.riskScore} /></td>
                    <td className="p-4"><StatusBadge status={c.status} /></td>
                    <td className="p-4 text-right">
                      <Link
                        href={`/adjuster/claims/${c.id || c._id}`}
                        className="inline-flex items-center gap-1 py-1.5 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px]"
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
