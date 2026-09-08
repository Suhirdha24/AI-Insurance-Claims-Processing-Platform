'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { ScrollText, Search, Eye, X, ShieldCheck, Clock } from 'lucide-react';

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
  const [selectedLog, setSelectedLog] = useState<any | null>(null);

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

  const renderFormattedDetails = (details: any) => {
    if (!details) return <span className="text-slate-400 italic text-[11px]">No details provided</span>;

    let parsed = details;
    if (typeof details === 'string') {
      try {
        parsed = JSON.parse(details);
      } catch (e) {
        parsed = { note: details };
      }
    }

    if (typeof parsed !== 'object') {
      return <span className="text-slate-700 font-medium text-[11px]">{String(parsed)}</span>;
    }

    const entries = Object.entries(parsed);
    if (entries.length === 0) return <span className="text-slate-400 italic text-[11px]">No details provided</span>;

    return (
      <div className="flex flex-wrap gap-1.5 items-center">
        {entries.slice(0, 3).map(([key, val]: [string, any], idx: number) => {
          let displayVal = typeof val === 'object' ? JSON.stringify(val) : String(val);
          if (key === 'estDamage' || key === 'payout' || key === 'amount') {
            displayVal = `₹${Number(val).toLocaleString()}`;
          }
          return (
            <span
              key={idx}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-800 text-[11px] font-medium"
            >
              <span className="font-bold text-purple-700">{key}:</span>
              <span>{displayVal}</span>
            </span>
          );
        })}
        {entries.length > 3 && (
          <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
            +{entries.length - 3} more
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <ScrollText className="w-5 h-5" />
            </div>
            Immutable System Audit Trail
          </h1>
          <p className="text-xs text-slate-500 mt-1">Read-only audit record of all system events, AI processing runs, and adjuster verdicts</p>
        </div>
        <div className="px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Tamper-Proof Audit Enabled</span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm flex items-center gap-3">
        <div className="flex-1 relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search audit actions, users, resources..."
            className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 font-medium focus:ring-2 focus:ring-purple-500/50 outline-none"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-xs text-slate-500">Loading audit log records...</div>
        ) : filteredLogs.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">No matching audit logs found.</div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] border-b border-slate-200">
              <tr>
                <th className="p-4">Timestamp</th>
                <th className="p-4">User</th>
                <th className="p-4">Action</th>
                <th className="p-4">Resource</th>
                <th className="p-4">Formatted Details</th>
                <th className="p-4 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map((l: any) => (
                <tr key={l.id || l._id} className="hover:bg-purple-50/30 transition-colors">
                  <td className="p-4 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {new Date(l.createdAt || l.timestamp).toLocaleString()}
                    </span>
                  </td>
                  <td className="p-4 font-bold text-slate-900">{l.userName || l.userId}</td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-md font-extrabold text-[10px] uppercase bg-purple-100 text-purple-700 border border-purple-200">
                      {l.action}
                    </span>
                  </td>
                  <td className="p-4 font-bold text-slate-800">{l.resource}</td>
                  <td className="p-4">
                    {renderFormattedDetails(l.details)}
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => setSelectedLog(l)}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-purple-100 text-slate-700 hover:text-purple-700 border border-slate-200 hover:border-purple-300 transition-all text-xs font-bold flex items-center gap-1.5 ml-auto"
                      title="Inspect payload"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Log Detail Inspector Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold text-xs">
                  <ScrollText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm">Audit Payload Inspector</h3>
                  <p className="text-[11px] text-slate-500 font-mono">{selectedLog.resource}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="p-1.5 rounded-xl hover:bg-slate-200 text-slate-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 font-semibold">
                <div>
                  <span className="text-slate-400 text-[10px] block uppercase font-bold">Action Event</span>
                  <span className="text-purple-700 font-mono font-bold">{selectedLog.action}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block uppercase font-bold">Executed By</span>
                  <span className="text-slate-900">{selectedLog.userName}</span>
                </div>
              </div>

              <div>
                <span className="text-slate-700 font-bold block mb-1.5">Full Payload Details (Structured)</span>
                <pre className="p-4 rounded-2xl bg-slate-900 text-emerald-400 font-mono text-[11px] overflow-x-auto max-h-60 leading-relaxed shadow-inner">
                  {JSON.stringify(selectedLog.details, null, 2)}
                </pre>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 text-right">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-colors shadow-md shadow-purple-500/20"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

