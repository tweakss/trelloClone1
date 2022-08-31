const router = require('express').Router()
const { models: { Workspace, User }} = require('../db')


router.get('/', async (req, res, next) => {
  try {
    const workspaces = await Workspace.findAll({
      include: User
    });
    
    res.send(workspaces);
  } catch (err) {
    next(err)
  }
})

module.exports = router