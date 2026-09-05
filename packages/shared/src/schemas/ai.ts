import { z } from 'zod';

export const extractedFieldSchema = z.object({
  field: z.string(),
  value: z.union([z.string(), z.number(), z.boolean()]),
  confidence: z.number().min(0).max(100),
  sourceDocument: z.string(),
  validationStatus: z.enum(['VERIFIED', 'MISMATCH', 'UNVERIFIED']).default('UNVERIFIED'),
});

export const documentExtractionSchema = z.object({
  extractedFields: z.array(extractedFieldSchema),
  rawText: z.string().optional(),
});

export const damageAreaSchema = z.object({
  location: z.string(),
  description: z.string(),
  severity: z.enum(['MINOR', 'MODERATE', 'SEVERE']),
  estimatedCost: z.number(),
});

export const damageAnalysisSchema = z.object({
  damageAreas: z.array(damageAreaSchema),
  overallSeverity: z.enum(['MINOR', 'MODERATE', 'SEVERE']),
  estimatedTotalRepair: z.number(),
  confidenceScore: z.number().min(0).max(100),
});

export const naturalLanguageFilterSchema = z.object({
  riskLevel: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
  claimType: z.enum(['VEHICLE', 'PROPERTY', 'HEALTH', 'LIFE']).optional(),
  status: z.string().optional(),
  minAmount: z.number().optional(),
  maxAmount: z.number().optional(),
  dateRange: z.enum(['LAST_7_DAYS', 'LAST_30_DAYS', 'LAST_90_DAYS', 'ALL_TIME']).optional(),
  searchQuery: z.string().optional(),
});

export type NaturalLanguageFilter = z.infer<typeof naturalLanguageFilterSchema>;
