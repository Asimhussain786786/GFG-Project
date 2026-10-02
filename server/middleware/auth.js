import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'kiit_society_hub_super_secret_jwt_key_2026';

export function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function authenticate(req, _res, next) {
  let token = req.cookies?.token;

  if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.substring(7);
  }

  if (!token) {
    req.user = undefined;
    return next();
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
  } catch (err) {
    req.user = undefined;
  }
  next();
}

export function requireAuth(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required. Please log in.' });
  }
  next();
}

export function requireUser(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required. Please log in.' });
  }
  if (req.user.role !== 'student') {
    return res.status(403).json({ error: 'Access restricted to student accounts.' });
  }
  next();
}

export function requireAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: 'Admin authentication required. Please log in with your society admin credentials.' });
  }
  if (req.user.role !== 'society_admin') {
    return res.status(403).json({ error: 'Access restricted to Society Administrators.' });
  }
  next();
}

export function requireSocietyAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'society_admin') {
    return res.status(403).json({ error: 'Access restricted to Society Administrators.' });
  }
  const targetSocietyId = req.params.societyId || req.params.id || req.body.societyId;
  if (targetSocietyId && req.user.societyId !== targetSocietyId) {
    return res.status(403).json({ error: 'Unauthorized: You are only permitted to manage your own society data.' });
  }
  next();
}
