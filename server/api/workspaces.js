const router = require('express').Router();
const { 
  models: { 
    Workspace, User, Board, List, Card, Comment 
  }
} = require('../db');
const { Op } = require('sequelize');

// api/workspaces

// Get a workspace by its id
router.get('/workspace/:workspaceId', async(req, res, next) => {
  const workspaceId = req.params.workspaceId;
  try {
    const workspace = await Workspace.findOne({
      where: {
        id: workspaceId
      }
    });

    res.send(workspace);
  } catch(err) {

  }
})

// Get workspaces and only the boards that the user is a member of 
router.get('/user/:userId/boards/memberOf', async (req, res, next) => {
  const userId = req.params.userId;
  try {
    const workspaces = await Workspace.findAll({
      include: {
        model: Board,
        include: {
          model: User,
          where: {
            id: userId
          },
        },
      },
      where: {
        owner: {
          [Op.ne]: userId
        }
      }
    });
    
    const workspacesWithBoards = workspaces.filter((workspace) => {
      return workspace.boards.length > 0;
    })

    res.send(workspacesWithBoards);
  } catch (err) {
    next(err)
  }
})

//Create a new workspace and assign to user
router.post('/newWorkspace/user/:userId', async(req, res, next) => {
  const userId = req.params.userId;
  try {
    const newWorkspace = await Workspace.create(req.body)
    const user = await User.findOne({
      where: {
        id: userId
      }
    });

    await newWorkspace.addUsers([user]);

    const response = await Workspace.findOne({
      where: {
        id: newWorkspace.getDataValue("id")
      },
      include: [
        {
          model: User,
          where: {
            id: userId
          }
        },
        {
          model: Board
        }
      ],
      
    });

    res.send(response);
  } catch(err) {
    next(err);
  }
})

// Delete a workspace
router.delete('/workspace/:workspaceId', async(req, res, next) => {
  const workspaceId = req.params.workspaceId;
  try {
    const workspace = await Workspace.findOne({
      where: {
        id: workspaceId
      }
    });
    
    const totalBoards = await workspace.getBoards();
    
    const eachBoardLists = await Promise.all(totalBoards.map((board) => {
      const boardLists = board.getLists();
      return boardLists;
    }));
    const totalLists = eachBoardLists.flat(1);
    // console.log("totalLists:", totalLists);
    
    const eachListCards = await Promise.all(totalLists.map((list) => {
      const listCards = list.getCards();
      return listCards;
    }));
    const totalCards = eachListCards.flat(1);
    // console.log("totalCards:", totalCards);
    
    // Start deleting...
    const commentRowsDeleted = await Promise.all(totalCards.map((card) => {
      const numOfRowsDeleted = Comment.destroy({
        where: {
          cardId: card.id
        }
      })
      return numOfRowsDeleted;
    }));
    // console.log("commentRowsDeleted:", commentRowsDeleted);

    const cardRowsDeleted = await Promise.all(totalLists.map((list) => {
      const numOfRowsDeleted = Card.destroy({
        where: {
          listId: list.id
        }
      });
      return numOfRowsDeleted;
    }));
    // console.log("cardRowsDeleted:", cardRowsDeleted);

    const listRowsDeleted = await Promise.all(totalBoards.map((board) => {
      const numOfRowsDeleted = List.destroy({
        where: {
          boardId: board.id
        }
      });
      return numOfRowsDeleted;
    }));
    // console.log("listRowsDeleted:", listRowsDeleted);

    const boardRowsDeleted = await Board.destroy({
      where: {
        workspaceId
      }
    });
    // console.log("boardRowsDeleted:", boardRowsDeleted);
  
    const workspaceDeleted = await workspace.destroy();  
    
    res.send(workspaceDeleted);
  } catch(err) {
    next(err);
  }
})


module.exports = router