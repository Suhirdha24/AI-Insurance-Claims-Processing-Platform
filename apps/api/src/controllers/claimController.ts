import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { claimService } from '../services/claimService';
import { createClaimSchema, approveClaimSchema, rejectClaimSchema, requestInfoSchema, UserRole } from '@ai-insurance/shared';
import { Claim } from '../models/Claim';
import { RiskAnalysis } from '../models/RiskAnalysis';
import { DamageAnalysis } from '../models/DamageAnalysis';
import { CoverageAnalysis } from '../models/CoverageAnalysis';
import { DocumentExtraction } from '../models/DocumentExtraction';
import { ClaimDocument } from '../models/ClaimDocument';
import { getAIProvider } from '../ai/aiFactory';

export class ClaimController {
  async createClaim(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const validated = createClaimSchema.parse(req.body);
      const user = req.user!;
      const claim = await claimService.createClaim(user.id, validated, { name: user.name, role: user.role });
      res.status(201).json({ success: true, data: claim });
    } catch (error) {
      next(error);
    }
  }

  async getClaims(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const user = req.user!;
      const page = parseInt(req.query.page as string || '1', 10);
      const limit = parseInt(req.query.limit as string || '20', 10);
      const status = req.query.status as string;
      const riskLevel = req.query.riskLevel as string;
      const claimType = req.query.claimType as string;
      const search = req.query.search as string;

      const filter: any = {};

      // Customer isolation rule: Customers can only access their own claims
      if (user.role === UserRole.CUSTOMER) {
        filter.customerId = user.id;
      } else if (user.role === UserRole.ADJUSTER && req.query.assignedOnly === 'true') {
        filter.assignedAdjusterId = user.id;
      }

      if (status) filter.status = status;
      if (riskLevel) filter.riskLevel = riskLevel;
      if (claimType) filter.claimType = claimType;

      if (search) {
        filter.$or = [
          { claimNumber: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { vehicleRegistration: { $regex: search, $options: 'i' } },
        ];
      }

      const result = await claimService.getClaims(filter, page, limit);
      res.status(200).json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  }

  async getClaimById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const claimId = req.params.id;
      const claim = await Claim.findById(claimId)
        .populate('customerId', 'name email phone')
        .populate('policyId')
        .populate('assignedAdjusterId', 'name email');

      if (!claim) {
        return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Claim not found' } });
      }

      // Fetch related document, extraction, risk, damage, and coverage records
      const documents = await ClaimDocument.find({ claimId });
      const extractions = await DocumentExtraction.find({ claimId });
      const riskAnalysis = await RiskAnalysis.findOne({ claimId });
      const damageAnalysis = await DamageAnalysis.findOne({ claimId });
      const coverageAnalysis = await CoverageAnalysis.findOne({ claimId });

      res.status(200).json({
        success: true,
        data: {
          claim,
          documents,
          extractions,
          riskAnalysis,
          damageAnalysis,
          coverageAnalysis,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async approveClaim(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const validated = approveClaimSchema.parse(req.body);
      const user = req.user!;
      const claim = await claimService.approveClaim(req.params.id, validated, { id: user.id, name: user.name, role: user.role });
      res.status(200).json({ success: true, data: claim });
    } catch (error) {
      next(error);
    }
  }

  async rejectClaim(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const validated = rejectClaimSchema.parse(req.body);
      const user = req.user!;
      const claim = await claimService.rejectClaim(req.params.id, validated, { id: user.id, name: user.name, role: user.role });
      res.status(200).json({ success: true, data: claim });
    } catch (error) {
      next(error);
    }
  }

  async requestInformation(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const validated = requestInfoSchema.parse(req.body);
      const user = req.user!;
      const claim = await claimService.requestInformation(req.params.id, validated, { id: user.id, name: user.name, role: user.role });
      res.status(200).json({ success: true, data: claim });
    } catch (error) {
      next(error);
    }
  }

  async triggerAI(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const claim = await claimService.triggerAIAnalysis(req.params.id);
      res.status(200).json({ success: true, data: claim });
    } catch (error) {
      next(error);
    }
  }

  async naturalLanguageSearch(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { query } = req.body;
      if (!query || typeof query !== 'string') {
        return res.status(400).json({ success: false, error: { code: 'INVALID_QUERY', message: 'Search query string is required' } });
      }

      const ai = getAIProvider();
      const safeFilter = await ai.convertNaturalLanguageToFilter(query);

      const mongoFilter: any = {};
      const user = req.user!;

      if (user.role === UserRole.CUSTOMER) {
        mongoFilter.customerId = user.id;
      }

      if (safeFilter.riskLevel) mongoFilter.riskLevel = safeFilter.riskLevel;
      if (safeFilter.claimType) mongoFilter.claimType = safeFilter.claimType;
      if (safeFilter.minAmount) mongoFilter.estimatedAmount = { $gte: safeFilter.minAmount };

      const claims = await Claim.find(mongoFilter)
        .populate('customerId', 'name email')
        .limit(50)
        .sort({ createdAt: -1 });

      res.status(200).json({
        success: true,
        data: {
          query,
          appliedFilter: safeFilter,
          claims,
          total: claims.length,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

export const claimController = new ClaimController();
