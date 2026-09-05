import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { documentController } from '../controllers/documentController';
import { authenticateToken } from '../middleware/auth';
import { authorizeClaimAccess } from '../middleware/resourceAuth';

const uploadDir = path.resolve(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedMime = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (allowedMime.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, JPG, and PNG are allowed.'));
    }
  },
});

const router = Router();

router.use(authenticateToken);

router.post('/claims/:claimId/documents', authorizeClaimAccess, upload.single('file'), (req, res, next) =>
  documentController.uploadDocument(req, res, next)
);
router.get('/claims/:claimId/documents', authorizeClaimAccess, (req, res, next) =>
  documentController.getClaimDocuments(req, res, next)
);
router.delete('/documents/:id', (req, res, next) => documentController.deleteDocument(req, res, next));

export default router;
