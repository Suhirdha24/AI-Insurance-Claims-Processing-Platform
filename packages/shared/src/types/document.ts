import { DocumentType } from '../constants/status';

export interface IExtractedField {
  field: string;
  value: string | number | boolean;
  confidence: number; // 0-100
  sourceDocument: string;
  validationStatus: 'VERIFIED' | 'MISMATCH' | 'UNVERIFIED';
}

export interface IDocumentExtraction {
  id: string;
  documentId: string;
  claimId: string;
  extractedFields: IExtractedField[];
  rawText?: string;
  aiProvider: string;
  createdAt: string;
}

export interface IClaimDocument {
  id: string;
  claimId: string;
  fileName: string;
  fileUrl: string;
  mimeType: string;
  fileSize: number;
  documentType: DocumentType;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  extractions?: IDocumentExtraction;
  uploadedAt: string;
}
