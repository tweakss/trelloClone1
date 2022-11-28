const router = require('express').Router();
// const { List } = require('@mui/material');
const { models: { Card, Comment, User }} = require('../db');

// api/cards

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
});

router.put('/card/:cardId/updateTitle', async (req, res, next) => {
  const cardId = req.params.cardId;
  try {
    const card = await Card.findOne({
      where: {
        id: cardId 
      }
    });
    
    const cardUpdated = await card.update(req.body);
    res.send(cardUpdated);
  } catch (err) {
    next(err);
  }
});



module.exports = router;