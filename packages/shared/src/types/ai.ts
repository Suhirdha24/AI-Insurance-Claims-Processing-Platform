export interface IDamageArea {
  location: string;
  description: string;
  severity: 'MINOR' | 'MODERATE' | 'SEVERE';
  estimatedCost: number;
}

export interface IDamageAnalysis {
  id: string;
  claimId: string;
  documentId: string;
  damageAreas: IDamageArea[];
  overallSeverity: 'MINOR' | 'MODERATE' | 'SEVERE';
  estimatedTotalRepair: number;
  confidenceScore: number;
  adjusterOverride?: {
    overriddenBy: string;
    adjustedTotalCost: number;
    notes: string;
    overriddenAt: string;
  };
  aiProvider: string;
  model: string;
  createdAt: string;
}

export interface ICoverageAnalysis {
  id: string;
  claimId: string;
  policyId: string;
  coverageStatus: 'COVERED' | 'PARTIALLY_COVERED' | 'NOT_COVERED' | 'EXCEEDS_LIMIT';
  coverageLimit: number;
  deductible: number;
  claimAmount: number;
  estimatedEligibleAmount: number;
  appliedExclusions: string[];
  notes: string;
  createdAt: string;
}
