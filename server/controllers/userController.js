import bcrypt from 'bcryptjs';
import { db } from '../models/storage.js';

export function getUserProfile(req, res) {
  try {
    if (!req.user || req.user.role !== 'student') {
      return res.status(401).json({ error: 'Unauthorized.' });
    }

    const user = db.getUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const registrations = db.getRegistrationsByUser(user.id);

    return res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        rollNumber: user.rollNumber,
        branch: user.branch,
        year: user.year,
        createdAt: user.createdAt
      },
      registrations
    });
  } catch (err) {
    console.error('Error fetching profile:', err);
    return res.status(500).json({ error: 'Failed to retrieve profile.' });
  }
}

export function updateUserProfile(req, res) {
  try {
    if (!req.user || req.user.role !== 'student') {
      return res.status(401).json({ error: 'Unauthorized.' });
    }

    const { name, branch, year, rollNumber } = req.body;

    if (!name || name.trim().length < 2) {
      return res.status(400).json({ error: 'Full name must be at least 2 characters.' });
    }
    if (!branch || branch.trim().length < 2) {
      return res.status(400).json({ error: 'Academic branch is required.' });
    }
    if (!year) {
      return res.status(400).json({ error: 'Academic year is required.' });
    }

    if (rollNumber) {
      const existingRoll = db.getUserByRollNumber(rollNumber.trim());
      if (existingRoll && existingRoll.id !== req.user.id) {
        return res.status(409).json({ error: 'This roll number is already assigned to another student.' });
      }
    }

    const updated = db.updateUser(req.user.id, {
      name: name.trim(),
      branch: branch.trim(),
      year: year.trim(),
      rollNumber: rollNumber ? rollNumber.trim() : undefined
    });

    if (!updated) {
      return res.status(404).json({ error: 'User not found.' });
    }

    return res.json({
      message: 'Profile updated successfully.',
      user: {
        id: updated.id,
        name: updated.name,
        email: updated.email,
        rollNumber: updated.rollNumber,
        branch: updated.branch,
        year: updated.year
      }
    });
  } catch (err) {
    console.error('Error updating profile:', err);
    return res.status(500).json({ error: 'Failed to update profile.' });
  }
}

export async function changePassword(req, res) {
  try {
    if (!req.user || req.user.role !== 'student') {
      return res.status(401).json({ error: 'Unauthorized.' });
    }

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters.' });
    }

    const user = db.getUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ error: 'Current password does not match.' });
    }

    const salt = await bcrypt.genSalt(10);
    const newHash = await bcrypt.hash(newPassword, salt);

    db.updateUser(user.id, { passwordHash: newHash });

    return res.json({ message: 'Password changed successfully.' });
  } catch (err) {
    console.error('Error changing password:', err);
    return res.status(500).json({ error: 'Failed to update password.' });
  }
}
