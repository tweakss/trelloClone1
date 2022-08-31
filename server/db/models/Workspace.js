const Sequelize = require('sequelize')
const db = require('../db');

const Workspace = db.define('workspace', {
  title: {
    type: Sequelize.STRING 
  },
  type: {
    type: Sequelize.STRING,
    defaultValue: 'Other'
  },
  privateVisibility: {
    type: Sequelize.BOOLEAN,
    defaultValue: true
  },
  publicVisibility: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  owner: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  }
});

module.exports = Workspace;