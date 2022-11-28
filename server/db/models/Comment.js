const Sequelize = require('sequelize');
const db = require('../db');

const Comment = db.define('comment', {
  content: {
    type: Sequelize.TEXT
  },
  txtareaHeight: {
    type: Sequelize.STRING,
    defaultValue: ""
  },
  // commentReplier: {
  //   type: Sequelize.STRING,
  //   defaultValue: ""
  // }
  // isReplyComment: {
  //   type: Sequelize.BOOLEAN,  
  //   defaultValue: false
  // }
});

module.exports = Comment;