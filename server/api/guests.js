const router = require('express').Router();
const { models: { Guest, Board }} = require('../db');

router.get('/boards', async (req, res, next) => {
  try {
    const guests = await Guest.findAll({
      include: Board
    });

    res.send(guests);
  } catch (err) {
    next(err);
  }
});

module.exports = router;