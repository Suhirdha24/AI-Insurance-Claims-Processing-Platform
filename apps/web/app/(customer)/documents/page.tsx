'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { FileText, FolderOpen } from 'lucide-react';

export default function CustomerDocumentsPage() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.get('/claims')
      .then((res: any) => {
        const claims = res.claims || [];
        const allDocs: any[] = [];
        claims.forEach((c: any) => {
          if (c.documents) allDocs.push(...c.documents);
        });
        setDocuments(allDocs);
      })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <h1 className="text-xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <FolderOpen className="w-6 h-6 text-blue-500" />
          Document Repository
        </h1>
        <p className="text-xs text-slate-400 mt-1">Uploaded policies, police FIR reports, repair estimates and claim forms</p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        {isLoading ? (
          <div className="text-center text-xs text-slate-400 p-8">Loading document repository...</div>
        ) : documents.length === 0 ? (
          <div className="text-center text-xs text-slate-400 p-8">No documents uploaded yet.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {documents.map((doc, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2 text-xs">
                <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
                  <FileText className="w-4 h-4 text-blue-500" />
                  <span className="truncate">{doc.fileName}</span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>Type: {doc.documentType}</span>
                  <span className="uppercase text-[9px] font-bold text-emerald-600">{doc.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
