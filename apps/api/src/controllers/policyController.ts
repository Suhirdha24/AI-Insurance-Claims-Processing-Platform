import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { policyService } from '../services/policyService';
import { createPolicySchema, UserRole } from '@ai-insurance/shared';

export class PolicyController {
  async createPolicy(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const validated = createPolicySchema.parse(req.body);
      const policy = await policyService.createPolicy(validated);
      res.status(201).json({ success: true, data: policy });
    } catch (error) {
      next(error);
    }
  }

  async getMyPolicies(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const user = req.user!;
      const policies = await policyService.getPoliciesByCustomer(user.id);
      res.status(200).json({ success: true, data: policies });
    } catch (error) {
      next(error);
    }
  }

  async getAllPolicies(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string || '1', 10);
      const limit = parseInt(req.query.limit as string || '20', 10);
      const result = await policyService.getAllPolicies(page, limit);
      res.status(200).json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  }
}

export const policyController = new PolicyController();
