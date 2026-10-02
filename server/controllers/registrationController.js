import { db } from '../models/storage.js';

export function registerForEvent(req, res) {
  try {
    if (!req.user || req.user.role !== 'student') {
      return res.status(401).json({ error: 'Please log in with your student account to register for events.' });
    }

    const { eventId } = req.body;
    if (!eventId) {
      return res.status(400).json({ error: 'Event ID is required.' });
    }

    const event = db.getEventById(eventId);
    if (!event) {
      return res.status(404).json({ error: 'Event not found.' });
    }

    if (event.externalLink) {
      return res.status(400).json({
        error: 'This event uses an external registration platform.',
        externalLink: event.externalLink
      });
    }

    if (db.isRegistered(req.user.id, eventId)) {
      return res.status(409).json({ error: 'You are already registered for this event!' });
    }

    const user = db.getUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'Student record not found.' });
    }

    const registration = db.createRegistration(req.user.id, eventId, {
      name: user.name,
      email: user.email,
      rollNumber: user.rollNumber,
      branch: user.branch,
      year: user.year
    });

    return res.status(201).json({
      message: 'Registration confirmed successfully! See you at the event.',
      registration
    });
  } catch (err) {
    console.error('Registration error:', err);
    if (err.message?.includes('already registered')) {
      return res.status(409).json({ error: 'You are already registered for this event!' });
    }
    return res.status(500).json({ error: 'Failed to process event registration.' });
  }
}

export function getMyRegistrations(req, res) {
  try {
    if (!req.user || req.user.role !== 'student') {
      return res.status(401).json({ error: 'Unauthorized.' });
    }

    const list = db.getRegistrationsByUser(req.user.id);
    return res.json({ registrations: list });
  } catch (err) {
    console.error('Error fetching registrations:', err);
    return res.status(500).json({ error: 'Failed to retrieve registrations.' });
  }
}

export function cancelRegistration(req, res) {
  try {
    if (!req.user || req.user.role !== 'student') {
      return res.status(401).json({ error: 'Unauthorized.' });
    }

    const { id } = req.params;
    const deleted = db.deleteRegistration(id, req.user.id);

    if (!deleted) {
      return res.status(404).json({ error: 'Registration record not found or not owned by you.' });
    }

    return res.json({ message: 'Registration cancelled successfully.' });
  } catch (err) {
    console.error('Error cancelling registration:', err);
    return res.status(500).json({ error: 'Failed to cancel registration.' });
  }
}
