import { Router } from 'express';
import {
  getEvents,
  getFeaturedEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventRegistrations,
  uploadEventBanner,
  createPastEvent,
  deletePastEvent
} from '../controllers/eventController.js';
import { requireAdmin } from '../middleware/auth.js';
import { upload } from '../utils/upload.js';

const router = Router();

router.get('/', getEvents);
router.get('/featured', getFeaturedEvents);
router.get('/:id', getEventById);

router.post('/', requireAdmin, createEvent);
router.put('/:id', requireAdmin, updateEvent);
router.delete('/:id', requireAdmin, deleteEvent);
router.get('/:id/registrations', requireAdmin, getEventRegistrations);
router.post('/upload-banner', requireAdmin, upload.single('banner'), uploadEventBanner);

router.post('/past', requireAdmin, createPastEvent);
router.delete('/past/:id', requireAdmin, deletePastEvent);

export default router;
