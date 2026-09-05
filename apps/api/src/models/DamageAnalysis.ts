import mongoose, { Schema, Document } from 'mongoose';

export interface IDamageAnalysisModel extends Document {
  claimId: mongoose.Types.ObjectId;
  documentId?: mongoose.Types.ObjectId;
  damageAreas: {
    location: string;
    description: string;
    severity: 'MINOR' | 'MODERATE' | 'SEVERE';
    estimatedCost: number;
  }[];
  overallSeverity: 'MINOR' | 'MODERATE' | 'SEVERE';
  estimatedTotalRepair: number;
  confidenceScore: number;
  adjusterOverride?: {
    overriddenBy: mongoose.Types.ObjectId;
    adjustedTotalCost: number;
    notes: string;
    overriddenAt: Date;
  };
  aiProvider: string;
  model: string;
  createdAt: Date;
}

const damageAnalysisSchema = new Schema<IDamageAnalysisModel>(
  {
    claimId: { type: Schema.Types.ObjectId, ref: 'Claim', required: true, index: true },
    documentId: { type: Schema.Types.ObjectId, ref: 'ClaimDocument' },
    damageAreas: [
      {
        location: String,
        description: String,
        severity: { type: String, enum: ['MINOR', 'MODERATE', 'SEVERE'] },
        estimatedCost: Number,
      },
    ],
    overallSeverity: { type: String, enum: ['MINOR', 'MODERATE', 'SEVERE'], default: 'MODERATE' },
    estimatedTotalRepair: { type: Number, required: true },
    confidenceScore: { type: Number, required: true },
    adjusterOverride: {
      overriddenBy: { type: Schema.Types.ObjectId, ref: 'User' },
      adjustedTotalCost: Number,
      notes: String,
      overriddenAt: Date,
    },
    aiProvider: { type: String, default: 'MOCK' },
    model: { type: String, default: 'mock-vision-v1' },
  },
  { timestamps: true }
);

export const DamageAnalysis = mongoose.model<IDamageAnalysisModel>('DamageAnalysis', damageAnalysisSchema);
