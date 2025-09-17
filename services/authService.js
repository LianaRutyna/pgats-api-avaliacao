const jwt = require('jsonwebtoken');
const { users } = require('../models/userModel');
const SECRET = 'supersecret';

function register(username, password, role = 'user') {
  if (users.find(u => u.username === username)) {
    throw new Error('User already exists');
  }
  const user = { id: users.length + 1, username, password, role };
  users.push(user);
  return user;
}

function login(username, password) {
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) throw new Error('Invalid credentials');
  const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, SECRET, { expiresIn: '1h' });
  return token;
}

function verifyToken(token) {
  return jwt.verify(token, SECRET);
}

module.exports = { register, login, verifyToken };
