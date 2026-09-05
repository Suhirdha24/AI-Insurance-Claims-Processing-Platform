import mongoose, { Schema, Document } from 'mongoose';
import { ClaimType } from '@ai-insurance/shared';

export interface IPolicyDocument extends Document {
  policyNumber: string;
  customerId: mongoose.Types.ObjectId;
  policyType: ClaimType;
  coverageLimit: number;
  deductible: number;
  startDate: Date;
  endDate: Date;
  status: 'ACTIVE' | 'EXPIRED' | 'CANCELLED' | 'PENDING';
  coverageDetails: string[];
  exclusions: string[];
  vehicleDetails?: {
    make?: string;
    model?: string;
    year?: number;
    registrationNumber?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const policySchema = new Schema<IPolicyDocument>(
  {
    policyNumber: { type: String, required: true, unique: true, index: true },
    customerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    policyType: { type: String, enum: Object.values(ClaimType), required: true },
    coverageLimit: { type: Number, required: true },
    deductible: { type: Number, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: { type: String, enum: ['ACTIVE', 'EXPIRED', 'CANCELLED', 'PENDING'], default: 'ACTIVE' },
    coverageDetails: [{ type: String }],
    exclusions: [{ type: String }],
    vehicleDetails: {
      make: String,
      model: String,
      year: Number,
      registrationNumber: String,
    },
  },
  { timestamps: true }
);

export const Policy = mongoose.model<IPolicyDocument>('Policy', policySchema);
