import { Router } from 'express';
import { policyController } from '../controllers/policyController';
import { authenticateToken } from '../middleware/auth';
import { requireRole } from '../middleware/rbac';
import { UserRole } from '@ai-insurance/shared';

const router = Router();

router.use(authenticateToken);

router.get('/my', (req, res, next) => policyController.getMyPolicies(req, res, next));
router.get('/', requireRole(UserRole.ADJUSTER, UserRole.ADMIN), (req, res, next) => policyController.getAllPolicies(req, res, next));
router.post('/', requireRole(UserRole.ADMIN), (req, res, next) => policyController.createPolicy(req, res, next));

export default router;
