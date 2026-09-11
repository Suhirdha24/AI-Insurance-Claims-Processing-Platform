import React from 'react';
import { ClaimStatus, RiskLevel } from '@ai-insurance/shared';

export function StatusBadge({ status }: { status: ClaimStatus | string }) {
  let style = 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';

  switch (status) {
    case ClaimStatus.SUBMITTED:
    case ClaimStatus.DOCUMENT_REVIEW:
      style = 'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800';
      break;
    case ClaimStatus.AI_PROCESSING:
      style = 'bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800 animate-pulse';
      break;
    case ClaimStatus.ADJUSTER_REVIEW:
    case ClaimStatus.INVESTIGATION:
      style = 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800';
      break;
    case ClaimStatus.INFORMATION_REQUIRED:
      style = 'bg-orange-50 text-orange-700 border border-orange-200 dark:bg-orange-950/40 dark:text-orange-300 dark:border-orange-800';
      break;
    case ClaimStatus.APPROVED:
    case ClaimStatus.SETTLEMENT:
      style = 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800';
      break;
    case ClaimStatus.REJECTED:
    case ClaimStatus.CLOSED:
      style = 'bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800';
      break;
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${style}`}>
      {status ? status.replace(/_/g, ' ') : 'UNKNOWN'}
    </span>
  );
}

export function RiskBadge({ level, score }: { level: RiskLevel | string; score?: number }) {
  let style = 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';

  switch (level) {
    case RiskLevel.LOW:
      style = 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800';
      break;
    case RiskLevel.MEDIUM:
      style = 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800';
      break;
    case RiskLevel.HIGH:
      style = 'bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800';
      break;
    case RiskLevel.CRITICAL:
      style = 'bg-red-100 text-red-800 border border-red-300 dark:bg-red-950/60 dark:text-red-300 dark:border-red-800 animate-pulse';
      break;
  }

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${style}`}>
      <span>{level} RISK</span>
      {score !== undefined && <span className="opacity-85">({score}/100)</span>}
    </span>
  );
}
