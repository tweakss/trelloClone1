const router = require('express').Router()
module.exports = router

// api/...
router.use('/users', require('./users'))
router.use('/workspaces', require('./workspaces'));
router.use('/boards', require('./boards'));
router.use('/lists', require('./lists'));
router.use('/cards', require('./cards'));
router.use('/comments', require('./comments'));
router.use('/guests', require('./guests'));

router.use((req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})
