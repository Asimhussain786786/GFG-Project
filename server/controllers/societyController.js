import { db } from '../models/storage.js';

export function getAllSocieties(req, res) {
  try {
    const { category, search } = req.query;
    const societies = db.getSocieties({
      category: typeof category === 'string' ? category : undefined,
      search: typeof search === 'string' ? search : undefined
    });

    const allEvents = db.getEvents();
    const societiesWithCount = societies.map(soc => ({
      ...soc,
      upcomingEventsCount: allEvents.filter(e => e.societyId === soc.id).length
    }));

    return res.json({ societies: societiesWithCount });
  } catch (err) {
    console.error('Error fetching societies:', err);
    return res.status(500).json({ error: 'Failed to retrieve societies.' });
  }
}

export function getSocietyById(req, res) {
  try {
    const { id } = req.params;
    const society = db.getSocietyById(id);

    if (!society) {
      return res.status(404).json({ error: 'Society not found.' });
    }

    const upcomingEvents = db.getEvents({ societyId: id });
    const pastEvents = db.getPastEvents(id);

    return res.json({
      society,
      upcomingEvents,
      pastEvents
    });
  } catch (err) {
    console.error('Error fetching society details:', err);
    return res.status(500).json({ error: 'Failed to retrieve society details.' });
  }
}

export function updateSociety(req, res) {
  try {
    const { id } = req.params;
    const { name, logo, category, shortDescription, fullDescription, website, instagram, linkedin } = req.body;

    if (!req.user || req.user.role !== 'society_admin' || req.user.societyId !== id) {
      return res.status(403).json({ error: 'Forbidden: You can only edit your own assigned society.' });
    }

    if (!name || name.trim().length < 2) {
      return res.status(400).json({ error: 'Society name is required.' });
    }
    if (!shortDescription || shortDescription.trim().length < 10) {
      return res.status(400).json({ error: 'A short description of at least 10 characters is required.' });
    }
    if (!fullDescription || fullDescription.trim().length < 20) {
      return res.status(400).json({ error: 'A detailed full description is required.' });
    }

    const updated = db.updateSociety(id, {
      name: name.trim(),
      logo: logo?.trim() || undefined,
      category: category || undefined,
      shortDescription: shortDescription.trim(),
      fullDescription: fullDescription.trim(),
      website: website?.trim() || '',
      instagram: instagram?.trim() || '',
      linkedin: linkedin?.trim() || ''
    });

    if (!updated) {
      return res.status(404).json({ error: 'Society not found.' });
    }

    return res.json({
      message: 'Society profile updated successfully.',
      society: updated
    });
  } catch (err) {
    console.error('Error updating society:', err);
    return res.status(500).json({ error: 'Failed to update society details.' });
  }
}

export function uploadSocietyLogo(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file uploaded.' });
    }
    const fileUrl = `/uploads/${req.file.filename}`;
    return res.json({ url: fileUrl });
  } catch (err) {
    console.error('Logo upload error:', err);
    return res.status(500).json({ error: 'Failed to upload logo image.' });
  }
}
