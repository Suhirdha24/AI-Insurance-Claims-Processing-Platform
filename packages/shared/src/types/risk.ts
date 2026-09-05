import { RiskLevel } from '../constants/status';

export interface IRiskFactor {
  code: string;
  name: string;
  score: number;
  maxScore: number;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
}

export interface ICrossDocMismatch {
  field: string;
  doc1Name: string;
  doc1Value: string;
  doc2Name: string;
  doc2Value: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'PENDING' | 'CONFIRMED' | 'FALSE_POSITIVE' | 'RESOLVED';
}

export interface IRiskAnalysis {
  id: string;
  claimId: string;
  overallScore: number; // 0-100
  riskLevel: RiskLevel;
  factors: IRiskFactor[];
  mismatches: ICrossDocMismatch[];
  duplicateMatches: {
    matchedClaimId: string;
    matchedClaimNumber: string;
    similarityScore: number;
    matchingFields: string[];
  }[];
  aiConfidence: number;
  aiRecommendation: string;
  createdAt: string;
}
