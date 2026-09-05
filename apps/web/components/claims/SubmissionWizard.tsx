'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { ClaimType, DocumentType } from '@ai-insurance/shared';
import { ShieldCheck, Upload, FileText, CheckCircle2, ChevronRight, ChevronLeft } from 'lucide-react';

export function SubmissionWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [policies, setPolicies] = useState<any[]>([]);

  // Form State
  const [formData, setFormData] = useState({
    policyId: '',
    claimType: ClaimType.VEHICLE,
    incidentDate: new Date().toISOString().split('T')[0],
    incidentLocation: '',
    description: '',
    estimatedAmount: 150000,
    vehicleRegistration: 'KA-01-MJ-9921',
    thirdPartyInvolved: false,
    policeReportAvailable: true,
  });

  const [files, setFiles] = useState<{ file: File; docType: DocumentType }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdClaim, setCreatedClaim] = useState<any>(null);

  useEffect(() => {
    api.get('/policies/my').then((res: any) => {
      if (res.data && res.data.length > 0) {
        setPolicies(res.data);
        setFormData((prev) => ({ ...prev, policyId: res.data[0].id || res.data[0]._id }));
      }
    });
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, docType: DocumentType) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFiles((prev) => [...prev, { file: selected, docType }]);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // 1. Create Claim
      const claimRes: any = await api.post('/claims', formData);
      const claim = claimRes.data;
      setCreatedClaim(claim);

      // 2. Upload attached documents if any
      for (const item of files) {
        const fileData = new FormData();
        fileData.append('file', item.file);
        fileData.append('documentType', item.docType);

        await api.post(`/claims/${claim.id || claim._id}/documents`, fileData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      setStep(5); // Confirmation screen
    } catch (err: any) {
      alert(err.message || 'Submission failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden p-8">
      {/* Wizard Step Progress */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200 dark:border-slate-800">
        {[1, 2, 3, 4, 5].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                s === step
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : s < step
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
              }`}
            >
              {s < step ? <CheckCircle2 className="w-4 h-4" /> : s}
            </div>
            <span className="text-xs font-semibold hidden sm:inline text-slate-600 dark:text-slate-400">
              {s === 1 && 'Policy'}
              {s === 2 && 'Incident'}
              {s === 3 && 'Documents'}
              {s === 4 && 'Review'}
              {s === 5 && 'Success'}
            </span>
          </div>
        ))}
      </div>

      {/* Step 1: Policy & Claim Info */}
      {step === 1 && (
        <div className="space-y-4">
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">Step 1: Select Policy & Type</h2>
          <div>
            <label className="block text-xs font-bold mb-1">Active Policy</label>
            <select
              value={formData.policyId}
              onChange={(e) => setFormData({ ...formData, policyId: e.target.value })}
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold"
            >
              {policies.map((p) => (
                <option key={p.id || p._id} value={p.id || p._id}>
                  {p.policyNumber} ({p.policyType} - Max ₹{p.coverageLimit?.toLocaleString()})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold mb-1">Claim Type</label>
            <select
              value={formData.claimType}
              onChange={(e) => setFormData({ ...formData, claimType: e.target.value as ClaimType })}
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold"
            >
              <option value={ClaimType.VEHICLE}>Vehicle Insurance Claim</option>
              <option value={ClaimType.PROPERTY}>Property Insurance Claim</option>
              <option value={ClaimType.HEALTH}>Health Insurance Claim</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold mb-1">Estimated Repair / Claim Amount (₹)</label>
            <input
              type="number"
              value={formData.estimatedAmount}
              onChange={(e) => setFormData({ ...formData, estimatedAmount: Number(e.target.value) })}
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-bold"
            />
          </div>

          <button
            onClick={() => setStep(2)}
            className="w-full mt-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2"
          >
            Continue to Incident Details <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Step 2: Incident Details */}
      {step === 2 && (
        <div className="space-y-4">
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">Step 2: Incident Details</h2>
          <div>
            <label className="block text-xs font-bold mb-1">Incident Date</label>
            <input
              type="date"
              value={formData.incidentDate}
              onChange={(e) => setFormData({ ...formData, incidentDate: e.target.value })}
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold mb-1">Incident Location</label>
            <input
              type="text"
              value={formData.incidentLocation}
              onChange={(e) => setFormData({ ...formData, incidentLocation: e.target.value })}
              placeholder="e.g. MG Road Junction, Bangalore"
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold mb-1">Detailed Incident Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              placeholder="Describe what occurred, vehicles involved, and extent of damage..."
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep(1)}
              className="py-3 px-6 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-xs"
            >
              Back
            </button>
            <button
              onClick={() => setStep(3)}
              className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2"
            >
              Continue to Document Upload <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Document Upload */}
      {step === 3 && (
        <div className="space-y-4">
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">Step 3: Attach Evidence Documents</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-center">
              <Upload className="w-6 h-6 text-blue-500 mx-auto mb-2" />
              <div className="text-xs font-bold">Claim Form / Invoice</div>
              <input
                type="file"
                onChange={(e) => handleFileUpload(e, DocumentType.CLAIM_FORM)}
                className="mt-2 text-xs"
              />
            </div>

            <div className="p-4 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-center">
              <Upload className="w-6 h-6 text-blue-500 mx-auto mb-2" />
              <div className="text-xs font-bold">Police Incident Report</div>
              <input
                type="file"
                onChange={(e) => handleFileUpload(e, DocumentType.POLICE_REPORT)}
                className="mt-2 text-xs"
              />
            </div>
          </div>

          {files.length > 0 && (
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-1">
              <div className="text-xs font-bold text-slate-500">Attached Files:</div>
              {files.map((item, idx) => (
                <div key={idx} className="text-xs font-semibold flex justify-between">
                  <span>{item.file.name}</span>
                  <span className="text-blue-500">{item.docType}</span>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => setStep(2)}
              className="py-3 px-6 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-xs"
            >
              Back
            </button>
            <button
              onClick={() => setStep(4)}
              className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2"
            >
              Review Claim Summary <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Final Summary Review */}
      {step === 4 && (
        <div className="space-y-4">
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">Step 4: Review & Submit</h2>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Claim Type:</span>
              <strong className="text-slate-900 dark:text-slate-100">{formData.claimType}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Incident Date:</span>
              <strong className="text-slate-900 dark:text-slate-100">{formData.incidentDate}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Estimated Amount:</span>
              <strong className="text-slate-900 dark:text-slate-100">₹{formData.estimatedAmount?.toLocaleString()}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Location:</span>
              <strong className="text-slate-900 dark:text-slate-100">{formData.incidentLocation}</strong>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
          >
            {isSubmitting ? 'Submitting Claim...' : 'Confirm & Submit Claim'}
          </button>
        </div>
      )}

      {/* Step 5: Confirmation Success */}
      {step === 5 && (
        <div className="text-center py-8 space-y-4">
          <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100">Claim Submitted Successfully!</h2>
          <p className="text-xs text-slate-500">
            Your claim number is <strong className="text-blue-600 dark:text-blue-400">{createdClaim?.claimNumber}</strong>. Background AI document extraction and risk scoring have been initiated.
          </p>
          <button
            onClick={() => router.push('/dashboard')}
            className="py-3 px-8 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
          >
            Go to My Dashboard
          </button>
        </div>
      )}
    </div>
  );
}
