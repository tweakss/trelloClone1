//this is the access point for all things database related!

const db = require('./db')

const User = require('./models/User')
const Workspace = require('./models/Workspace');
const Board = require('./models/Board');
const List = require('./models/List');
const Card = require('./models/Card');
const Comment = require('./models/Comment');
const Guest = require('./models/Guest');


Workspace.belongsToMany(User, { through: 'WorkspaceMembers' });
User.belongsToMany(Workspace, { through: 'WorkspaceMembers' });

Workspace.hasMany(Board);
Board.belongsTo(Workspace);

Board.belongsToMany(User, { through: 'BoardMembers' });
User.belongsToMany(Board, { through: 'BoardMembers' });

Board.belongsToMany(Guest, { through: 'BoardGuests' });
Guest.belongsToMany(Board, { through: 'BoardGuests' });

Board.hasMany(List);
List.belongsTo(Board);

List.hasMany(Card);
Card.belongsTo(List);

Card.hasMany(Comment);
Comment.belongsTo(Card);

User.hasMany(Comment);
Comment.belongsTo(User);



module.exports = {
  db,
  models: {
    User,
    Workspace,
    Board,
    List,
    Card,
    Comment,
    Guest,
  },
}
