import { Router } from 'express';
import { auditController } from '../controllers/auditController';
import { authenticateToken } from '../middleware/auth';
import { requireRole } from '../middleware/rbac';
import { UserRole } from '@ai-insurance/shared';

const router = Router();

router.use(authenticateToken);
router.use(requireRole(UserRole.ADMIN));

router.get('/', (req, res, next) => auditController.getAuditLogs(req, res, next));

export default router;
