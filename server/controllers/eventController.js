import { db } from '../models/storage.js';

export function getEvents(req, res) {
  try {
    const { category, societyId, search, sort } = req.query;
    const events = db.getEvents({
      category: typeof category === 'string' ? category : undefined,
      societyId: typeof societyId === 'string' ? societyId : undefined,
      search: typeof search === 'string' ? search : undefined,
      sort: typeof sort === 'string' ? sort : undefined
    });

    return res.json({ events });
  } catch (err) {
    console.error('Error fetching events:', err);
    return res.status(500).json({ error: 'Failed to retrieve events.' });
  }
}

export function getFeaturedEvents(_req, res) {
  try {
    const all = db.getEvents();
    const featured = all.slice(0, 4);
    return res.json({ events: featured });
  } catch (err) {
    console.error('Error fetching featured events:', err);
    return res.status(500).json({ error: 'Failed to retrieve featured events.' });
  }
}

export function getEventById(req, res) {
  try {
    const { id } = req.params;
    const event = db.getEventById(id);

    if (!event) {
      return res.status(404).json({ error: 'Event not found.' });
    }

    let isRegistered = false;
    let registrationId = null;
    let registeredAt = null;

    if (req.user && req.user.role === 'student') {
      const userRegs = db.getRegistrationsByUser(req.user.id);
      const matched = userRegs.find(r => r.eventId === id);
      if (matched) {
        isRegistered = true;
        registrationId = matched.id;
        registeredAt = matched.registeredAt;
      }
    }

    return res.json({
      event,
      isRegistered,
      registrationId,
      registeredAt
    });
  } catch (err) {
    console.error('Error fetching event details:', err);
    return res.status(500).json({ error: 'Failed to retrieve event details.' });
  }
}

export function createEvent(req, res) {
  try {
    if (!req.user || req.user.role !== 'society_admin' || !req.user.societyId) {
      return res.status(403).json({ error: 'Forbidden: Only verified Society Admins can post events.' });
    }

    const { title, bannerImage, date, time, venue, category, fullDescription, externalLink } = req.body;

    if (!title || title.trim().length < 3) {
      return res.status(400).json({ error: 'Event title is required.' });
    }
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({ error: 'Valid event date (YYYY-MM-DD) is required.' });
    }
    if (!time || time.trim().length < 2) {
      return res.status(400).json({ error: 'Event time is required (e.g. 10:00 AM - 01:00 PM).' });
    }
    if (!venue || venue.trim().length < 2) {
      return res.status(400).json({ error: 'Campus venue is required (e.g. Campus 6 Auditorium).' });
    }
    const validCategories = ['Recruitment', 'Hackathon', 'Workshop', 'Competition', 'Cultural', 'Other'];
    if (!category || !validCategories.includes(category)) {
      return res.status(400).json({ error: `Category must be one of: ${validCategories.join(', ')}` });
    }
    if (!fullDescription || fullDescription.trim().length < 10) {
      return res.status(400).json({ error: 'Detailed event description is required.' });
    }

    const newEvent = db.createEvent({
      societyId: req.user.societyId,
      title: title.trim(),
      bannerImage: bannerImage?.trim() || '/images/banners/default.svg',
      date: date.trim(),
      time: time.trim(),
      venue: venue.trim(),
      category,
      fullDescription: fullDescription.trim(),
      externalLink: externalLink?.trim() || undefined
    });

    return res.status(201).json({
      message: 'Event created successfully.',
      event: newEvent
    });
  } catch (err) {
    console.error('Error creating event:', err);
    return res.status(500).json({ error: 'Failed to create event.' });
  }
}

