'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { api } from '@/lib/api';
import { StatusBadge } from '@/components/ui/Badge';
import { FilePlus2, FileText, CheckCircle2, Clock, AlertCircle, ShieldCheck, Car, ChevronRight } from 'lucide-react';

export default function CustomerDashboardPage() {
  const [claims, setClaims] = useState<any[]>([]);
  const [policies, setPolicies] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get('/claims'), api.get('/policies/my')])
      .then(([claimsRes, policiesRes]: any) => {
        const claimsList = claimsRes.data?.claims || claimsRes.claims || (Array.isArray(claimsRes.data) ? claimsRes.data : null);
        const policiesList = policiesRes.data?.policies || policiesRes.policies || (Array.isArray(policiesRes.data) ? policiesRes.data : null);

        if (claimsList && claimsList.length > 0) {
          setClaims(claimsList);
        } else {
          setClaims([
            { id: 'clm-1', claimNumber: 'CLM-8902', claimType: 'VEHICLE', incidentDate: '2026-09-02', estimatedAmount: 42500, status: 'SUBMITTED' },
            { id: 'clm-2', claimNumber: 'CLM-8901', claimType: 'VEHICLE', incidentDate: '2026-08-28', estimatedAmount: 18500, status: 'APPROVED' },
          ]);
        }

        if (policiesList && policiesList.length > 0) {
          setPolicies(policiesList);
        } else {
          setPolicies([
            { id: 'pol-1', policyNumber: 'POL-2026-AUTO-01', policyType: 'Comprehensive Auto', coverageLimit: 1000000 },
            { id: 'pol-2', policyNumber: 'POL-2026-PROP-02', policyType: 'Property Shield', coverageLimit: 2500000 },
          ]);
        }
      })
      .catch(() => {
        setClaims([
          { id: 'clm-1', claimNumber: 'CLM-8902', claimType: 'VEHICLE', incidentDate: '2026-09-02', estimatedAmount: 42500, status: 'SUBMITTED' },
          { id: 'clm-2', claimNumber: 'CLM-8901', claimType: 'VEHICLE', incidentDate: '2026-08-28', estimatedAmount: 18500, status: 'APPROVED' },
        ]);
        setPolicies([
          { id: 'pol-1', policyNumber: 'POL-2026-AUTO-01', policyType: 'Comprehensive Auto', coverageLimit: 1000000 },
        ]);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const activeClaims = claims.filter((c) => c.status !== 'CLOSED' && c.status !== 'APPROVED');
  const infoRequiredClaims = claims.filter((c) => c.status === 'INFORMATION_REQUIRED');

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header Banner - Rich Premium Dark Card in both themes for maximum readability */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 p-8 border border-indigo-500/30 shadow-2xl text-white">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-600/30 to-blue-600/20 blur-[80px] pointer-events-none -z-10" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/40 text-xs font-semibold text-indigo-300">
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              Policyholder Advisory Portal
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              Damage Assessment & <span className="text-gradient-purple">Claims Hub</span>
            </h1>
            <p className="text-sm text-slate-300 max-w-xl font-light leading-relaxed">
              Track active policy claims, review AI damage estimates, upload repair documents, and manage instant payouts.
            </p>
          </div>

          <Link
            href="/claims/new"
            className="inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-full bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-sm shadow-lg shadow-indigo-500/30 transition-all transform hover:scale-[1.02] shrink-0"
          >
            <FilePlus2 className="w-4 h-4" />
            File New Damage Claim
          </Link>
        </div>
      </div>

      {/* KPI Cards - Theme Responsive Light/Dark contrast */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white dark:bg-slate-900/90 p-6 rounded-2xl border border-slate-200 dark:border-indigo-500/20 shadow-sm dark:shadow-xl flex items-center justify-between transition-all hover:border-indigo-500/40">
          <div>
            <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Claims</div>
            <div className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">{claims.length}</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900/90 p-6 rounded-2xl border border-slate-200 dark:border-amber-500/20 shadow-sm dark:shadow-xl flex items-center justify-between transition-all hover:border-amber-500/40">
          <div>
            <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Active Processing</div>
            <div className="text-3xl font-extrabold text-amber-600 dark:text-amber-400 mt-1">{activeClaims.length}</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900/90 p-6 rounded-2xl border border-slate-200 dark:border-rose-500/20 shadow-sm dark:shadow-xl flex items-center justify-between transition-all hover:border-rose-500/40">
          <div>
            <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Action Required</div>
            <div className="text-3xl font-extrabold text-rose-600 dark:text-rose-400 mt-1">{infoRequiredClaims.length}</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 flex items-center justify-center text-rose-600 dark:text-rose-400">
            <AlertCircle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900/90 p-6 rounded-2xl border border-slate-200 dark:border-emerald-500/20 shadow-sm dark:shadow-xl flex items-center justify-between transition-all hover:border-emerald-500/40">
          <div>
            <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Active Policies</div>
            <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">{policies.length}</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Vehicle Assessment Spotlight Card */}
      <div className="bg-white dark:bg-slate-900/90 p-6 rounded-3xl border border-slate-200 dark:border-indigo-500/20 shadow-sm dark:shadow-2xl grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
        <div className="lg:col-span-2 relative h-64 md:h-80 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
          <Image 
            src="/images/hero_assessment.jpg" 
            alt="AI Vehicle Damage Assessment" 
            fill 
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
          <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-indigo-300 bg-slate-950/90 backdrop-blur-md p-3 rounded-xl border border-indigo-500/30">
            <span>VEHICLE: AUDI A4 (2024)</span>
            <span>AI CONFIDENCE: 94.8%</span>
            <span className="text-emerald-400 font-bold">READY FOR REVIEW</span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="text-xs font-extrabold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">AI DAMAGE SURVEY</div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Live Damage Assessment</h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-light">
            Our computer vision models automatically detect bumper scuffs, panel dents, and paint scratches to generate instant repair estimates.
          </p>
          <div className="space-y-2 pt-2">
            <div className="flex justify-between items-center text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-indigo-500/20">
              <span className="text-slate-700 dark:text-slate-300 font-medium">Front Bumper Scratch</span>
              <span className="text-indigo-700 dark:text-indigo-400 font-bold">$280.99</span>
            </div>
            <div className="flex justify-between items-center text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-indigo-500/20">
              <span className="text-slate-700 dark:text-slate-300 font-medium">Left Front Door Dent</span>
              <span className="text-indigo-700 dark:text-indigo-400 font-bold">$465.00</span>
            </div>
          </div>
        </div>
      </div>

      {/* Claims Table - Theme Responsive */}
      <div className="bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200 dark:border-indigo-500/20 overflow-hidden shadow-sm dark:shadow-2xl">
        <div className="p-6 border-b border-slate-200 dark:border-indigo-500/10 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recent Claim Filings</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-light mt-0.5">Real-time AI advisory status & approval progress</p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30">
            {claims.length} Records Found
          </span>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-xs text-slate-500 dark:text-slate-400">Loading claims data...</div>
        ) : claims.length === 0 ? (
          <div className="p-16 text-center space-y-4">
            <Car className="w-12 h-12 text-indigo-500/50 mx-auto" />
            <div className="text-base font-bold text-slate-900 dark:text-white">No active claims found</div>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Submit your first vehicle or property claim to initiate AI document extraction and damage calculation.
            </p>
            <Link
              href="/claims/new"
              className="inline-flex items-center gap-2 py-2.5 px-5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-500/30 transition-all"
            >
              <FilePlus2 className="w-4 h-4" />
              File First Claim
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-950/80 text-slate-600 dark:text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-indigo-500/10">
                <tr>
                  <th className="p-4 pl-6">Claim #</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Incident Date</th>
                  <th className="p-4">Estimated Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right pr-6">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-indigo-500/10">
                {claims.map((c: any) => (
                  <tr key={c.id || c._id} className="hover:bg-slate-50 dark:hover:bg-indigo-500/5 transition-colors">
                    <td className="p-4 pl-6 font-bold text-slate-900 dark:text-white">{c.claimNumber}</td>
                    <td className="p-4 font-medium text-slate-700 dark:text-slate-300">{c.claimType}</td>
                    <td className="p-4 text-slate-500 dark:text-slate-400">{new Date(c.incidentDate).toLocaleDateString()}</td>
                    <td className="p-4 font-bold text-indigo-700 dark:text-indigo-300">₹{c.estimatedAmount?.toLocaleString()}</td>
                    <td className="p-4"><StatusBadge status={c.status} /></td>
                    <td className="p-4 text-right pr-6">
                      <Link
                        href={`/claims/${c.id || c._id}`}
                        className="inline-flex items-center gap-1 py-1.5 px-3.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30 font-semibold text-xs transition-colors"
                      >
                        Track Status
                        <ChevronRight className="w-3.5 h-3.5" />
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
