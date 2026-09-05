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
        setClaims(claimsRes.claims || []);
        setPolicies(policiesRes.data || []);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const activeClaims = claims.filter((c) => c.status !== 'CLOSED' && c.status !== 'APPROVED');
  const infoRequiredClaims = claims.filter((c) => c.status === 'INFORMATION_REQUIRED');

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header Banner - INSURE.AI Dark Glassmorphism Style */}
      <div className="relative overflow-hidden rounded-3xl glass-panel p-8 border border-purple-500/20 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-600/20 to-fuchsia-600/10 blur-[80px] pointer-events-none -z-10" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-xs font-semibold text-purple-300">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
              Policyholder Advisory Portal
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Damage Assessment & <span className="text-gradient-purple">Claims Hub</span>
            </h1>
            <p className="text-sm text-slate-300 max-w-xl font-light">
              Track active policy claims, review AI damage estimates, upload repair documents, and manage instant payouts.
            </p>
          </div>

          <Link
            href="/claims/new"
            className="inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-full bg-gradient-to-r from-purple-600 via-fuchsia-500 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-purple-500/30 transition-all transform hover:scale-[1.02] shrink-0"
          >
            <FilePlus2 className="w-4 h-4" />
            File New Damage Claim
          </Link>
        </div>
      </div>

      {/* KPI Cards - INSURE.AI Glow Style */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="glass-panel glass-panel-hover p-6 rounded-2xl border border-purple-500/20 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Claims</div>
            <div className="text-3xl font-extrabold text-white mt-1">{claims.length}</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-panel glass-panel-hover p-6 rounded-2xl border border-amber-500/20 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Processing</div>
            <div className="text-3xl font-extrabold text-amber-400 mt-1">{activeClaims.length}</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-panel glass-panel-hover p-6 rounded-2xl border border-rose-500/20 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Action Required</div>
            <div className="text-3xl font-extrabold text-rose-400 mt-1">{infoRequiredClaims.length}</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <AlertCircle className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-panel glass-panel-hover p-6 rounded-2xl border border-emerald-500/20 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Policies</div>
            <div className="text-3xl font-extrabold text-emerald-400 mt-1">{policies.length}</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* INSURE.AI Vehicle Assessment Spotlight Card */}
      <div className="glass-panel p-6 rounded-3xl border border-purple-500/20 grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
        <div className="lg:col-span-2 relative h-64 md:h-80 rounded-2xl overflow-hidden border border-slate-800">
          <Image 
            src="/images/hero_assessment.jpg" 
            alt="AI Vehicle Damage Assessment" 
            fill 
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#06070B] via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs font-mono text-purple-300 bg-slate-950/80 backdrop-blur-md p-3 rounded-xl border border-purple-500/30">
            <span>VEHICLE: AUDI A4 (2024)</span>
            <span>AI CONFIDENCE: 94.8%</span>
            <span>STATUS: READY FOR REVIEW</span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="text-xs font-bold uppercase tracking-widest text-purple-400">AI DAMAGE SURVEY</div>
          <h3 className="text-xl font-bold text-white">Live Damage Assessment</h3>
          <p className="text-xs text-slate-300 leading-relaxed font-light">
            Our computer vision models automatically detect bumper scuffs, panel dents, and paint scratches to generate instant repair estimates.
          </p>
          <div className="space-y-2 pt-2">
            <div className="flex justify-between items-center text-xs p-2.5 rounded-lg bg-slate-900/60 border border-purple-500/20">
              <span className="text-slate-300">Front Bumper Scratch</span>
              <span className="text-purple-400 font-bold">$280.99</span>
            </div>
            <div className="flex justify-between items-center text-xs p-2.5 rounded-lg bg-slate-900/60 border border-purple-500/20">
              <span className="text-slate-300">Left Front Door Dent</span>
              <span className="text-purple-400 font-bold">$465.00</span>
            </div>
          </div>
        </div>
      </div>

      {/* Claims Table - Glassmorphism Style */}
      <div className="glass-panel rounded-3xl border border-purple-500/20 overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-purple-500/10 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-white">Recent Claim Filings</h2>
            <p className="text-xs text-slate-400 font-light mt-0.5">Real-time AI advisory status & approval progress</p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/30">
            {claims.length} Records Found
          </span>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-xs text-slate-400">Loading claims data...</div>
        ) : claims.length === 0 ? (
          <div className="p-16 text-center space-y-4">
            <Car className="w-12 h-12 text-purple-400/50 mx-auto" />
            <div className="text-base font-bold text-white">No active claims found</div>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Submit your first vehicle or property claim to initiate AI document extraction and damage calculation.
            </p>
            <Link
              href="/claims/new"
              className="inline-flex items-center gap-2 py-2.5 px-5 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-500/30 transition-all"
            >
              <FilePlus2 className="w-4 h-4" />
              File First Claim
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-purple-500/10">
                <tr>
                  <th className="p-4 pl-6">Claim #</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Incident Date</th>
                  <th className="p-4">Estimated Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right pr-6">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-500/10">
                {claims.map((c: any) => (
                  <tr key={c.id || c._id} className="hover:bg-purple-500/5 transition-colors">
                    <td className="p-4 pl-6 font-bold text-white">{c.claimNumber}</td>
                    <td className="p-4 font-medium text-slate-300">{c.claimType}</td>
                    <td className="p-4 text-slate-400">{new Date(c.incidentDate).toLocaleDateString()}</td>
                    <td className="p-4 font-bold text-purple-300">₹{c.estimatedAmount?.toLocaleString()}</td>
                    <td className="p-4"><StatusBadge status={c.status} /></td>
                    <td className="p-4 text-right pr-6">
                      <Link
                        href={`/claims/${c.id || c._id}`}
                        className="inline-flex items-center gap-1 py-1.5 px-3.5 rounded-full bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 font-semibold text-xs transition-colors"
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
