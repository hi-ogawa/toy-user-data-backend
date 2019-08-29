// For easier experimentation during development using console
const { sequelize } = require('./db');
const User = require('./user');

global.C = {
  sequelize,
  User
};
