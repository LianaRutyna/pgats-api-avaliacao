const { users } = require('../models/itemModel');

function getAllUsers() {
  return users;
}

function addUser(name, role) {
  if (!name || !role) throw new Error('Name and role required');
  const user = { id: users.length + 1, name, role };
  users.push(user);
  return user;
}

module.exports = { getAllUsers, addUser };
