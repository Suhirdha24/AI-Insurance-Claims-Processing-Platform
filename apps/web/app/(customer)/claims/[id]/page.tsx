'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { StatusBadge } from '@/components/ui/Badge';
import { FileText, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export default function CustomerClaimTrackingPage() {
  const params = useParams();
  const claimId = params.id as string;
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.get(`/claims/${claimId}`)
      .then((res: any) => setData(res.data))
      .finally(() => setIsLoading(false));
  }, [claimId]);

  if (isLoading) return <div className="p-8 text-center text-xs text-slate-400">Loading claim tracking data...</div>;
  if (!data) return <div className="p-8 text-center text-xs text-rose-500">Claim record not found.</div>;

  const { claim, documents } = data;

  const stages = [
    'SUBMITTED',
    'DOCUMENT_REVIEW',
    'AI_PROCESSING',
    'ADJUSTER_REVIEW',
    'APPROVED',
    'SETTLEMENT',
    'CLOSED',
  ];

  const currentIdx = stages.indexOf(claim.status);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100">{claim.claimNumber}</h1>
            <StatusBadge status={claim.status} />
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Claim Type: <strong className="text-slate-700 dark:text-slate-300">{claim.claimType}</strong> • Filed on {new Date(claim.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100">₹{claim.estimatedAmount?.toLocaleString()}</div>
          <div className="text-[11px] text-slate-400">Estimated Claim Value</div>
        </div>
      </div>

      {/* Status Timeline */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Claim Lifecycle Progress</h2>

        <div className="flex items-center justify-between relative overflow-x-auto py-2">
          {stages.map((stage, idx) => {
            const isCompleted = idx <= currentIdx;
            const isCurrent = idx === currentIdx;
            return (
              <div key={stage} className="flex flex-col items-center min-w-[90px] relative z-10">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isCurrent
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-110 ring-4 ring-blue-100 dark:ring-blue-900'
                      : isCompleted
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                </div>
                <span className={`text-[10px] font-bold mt-2 text-center ${isCurrent ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500'}`}>
                  {stage.replace(/_/g, ' ')}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Information Requests Alert Banner */}
      {claim.status === 'INFORMATION_REQUIRED' && claim.informationRequested && (
        <div className="bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800 rounded-2xl p-5 space-y-2 text-xs">
          <div className="flex items-center gap-2 font-bold text-orange-800 dark:text-orange-300 text-sm">
            <AlertCircle className="w-5 h-5 text-orange-600" />
            Action Required: Information Requested by Adjuster
          </div>
          <p className="text-orange-700 dark:text-orange-400">{claim.informationRequested.message}</p>
          <div className="pt-2 font-semibold text-slate-700 dark:text-slate-300">
            Requested items: {claim.informationRequested.requestedFields?.join(', ')}
          </div>
        </div>
      )}

      {/* Claim Summary & Documents */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Incident Details</h3>
          <div className="text-xs space-y-2">
            <div><span className="text-slate-400">Location:</span> <strong className="text-slate-800 dark:text-slate-200">{claim.incidentLocation}</strong></div>
            <div><span className="text-slate-400">Incident Date:</span> <strong className="text-slate-800 dark:text-slate-200">{new Date(claim.incidentDate).toLocaleDateString()}</strong></div>
            <div><span className="text-slate-400">Description:</span> <p className="mt-1 p-2 rounded bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300">{claim.description}</p></div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Submitted Documents ({documents.length})</h3>
          <div className="space-y-2">
            {documents.map((doc: any) => (
              <div key={doc.id || doc._id} className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-500" />
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{doc.fileName}</span>
                </div>
                <span className="text-[10px] font-bold uppercase text-emerald-600">{doc.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
