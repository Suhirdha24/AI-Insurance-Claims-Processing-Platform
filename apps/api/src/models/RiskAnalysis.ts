import mongoose, { Schema, Document } from 'mongoose';
import { RiskLevel } from '@ai-insurance/shared';

export interface IRiskAnalysisModel extends Document {
  claimId: mongoose.Types.ObjectId;
  overallScore: number;
  riskLevel: RiskLevel;
  factors: {
    code: string;
    name: string;
    score: number;
    maxScore: number;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    description: string;
  }[];
  mismatches: {
    field: string;
    doc1Name: string;
    doc1Value: string;
    doc2Name: string;
    doc2Value: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH';
    status: 'PENDING' | 'CONFIRMED' | 'FALSE_POSITIVE' | 'RESOLVED';
  }[];
  duplicateMatches: {
    matchedClaimId: mongoose.Types.ObjectId;
    matchedClaimNumber: string;
    similarityScore: number;
    matchingFields: string[];
  }[];
  aiConfidence: number;
  aiRecommendation: string;
  createdAt: Date;
}

const riskAnalysisSchema = new Schema<IRiskAnalysisModel>(
  {
    claimId: { type: Schema.Types.ObjectId, ref: 'Claim', required: true, index: true },
    overallScore: { type: Number, required: true },
    riskLevel: { type: String, enum: Object.values(RiskLevel), required: true },
    factors: [
      {
        code: String,
        name: String,
        score: Number,
        maxScore: Number,
        severity: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] },
        description: String,
      },
    ],
    mismatches: [
      {
        field: String,
        doc1Name: String,
        doc1Value: String,
        doc2Name: String,
        doc2Value: String,
        severity: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH'] },
        status: { type: String, enum: ['PENDING', 'CONFIRMED', 'FALSE_POSITIVE', 'RESOLVED'], default: 'PENDING' },
      },
    ],
    duplicateMatches: [
      {
        matchedClaimId: { type: Schema.Types.ObjectId, ref: 'Claim' },
        matchedClaimNumber: String,
        similarityScore: Number,
        matchingFields: [String],
      },
    ],
    aiConfidence: { type: Number, default: 85 },
    aiRecommendation: { type: String, required: true },
  },
  { timestamps: true }
);

export const RiskAnalysis = mongoose.model<IRiskAnalysisModel>('RiskAnalysis', riskAnalysisSchema);
