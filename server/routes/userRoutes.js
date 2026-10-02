import { Router } from 'express';
import { getUserProfile, updateUserProfile, changePassword } from '../controllers/userController.js';
import { requireUser } from '../middleware/auth.js';

const router = Router();

router.get('/profile', requireUser, getUserProfile);
router.put('/profile', requireUser, updateUserProfile);
router.put('/change-password', requireUser, changePassword);

export default router;