export function updateEvent(req, res) {
  try {
    const { id } = req.params;
    const existing = db.getEventById(id);

    if (!existing) {
      return res.status(404).json({ error: 'Event not found.' });
    }

    if (!req.user || req.user.role !== 'society_admin' || req.user.societyId !== existing.societyId) {
      return res.status(403).json({ error: 'Forbidden: You cannot modify events belonging to another society.' });
    }

    const { title, bannerImage, date, time, venue, category, fullDescription, externalLink } = req.body;

    const updated = db.updateEvent(id, {
      title: title?.trim() || existing.title,
      bannerImage: bannerImage?.trim() || existing.bannerImage,
      date: date?.trim() || existing.date,
      time: time?.trim() || existing.time,
      venue: venue?.trim() || existing.venue,
      category: category || existing.category,
      fullDescription: fullDescription?.trim() || existing.fullDescription,
      externalLink: externalLink !== undefined ? externalLink.trim() : existing.externalLink
    });

    return res.json({
      message: 'Event updated successfully.',
      event: updated
    });
  } catch (err) {
    console.error('Error updating event:', err);
    return res.status(500).json({ error: 'Failed to update event.' });
  }
}

export function deleteEvent(req, res) {
  try {
    const { id } = req.params;
    const existing = db.getEventById(id);

    if (!existing) {
      return res.status(404).json({ error: 'Event not found.' });
    }

    if (!req.user || req.user.role !== 'society_admin' || req.user.societyId !== existing.societyId) {
      return res.status(403).json({ error: 'Forbidden: You cannot delete events of another society.' });
    }

    db.deleteEvent(id);
    return res.json({ message: 'Event and associated registrations deleted successfully.' });
  } catch (err) {
    console.error('Error deleting event:', err);
    return res.status(500).json({ error: 'Failed to delete event.' });
  }
}

export function getEventRegistrations(req, res) {
  try {
    const { id } = req.params;
    const event = db.getEventById(id);

    if (!event) {
      return res.status(404).json({ error: 'Event not found.' });
    }

    if (!req.user || req.user.role !== 'society_admin' || req.user.societyId !== event.societyId) {
      return res.status(403).json({ error: 'Forbidden: You can only view registrations for your own society events.' });
    }

    const registrations = db.getRegistrationsByEvent(id);
    return res.json({
      eventTitle: event.title,
      totalRegistrations: registrations.length,
      registrations
    });
  } catch (err) {
    console.error('Error fetching event registrations:', err);
    return res.status(500).json({ error: 'Failed to retrieve registrations.' });
  }
}

export function uploadEventBanner(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file uploaded.' });
    }
    const fileUrl = `/uploads/${req.file.filename}`;
    return res.json({ url: fileUrl });
  } catch (err) {
    console.error('Event banner upload error:', err);
    return res.status(500).json({ error: 'Failed to upload event banner.' });
  }
}

export function createPastEvent(req, res) {
  try {
    if (!req.user || req.user.role !== 'society_admin' || !req.user.societyId) {
      return res.status(403).json({ error: 'Forbidden: Only Society Admins can post past events.' });
    }

    const { title, date, shortDescription, images } = req.body;

    if (!title || title.trim().length < 3) {
      return res.status(400).json({ error: 'Past event title is required.' });
    }
    if (!date) {
      return res.status(400).json({ error: 'Past event date is required.' });
    }
    if (!shortDescription || shortDescription.trim().length < 5) {
      return res.status(400).json({ error: 'Short summary of the past event is required.' });
    }

    const pastEvent = db.createPastEvent({
      societyId: req.user.societyId,
      title: title.trim(),
      date: date.trim(),
      shortDescription: shortDescription.trim(),
      images: Array.isArray(images) && images.length > 0 ? images : ['/images/gallery/default_past.svg']
    });

    return res.status(201).json({
      message: 'Past event archived successfully.',
      pastEvent
    });
  } catch (err) {
    console.error('Error creating past event:', err);
    return res.status(500).json({ error: 'Failed to record past event.' });
  }
}

export function deletePastEvent(req, res) {
  try {
    const { id } = req.params;
    const pastEvents = db.getPastEvents();
    const existing = pastEvents.find(p => p.id === id);

    if (!existing) {
      return res.status(404).json({ error: 'Past event not found.' });
    }

    if (!req.user || req.user.role !== 'society_admin' || req.user.societyId !== existing.societyId) {
      return res.status(403).json({ error: 'Forbidden: You can only delete your own society past events.' });
    }

    db.deletePastEvent(id);
    return res.json({ message: 'Past event deleted successfully.' });
  } catch (err) {
    console.error('Error deleting past event:', err);
    return res.status(500).json({ error: 'Failed to delete past event.' });
  }
}
