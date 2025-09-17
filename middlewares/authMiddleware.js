const { verifyToken } = require('../services/authService');

function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ error: 'No token provided' });
  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  try {
    req.user = verifyToken(token);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

function optionalAuthMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return next(); // allow public access
  const token = authHeader.split(' ')[1];
  if (!token) return next();
  try {
    req.user = verifyToken(token);
  } catch {
    // ignore invalid token for public access
  }
  next();
}

function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  next();
}

module.exports = { authMiddleware, optionalAuthMiddleware, requireAdmin };
