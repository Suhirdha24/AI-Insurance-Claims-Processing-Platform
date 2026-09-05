import { z } from 'zod';
import { ClaimType } from '../constants/status';

export const createClaimSchema = z.object({
  policyId: z.string().min(1, 'Policy is required'),
  claimType: z.nativeEnum(ClaimType),
  incidentDate: z.string().min(1, 'Incident date is required'),
  incidentLocation: z.string().min(3, 'Incident location is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  estimatedAmount: z.number().positive('Estimated amount must be greater than 0'),
  vehicleRegistration: z.string().optional(),
  thirdPartyInvolved: z.boolean().optional().default(false),
  policeReportAvailable: z.boolean().optional().default(false),
});

export const approveClaimSchema = z.object({
  approvedAmount: z.number().positive('Approved amount must be positive'),
  notes: z.string().min(5, 'Adjuster notes are required for approval'),
});

export const rejectClaimSchema = z.object({
  rejectionReason: z.string().min(5, 'Rejection reason is required'),
  notes: z.string().min(5, 'Internal notes are required for rejection'),
});

export const requestInfoSchema = z.object({
  requestedFields: z.array(z.string()).min(1, 'At least one field or document must be requested'),
  message: z.string().min(5, 'Message to customer is required'),
  deadline: z.string().optional(),
});

export type CreateClaimInput = z.infer<typeof createClaimSchema>;
export type ApproveClaimInput = z.infer<typeof approveClaimSchema>;
export type RejectClaimInput = z.infer<typeof rejectClaimSchema>;
export type RequestInfoInput = z.infer<typeof requestInfoSchema>;
