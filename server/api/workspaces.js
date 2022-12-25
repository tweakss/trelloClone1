const router = require('express').Router();
const { models: { Workspace, User, Board }} = require('../db');
const { Op } = require('sequelize');

// api/workspaces

// Get workspaces and only the boards that the user is a member of 
router.get('/user/:userId/boards/memberOf', async (req, res, next) => {
  const userId = req.params.userId;
  try {
    const workspaces = await Workspace.findAll({
      include: {
        model: Board,
        include: {
          model: User,
          where: {
            id: userId
          },
        },
      },
      where: {
        owner: {
          [Op.ne]: userId
        }
      }
    });
    
    const workspacesWithBoards = workspaces.filter((workspace) => {
      return workspace.boards.length > 0;
    })

    res.send(workspacesWithBoards);
  } catch (err) {
    next(err)
  }
})

//Create a new workspace and assign to user
router.post('/newWorkspace/user/:userId', async(req, res, next) => {
  const userId = req.params.userId;
  try {
    const newWorkspace = await Workspace.create(req.body)
    const user = await User.findOne({
      where: {
        id: userId
      }
    });

    await newWorkspace.addUsers([user]);

    const response = await Workspace.findOne({
      where: {
        id: newWorkspace.getDataValue("id")
      },
      include: [
        {
          model: User,
          where: {
            id: userId
          }
        },
        {
          model: Board
        }
      ],
      
    });

    res.send(response);
  } catch(err) {
    next(err);
  }
})


module.exports = router