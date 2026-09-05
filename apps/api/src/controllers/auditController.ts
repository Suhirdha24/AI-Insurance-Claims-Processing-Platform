import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { auditService } from '../services/auditService';

export class AuditController {
  async getAuditLogs(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string || '1', 10);
      const limit = parseInt(req.query.limit as string || '50', 10);
      const action = req.query.action as string;
      const resource = req.query.resource as string;

      const filter: any = {};
      if (action) filter.action = action;
      if (resource) filter.resource = resource;

      const result = await auditService.getLogs(filter, page, limit);
      res.status(200).json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  }
}

export const auditController = new AuditController();
