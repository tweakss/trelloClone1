const router = require('express').Router()
const { models: {User, Workspace, Board }} = require('../db')
module.exports = router

// auth/...

router.post('/login', async (req, res, next) => {
  console.log("auth, req.body:", req.body);
  try {
    res.send({ token: await User.authenticate(req.body)}); 
  } catch (err) {
    next(err)
  }
})

// Create new user and its initial workspace, board
router.post('/signup', async (req, res, next) => {
  try {
    const newUser = await User.create(req.body)
    const newWorkspace = await Workspace.create({ 
      title: `${newUser.dataValues.username}'s Workspace`,
      owner: newUser.dataValues.id
    });
    await newWorkspace.addUsers(newUser);
    const newBoard = await Board.create({
      title: `${newUser.dataValues.username}'s board`
    });
    await newWorkspace.addBoards([newBoard]);
    await newBoard.addUsers([newUser]);
    
    res.send({token: await newUser.generateToken()})
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      res.status(401).send('newUser already exists')
    } else {
      next(err)
    }
  }
})

router.get('/me', async (req, res, next) => {
  try {
    res.send(await User.findByToken(req.headers.authorization))
  } catch (ex) {
    next(ex)
  }
});

// Check if username is valid
router.get('/username/:username/validate', async(req, res, next) => {
  const username = req.params.username;
  try {
    const user = await User.findOne({where: { username }});
    // console.log("user:", user)
    if(!user) {
      const error = Error("Username doesn't exist");
      error.status = 401;
      throw error;
    }

    res.send(user);
  } catch(err) {
    next(err);
  }
})

