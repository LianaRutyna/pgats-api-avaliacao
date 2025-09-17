const express = require('express');
const router = express.Router();
const { register, login } = require('../services/authService');

router.post('/register', (req, res) => {
  const { username, password, role } = req.body;
  try {
    const user = register(username, password, role);
    res.status(201).json({ id: user.id, username: user.username, role: user.role });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  try {
    const token = login(username, password);
    res.json({ token });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
});

module.exports = router;
