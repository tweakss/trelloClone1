const Sequelize = require('sequelize')
const db = require('../db');

const Board = db.define('board', {
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  description: {
    type: Sequelize.TEXT,
    defaultValue: ""
  },
  privateVisibility: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  workspaceVisibility: {
    type: Sequelize.BOOLEAN,
    defaultValue: true
  },
  publicVisibility: {
    type: Sequelize.BOOLEAN,  
    defaultValue: false
  },
  

});

module.exports = Board;