import mongoose, { Schema, Document } from 'mongoose';

export interface ICoverageAnalysisModel extends Document {
  claimId: mongoose.Types.ObjectId;
  policyId: mongoose.Types.ObjectId;
  coverageStatus: 'COVERED' | 'PARTIALLY_COVERED' | 'NOT_COVERED' | 'EXCEEDS_LIMIT';
  coverageLimit: number;
  deductible: number;
  claimAmount: number;
  estimatedEligibleAmount: number;
  appliedExclusions: string[];
  notes: string;
  createdAt: Date;
}

const coverageAnalysisSchema = new Schema<ICoverageAnalysisModel>(
  {
    claimId: { type: Schema.Types.ObjectId, ref: 'Claim', required: true, index: true },
    policyId: { type: Schema.Types.ObjectId, ref: 'Policy', required: true },
    coverageStatus: { type: String, enum: ['COVERED', 'PARTIALLY_COVERED', 'NOT_COVERED', 'EXCEEDS_LIMIT'], required: true },
    coverageLimit: { type: Number, required: true },
    deductible: { type: Number, required: true },
    claimAmount: { type: Number, required: true },
    estimatedEligibleAmount: { type: Number, required: true },
    appliedExclusions: [{ type: String }],
    notes: String,
  },
  { timestamps: true }
);

export const CoverageAnalysis = mongoose.model<ICoverageAnalysisModel>('CoverageAnalysis', coverageAnalysisSchema);
