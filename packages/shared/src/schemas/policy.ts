import { z } from 'zod';
import { ClaimType } from '../constants/status';

export const createPolicySchema = z.object({
  policyNumber: z.string().min(3, 'Policy number required'),
  customerId: z.string().min(1, 'Customer is required'),
  policyType: z.nativeEnum(ClaimType),
  coverageLimit: z.number().positive(),
  deductible: z.number().nonnegative(),
  startDate: z.string(),
  endDate: z.string(),
  coverageDetails: z.array(z.string()).default([]),
  exclusions: z.array(z.string()).default([]),
  vehicleDetails: z.object({
    make: z.string().optional(),
    model: z.string().optional(),
    year: z.number().optional(),
    registrationNumber: z.string().optional(),
  }).optional(),
});

export type CreatePolicyInput = z.infer<typeof createPolicySchema>;
