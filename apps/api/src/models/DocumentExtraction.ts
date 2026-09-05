import mongoose, { Schema, Document } from 'mongoose';

export interface IDocumentExtractionModel extends Document {
  documentId: mongoose.Types.ObjectId;
  claimId: mongoose.Types.ObjectId;
  extractedFields: {
    field: string;
    value: Schema.Types.Mixed;
    confidence: number;
    sourceDocument: string;
    validationStatus: 'VERIFIED' | 'MISMATCH' | 'UNVERIFIED';
  }[];
  rawText?: string;
  aiProvider: string;
  createdAt: Date;
}

const documentExtractionSchema = new Schema<IDocumentExtractionModel>(
  {
    documentId: { type: Schema.Types.ObjectId, ref: 'ClaimDocument', required: true, index: true },
    claimId: { type: Schema.Types.ObjectId, ref: 'Claim', required: true, index: true },
    extractedFields: [
      {
        field: { type: String, required: true },
        value: { type: Schema.Types.Mixed, required: true },
        confidence: { type: Number, required: true },
        sourceDocument: { type: String, required: true },
        validationStatus: { type: String, enum: ['VERIFIED', 'MISMATCH', 'UNVERIFIED'], default: 'UNVERIFIED' },
      },
    ],
    rawText: String,
    aiProvider: { type: String, default: 'MOCK' },
  },
  { timestamps: true }
);

export const DocumentExtraction = mongoose.model<IDocumentExtractionModel>('DocumentExtraction', documentExtractionSchema);
