import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';
import { Claim } from '../models/Claim';
import { UserRole } from '@ai-insurance/shared';

export async function authorizeClaimAccess(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const claimId = req.params.id || req.params.claimId;
    if (!claimId) {
      return res.status(400).json({ success: false, error: { code: 'INVALID_PARAM', message: 'Claim ID parameter missing' } });
    }

    const claim = await Claim.findById(claimId);
    if (!claim) {
      return res.status(404).json({ success: false, error: { code: 'CLAIM_NOT_FOUND', message: 'Claim not found' } });
    }

    const user = req.user!;
    if (user.role === UserRole.CUSTOMER) {
      if (claim.customerId.toString() !== user.id) {
        return res.status(403).json({
          success: false,
          error: { code: 'FORBIDDEN_RESOURCE', message: 'You are not authorized to access this claim' },
        });
      }
    }

    // Attach claim to request for downstream handlers
    (req as any).claim = claim;
    next();
  } catch (error) {
    next(error);
  }
}
