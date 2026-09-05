import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { getAIProvider } from '../ai/aiFactory';
import { Claim } from '../models/Claim';

export class AIController {
  async chatAssistant(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { claimId, message } = req.body;
      if (!claimId || !message) {
        return res.status(400).json({ success: false, error: { code: 'INVALID_PARAMS', message: 'claimId and message required' } });
      }

      const claim = await Claim.findById(claimId).populate('customerId', 'name').populate('policyId');
      if (!claim) {
        return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Claim not found' } });
      }

      // Context construction safely restricted to current claim
      const context = `Claim #${claim.claimNumber}, Type: ${claim.claimType}, Amount: ₹${claim.estimatedAmount}, Status: ${claim.status}, Risk: ${claim.riskLevel} (${claim.riskScore}/100), Description: ${claim.description}`;

      const ai = getAIProvider();
      const reply = await ai.generateClaimAssistantReply(context, message);

      res.status(200).json({
        success: true,
        data: {
          reply,
          provider: ai.name,
          claimId,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

export const aiController = new AIController();
