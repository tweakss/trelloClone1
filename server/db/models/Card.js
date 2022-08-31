const Sequelize = require('sequelize');
const db = require('../db');

const Card = db.define('card', {
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  creator: {
    type: Sequelize.STRING,
    allowNull: false
  },
  dateCreated: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW
  },
  dateDue: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW
  },
  description: {
    type: Sequelize.TEXT,
    defaultValue: ""
  },
  cardPosition: {
    type: Sequelize.INTEGER
  }
});

module.exports = Card;