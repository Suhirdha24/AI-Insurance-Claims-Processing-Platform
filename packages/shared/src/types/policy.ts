import { ClaimType } from '../constants/status';

export interface IPolicy {
  id: string;
  policyNumber: string;
  customerId: string;
  customerName?: string;
  policyType: ClaimType;
  coverageLimit: number;
  deductible: number;
  startDate: string;
  endDate: string;
  status: 'ACTIVE' | 'EXPIRED' | 'CANCELLED' | 'PENDING';
  coverageDetails: string[];
  exclusions: string[];
  vehicleDetails?: {
    make?: string;
    model?: string;
    year?: number;
    registrationNumber?: string;
  };
  createdAt: string;
  updatedAt: string;
}
