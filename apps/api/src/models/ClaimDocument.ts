import mongoose, { Schema, Document } from 'mongoose';
import { DocumentType } from '@ai-insurance/shared';

export interface IClaimDocumentModel extends Document {
  claimId: mongoose.Types.ObjectId;
  fileName: string;
  fileUrl: string;
  mimeType: string;
  fileSize: number;
  documentType: DocumentType;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  createdAt: Date;
  updatedAt: Date;
}

const claimDocumentSchema = new Schema<IClaimDocumentModel>(
  {
    claimId: { type: Schema.Types.ObjectId, ref: 'Claim', required: true, index: true },
    fileName: { type: String, required: true },
    fileUrl: { type: String, required: true },
    mimeType: { type: String, required: true },
    fileSize: { type: Number, required: true },
    documentType: { type: String, enum: Object.values(DocumentType), required: true },
    status: { type: String, enum: ['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED'], default: 'PENDING' },
  },
  { timestamps: true }
);

export const ClaimDocument = mongoose.model<IClaimDocumentModel>('ClaimDocument', claimDocumentSchema);
