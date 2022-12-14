const router = require('express').Router();
const { models: { Board, User, List, Card, Workspace, Guest, Comment }} = require('../db');

// api/boards/...

// for testing
router.get('/:boardId/testing', async (req, res, next) => {
  const boardId = req.params.boardId;

  try {
    const workspace = await Workspace.findOne({
      include: {
        model: Board,
        where: {
          id: boardId
        }
      }
    })
    const user = await User.findOne({
      where: {
        id: 5
      }
    })
    await workspace.removeUsers([user]);

    res.send(workspace);
  } catch(err) {
    next(err);
  }
});

// Get a board
router.get('/:boardId', async (req, res, next) => {
  const boardId = req.params.boardId;

  try {
    const board = await Board.findOne({
      where: {
        id: boardId
      },
      // include: {
      //   model: User
      // }
      
    });
    // console.log("board:", board);

    res.send(board);
  } catch (err) {
    next(err)
  }
});

// Get members of a board
router.get('/:boardId/members', async (req, res, next) => {
  const boardId = req.params.boardId;

  try {
    const boardMembers = await User.findAll({
      include: {
        model: Board,
        where: {
          id: boardId
        }
      }
    });

    res.send(boardMembers);
  } catch(err) {
    next(err);
  }
});

// Get guests of a board
router.get('/:boardId/guests', async (req, res, next) => {
  const boardId = req.params.boardId;

  try {
    const boardGuests = await Guest.findAll({
      include: {
        model: Board,
        where: {
          id: boardId
        }
      }
    });

    res.send(boardGuests);
  } catch(err) {
    next(err);
  }
});

// Get a workspace and its boards that the user is a member of
router.get('/workspace/:workspaceId/user/:userId', async(req, res, next) => {
  const workspaceId = req.params.workspaceId;
  const userId = req.params.userId;
  try {
    const workspace = await Workspace.findOne({
      where: {
        id: workspaceId,
      },
      include: {
        model: Board,
        separate: true,
        order: [['id', 'ASC']],
        include: {
          model: User,
          where: {
            id: userId
          }
        }
      }
    });

    res.send(workspace);
  } catch(err) {
    next(err);
  }
})

// Create a board for a user
router.post('/newBoard/user/:userId/workspace/:workspaceId', async (req, res, next) => {
  const userId = req.params.userId;
  const workspaceId = req.params.workspaceId;

  try {
    const newBoard = await Board.create(req.body)
    const currUser = await User.findOne({
      where: {
        id: userId
      }
    });
    const currWorkspace = await Workspace.findOne({
      where: {
        id: workspaceId
      }
    });
    await newBoard.addUsers(currUser);
    await currWorkspace.addBoards(newBoard);

    const updatedWorkspace = await Workspace.findOne({
      where: {
        id: workspaceId,
      },
      include: {
        model: Board,
        separate: true,
        order: [['id', 'ASC']],
        include: {
          model: User,
          where: {
            id: userId
          }
        }
      }
    });

    res.send(updatedWorkspace);
  } catch (err) {
    next(err);
  }
});

// Delete a board
router.delete('/board/:boardId', async(req, res, next) => {
  const boardId = req.params.boardId;
  try {
    const board = await Board.findOne({
      where: {
        id: boardId
      }
    });
    const boardLists = await board.getLists();
    const eachListCards = await Promise.all(boardLists.map((list) => {
      return list.getCards();
    }));
    const totalCards = eachListCards.flat(1);
    
    const commentsDeleted = await Promise.all(totalCards.map((card) => {
      const numOfRowsDeleted = Comment.destroy({
        where: {
          cardId: card.id
        }
      });
      
      return numOfRowsDeleted;
    }));
    const cardsDeleted = await Promise.all(boardLists.map((list) => {
      const numOfRowsDeleted = Card.destroy({
        where: {
          listId: list.id
        }
      });

      return numOfRowsDeleted;
    }));
    const listsDeleted = await List.destroy({
      where: {
        boardId
      }
    });

    const response = await board.destroy();
    res.send(response);
  } catch(err) {
    next(err);
  }
})

// Add a user to a board
router.put('/:boardId/addMember/:emailAddr', async (req, res, next) => {
  const boardId = req.params.boardId;
  const emailAddr = req.params.emailAddr;

  try {
    const board = await Board.findOne({
      where: {
        id: boardId
      }
    });

    const user = await User.findOne({
      where: {
        email: emailAddr
      }
    });
    console.log("user:", user);
    if(user === null) {
      res.send("No user exists with this email address");
    }

    const response = await board.addUsers([user]);

    // console.log("After adding a user to a board, response:", response);
    if(response) {
      res.send(user);
    } else {
      res.send("The user with this email address is already a member");
    }
    
  } catch(err) {
    next(err)
  }
});

// Remove a user from a board
router.delete('/:boardId/removeMember/:username', async (req, res, next) => {
  const boardId = req.params.boardId;
  const username = req.params.username;

  try {
    const board = await Board.findOne({
      where: {
        id: boardId
      }
    });
    const user = await User.findOne({
      where: {
        username
      }
    });

    const response = await board.removeUsers([user]);
    console.log("After removing a user from a board, response:", response);
    if(response) {
      res.send(user);
    } else {
      res.send("User does not exist");
    }
    
  } catch(err) {
    next(err)
  }
});

//Delete a list from a board
router.delete('/:boardId/deleteList/:listId', async(req, res, next) => {
  const boardId = req.params.boardId; // boardId not needed, but used for debugging
  const listId = req.params.listId;

  try {
    // const board = await Board.findOne({
    //   where: {
    //     id: boardId
    //   }
    // });
    const list = await List.findOne({
      where: {
        id: listId
      }
    });
    if(list === null) {
      res.send("The list to be deleted doesn't exist");
    } 
    
    const listCards = await list.getCards();
    const commentsDeleted = Promise.all(listCards.map((card) => {
      const numOfRowsDeleted = Comment.destroy({
        where: {
          cardId: card.id
        }
      });

      return numOfRowsDeleted;
    }));
    const cardsDeleted = await Card.destroy({
      where: {
        listId
      }
    });
      
    const response = await list.destroy(); // response is [] 
    
    res.send("List deleted");
    
    
  } catch(err) {
    next(err);
  }
});

//Move a list to another board
router.put('/:currBoardId/:listId/moveListTo/:boardId', async(req, res, next) => {
  const listId = req.params.listId;
  const currBoardId = req.params.currBoardId;
  const boardId = req.params.boardId;

  try {
    const currBoard = await Board.findOne({
      where: {
        id: currBoardId
      }
    });
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

    await currBoard.removeList(list);
    const response = await board.addList(list);
    console.log("move list, response:", response);
    res.send(response);

  } catch(err) {
    next(err);
  }
});



module.exports = router;
