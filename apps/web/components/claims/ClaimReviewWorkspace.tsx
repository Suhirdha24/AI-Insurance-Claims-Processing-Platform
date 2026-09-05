'use client';

import React, { useState } from 'react';
import { StatusBadge, RiskBadge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { api } from '@/lib/api';
import {
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  FileText,
  Shield,
  Clock,
  MessageSquare,
  Sparkles,
  ChevronRight,
  Eye,
  Edit3,
} from 'lucide-react';

export function ClaimReviewWorkspace({ data, onRefresh }: { data: any; onRefresh: () => void }) {
  const { claim, documents, extractions, riskAnalysis, damageAnalysis, coverageAnalysis } = data;

  // Active document selection for left column
  const [selectedDocId, setSelectedDocId] = useState<string | null>(documents?.[0]?.id || documents?.[0]?._id || null);

  // Modals state
  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [isRequestInfoOpen, setIsRequestInfoOpen] = useState(false);
  const [isDocViewerOpen, setIsDocViewerOpen] = useState(false);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);

  // Form states
  const [approvedAmount, setApprovedAmount] = useState<number>(claim.estimatedAmount);
  const [adjusterNotes, setAdjusterNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [requestFields, setRequestFields] = useState<string[]>(['Incident Date Verification', 'Police Station Clearance']);
  const [requestMessage, setRequestMessage] = useState('');
  const [aiChatQuery, setAiChatQuery] = useState('');
  const [aiChatHistory, setAiChatHistory] = useState<{ sender: 'user' | 'ai'; text: string }[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const activeDoc = documents.find((d: any) => (d.id || d._id) === selectedDocId) || documents[0];

  const handleApprove = async () => {
    try {
      await api.post(`/claims/${claim.id || claim._id}/approve`, {
        approvedAmount: Number(approvedAmount),
        notes: adjusterNotes || 'Approved following review of extracted evidence.',
      });
      setIsApproveOpen(false);
      onRefresh();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleReject = async () => {
    try {
      await api.post(`/claims/${claim.id || claim._id}/reject`, {
        rejectionReason,
        notes: adjusterNotes || 'Claim rejected after manual evaluation.',
      });
      setIsRejectOpen(false);
      onRefresh();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleRequestInfo = async () => {
    try {
      await api.post(`/claims/${claim.id || claim._id}/request-information`, {
        requestedFields: requestFields,
        message: requestMessage || 'Please provide updated documentation to clarify date discrepancies.',
      });
      setIsRequestInfoOpen(false);
      onRefresh();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleAIChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiChatQuery.trim()) return;

    const userMsg = aiChatQuery;
    setAiChatHistory((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setAiChatQuery('');
    setIsAiLoading(true);

    try {
      const res: any = await api.post('/ai/chat', {
        claimId: claim.id || claim._id,
        message: userMsg,
      });
      setAiChatHistory((prev) => [...prev, { sender: 'ai', text: res.data.reply }]);
    } catch (err) {
      setAiChatHistory((prev) => [...prev, { sender: 'ai', text: 'Error connecting to AI Assistant service.' }]);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-65px)] overflow-hidden bg-slate-100 dark:bg-slate-950">
      {/* ================= LEFT COLUMN: Documents Nav ================= */}
      <div className="w-full lg:w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-4 flex flex-col overflow-y-auto">
        <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">
          Claim Evidence ({documents.length})
        </h3>
        <div className="space-y-2">
          {documents.map((doc: any) => {
            const id = doc.id || doc._id;
            const isSelected = id === selectedDocId;
            return (
              <div
                key={id}
                onClick={() => setSelectedDocId(id)}
                className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30 shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between font-semibold text-slate-800 dark:text-slate-200 mb-1">
                  <span className="truncate max-w-[170px]">{doc.fileName}</span>
                  <FileText className="w-4 h-4 text-blue-500 shrink-0" />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>{doc.documentType}</span>
                  <span className="uppercase text-[9px] font-bold text-emerald-600 dark:text-emerald-400">
                    {doc.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={() => setIsDocViewerOpen(true)}
          className="mt-4 flex items-center justify-center gap-2 w-full py-2 px-3 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        >
          <Eye className="w-3.5 h-3.5" />
          Inspect Active Document
        </button>
      </div>

      {/* ================= CENTER COLUMN: Main Review Content ================= */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Workspace Banner */}
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 flex items-center gap-3 text-amber-800 dark:text-amber-300 text-xs font-medium">
          <AlertTriangle className="w-5 h-5 shrink-0 text-amber-600 dark:text-amber-400" />
          <span>
            <strong>AI-Assisted Workspace:</strong> AI outputs are advisory. The final business decision must be rendered by an authorized human adjuster.
          </span>
        </div>

        {/* Claim Header Bar */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">{claim.claimNumber}</h2>
              <StatusBadge status={claim.status} />
              <RiskBadge level={claim.riskLevel} score={claim.riskScore} />
            </div>
            <p className="text-xs text-slate-500">
              Submitted on {new Date(claim.createdAt).toLocaleDateString()} • Type: <strong className="text-slate-700 dark:text-slate-300">{claim.claimType}</strong>
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-black text-slate-900 dark:text-slate-100">
              ₹{claim.estimatedAmount?.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-500">Claimed Repair Amount</div>
          </div>
        </div>

        {/* Section 1: Overview & Incident Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Incident Overview</h3>
            <div className="text-xs space-y-2">
              <div>
                <span className="text-slate-400">Location:</span>{' '}
                <strong className="text-slate-800 dark:text-slate-200">{claim.incidentLocation}</strong>
              </div>
              <div>
                <span className="text-slate-400">Incident Date:</span>{' '}
                <strong className="text-slate-800 dark:text-slate-200">
                  {new Date(claim.incidentDate).toLocaleDateString()}
                </strong>
              </div>
              <div>
                <span className="text-slate-400">Vehicle Reg:</span>{' '}
                <strong className="text-slate-800 dark:text-slate-200">{claim.vehicleRegistration || 'N/A'}</strong>
              </div>
              <div>
                <span className="text-slate-400">Description:</span>
                <p className="mt-1 p-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {claim.description}
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Policy Coverage Analysis */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Policy Coverage Analysis</h3>
            {coverageAnalysis ? (
              <div className="text-xs space-y-2">
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400">Coverage Limit:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">₹{coverageAnalysis.coverageLimit?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400">Deductible:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">₹{coverageAnalysis.deductible?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400">Est. Eligible Amount:</span>
                  <span className="font-extrabold text-emerald-600 dark:text-emerald-400">₹{coverageAnalysis.estimatedEligibleAmount?.toLocaleString()}</span>
                </div>
                <p className="text-[11px] text-slate-500 italic mt-2">{coverageAnalysis.notes}</p>
              </div>
            ) : (
              <div className="text-xs text-slate-400 italic">Coverage evaluation pending...</div>
            )}
          </div>
        </div>

        {/* Section 3: Cross-Document Validation (Discrepancies) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Cross-Document Validation</h3>
            <span className="text-xs font-bold text-rose-500 bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded-full border border-rose-200 dark:border-rose-800">
              {riskAnalysis?.mismatches?.length || 0} Inconsistent Fields
            </span>
          </div>

          {riskAnalysis?.mismatches?.length > 0 ? (
            <div className="space-y-3">
              {riskAnalysis.mismatches.map((m: any, idx: number) => (
                <div key={idx} className="p-3 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/30 dark:bg-rose-950/20 text-xs">
                  <div className="flex items-center justify-between font-bold text-rose-700 dark:text-rose-400 mb-2">
                    <span>Field: {m.field}</span>
                    <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-rose-100 dark:bg-rose-900">{m.severity} SEVERITY</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-slate-700 dark:text-slate-300">
                    <div className="p-2 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <span className="block text-[10px] text-slate-400">{m.doc1Name}</span>
                      <strong className="text-slate-900 dark:text-slate-100">{m.doc1Value}</strong>
                    </div>
                    <div className="p-2 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <span className="block text-[10px] text-slate-400">{m.doc2Name}</span>
                      <strong className="text-rose-600 dark:text-rose-400">{m.doc2Value}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              All document extraction fields match across submitted evidence.
            </div>
          )}
        </div>

        {/* Section 4: AI Visual Damage Analysis */}
        {damageAnalysis && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">AI Visual Damage Assessment</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {damageAnalysis.damageAreas?.map((area: any, idx: number) => (
                <div key={idx} className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-xs">
                  <div className="flex justify-between font-bold text-slate-900 dark:text-slate-100">
                    <span>{area.location}</span>
                    <span className="text-amber-600 dark:text-amber-400">₹{area.estimatedCost?.toLocaleString()}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">{area.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ================= RIGHT COLUMN: AI Panel & Adjuster Action Bar ================= */}
      <div className="w-full lg:w-80 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 p-5 flex flex-col space-y-6 overflow-y-auto">
        {/* Risk Scorecard Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-b from-slate-900 to-navy-800 text-white shadow-xl space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-wider">
            <span>AI Risk Scorecard</span>
            <Sparkles className="w-4 h-4 text-blue-400" />
          </div>

          <div className="flex items-end justify-between">
            <div>
              <div className="text-4xl font-black">{claim.riskScore}<span className="text-lg font-normal text-slate-400">/100</span></div>
              <div className="mt-1"><RiskBadge level={claim.riskLevel} /></div>
            </div>
            <div className="text-right text-[11px] text-slate-400">
              Confidence: <strong className="text-white">{riskAnalysis?.aiConfidence || 88}%</strong>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-3 space-y-2 text-xs">
            <span className="block font-bold text-slate-300 text-[11px]">Identified Risk Drivers:</span>
            {riskAnalysis?.factors?.map((f: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between text-[11px] text-slate-300">
                <span className="truncate max-w-[180px]">• {f.name}</span>
                <span className="font-bold text-amber-400">+{f.score}</span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Assistant Drawer Launcher */}
        <button
          onClick={() => setIsAIChatOpen(true)}
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 transition-all"
        >
          <Sparkles className="w-4 h-4" />
          Open AI Claim Assistant
        </button>

        {/* Adjuster Action Buttons */}
        <div className="space-y-3 border-t border-slate-200 dark:border-slate-800 pt-5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Adjuster Verdict</h4>

          <button
            onClick={() => setIsApproveOpen(true)}
            className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <CheckCircle2 className="w-4 h-4" />
            Approve Claim
          </button>

          <button
            onClick={() => setIsRequestInfoOpen(true)}
            className="w-full py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
            Request Information
          </button>

          <button
            onClick={() => setIsRejectOpen(true)}
            className="w-full py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <XCircle className="w-4 h-4" />
            Reject Claim
          </button>
        </div>
      </div>

      {/* ================= MODALS ================= */}
      {/* Approve Modal */}
      <Modal isOpen={isApproveOpen} onClose={() => setIsApproveOpen(false)} title="Confirm Claim Approval">
        <div className="space-y-4 text-xs">
          <div className="p-3 rounded-lg bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 font-medium">
            AI analysis is advisory. As the authorized adjuster, you are rendering the final business decision.
          </div>
          <div>
            <label className="block font-bold mb-1">Approved Settlement Amount (₹)</label>
            <input
              type="number"
              value={approvedAmount}
              onChange={(e) => setApprovedAmount(Number(e.target.value))}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-bold"
            />
          </div>
          <div>
            <label className="block font-bold mb-1">Adjuster Execution Notes</label>
            <textarea
              value={adjusterNotes}
              onChange={(e) => setAdjusterNotes(e.target.value)}
              rows={3}
              placeholder="State rationale for approval..."
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
            />
          </div>
          <button
            onClick={handleApprove}
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors"
          >
            Confirm Final Approval
          </button>
        </div>
      </Modal>

      {/* Reject Modal */}
      <Modal isOpen={isRejectOpen} onClose={() => setIsRejectOpen(false)} title="Confirm Claim Rejection">
        <div className="space-y-4 text-xs">
          <div>
            <label className="block font-bold mb-1">Rejection Reason</label>
            <select
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold"
            >
              <option value="">Select primary reason...</option>
              <option value="Policy Exclusion Triggered">Policy Exclusion Triggered</option>
              <option value="Unverified Document Discrepancy">Unverified Document Discrepancy</option>
              <option value="Fraud Concern">Fraud Concern</option>
              <option value="Incident Outside Coverage Period">Incident Outside Coverage Period</option>
            </select>
          </div>
          <div>
            <label className="block font-bold mb-1">Internal Notes</label>
            <textarea
              value={adjusterNotes}
              onChange={(e) => setAdjusterNotes(e.target.value)}
              rows={3}
              placeholder="Internal record notes..."
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
            />
          </div>
          <button
            onClick={handleReject}
            className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors"
          >
            Confirm Rejection
          </button>
        </div>
      </Modal>

      {/* AI Assistant Drawer Modal */}
      <Modal isOpen={isAIChatOpen} onClose={() => setIsAIChatOpen(false)} title="Claim Context AI Assistant">
        <div className="flex flex-col h-[400px]">
          <div className="flex-1 overflow-y-auto space-y-3 p-2 border border-slate-200 dark:border-slate-800 rounded-xl mb-3 bg-slate-50 dark:bg-slate-900">
            {aiChatHistory.map((msg, i) => (
              <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] p-3 rounded-xl text-xs ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white font-medium'
                      : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isAiLoading && <div className="text-xs text-slate-400 italic">AI is thinking...</div>}
          </div>

          <form onSubmit={handleAIChat} className="flex gap-2">
            <input
              type="text"
              value={aiChatQuery}
              onChange={(e) => setAiChatQuery(e.target.value)}
              placeholder="Ask about date mismatches, policy coverage, repair estimates..."
              className="flex-1 p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
            />
            <button type="submit" className="px-4 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs">
              Send
            </button>
          </form>
        </div>
      </Modal>
    </div>
  );
}
