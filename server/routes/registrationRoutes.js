import { Router } from 'express';
import { registerForEvent, getMyRegistrations, cancelRegistration } from '../controllers/registrationController.js';
import { requireUser } from '../middleware/auth.js';

const router = Router();

router.post('/', requireUser, registerForEvent);
router.get('/my', requireUser, getMyRegistrations);
router.delete('/:id', requireUser, cancelRegistration);

export default router;
