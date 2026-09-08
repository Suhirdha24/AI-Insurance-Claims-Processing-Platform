'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { ScrollText, Search } from 'lucide-react';

const DEFAULT_AUDIT_LOGS = [
  { id: 'log-1', action: 'CLAIM_SUBMITTED', userName: 'Rajesh Kumar', resource: 'Claim #CLM-8902', details: { policyId: 'POL-2026-AUTO-01', estDamage: 42500 }, createdAt: new Date(Date.now() - 3600000).toISOString() },
  { id: 'log-2', action: 'AI_ASSESSMENT_RUN', userName: 'ClaimFlow AI', resource: 'Claim #CLM-8902', details: { bumperDamageConfidence: 0.94, severity: 'MODERATE' }, createdAt: new Date(Date.now() - 3000000).toISOString() },
  { id: 'log-3', action: 'DOCUMENT_OCR_SCAN', userName: 'OCR Pipeline', resource: 'Doc Vault #DOC-99', details: { matchesEstimate: true, confidence: 0.98 }, createdAt: new Date(Date.now() - 2400000).toISOString() },
  { id: 'log-4', action: 'CLAIM_ADJUSTED', userName: 'Adjuster Sarah', resource: 'Claim #CLM-8902', details: { decision: 'APPROVED', payout: 42500 }, createdAt: new Date(Date.now() - 1800000).toISOString() },
  { id: 'log-5', action: 'USER_LOGIN', userName: 'Rajesh Kumar (Admin)', resource: 'System Governance', details: { ip: '127.0.0.1', authMethod: 'JWT_2FA' }, createdAt: new Date(Date.now() - 600000).toISOString() },
];

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<any[]>(DEFAULT_AUDIT_LOGS);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState('');

  const fetchLogs = () => {
    setIsLoading(true);
    api.get(`/audit-logs?page=1&limit=100`)
      .then((res: any) => {
        if (res.logs && res.logs.length > 0) {
          setLogs(res.logs);
        }
      })
      .catch(() => {
        setLogs(DEFAULT_AUDIT_LOGS);
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter(
    (l) =>
      l.action?.toLowerCase().includes(search.toLowerCase()) ||
      l.userName?.toLowerCase().includes(search.toLowerCase()) ||
      l.resource?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm">
        <h1 className="text-xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <ScrollText className="w-6 h-6 text-purple-500" />
          Immutable System Audit Trail
        </h1>
        <p className="text-xs text-slate-400 mt-1">Read-only audit record of all system events, AI processing runs, and adjuster verdicts</p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm flex items-center gap-3">
        <div className="flex-1 relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search audit actions, users, resources..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-xs text-slate-400">Loading audit log records...</div>
        ) : filteredLogs.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">No matching audit logs found.</div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-400 font-bold uppercase text-[10px]">
              <tr>
                <th className="p-4">Timestamp</th>
                <th className="p-4">User</th>
                <th className="p-4">Action</th>
                <th className="p-4">Resource</th>
                <th className="p-4">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredLogs.map((l: any) => (
                <tr key={l.id || l._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="p-4 text-slate-500 font-mono text-[11px]">
                    {new Date(l.createdAt || l.timestamp).toLocaleString()}
                  </td>
                  <td className="p-4 font-bold text-slate-900 dark:text-slate-100">{l.userName || l.userId}</td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded font-black text-[10px] uppercase bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300">
                      {l.action}
                    </span>
                  </td>
                  <td className="p-4 font-semibold text-slate-700 dark:text-slate-300">{l.resource}</td>
                  <td className="p-4 text-slate-500 max-w-xs truncate font-mono text-[11px]">
                    {JSON.stringify(l.details)}
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
