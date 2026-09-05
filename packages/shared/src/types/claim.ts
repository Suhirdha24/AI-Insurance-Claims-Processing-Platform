import { ClaimStatus, ClaimType, RiskLevel } from '../constants/status';

export interface IClaimTimelineEvent {
  id: string;
  stage: ClaimStatus | string;
  title: string;
  description: string;
  performedBy: string;
  userRole?: string;
  timestamp: string;
}

export interface IClaim {
  id: string;
  claimNumber: string;
  customerId: string;
  customerName?: string;
  customerEmail?: string;
  policyId: string;
  policyNumber?: string;
  assignedAdjusterId?: string;
  assignedAdjusterName?: string;
  claimType: ClaimType;
  incidentDate: string;
  incidentLocation: string;
  description: string;
  estimatedAmount: number;
  approvedAmount?: number;
  status: ClaimStatus;
  riskScore: number;
  riskLevel: RiskLevel;
  vehicleRegistration?: string;
  thirdPartyInvolved?: boolean;
  policeReportAvailable?: boolean;
  rejectionReason?: string;
  informationRequested?: {
    requestedFields: string[];
    message: string;
    deadline?: string;
    requestedAt: string;
    isResolved: boolean;
  };
  timeline: IClaimTimelineEvent[];
  createdAt: string;
  updatedAt: string;
}
