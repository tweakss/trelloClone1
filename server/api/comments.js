const router = require('express').Router();
const { models: { Card, Comment }} = require('../db');

router.get('/comments', async (req, res, next) => {
  try {
    const cards = await Card.findAll({
      include: Comment
    });

    res.send(cards);
  } catch (err) {
    next(err);
  }
});

module.exports = router;