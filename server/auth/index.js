const router = require('express').Router()
const { models: {User, Workspace }} = require('../db')
module.exports = router

router.post('/login', async (req, res, next) => {
  try {
    res.send({ token: await User.authenticate(req.body)}); 
  } catch (err) {
    next(err)
  }
})


router.post('/signup', async (req, res, next) => {
  try {
    const newUser = await User.create(req.body)
    const newWorkspace = await Workspace.create({ 
      title: `${newUser.dataValues.username}'s Workspace`,
      owner: newUser.dataValues.id
    });
    newWorkspace.addUsers(newUser);
    
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
})
