import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { analyticsService } from '../services/analyticsService';

export class AnalyticsController {
  async getDashboardMetrics(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await analyticsService.getDashboardMetrics();
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }
}

export const analyticsController = new AnalyticsController();
