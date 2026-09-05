import { Router } from 'express';
import { userController } from '../controllers/userController';
import { authenticateToken } from '../middleware/auth';
import { requireRole } from '../middleware/rbac';
import { UserRole } from '@ai-insurance/shared';

const router = Router();

router.use(authenticateToken);
router.use(requireRole(UserRole.ADMIN));

router.get('/', (req, res, next) => userController.getUsers(req, res, next));
router.patch('/:id/role', (req, res, next) => userController.updateRole(req, res, next));
router.patch('/:id/active', (req, res, next) => userController.toggleActive(req, res, next));

export default router;
