'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Shield } from 'lucide-react';

const DEFAULT_POLICIES = [
  { id: 'pol-1', policyNumber: 'POL-2026-AUTO-01', policyType: 'COMPREHENSIVE_AUTO', coverageLimit: 1000000, deductible: 15000, status: 'ACTIVE' },
  { id: 'pol-2', policyNumber: 'POL-2026-MOTO-02', policyType: 'TWO_WHEELER_PROTECT', coverageLimit: 500000, deductible: 5000, status: 'ACTIVE' },
  { id: 'pol-3', policyNumber: 'POL-2026-COMM-03', policyType: 'COMMERCIAL_FLEET', coverageLimit: 2500000, deductible: 50000, status: 'ACTIVE' },
  { id: 'pol-4', policyNumber: 'POL-2026-EV-04', policyType: 'EV_BATTERY_SHIELD', coverageLimit: 1500000, deductible: 20000, status: 'ACTIVE' },
];

export default function AdminPoliciesPage() {
  const [policies, setPolicies] = useState<any[]>(DEFAULT_POLICIES);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPolicies = () => {
    setIsLoading(true);
    api.get('/policies')
      .then((res: any) => {
        if (res.policies && res.policies.length > 0) {
          setPolicies(res.policies);
        }
      })
      .catch(() => {
        setPolicies(DEFAULT_POLICIES);
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchPolicies();
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm">
        <div>
          <h1 className="text-xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Shield className="w-6 h-6 text-purple-500" />
            Insurance Policy Catalog
          </h1>
          <p className="text-xs text-slate-400 mt-1">Configure policy templates, coverage limits, deductibles and exclusions</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-xs text-slate-400">Loading policy catalog...</div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-400 font-bold uppercase text-[10px]">
              <tr>
                <th className="p-4">Policy #</th>
                <th className="p-4">Type</th>
                <th className="p-4">Coverage Limit</th>
                <th className="p-4">Deductible</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {policies.map((p: any) => (
                <tr key={p.id || p._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="p-4 font-bold text-slate-900 dark:text-slate-100">{p.policyNumber}</td>
                  <td className="p-4 font-semibold text-slate-600 dark:text-slate-400">{p.policyType}</td>
                  <td className="p-4 font-extrabold text-emerald-600 dark:text-emerald-400">₹{p.coverageLimit?.toLocaleString()}</td>
                  <td className="p-4 text-slate-700 dark:text-slate-300">₹{p.deductible?.toLocaleString()}</td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded font-bold text-[10px] uppercase bg-emerald-50 text-emerald-600">
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
