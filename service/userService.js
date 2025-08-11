// userService.js
const { users } = require('../model/userModel');

function registerUser({ username, password, favorecido }) {
  if (users.find(u => u.username === username)) {
    return { error: 'Usuário já existe.' };
  }
  const user = { username, password, favorecido: !!favorecido, saldo: 10000 };
  users.push(user);
  return { user };
}

function loginUser({ username, password }) {
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) return { error: 'Credenciais inválidas.' };
  return { user };
}

function getUsers() {
  return users;
}

function getUser(username) {
  return users.find(u => u.username === username);
}

module.exports = {
  registerUser,
  loginUser,
  getUsers,
  getUser,
};
