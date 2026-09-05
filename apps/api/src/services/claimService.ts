import { Claim, IClaimDocumentModel } from '../models/Claim';
import { Policy } from '../models/Policy';
import { User } from '../models/User';
import { ClaimStatus, CreateClaimInput, ApproveClaimInput, RejectClaimInput, RequestInfoInput, RiskLevel, UserRole } from '@ai-insurance/shared';
import { auditService } from './auditService';
import { socketService } from './socketService';
import { dispatchClaimProcessing } from '../queues/queueManager';

export class ClaimService {
  async generateClaimNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const count = await Claim.countDocuments();
    const sequence = (count + 1).toString().padStart(5, '0');
    return `CLM-${year}-${sequence}`;
  }

  async createClaim(customerId: string, input: CreateClaimInput, userMeta: { name: string; role: string }) {
    const policy = await Policy.findById(input.policyId);
    if (!policy) {
      const err: any = new Error('Selected policy does not exist');
      err.statusCode = 400;
      throw err;
    }

    if (policy.customerId.toString() !== customerId) {
      const err: any = new Error('Selected policy does not belong to user');
      err.statusCode = 403;
      throw err;
    }

    const claimNumber = await this.generateClaimNumber();

    // Auto-assign available adjuster if any exists
    const adjuster = await User.findOne({ role: UserRole.ADJUSTER, isActive: true });

    const claim = await Claim.create({
      claimNumber,
      customerId,
      policyId: input.policyId,
      assignedAdjusterId: adjuster ? adjuster._id : undefined,
      claimType: input.claimType,
      incidentDate: new Date(input.incidentDate),
      incidentLocation: input.incidentLocation,
      description: input.description,
      estimatedAmount: input.estimatedAmount,
      status: ClaimStatus.SUBMITTED,
      riskScore: 0,
      riskLevel: RiskLevel.LOW,
      vehicleRegistration: input.vehicleRegistration,
      thirdPartyInvolved: input.thirdPartyInvolved,
      policeReportAvailable: input.policeReportAvailable,
      timeline: [
        {
          stage: ClaimStatus.SUBMITTED,
          title: 'Claim Created & Submitted',
          description: `Claim ${claimNumber} submitted by ${userMeta.name}`,
          performedBy: userMeta.name,
          userRole: userMeta.role,
          timestamp: new Date(),
        },
      ],
    });

    await auditService.log({
      userId: customerId,
      userName: userMeta.name,
      userRole: userMeta.role,
      action: 'CLAIM_CREATED',
      resource: 'Claim',
      resourceId: claim._id.toString(),
      details: { claimNumber, estimatedAmount: input.estimatedAmount },
    });

    return claim;
  }

  async getClaims(queryFilter: any, page = 1, limit = 20, sort: any = { createdAt: -1 }) {
    const skip = (page - 1) * limit;
    const claims = await Claim.find(queryFilter)
      .populate('customerId', 'name email')
      .populate('policyId', 'policyNumber coverageLimit deductible')
      .populate('assignedAdjusterId', 'name email')
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Claim.countDocuments(queryFilter);

    return {
      claims,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async transitionStatus(
    claimId: string,
    newStatus: ClaimStatus,
    performedBy: { id: string; name: string; role: string },
    description: string
  ) {
    const claim = await Claim.findById(claimId);
    if (!claim) {
      const err: any = new Error('Claim not found');
      err.statusCode = 404;
      throw err;
    }

    const previousStatus = claim.status;

    // State machine transition validation
    const allowedTransitions: Record<string, string[]> = {
      [ClaimStatus.DRAFT]: [ClaimStatus.SUBMITTED],
      [ClaimStatus.SUBMITTED]: [ClaimStatus.DOCUMENT_REVIEW, ClaimStatus.AI_PROCESSING, ClaimStatus.ADJUSTER_REVIEW],
      [ClaimStatus.DOCUMENT_REVIEW]: [ClaimStatus.AI_PROCESSING, ClaimStatus.ADJUSTER_REVIEW],
      [ClaimStatus.AI_PROCESSING]: [ClaimStatus.ADJUSTER_REVIEW, ClaimStatus.INVESTIGATION, ClaimStatus.INFORMATION_REQUIRED],
      [ClaimStatus.ADJUSTER_REVIEW]: [ClaimStatus.APPROVED, ClaimStatus.REJECTED, ClaimStatus.INFORMATION_REQUIRED, ClaimStatus.INVESTIGATION],
      [ClaimStatus.INFORMATION_REQUIRED]: [ClaimStatus.DOCUMENT_REVIEW, ClaimStatus.ADJUSTER_REVIEW, ClaimStatus.AI_PROCESSING],
      [ClaimStatus.INVESTIGATION]: [ClaimStatus.ADJUSTER_REVIEW, ClaimStatus.APPROVED, ClaimStatus.REJECTED],
      [ClaimStatus.APPROVED]: [ClaimStatus.SETTLEMENT],
      [ClaimStatus.SETTLEMENT]: [ClaimStatus.CLOSED],
      [ClaimStatus.REJECTED]: [ClaimStatus.CLOSED],
    };

    if (allowedTransitions[previousStatus] && !allowedTransitions[previousStatus].includes(newStatus)) {
      const err: any = new Error(`Cannot transition claim status directly from ${previousStatus} to ${newStatus}`);
      err.statusCode = 400;
      throw err;
    }

    claim.status = newStatus;
    claim.timeline.push({
      stage: newStatus,
      title: `Status updated to ${newStatus.replace(/_/g, ' ')}`,
      description,
      performedBy: performedBy.name,
      userRole: performedBy.role,
      timestamp: new Date(),
    });

    await claim.save();

    socketService.emitClaimUpdate(claim._id.toString(), 'status_changed', {
      previousStatus,
      newStatus,
      updatedBy: performedBy.name,
    });

    await auditService.log({
      userId: performedBy.id,
      userName: performedBy.name,
      userRole: performedBy.role,
      action: 'CLAIM_STATUS_CHANGED',
      resource: 'Claim',
      resourceId: claim._id.toString(),
      details: { previousStatus, newStatus, description },
    });

    return claim;
  }

  async approveClaim(claimId: string, input: ApproveClaimInput, adjuster: { id: string; name: string; role: string }) {
    const claim = await Claim.findById(claimId);
    if (!claim) throw new Error('Claim not found');

    claim.approvedAmount = input.approvedAmount;
    claim.status = ClaimStatus.APPROVED;
    claim.timeline.push({
      stage: ClaimStatus.APPROVED,
      title: 'Claim Approved by Adjuster',
      description: `Approved amount: ₹${input.approvedAmount.toLocaleString()}. Notes: ${input.notes}`,
      performedBy: adjuster.name,
      userRole: adjuster.role,
      timestamp: new Date(),
    });

    await claim.save();

    await auditService.log({
      userId: adjuster.id,
      userName: adjuster.name,
      userRole: adjuster.role,
      action: 'CLAIM_APPROVED',
      resource: 'Claim',
      resourceId: claim._id.toString(),
      details: { approvedAmount: input.approvedAmount, notes: input.notes },
    });

    socketService.emitClaimUpdate(claim._id.toString(), 'claim_approved', claim);
    return claim;
  }

  async rejectClaim(claimId: string, input: RejectClaimInput, adjuster: { id: string; name: string; role: string }) {
    const claim = await Claim.findById(claimId);
    if (!claim) throw new Error('Claim not found');

    claim.rejectionReason = input.rejectionReason;
    claim.status = ClaimStatus.REJECTED;
    claim.timeline.push({
      stage: ClaimStatus.REJECTED,
      title: 'Claim Rejected by Adjuster',
      description: `Reason: ${input.rejectionReason}. Notes: ${input.notes}`,
      performedBy: adjuster.name,
      userRole: adjuster.role,
      timestamp: new Date(),
    });

    await claim.save();

    await auditService.log({
      userId: adjuster.id,
      userName: adjuster.name,
      userRole: adjuster.role,
      action: 'CLAIM_REJECTED',
      resource: 'Claim',
      resourceId: claim._id.toString(),
      details: { rejectionReason: input.rejectionReason, notes: input.notes },
    });

    socketService.emitClaimUpdate(claim._id.toString(), 'claim_rejected', claim);
    return claim;
  }

  async requestInformation(claimId: string, input: RequestInfoInput, adjuster: { id: string; name: string; role: string }) {
    const claim = await Claim.findById(claimId);
    if (!claim) throw new Error('Claim not found');

    claim.status = ClaimStatus.INFORMATION_REQUIRED;
    claim.informationRequested = {
      requestedFields: input.requestedFields,
      message: input.message,
      deadline: input.deadline ? new Date(input.deadline) : undefined,
      requestedAt: new Date(),
      isResolved: false,
    };

    claim.timeline.push({
      stage: ClaimStatus.INFORMATION_REQUIRED,
      title: 'Information Requested from Claimant',
      description: input.message,
      performedBy: adjuster.name,
      userRole: adjuster.role,
      timestamp: new Date(),
    });

    await claim.save();

    await auditService.log({
      userId: adjuster.id,
      userName: adjuster.name,
      userRole: adjuster.role,
      action: 'INFORMATION_REQUESTED',
      resource: 'Claim',
      resourceId: claim._id.toString(),
      details: { fields: input.requestedFields, message: input.message },
    });

    socketService.emitClaimUpdate(claim._id.toString(), 'info_requested', claim);
    return claim;
  }

  async triggerAIAnalysis(claimId: string) {
    const claim = await Claim.findById(claimId);
    if (!claim) throw new Error('Claim not found');

    claim.status = ClaimStatus.AI_PROCESSING;
    claim.timeline.push({
      stage: ClaimStatus.AI_PROCESSING,
      title: 'AI Processing Started',
      description: 'Document extraction, cross-doc validation, risk scoring & damage analysis initiated',
      performedBy: 'System AI Engine',
      userRole: 'SYSTEM',
      timestamp: new Date(),
    });
    await claim.save();

    // Dispatch background queue job
    await dispatchClaimProcessing(claimId);

    socketService.emitClaimUpdate(claim._id.toString(), 'ai_processing_started', claim);
    return claim;
  }
}

export const claimService = new ClaimService();
