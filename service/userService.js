// userService.js
//const { users } = require('../model/userModel');
import { users } from '../model/userModel.js';

export function registerUser({ username, password, favorecido }) {
  if (users.find(u => u.username === username)) {
    return { error: 'Usuário já existe.' };
  }
  const user = { username, password, favorecido: !!favorecido, saldo: 10000 };
  users.push(user);
  return { user };
}

export function loginUser({ username, password }) {
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) return { error: 'Credenciais inválidas.' };
  return { user };
}

export function getUsers() {
  return users;
}

export function getUser(username) {
  return users.find(u => u.username === username);
}
