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
      <div className="glass-panel border border-purple-500/30 rounded-3xl p-6 shadow-xl">
        <h1 className="text-xl font-extrabold text-white flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300">
            <FolderOpen className="w-6 h-6 text-purple-400" />
          </div>
          <span>Document Repository</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">Uploaded policies, police FIR reports, repair estimates and claim forms</p>
      </div>

      <div className="glass-panel border border-purple-500/30 rounded-3xl p-6 shadow-xl">
        {isLoading ? (
          <div className="text-center text-xs text-slate-400 p-8">Loading document repository...</div>
        ) : documents.length === 0 ? (
          <div className="text-center text-xs text-slate-400 p-12 space-y-2">
            <FolderOpen className="w-10 h-10 text-purple-400/50 mx-auto" />
            <div className="font-bold text-slate-300">No documents uploaded yet</div>
            <p className="text-[11px] text-slate-500">Submit a claim to attach evidence documents and FIR reports</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {documents.map((doc, idx) => (
              <div key={idx} className="p-4 rounded-2xl border border-purple-500/20 bg-slate-900/80 hover:border-purple-500/40 transition-all space-y-2 text-xs">
                <div className="flex items-center gap-2 font-bold text-white">
                  <FileText className="w-4 h-4 text-purple-400" />
                  <span className="truncate">{doc.fileName}</span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>Type: {doc.documentType}</span>
                  <span className="uppercase text-[9px] font-bold text-emerald-400">{doc.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
