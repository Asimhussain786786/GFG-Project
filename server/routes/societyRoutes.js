import { Router } from 'express';
import { getAllSocieties, getSocietyById, updateSociety, uploadSocietyLogo } from '../controllers/societyController.js';
import { requireAdmin, requireSocietyAdmin } from '../middleware/auth.js';
import { upload } from '../utils/upload.js';

const router = Router();

router.get('/', getAllSocieties);
router.get('/:id', getSocietyById);
router.put('/:id', requireAdmin, requireSocietyAdmin, updateSociety);
router.post('/upload-logo', requireAdmin, upload.single('logo'), uploadSocietyLogo);

export default router;
