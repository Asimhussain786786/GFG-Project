import bcrypt from 'bcryptjs';
import { db } from '../models/storage.js';
import { generateToken } from '../middleware/auth.js';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000
};

export async function signupStudent(req, res) {
  try {
    const { name, rollNumber, email, branch, year, password } = req.body;

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({ error: 'Please enter a valid full name.' });
    }
    if (!rollNumber || typeof rollNumber !== 'string' || !/^\d{5,12}$/.test(rollNumber.trim())) {
      return res.status(400).json({ error: 'Please enter a valid KIIT roll number (numeric).' });
    }
    if (!email || typeof email !== 'string' || !email.trim().toLowerCase().endsWith('@kiit.ac.in')) {
      return res.status(400).json({ error: 'Invalid email. Only official @kiit.ac.in email addresses are permitted.' });
    }
    if (!branch || typeof branch !== 'string' || branch.trim().length < 2) {
      return res.status(400).json({ error: 'Please specify your engineering/academic branch.' });
    }
    if (!year || typeof year !== 'string') {
      return res.status(400).json({ error: 'Please select your academic year.' });
    }
    if (!password || typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanRoll = rollNumber.trim();

    const existingEmail = db.getUserByEmail(cleanEmail);
    if (existingEmail) {
      return res.status(409).json({ error: 'An account with this KIIT email already exists. Please log in.' });
    }

    const existingRoll = db.getUserByRollNumber(cleanRoll);
    if (existingRoll) {
      return res.status(409).json({ error: 'An account with this KIIT roll number already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = db.createUser({
      name: name.trim(),
      rollNumber: cleanRoll,
      email: cleanEmail,
      branch: branch.trim(),
      year: year.trim(),
      passwordHash
    });

    const token = generateToken({
      id: newUser.id,
      role: 'student',
      email: newUser.email,
      name: newUser.name
    });

    res.cookie('token', token, COOKIE_OPTIONS);

    return res.status(201).json({
      message: 'Student account created successfully.',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        rollNumber: newUser.rollNumber,
        branch: newUser.branch,
        year: newUser.year,
        role: newUser.role
      }
    });
  } catch (err) {
    console.error('Signup error:', err);
    return res.status(500).json({ error: 'Internal server error during registration.' });
  }
}

export async function loginStudent(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = db.getUserByEmail(cleanEmail);

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials. No student account found with this email.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials. Please verify your password.' });
    }

    const token = generateToken({
      id: user.id,
      role: 'student',
      email: user.email,
      name: user.name
    });

    res.cookie('token', token, COOKIE_OPTIONS);

    return res.json({
      message: 'Logged in successfully.',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        rollNumber: user.rollNumber,
        branch: user.branch,
        year: user.year,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Internal server error during login.' });
  }
}

export async function loginAdmin(req, res) {
  try {
    const { adminCode, password } = req.body;

    if (!adminCode || typeof adminCode !== 'string') {
      return res.status(400).json({ error: 'Society Admin Code is required.' });
    }
    if (!password || typeof password !== 'string') {
      return res.status(400).json({ error: 'Admin password is required.' });
    }

    const cleanCode = adminCode.trim().toUpperCase();
    const society = db.getSocietyByAdminCode(cleanCode);

    if (!society) {
      return res.status(401).json({ error: 'Invalid Society Admin Code. Please check the code assigned to your society.' });
    }

    let admin = db.getAdminByCode(cleanCode);

    if (!admin) {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);
      admin = db.createOrUpdateAdmin({
        societyId: society.id,
        adminCode: cleanCode,
        email: `admin.${society.id.replace('soc-', '')}@kiit.ac.in`,
        passwordHash
      });
    } else {
      const isMatch = await bcrypt.compare(password, admin.passwordHash);
      if (!isMatch) {
        return res.status(401).json({ error: 'Incorrect password for this Society Admin Code.' });
      }
    }

    const token = generateToken({
      id: admin.id,
      role: 'society_admin',
      societyId: society.id,
      adminCode: admin.adminCode,
      email: admin.email,
      name: society.name
    });

    res.cookie('token', token, COOKIE_OPTIONS);

    return res.json({
      message: 'Admin authenticated successfully.',
      admin: {
        id: admin.id,
        societyId: society.id,
        societyName: society.name,
        adminCode: admin.adminCode,
        email: admin.email,
        role: admin.role
      },
      society
    });
  } catch (err) {
    console.error('Admin login error:', err);
    return res.status(500).json({ error: 'Internal server error during admin authentication.' });
  }
}

export async function getCurrentUser(req, res) {
  try {
    if (!req.user) {
      return res.status(401).json({ user: null });
    }

    if (req.user.role === 'student') {
      const user = db.getUserById(req.user.id);
      if (!user) {
        return res.status(401).json({ user: null });
      }
      return res.json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          rollNumber: user.rollNumber,
          branch: user.branch,
          year: user.year,
          role: user.role
        }
      });
    }

    if (req.user.role === 'society_admin') {
      const admin = db.getAdminById(req.user.id);
      const society = req.user.societyId ? db.getSocietyById(req.user.societyId) : null;
      if (!admin || !society) {
        return res.status(401).json({ user: null });
      }
      return res.json({
        admin: {
          id: admin.id,
          societyId: society.id,
          societyName: society.name,
          adminCode: admin.adminCode,
          email: admin.email,
          role: admin.role
        },
        society
      });
    }

    return res.status(401).json({ user: null });
  } catch (err) {
    console.error('Get current user error:', err);
    return res.status(500).json({ error: 'Failed to retrieve session info.' });
  }
}

export function logoutUser(_req, res) {
  res.clearCookie('token', COOKIE_OPTIONS);
  return res.json({ message: 'Logged out successfully.' });
}
