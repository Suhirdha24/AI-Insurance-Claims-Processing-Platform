import { Router } from 'express';
import { claimController } from '../controllers/claimController';
import { authenticateToken } from '../middleware/auth';
import { requireRole } from '../middleware/rbac';
import { authorizeClaimAccess } from '../middleware/resourceAuth';
import { UserRole } from '@ai-insurance/shared';

const router = Router();

router.use(authenticateToken);

router.post('/', (req, res, next) => claimController.createClaim(req, res, next));
router.get('/', (req, res, next) => claimController.getClaims(req, res, next));
router.post('/natural-language-search', (req, res, next) => claimController.naturalLanguageSearch(req, res, next));

router.get('/:id', authorizeClaimAccess, (req, res, next) => claimController.getClaimById(req, res, next));

// Adjuster & Admin decision endpoints
router.post('/:id/approve', requireRole(UserRole.ADJUSTER, UserRole.ADMIN), authorizeClaimAccess, (req, res, next) =>
  claimController.approveClaim(req, res, next)
);
router.post('/:id/reject', requireRole(UserRole.ADJUSTER, UserRole.ADMIN), authorizeClaimAccess, (req, res, next) =>
  claimController.rejectClaim(req, res, next)
);
router.post('/:id/request-information', requireRole(UserRole.ADJUSTER, UserRole.ADMIN), authorizeClaimAccess, (req, res, next) =>
  claimController.requestInformation(req, res, next)
);
router.post('/:id/analyze', authorizeClaimAccess, (req, res, next) => claimController.triggerAI(req, res, next));

export default router;
