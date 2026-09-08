'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { ClaimType, DocumentType } from '@ai-insurance/shared';
import { ShieldCheck, Upload, FileText, CheckCircle2, ChevronRight, ChevronLeft, AlertCircle } from 'lucide-react';

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
  const [validationError, setValidationError] = useState<string | null>(null);

  const fallbackPolicies = [
    { id: 'POL-2026-AUTO-01', policyNumber: 'POL-2026-AUTO-01', policyType: 'Comprehensive Auto', coverageLimit: 1000000 },
    { id: 'POL-2026-PROP-02', policyNumber: 'POL-2026-PROP-02', policyType: 'Property Shield', coverageLimit: 2500000 },
    { id: 'POL-2026-HLTH-03', policyNumber: 'POL-2026-HLTH-03', policyType: 'Health Secure', coverageLimit: 500000 },
  ];

  useEffect(() => {
    api.get('/policies/my').then((res: any) => {
      const activeList = (res.data && res.data.length > 0) ? res.data : fallbackPolicies;
      setPolicies(activeList);
      if (activeList.length > 0) {
        setFormData((prev) => ({ ...prev, policyId: activeList[0].id || activeList[0]._id }));
      }
    }).catch(() => {
      setPolicies(fallbackPolicies);
      setFormData((prev) => ({ ...prev, policyId: fallbackPolicies[0].id }));
    });
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, docType: DocumentType) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFiles((prev) => [...prev, { file: selected, docType }]);
      setValidationError(null);
    }
  };

  const handleNextStep1 = () => {
    if (!formData.policyId) {
      setValidationError('Please select an active insurance policy.');
      return;
    }
    if (!formData.estimatedAmount || formData.estimatedAmount <= 0) {
      setValidationError('Please enter a valid estimated claim amount in ₹.');
      return;
    }
    setValidationError(null);
    setStep(2);
  };

  const handleNextStep2 = () => {
    if (!formData.incidentDate) {
      setValidationError('Please select the incident date.');
      return;
    }
    if (!formData.incidentLocation.trim()) {
      setValidationError('Please enter the incident location (e.g. MG Road Junction, Bangalore).');
      return;
    }
    if (!formData.description.trim()) {
      setValidationError('Please enter a detailed description of the incident and damage.');
      return;
    }
    setValidationError(null);
    setStep(3);
  };

  const handleNextStep3 = () => {
    if (files.length === 0) {
      setValidationError('Please attach at least one document or photo (Claim Form or Police Report) before proceeding.');
      return;
    }
    setValidationError(null);
    setStep(4);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setValidationError(null);
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
      setValidationError(err.message || 'Submission failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-purple-500/30 rounded-3xl shadow-lg dark:shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6">
      {/* Wizard Step Progress Header */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-200 dark:border-purple-500/20">
        {[1, 2, 3, 4, 5].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold transition-all ${
                s === step
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/30 ring-2 ring-purple-400/50'
                  : s < step
                  ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/40'
                  : 'bg-slate-100 dark:bg-slate-950 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-800'
              }`}
            >
              {s < step ? <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : s}
            </div>
            <span className="text-xs font-semibold hidden sm:inline text-slate-700 dark:text-slate-300">
              {s === 1 && 'Policy'}
              {s === 2 && 'Incident'}
              {s === 3 && 'Documents'}
              {s === 4 && 'Review'}
              {s === 5 && 'Success'}
            </span>
          </div>
        ))}
      </div>

      {/* Validation Error Alert Box */}
      {validationError && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-700/60 text-rose-800 dark:text-rose-200 text-xs font-semibold flex items-center gap-3 animate-in fade-in">
          <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Step 1: Policy & Claim Info */}
      {step === 1 && (
        <div className="space-y-5">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Step 1: Select Policy & Type</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Choose your registered policy and estimated repair coverage</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">Active Policy *</label>
            <select
              value={formData.policyId}
              onChange={(e) => {
                setFormData({ ...formData, policyId: e.target.value });
                setValidationError(null);
              }}
              className="w-full p-3.5 rounded-xl bg-white border border-purple-300 text-slate-900 text-xs font-bold focus:ring-2 focus:ring-purple-500/50 outline-none shadow-sm cursor-pointer"
            >
              {(policies.length > 0 ? policies : fallbackPolicies).map((p) => (
                <option key={p.id || p._id} value={p.id || p._id} className="bg-white text-slate-900 font-bold py-1">
                  {p.policyNumber} ({p.policyType} - Max ₹{p.coverageLimit?.toLocaleString()})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Claim Type *</label>
            <select
              value={formData.claimType}
              onChange={(e) => setFormData({ ...formData, claimType: e.target.value as ClaimType })}
              className="w-full p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-purple-500/30 text-slate-900 dark:text-white text-xs font-bold focus:ring-2 focus:ring-purple-500/50 outline-none"
            >
              <option value={ClaimType.VEHICLE} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Vehicle Insurance Claim</option>
              <option value={ClaimType.PROPERTY} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Property Insurance Claim</option>
              <option value={ClaimType.HEALTH} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Health Insurance Claim</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Estimated Repair / Claim Amount (₹) *</label>
            <input
              type="number"
              value={formData.estimatedAmount}
              onChange={(e) => {
                setFormData({ ...formData, estimatedAmount: Number(e.target.value) });
                setValidationError(null);
              }}
              className="w-full p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-purple-500/30 text-slate-900 dark:text-white text-sm font-bold focus:ring-2 focus:ring-purple-500/50 outline-none"
            />
          </div>

          <button
            onClick={handleNextStep1}
            className="w-full mt-4 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-500 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-500/30 transition-all"
          >
            Continue to Incident Details <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Step 2: Incident Details */}
      {step === 2 && (
        <div className="space-y-5">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Step 2: Incident Details</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Provide exact date, location, and comprehensive incident description</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Incident Date *</label>
            <input
              type="date"
              value={formData.incidentDate}
              onChange={(e) => {
                setFormData({ ...formData, incidentDate: e.target.value });
                setValidationError(null);
              }}
              className="w-full p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-purple-500/30 text-slate-900 dark:text-white text-xs font-bold focus:ring-2 focus:ring-purple-500/50 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Incident Location *</label>
            <input
              type="text"
              value={formData.incidentLocation}
              onChange={(e) => {
                setFormData({ ...formData, incidentLocation: e.target.value });
                setValidationError(null);
              }}
              placeholder="e.g. MG Road Junction, Bangalore"
              className="w-full p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-purple-500/30 text-slate-900 dark:text-white placeholder-slate-400 text-xs focus:ring-2 focus:ring-purple-500/50 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Detailed Incident Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => {
                setFormData({ ...formData, description: e.target.value });
                setValidationError(null);
              }}
              rows={4}
              placeholder="Describe what occurred, vehicles involved, and extent of damage..."
              className="w-full p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-purple-500/30 text-slate-900 dark:text-white placeholder-slate-400 text-xs focus:ring-2 focus:ring-purple-500/50 outline-none"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => {
                setValidationError(null);
                setStep(1);
              }}
              className="py-3.5 px-6 rounded-xl border border-slate-200 dark:border-purple-500/30 bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleNextStep2}
              className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-500 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-500/30 transition-all"
            >
              Continue to Document Upload <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Document Upload */}
      {step === 3 && (
        <div className="space-y-5">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Step 3: Attach Evidence Documents</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Upload photos, repair bills, or official police FIR documents</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 border-2 border-dashed border-purple-300 dark:border-purple-500/40 rounded-2xl bg-slate-50 dark:bg-slate-950/60 text-center hover:border-purple-500 transition-colors">
              <Upload className="w-7 h-7 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
              <div className="text-xs font-bold text-slate-900 dark:text-white">Claim Form / Repair Invoice</div>
              <input
                type="file"
                onChange={(e) => handleFileUpload(e, DocumentType.CLAIM_FORM)}
                className="mt-3 text-xs text-slate-600 dark:text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-purple-600 file:text-white hover:file:bg-purple-500 cursor-pointer"
              />
            </div>

            <div className="p-5 border-2 border-dashed border-cyan-300 dark:border-cyan-500/40 rounded-2xl bg-slate-50 dark:bg-slate-950/60 text-center hover:border-cyan-500 transition-colors">
              <Upload className="w-7 h-7 text-cyan-600 dark:text-cyan-400 mx-auto mb-2" />
              <div className="text-xs font-bold text-slate-900 dark:text-white">Police FIR / Incident Report</div>
              <input
                type="file"
                onChange={(e) => handleFileUpload(e, DocumentType.POLICE_REPORT)}
                className="mt-3 text-xs text-slate-600 dark:text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-purple-600 file:text-white hover:file:bg-purple-500 cursor-pointer"
              />
            </div>
          </div>

          {files.length > 0 && (
            <div className="p-4 bg-slate-50 dark:bg-slate-950/90 border border-slate-200 dark:border-purple-500/30 rounded-2xl space-y-2">
              <div className="text-xs font-bold text-purple-700 dark:text-purple-300">Attached Files:</div>
              {files.map((item, idx) => (
                <div key={idx} className="text-xs font-semibold flex justify-between items-center p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-purple-500/20">
                  <span className="text-slate-900 dark:text-white truncate max-w-[250px]">{item.file.name}</span>
                  <span className="px-2.5 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950 border border-purple-300 dark:border-purple-500/40 text-purple-700 dark:text-purple-300 text-[10px] font-mono">
                    {item.docType}
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => {
                setValidationError(null);
                setStep(2);
              }}
              className="py-3.5 px-6 rounded-xl border border-slate-200 dark:border-purple-500/30 bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleNextStep3}
              className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-500 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-500/30 transition-all"
            >
              Review Claim Summary <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Final Summary Review */}
      {step === 4 && (
        <div className="space-y-5">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Step 4: Review & Confirm Submission</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Double check your claim info before submitting for AI automated risk scoring</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/90 border border-slate-200 dark:border-purple-500/30 space-y-3 text-xs">
            <div className="flex justify-between border-b border-slate-200 dark:border-purple-500/10 pb-2">
              <span className="text-slate-500 dark:text-slate-400">Claim Type:</span>
              <strong className="text-slate-900 dark:text-white font-mono">{formData.claimType}</strong>
            </div>
            <div className="flex justify-between border-b border-slate-200 dark:border-purple-500/10 pb-2">
              <span className="text-slate-500 dark:text-slate-400">Incident Date:</span>
              <strong className="text-slate-900 dark:text-white font-mono">{formData.incidentDate}</strong>
            </div>
            <div className="flex justify-between border-b border-slate-200 dark:border-purple-500/10 pb-2">
              <span className="text-slate-500 dark:text-slate-400">Estimated Amount:</span>
              <strong className="text-emerald-600 dark:text-emerald-400 font-mono text-sm">₹{formData.estimatedAmount?.toLocaleString()}</strong>
            </div>
            <div className="flex justify-between border-b border-slate-200 dark:border-purple-500/10 pb-2">
              <span className="text-slate-500 dark:text-slate-400">Location:</span>
              <strong className="text-slate-900 dark:text-white">{formData.incidentLocation}</strong>
            </div>
            <div className="pt-1">
              <span className="text-slate-500 dark:text-slate-400 block mb-1">Description:</span>
              <p className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-purple-500/20 text-slate-800 dark:text-slate-300 italic">
                "{formData.description}"
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => {
                setValidationError(null);
                setStep(3);
              }}
              className="py-3.5 px-6 rounded-xl border border-slate-200 dark:border-purple-500/30 bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            >
              Back
            </button>

            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30 transition-all"
            >
              {isSubmitting ? 'Submitting Claim...' : 'Confirm & Submit Claim'}
            </button>
          </div>
        </div>
      )}

      {/* Step 5: Confirmation Success */}
      {step === 5 && (
        <div className="text-center py-8 space-y-5">
          <div className="w-16 h-16 bg-gradient-to-tr from-emerald-600 to-cyan-500 text-white rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Claim Submitted Successfully!</h2>
          <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto">
            Your claim number is <strong className="text-purple-700 dark:text-purple-300 font-mono text-sm">{createdClaim?.claimNumber}</strong>. Background AI document extraction and risk scoring have been initiated.
          </p>
          <button
            onClick={() => router.push('/dashboard')}
            className="py-3.5 px-8 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-extrabold text-xs shadow-lg shadow-purple-500/30"
          >
            Go to My Dashboard
          </button>
        </div>
      )}
    </div>
  );
}
