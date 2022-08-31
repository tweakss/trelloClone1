const Sequelize = require('sequelize');
const db = require('../db');

const List = db.define('list', {
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  listPosition: {
    type: Sequelize.INTEGER
  }

});

module.exports = List;
