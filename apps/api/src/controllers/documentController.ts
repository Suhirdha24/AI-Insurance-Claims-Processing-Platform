import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { ClaimDocument } from '../models/ClaimDocument';
import { Claim } from '../models/Claim';
import { DocumentType } from '@ai-insurance/shared';
import { claimService } from '../services/claimService';
import { auditService } from '../services/auditService';

export class DocumentController {
  async uploadDocument(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const claimId = req.params.claimId;
      const file = req.file;
      const documentType = (req.body.documentType as DocumentType) || DocumentType.OTHER;

      if (!file) {
        return res.status(400).json({ success: false, error: { code: 'FILE_REQUIRED', message: 'No file uploaded' } });
      }

      const claim = await Claim.findById(claimId);
      if (!claim) {
        return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Claim not found' } });
      }

      const docUrl = `/uploads/${file.filename}`;

      const claimDoc = await ClaimDocument.create({
        claimId,
        fileName: file.originalname,
        fileUrl: docUrl,
        mimeType: file.mimetype,
        fileSize: file.size,
        documentType,
        status: 'PENDING',
      });

      await auditService.log({
        userId: req.user!.id,
        userName: req.user!.name,
        userRole: req.user!.role,
        action: 'DOCUMENT_UPLOADED',
        resource: 'ClaimDocument',
        resourceId: claimDoc._id.toString(),
        details: { claimId, fileName: file.originalname, mimeType: file.mimetype, fileSize: file.size },
      });

      // Automatically trigger background AI extraction pipeline upon document upload
      await claimService.triggerAIAnalysis(claimId);

      res.status(201).json({ success: true, data: claimDoc });
    } catch (error) {
      next(error);
    }
  }

  async getClaimDocuments(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const claimId = req.params.claimId;
      const documents = await ClaimDocument.find({ claimId }).sort({ createdAt: -1 });
      res.status(200).json({ success: true, data: documents });
    } catch (error) {
      next(error);
    }
  }

  async deleteDocument(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const doc = await ClaimDocument.findByIdAndDelete(req.params.id);
      if (!doc) {
        return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Document not found' } });
      }
      res.status(200).json({ success: true, data: { message: 'Document deleted successfully' } });
    } catch (error) {
      next(error);
    }
  }
}

export const documentController = new DocumentController();
