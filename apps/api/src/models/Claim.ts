import mongoose, { Schema, Document } from 'mongoose';
import { ClaimStatus, ClaimType, RiskLevel } from '@ai-insurance/shared';

export interface IClaimDocumentModel extends Document {
  claimNumber: string;
  customerId: mongoose.Types.ObjectId;
  policyId: mongoose.Types.ObjectId;
  assignedAdjusterId?: mongoose.Types.ObjectId;
  claimType: ClaimType;
  incidentDate: Date;
  incidentLocation: string;
  description: string;
  estimatedAmount: number;
  approvedAmount?: number;
  status: ClaimStatus;
  riskScore: number;
  riskLevel: RiskLevel;
  vehicleRegistration?: string;
  thirdPartyInvolved: boolean;
  policeReportAvailable: boolean;
  rejectionReason?: string;
  informationRequested?: {
    requestedFields: string[];
    message: string;
    deadline?: Date;
    requestedAt: Date;
    isResolved: boolean;
  };
  timeline: {
    stage: string;
    title: string;
    description: string;
    performedBy: string;
    userRole?: string;
    timestamp: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const claimSchema = new Schema<IClaimDocumentModel>(
  {
    claimNumber: { type: String, required: true, unique: true, index: true },
    customerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    policyId: { type: Schema.Types.ObjectId, ref: 'Policy', required: true },
    assignedAdjusterId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    claimType: { type: String, enum: Object.values(ClaimType), required: true },
    incidentDate: { type: Date, required: true },
    incidentLocation: { type: String, required: true },
    description: { type: String, required: true },
    estimatedAmount: { type: Number, required: true },
    approvedAmount: { type: Number },
    status: { type: String, enum: Object.values(ClaimStatus), default: ClaimStatus.SUBMITTED, index: true },
    riskScore: { type: Number, default: 0 },
    riskLevel: { type: String, enum: Object.values(RiskLevel), default: RiskLevel.LOW, index: true },
    vehicleRegistration: { type: String },
    thirdPartyInvolved: { type: Boolean, default: false },
    policeReportAvailable: { type: Boolean, default: false },
    rejectionReason: { type: String },
    informationRequested: {
      requestedFields: [{ type: String }],
      message: String,
      deadline: Date,
      requestedAt: Date,
      isResolved: { type: Boolean, default: false },
    },
    timeline: [
      {
        stage: { type: String, required: true },
        title: { type: String, required: true },
        description: { type: String, required: true },
        performedBy: { type: String, required: true },
        userRole: { type: String },
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

claimSchema.index({ customerId: 1, createdAt: -1 });
claimSchema.index({ status: 1, riskLevel: 1 });

export const Claim = mongoose.model<IClaimDocumentModel>('Claim', claimSchema);
