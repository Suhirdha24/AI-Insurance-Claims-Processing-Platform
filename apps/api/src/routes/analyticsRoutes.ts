import { Router } from 'express';
import { analyticsController } from '../controllers/analyticsController';
import { authenticateToken } from '../middleware/auth';
import { requireRole } from '../middleware/rbac';
import { UserRole } from '@ai-insurance/shared';

const router = Router();

router.use(authenticateToken);
router.use(requireRole(UserRole.ADJUSTER, UserRole.ADMIN));

router.get('/dashboard', (req, res, next) => analyticsController.getDashboardMetrics(req, res, next));

export default router;
