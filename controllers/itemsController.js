const express = require('express');
const router = express.Router();
const { getAllUsers, addUser } = require('../services/itemService');

const { authMiddleware, optionalAuthMiddleware, requireAdmin } = require('../middlewares/authMiddleware');
function requireAuth(req, res, next) {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  next();
}

router.get('/', optionalAuthMiddleware, (req, res) => {
  res.json(getAllUsers());
});

router.post('/', authMiddleware, requireAuth, (req, res) => {
  try {
    const user = addUser(req.body.name, req.body.role);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
