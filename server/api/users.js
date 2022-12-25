const router = require('express').Router()
const { models: { User, Workspace, Board }} = require('../db')
module.exports = router
const { Op } = require("sequelize");

// api/users/...

router.get('/', async (req, res, next) => {
  try {
    const users = await User.findAll({
      // explicitly select only the id and username fields - even though
      // users' passwords are encrypted, it won't help if we just
      // send everything to anyone who asks!
      attributes: ['id', 'username', 'email']
    })
    res.json(users)
  } catch (err) {
    next(err)
  }
});

// Get a user's own workspace and its boards
router.get('/:userId/ownWorkspace', async(req, res, next) => {
  const userId = req.params.userId;
  // const workspaceId = req.params.workspaceId;

  try {
    const userWorkspace = await Workspace.findAll({
      where: {
        owner: userId
      },
      include: {
        model: Board
      }
    });
    
    res.send(userWorkspace);
  } catch (err) {
    next(err);
  }
});

// Get a user's workspaces and its boards
router.get('/userId/:userId/workspaces', async(req, res, next) => {
  const userId = req.params.userId;
  // const workspaceId = req.params.workspaceId;

  try {
    const userWorkspaces = await Workspace.findAll({
      include: [
        {
          model: User,
          where: {
            id: userId
          }
        },
        {
          model: Board,
          separate: true,
          order: [['id', 'ASC']]
        }
      ],
      
    });
    
    res.send(userWorkspaces);
  } catch (err) {
    next(err);
  }
});

// Get a user by email or username
router.get('/getUserBy/:input', async(req, res, next) => {
  const input = req.params.input;
  try {
    const users = await User.findAll({
      where: {
        [Op.or]: [
          {
            username: {
              [Op.like]: `${input}%`
            }
          },
          {
            email: {
              [Op.like]: `${input}%`
            }
          }
        ]
      },
      // attributes: ['id', 'username', 'email']
    });
    
    if(users.length === 0) {
      res.send("User doesn't exist");
    }
    res.send(users);
  } catch(err) {
    next(err);
  }
})
