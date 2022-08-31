const router = require('express').Router();
const { models: { Board, User, List, Card, Workspace, Guest }} = require('../db');

// api/boards/...

// router.get('/:boardId/lists', async (req, res, next) => {
//   const boardId = req.params.boardId;

//   try {
//     const board = await Board.findOne({
//       where: {
//         id: boardId
//       },
//       include: {
//         model: List,
//       }
//     });

//     res.send(userBoard);
//   } catch(err) {
//     next(err);
//   }
// });

// Get a board and its contents(lists and cards)
router.get('/:boardId', async (req, res, next) => {
  const boardId = req.params.boardId;

  try {
    const board = await Board.findOne({
      where: {
        id: boardId
      },
      // include: {
      //   model: List,
      //   include: Card,
      //   // separate: true,
      //   // order: [['position', 'ASC']]
      // },
      
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

// Create a board for a user
router.post('/newBoard/:userId/:workspaceId', async (req, res, next) => {
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
        id: workspaceId
      },
      include: Board
    });

    res.send(updatedWorkspace);
  } catch (err) {
    next(err);
  }
});

// Add a user to a board
router.put('/:boardId/addMember/:username', async (req, res, next) => {
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

    const response = await board.addUsers([user]);
    console.log("After adding a user to a board, response:", response);
    if(response) {
      res.send(user);
    } else {
      res.send("User does not exist or is already a member");
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
      const response = await list.destroy(); // response is [] 
      console.log("After removing, countLists:", await board.countLists())
      console.log("Successfully deleted list, response:", response);
      res.send("List deleted");
    }

    
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
