const Sequelize = require('sequelize');
const db = require('../db');

const Comment = db.define('comment', {
  content: {
    type: Sequelize.TEXT
  },
  commentTime: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW 
  },
});

module.exports = Comment;