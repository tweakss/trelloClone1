const router = require('express').Router();
// const { List } = require('@mui/material');
const { models: { Card, Comment }} = require('../db');

// api/cards

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

// Update a card's description
router.put('/:cardId/description', async (req, res, next) => {
  const cardId = req.params.cardId;
  try {
    const cardToBeUpdated = await Card.findOne({
      where: {
        id: cardId 
      }
    });
    
    const cardUpdated = await cardToBeUpdated.update(req.body);
    res.send(cardUpdated);
  } catch (err) {
    next(err);
  }
})



module.exports = router;