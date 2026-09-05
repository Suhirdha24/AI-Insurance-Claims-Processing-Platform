import { RiskLevel } from '../constants/status';
import { IRiskFactor, ICrossDocMismatch } from '../types/risk';

export interface IRiskCalculationInput {
  estimatedAmount: number;
  policyCoverageLimit: number;
  mismatches: ICrossDocMismatch[];
  hasDuplicateMatch: boolean;
  previousClaimsCountCountInLastYear: number;
}

export interface IRiskCalculationResult {
  overallScore: number;
  riskLevel: RiskLevel;
  factors: IRiskFactor[];
}

export function calculateDeterministicRisk(input: IRiskCalculationInput): IRiskCalculationResult {
  const factors: IRiskFactor[] = [];
  let totalScore = 0;

  // 1. Amount Anomaly Factor (Max 20 pts)
  const amountRatio = input.estimatedAmount / (input.policyCoverageLimit || 100000);
  if (amountRatio > 0.8) {
    const score = Math.min(20, Math.round(amountRatio * 20));
    factors.push({
      code: 'AMOUNT_ANOMALY',
      name: 'High Claim Amount relative to Coverage Limit',
      score,
      maxScore: 20,
      severity: score > 15 ? 'HIGH' : 'MEDIUM',
      description: `Claim amount is ${Math.round(amountRatio * 100)}% of total policy coverage limit.`,
    });
    totalScore += score;
  }

  // 2. Document Discrepancy Factor (Max 30 pts)
  if (input.mismatches && input.mismatches.length > 0) {
    let mismatchScore = 0;
    for (const m of input.mismatches) {
      if (m.field.toLowerCase().includes('date')) mismatchScore += 15;
      else if (m.field.toLowerCase().includes('vehicle') || m.field.toLowerCase().includes('registration')) mismatchScore += 15;
      else mismatchScore += 10;
    }
    const finalMismatchScore = Math.min(30, mismatchScore);
    factors.push({
      code: 'DOC_DISCREPANCY',
      name: 'Cross-Document Information Mismatch',
      score: finalMismatchScore,
      maxScore: 30,
      severity: finalMismatchScore >= 20 ? 'HIGH' : 'MEDIUM',
      description: `Detected ${input.mismatches.length} inconsistent fields across submitted documents.`,
    });
    totalScore += finalMismatchScore;
  }

  // 3. Duplicate Claim Factor (30 pts)
  if (input.hasDuplicateMatch) {
    const dupScore = 30;
    factors.push({
      code: 'DUPLICATE_CLAIM',
      name: 'Potential Duplicate Claim Signal',
      score: dupScore,
      maxScore: 30,
      severity: 'CRITICAL',
      description: 'Vehicle registration, policy, or incident date matches a previously filed claim.',
    });
    totalScore += dupScore;
  }

  // 4. Historical Frequency (Max 20 pts)
  if (input.previousClaimsCountCountInLastYear > 1) {
    const freqScore = Math.min(20, input.previousClaimsCountCountInLastYear * 10);
    factors.push({
      code: 'HIGH_FREQUENCY',
      name: 'Multiple Historical Claims in 12 Months',
      score: freqScore,
      maxScore: 20,
      severity: freqScore >= 20 ? 'HIGH' : 'MEDIUM',
      description: `Claimant has submitted ${input.previousClaimsCountCountInLastYear} prior claims in the past 12 months.`,
    });
    totalScore += freqScore;
  }

  const finalScore = Math.min(100, Math.max(0, totalScore));

  let riskLevel: RiskLevel = RiskLevel.LOW;
  if (finalScore >= 81) riskLevel = RiskLevel.CRITICAL;
  else if (finalScore >= 61) riskLevel = RiskLevel.HIGH;
  else if (finalScore >= 31) riskLevel = RiskLevel.MEDIUM;

  return {
    overallScore: finalScore,
    riskLevel,
    factors,
  };
}
