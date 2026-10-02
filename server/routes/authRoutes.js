import { Router } from 'express';
import { signupStudent, loginStudent, loginAdmin, getCurrentUser, logoutUser } from '../controllers/authController.js';

const router = Router();

router.post('/signup', signupStudent);
router.post('/login', loginStudent);
router.post('/admin-login', loginAdmin);
router.get('/me', getCurrentUser);
router.post('/logout', logoutUser);

export default router;
