import { Claim } from '../models/Claim';
import { User } from '../models/User';
import { Policy } from '../models/Policy';
import { ClaimStatus, RiskLevel, UserRole } from '@ai-insurance/shared';

export class AnalyticsService {
  async getDashboardMetrics() {
    const totalClaims = await Claim.countDocuments();
    const pendingClaims = await Claim.countDocuments({
      status: { $in: [ClaimStatus.SUBMITTED, ClaimStatus.DOCUMENT_REVIEW, ClaimStatus.AI_PROCESSING, ClaimStatus.ADJUSTER_REVIEW] },
    });
    const highRiskClaims = await Claim.countDocuments({ riskLevel: { $in: [RiskLevel.HIGH, RiskLevel.CRITICAL] } });
    const approvedClaims = await Claim.countDocuments({ status: ClaimStatus.APPROVED });
    const rejectedClaims = await Claim.countDocuments({ status: ClaimStatus.REJECTED });
    const totalUsers = await User.countDocuments();
    const totalPolicies = await Policy.countDocuments();

    // Group claims by status
    const claimsByStatus = await Claim.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    // Group claims by type
    const claimsByType = await Claim.aggregate([
      { $group: { _id: '$claimType', count: { $sum: 1 }, totalAmount: { $sum: '$estimatedAmount' } } },
    ]);

    // Group claims by risk level
    const claimsByRisk = await Claim.aggregate([
      { $group: { _id: '$riskLevel', count: { $sum: 1 } } },
    ]);

    // Adjuster workload
    const adjusterWorkload = await User.aggregate([
      { $match: { role: UserRole.ADJUSTER } },
      {
        $lookup: {
          from: 'claims',
          localField: '_id',
          foreignField: 'assignedAdjusterId',
          as: 'assignedClaims',
        },
      },
      {
        $project: {
          id: '$_id',
          name: 1,
          email: 1,
          activeCount: {
            $size: {
              $filter: {
                input: '$assignedClaims',
                as: 'c',
                cond: { $ne: ['$$c.status', ClaimStatus.CLOSED] },
              },
            },
          },
        },
      },
    ]);

    return {
      kpis: {
        totalClaims,
        pendingClaims,
        highRiskClaims,
        approvedClaims,
        rejectedClaims,
        totalUsers,
        totalPolicies,
        avgProcessingDays: 1.8,
      },
      claimsByStatus: claimsByStatus.map((item) => ({ status: item._id, count: item.count })),
      claimsByType: claimsByType.map((item) => ({ type: item._id, count: item.count, totalAmount: item.totalAmount })),
      claimsByRisk: claimsByRisk.map((item) => ({ riskLevel: item._id, count: item.count })),
      adjusterWorkload,
    };
  }
}

export const analyticsService = new AnalyticsService();
