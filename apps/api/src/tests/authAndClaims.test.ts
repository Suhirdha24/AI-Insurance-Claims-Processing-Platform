import { calculateDeterministicRisk } from '@ai-insurance/shared';

describe('Risk Engine & Auth Logic Tests', () => {
  it('should calculate LOW risk for normal claim', () => {
    const result = calculateDeterministicRisk({
      estimatedAmount: 50000,
      policyCoverageLimit: 500000,
      mismatches: [],
      hasDuplicateMatch: false,
      previousClaimsCountCountInLastYear: 0,
    });

    expect(result.overallScore).toBeLessThanOrEqual(30);
    expect(result.riskLevel).toBe('LOW');
  });

  it('should calculate HIGH / CRITICAL risk when mismatches and duplicates exist', () => {
    const result = calculateDeterministicRisk({
      estimatedAmount: 450000,
      policyCoverageLimit: 500000,
      mismatches: [
        {
          field: 'incidentDate',
          doc1Name: 'Form',
          doc1Value: '05/09/2026',
          doc2Name: 'Report',
          doc2Value: '03/09/2026',
          severity: 'HIGH',
          status: 'PENDING',
        },
      ],
      hasDuplicateMatch: true,
      previousClaimsCountCountInLastYear: 2,
    });

    expect(result.overallScore).toBeGreaterThan(60);
    expect(result.factors.length).toBeGreaterThan(0);
  });
});
