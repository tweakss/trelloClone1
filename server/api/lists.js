const router = require('express').Router();
const { models: { List, Card, Board }} = require('../db');

// api/lists/...


// All lists and their cards
router.get('/cards', async (req, res, next) => {
  try {
    const lists = await List.findAll({
      include: Card,
    });

    res.send(lists);
  } catch (err) {
    next(err);
  }
});

// Get the lists of a board
router.get('/boardId/:boardId', async(req, res, next) => {
  const boardId = req.params.boardId;

  try {
    const lists = await List.findAll({
      where: {
        boardId
      },
      include: {
        model: Card,
        separate: true,
        order: [['cardPosition', 'ASC']]
      },
      order: [['listPosition', 'ASC']]
    });

    res.send(lists);
  } catch(err) {
    next(err);
  }
}) 

// Create a new card and add to a list
router.post('/:listId/newCard', async (req, res, next) => {
  const listId = req.params.listId;

  try {
    const list = await List.findOne({
      where: {
        id: listId
      },
    });

    const newCard = await Card.create(req.body);
    await list.addCards([newCard]);
    
    // not really needed, leave here for now
    const updatedList = await List.findOne({
      where: {
        id: listId
      },
      include: Card
    });

    res.send(updatedList);
  } catch (err) {
    next(err);
  }
});

// Move an existing card to a list
router.put('/:moveToListId/moveCard/:draggedCardId', async(req, res, next) => {
  const moveToListId = req.params.moveToListId;
  const draggedCardId = req.params.draggedCardId;
  const { newPosition } = req.body.moveCardsInfo;
  const { moveToCardId } = req.body.moveCardsInfo;
  console.log("newPosition:", newPosition);

  try {
    const moveToList = await List.findOne({
      where: {
        id: moveToListId
      }
    });
    const cardToAdd = await Card.findOne({
      where: {
        id: draggedCardId
      }
    });
    
    await cardToAdd.update({ cardPosition: newPosition });
    const response = await moveToList.addCards([cardToAdd]);
    res.send(response);
  } catch(err) {

  }
});

// Remove a card from a list
router.delete('/:listId/removeCard/:cardId', async(req, res, next) => {
  const listId = req.params.listId;
  const cardId = req.params.cardId;

  try {
    const list = await List.findOne({
      where: {
        id: listId
      }
    });

    const card = await Card.findOne({
      where: {
        id: cardId
      }
    });
    
    if(card === null) {
      res.send("The card doesn't exist");
    } else {
      const response = await card.destroy();
      // console.log("response:", response);
      res.send("The card is deleted");
    }
  } catch(err) {
    next(err);
  }
})

// Add a new list to a board
router.post('/newList/:boardId', async (req, res, next) => {
  const boardId = req.params.boardId;
  
  try {
    // const newList = await List.create(req.body);
    const currBoard = await Board.findOne({
      where: {
        id: boardId
      },
      include: List
    });
    
    if(currBoard.lists.length > 0) {
      req.body.listPosition = currBoard.lists.length + 1;
    } else {
      req.body.listPosition = 1;
    }
    const newList = await List.create(req.body);
    await currBoard.addLists(newList);
    

    const updatedLists = await List.findAll({
      where: {
        boardId
      },
      include: Card,
      order: [['id', 'ASC']]
    });
    console.log("updatedLists:", updatedLists);
    res.send(updatedLists);
  } catch (err) {
    next(err);
  }
})

router.delete('/:boardId/deleteList/:listId', async(req, res, next) => {
  const boardId = req.params.boardId; // boardId not needed, but used for debugging
  const listId = req.params.listId;

  try {
    const board = await Board.findOne({
      where: {
        id: boardId
      }
    });
    const list = await List.findOne({
      where: {
        id: listId
      }
    });
    

    if(list === null) {
      // console.log("list === null");
      res.send("The list to be deleted doesn't exist");
    } else {
      console.log("Before removing, countLists:", await board.countLists())
      // await board.removeList(list);
      const numOfCardsDeleted = await Card.destroy({
        where: {
          listId
        }
      });
      const response = await list.destroy(); // response is [] 
      console.log("After removing, countLists:", await board.countLists())
      console.log("Successfully deleted list, response:", response);
      res.send("List deleted");
    }

    
  } catch(err) {
    next(err);
  }
});

router.put('/boardId/:boardId/swapListPositions', async(req, res, next) => {
  const boardId = req.params.boardId;
  const { swapListsInfo } = req.body;
  // console.log("swapListsInfo:", swapListsInfo, "\nboardId:", boardId);
  try {
    const currList = await List.findOne({
      where: {
        id: swapListsInfo.currListId
      },
    });
    // console.log("currList:", currList);
    await currList.update({ listPosition: swapListsInfo.swapToPosition });

    const swapToList = await List.findOne({
      where: {
        id: swapListsInfo.swapToListId
      }
    });
    // console.log("swapToList:", swapToList);
    await swapToList.update({ listPosition: swapListsInfo.currListPosition });

    const updatedLists = await List.findAll({
      where: {
        boardId
      },
      include: Card,
      order: [['listPosition', 'ASC']]
    })
    // console.log("updatedLists:", updatedLists);
    
    res.send(updatedLists);
  } catch (err) {
    next(err)
  }
})

// Updates all the cards cardPosition when a card is dropped on a list
router.put('/dropDraggedCard', async(req, res, next) => {
  const { targetListCardToIndex } = req.body;
  console.log("PUT dropDraggedCard, targetListCardToIndex:", targetListCardToIndex);
  try {
    // Updating cardPosition for cards on target list
    for(const [key, value] of Object.entries(targetListCardToIndex)) {
      const cardId = parseInt(key, 10);
      const index = value;
      const card = await Card.findOne({
        where: {
          id: cardId
        }
      });
      const cardUpdated = await card.update({ cardPosition: index + 1 });
      console.log("targetListCardToIndex, cardUpdated:", cardUpdated);
    }
    
    // Updating cardPosition for cards on dragged card's list and removing/adding dragged card
    let response;
    if(req.body.cardGoingToDiffList) {
      const { 
        draggedListCardToIndex, 
        draggedCardId, draggedListId, 
        listId,
      } = req.body;

      for(const [key, value] of Object.entries(draggedListCardToIndex)) {
        const cardId = parseInt(key, 10);
        const index = value;
        const card = await Card.findOne({
          where: {
            id: cardId
          }
        });
        const cardUpdated = await card.update({ cardPosition: index + 1 });
        console.log("draggedListCardToIndex, cardUpdated:", cardUpdated);
      }

      const draggedList = await List.findOne({
        where: {
          id: draggedListId
        }
      });
      const card = await Card.findOne({
        where: {
          id: draggedCardId
        }
      });
      response = await draggedList.removeCards([card]);
      console.log("after removing dragged card from draggedList, response:", response);
      
      const listToMoveTo = await List.findOne({
        where: {
          id: listId
        }
      });
      response = await listToMoveTo.addCards([card]);
      console.log("after adding card to targetList, response:", response);
    }

    res.send("dropDraggedCard");
  } catch(err) {
    next(err);
  }
})


module.exports = router;