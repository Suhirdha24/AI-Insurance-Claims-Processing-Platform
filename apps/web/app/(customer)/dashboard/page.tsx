'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { StatusBadge, RiskBadge } from '@/components/ui/Badge';
import { FilePlus2, FileText, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export default function CustomerDashboardPage() {
  const [claims, setClaims] = useState<any[]>([]);
  const [policies, setPolicies] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get('/claims'), api.get('/policies/my')])
      .then(([claimsRes, policiesRes]: any) => {
        setClaims(claimsRes.claims || []);
        setPolicies(policiesRes.data || []);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const activeClaims = claims.filter((c) => c.status !== 'CLOSED' && c.status !== 'APPROVED');
  const infoRequiredClaims = claims.filter((c) => c.status === 'INFORMATION_REQUIRED');

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-navy-800 to-slate-900 text-white p-6 rounded-2xl shadow-xl">
        <div>
          <h1 className="text-xl font-black">Customer Insurance Portal</h1>
          <p className="text-xs text-slate-300 mt-1">Track active policy claims, upload documents, and manage payouts</p>
        </div>
        <Link
          href="/claims/new"
          className="inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-500/20 transition-all shrink-0"
        >
          <FilePlus2 className="w-4 h-4" />
          Submit a New Claim
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase">Total Claims</div>
            <div className="text-2xl font-black text-slate-900 dark:text-slate-100">{claims.length}</div>
          </div>
          <FileText className="w-8 h-8 text-blue-500/30" />
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase">Active Processing</div>
            <div className="text-2xl font-black text-amber-600 dark:text-amber-400">{activeClaims.length}</div>
          </div>
          <Clock className="w-8 h-8 text-amber-500/30" />
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase">Info Required</div>
            <div className="text-2xl font-black text-orange-600 dark:text-orange-400">{infoRequiredClaims.length}</div>
          </div>
          <AlertCircle className="w-8 h-8 text-orange-500/30" />
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase">Active Policies</div>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{policies.length}</div>
          </div>
          <CheckCircle2 className="w-8 h-8 text-emerald-500/30" />
        </div>
      </div>

      {/* Claims Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <h2 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">My Claim History</h2>
          <span className="text-xs text-slate-400">{claims.length} total records</span>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-xs text-slate-400">Loading claims...</div>
        ) : claims.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <FileText className="w-10 h-10 text-slate-300 mx-auto" />
            <div className="text-sm font-bold text-slate-700 dark:text-slate-300">No claims submitted yet</div>
            <p className="text-xs text-slate-400">Submit your first claim to initiate AI document extraction and processing.</p>
            <Link
              href="/claims/new"
              className="inline-block py-2.5 px-4 rounded-xl bg-blue-600 text-white font-bold text-xs"
            >
              Submit First Claim
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-400 font-bold uppercase text-[10px]">
                <tr>
                  <th className="p-4">Claim #</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Incident Date</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {claims.map((c: any) => (
                  <tr key={c.id || c._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="p-4 font-bold text-slate-900 dark:text-slate-100">{c.claimNumber}</td>
                    <td className="p-4 font-semibold text-slate-600 dark:text-slate-400">{c.claimType}</td>
                    <td className="p-4 text-slate-500">{new Date(c.incidentDate).toLocaleDateString()}</td>
                    <td className="p-4 font-extrabold text-slate-900 dark:text-slate-100">₹{c.estimatedAmount?.toLocaleString()}</td>
                    <td className="p-4"><StatusBadge status={c.status} /></td>
                    <td className="p-4 text-right">
                      <Link
                        href={`/customer/claims/${c.id || c._id}`}
                        className="py-1.5 px-3 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-[11px]"
                      >
                        Track Status
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
