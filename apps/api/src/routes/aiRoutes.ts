import { Router } from 'express';
import { aiController } from '../controllers/aiController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);
router.post('/chat', (req, res, next) => aiController.chatAssistant(req, res, next));

export default router;
