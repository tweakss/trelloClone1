const Sequelize = require('sequelize');
const db = require('../db');

const Guest = db.define('guest', {
  username: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

module.exports = Guest;