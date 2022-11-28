const router = require('express').Router();
const { models: { Card, Comment, User }} = require('../db');

// api/comments

// Get comments of a card in ascending order based on time
router.get('/cardId/:cardId/comments', async (req, res, next) => {
  const cardId = req.params.cardId;
  try {
    const cardComments = await Comment.findAll({
      where: {
        cardId,
      },
      order: [['updatedAt', 'DESC']],
      include: {
        model: User,
        attributes: ['username']
      },
      
    });

    res.send(cardComments);
  } catch (err) {
    next(err);
  }
});

// Create a comment and send back a new arr of comments
router.post('/cardId/:cardId/userId/:userId/newComment', async (req, res, next) => {
  const userId = req.params.userId;
  const cardId = req.params.cardId;

  try {
    let newComment = await Comment.create(req.body)
    const commentOwner = await User.findOne({
      where: {
        id: userId
      }
    });
    const card = await Card.findOne({
      where: {
        id: cardId
      }
    });
    await card.addComments([newComment]);
    await commentOwner.addComments([newComment]);

    newComment = await Comment.findOne({
      where: {
        id: newComment.dataValues.id
      },
      include: {
        model: User,
        attributes: ['username']
      }
    });

    // const cardComments = await Comment.findAll({
    //   where: {
    //     cardId,
    //   },
    //   order: [['updatedAt', 'DESC']],
    //   include: {
    //     model: User,
    //     attributes: ['username']
    //   },
      
    // });

    res.send(newComment);
  } catch (err) {
    next(err);
  }
});

// Update a card's comment
router.put('/commentId/:commentId', async (req, res, next) => {
  const commentId = req.params.commentId;
  try {
    const commentToBeUpdated = await Comment.findOne({
      where: {
        id: commentId 
      }
    });
    
    await commentToBeUpdated.update(req.body);
    const updatedComment = await Comment.findOne({
      where: {
        id: commentId
      },
      include: {
        model: User,
        attributes: ['username']
      }
    })
    console.log("updatedComment:", updatedComment);
    res.send(updatedComment);
  } catch (err) {
    next(err);
  }
})

// Delete a comment
router.delete('/commentId/:commentId', async (req, res, next) => {
  const commentId = req.params.commentId;
  try {
    const comment = await Comment.findOne({
      where: {
        id: commentId
      }
    });

    const response = await comment.destroy();
    if(response.length === 0) {
      res.send("Comment deleted");
    } else {
      res.send("Couldn't successfully delete comment");
    }
    
  } catch(err) {

  }
});

module.exports = router;