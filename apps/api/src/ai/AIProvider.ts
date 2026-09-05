import {
  IExtractedField,
  IDamageArea,
  IRiskCalculationResult,
  ICrossDocMismatch,
  NaturalLanguageFilter,
} from '@ai-insurance/shared';

export interface IDocumentExtractionResult {
  extractedFields: IExtractedField[];
  rawText: string;
}

export interface IDamageAnalysisResult {
  damageAreas: IDamageArea[];
  overallSeverity: 'MINOR' | 'MODERATE' | 'SEVERE';
  estimatedTotalRepair: number;
  confidenceScore: number;
}

export interface IAIProvider {
  name: string;
  extractDocumentData(fileBuffer: Buffer, mimeType: string, fileName: string, docType: string): Promise<IDocumentExtractionResult>;
  analyzeDamageImage(fileBuffer: Buffer, mimeType: string): Promise<IDamageAnalysisResult>;
  performCrossDocValidation(extractions: IDocumentExtractionResult[]): Promise<ICrossDocMismatch[]>;
  generateClaimAssistantReply(context: string, userMessage: string): Promise<string>;
  convertNaturalLanguageToFilter(naturalQuery: string): Promise<NaturalLanguageFilter>;
}
