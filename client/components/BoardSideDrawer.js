import React, { useState, useEffect } from 'react'
import {connect, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom';
import { createNewBoard } from '../store/board';
import { getBoardWorkspace } from '../store/board';
import BoardSideDrawerBoardLink from './BoardSideDrawerBoardLink';

const BoardSideDrawer = (props) => {
  const {
    user, currBoard, workspaces,
    createNewBoard, getBoardWorkspace, boardWorkspace,
    match,
  } = props;
  const dispatch = useDispatch();
  
  const localStorage = window.localStorage;
  const [open, setOpen] = useState(parseInt(localStorage.getItem("sideDrawerOpen"), 10));
  
  useEffect(() => {
    const sideDrawer = document.querySelector('.board-side-drawer-wrapper');
    // const openCloseDrawerBtn = document.querySelector('.board-side-drawer-handle');
    const gridBoard = document.getElementById('grid-board');
    
    if(open) {
      gridBoard.style.gridTemplateColumns = '240px';
      sideDrawer.style.width = '240px';
      // openCloseDrawerBtn.style.left = '100%' // originally at 80%
    } else {
      sideDrawer.style.width = '30px';
      // openCloseDrawerBtn.style.left = 'calc(30% - 8px)';
      gridBoard.style.gridTemplateColumns = '30px';
    }
    
  })

  const handleDrawerOpenClose = () => {
    const sideDrawerState = localStorage.getItem("sideDrawerOpen");
    if(sideDrawerState === "1") {
      localStorage.setItem("sideDrawerOpen", "0");
      setOpen(parseInt(localStorage.getItem("sideDrawerOpen"), 10));
    } else {
      localStorage.setItem("sideDrawerOpen", "1");
      setOpen(parseInt(localStorage.getItem("sideDrawerOpen"), 10));
    }
  };

  const [newBoardModal, setNewBoardModal] = useState(false);
  const handleNewBoardModal = () => {
    setNewBoardModal((prev) => !prev);
  }

  const handleCloseNewBoardModal = () => {
    setNewBoardModal(false);
    setNewBoardTitle("");
  }

  const [newBoardTitle, setNewBoardTitle] = useState("");
  const handleNewBoardTitle = (event) => {
    setNewBoardTitle(event.target.value);
  }

  const currWorkspaceIndex = workspaces.findIndex((workspace) => workspace.id === boardWorkspace.id);
  // const boardWorkspace = workspaces[currWorkspaceIndex]; // this is assuming u are in the same workspace as the board 
  
  useEffect(() => {
    if(currBoard.id) {
      // console.log("getBoardWorkspace useEffect, currBoard:", currBoard);
      getBoardWorkspace(currBoard.workspaceId, user.id);
    }
  }, [currBoard]);

  const handleCreateNewBoard = async(event) => {
    event.preventDefault();

    const updatedWorkspace = await createNewBoard(user.id, boardWorkspace.id, newBoardTitle);
    console.log("handleCreateNewBoard, response:", updatedWorkspace, " currWorkspaceIndex:", currWorkspaceIndex);
    dispatch({
      type: "UPDATE_WORKSPACES_AFTER_NEW_BOARD",
      updatedWorkspace, currWorkspaceIndex,
    });

    handleCloseNewBoardModal();
  }

  
  
  // console.log('BoardSideDrawer, currBoard:', currBoard, " boardWorkspace:", boardWorkspace, " workspaces:", workspaces);

  return (
    <div className="board-side-drawer-wrapper">
    {
      (open && boardWorkspace.id) ? 
      <div>
        <div className="board-side-drawer-header">
          <span className="board-side-drawer-wkspce-title | mgn-05rem">
            { boardWorkspace ? boardWorkspace.title : "Loading..." }
          </span>
          <button
            className="board-side-drawer-close-btn | mgn-05rem br-025rem bdr-none bg-clr-transparent" 
            onClick={handleDrawerOpenClose}
          >
            
          </button>
        </div>

        <div className="board-side-drawer-list-boards">
          <span className="board-side-drawer-list-boards-title | mgn-05rem">
            Your boards
          </span>
          <button 
            className="board-side-drawer-new-board-btn | mgn-05rem br-025rem bdr-none bg-clr-transparent"
            type="button"
            onClick={handleNewBoardModal}
          >
            +
          </button>

          {
            newBoardModal ? 
            
            <div 
              className={`board-side-drawer new-board menu wkspce${boardWorkspace.id} | br-025rem pdg-075rem`}
            >
              <div className={`workspaces-display new-board menu-title wkspce${boardWorkspace.id}`}>
                <span
                  className={`create-board-txt new-board wkspce${boardWorkspace.id} | menu-title-clr`}
                >
                  Create board
                </span>
                <button
                  className={`workspaces-display new-board menu-close-btn wkspce${boardWorkspace.id} | bdr-none bg-clr-transparent`}
                  onClick={handleCloseNewBoardModal}
                >
                  &times;
                </button>
              </div>
              
              <div className={`workspaces-display new-board menu-board-title-input wkspce${boardWorkspace.id}`}>
                <form
                  onSubmit={handleCreateNewBoard}
                >
                  <label htmlFor="board-title-input">Board title</label>
                  <input
                    id="board-title-input"
                    type="text"
                    value={newBoardTitle}
                    onChange={handleNewBoardTitle}
                  >
                  </input>

                  {
                    newBoardTitle.length > 0 ?
                    <button
                      type="submit"
                    >
                      Create
                    </button> :
                    <button
                      disabled
                    >
                      Create
                    </button>
                  }
                  
                </form>
              </div>
              
            </div> : null
            
          }
        </div>

        <div className="board-side-drawer-board-links">
          <ul className="board-side-drawer-board-links-ul">
            {
              boardWorkspace ? boardWorkspace.boards.map((board, index) => {
                return (
                  <li className="board-side-drawer-board-links-li" 
                    key={board.id}
                  >
                    <BoardSideDrawerBoardLink 
                      board={board} currWorkspaceIndex={currWorkspaceIndex}
                      boardIndex={index} match={match}
                    />
                    
                  </li>
                );
              }) : null
            }
          </ul>
        </div>
      </div> :
      <div className="board-side-drawer-closed">
        <button
          className="board-side-drawer-open-btn | mgn-05rem bdr-none" 
          type="button"
          onClick={handleDrawerOpenClose} 
        >
          {`>`}
        </button>

      </div>
    } 
    
    </div>
  );
}

const mapState = (state) => {
  return {
    currBoard: state.board.board,
    boardWorkspace: state.board.workspace,
    user: state.auth.user,
    workspaces: state.workspaces.workspaces
  }
}

const mapDispatch = (dispatch) => {
  return {
    createNewBoard: (userId, boardWorkspaceId, boardTitle) => dispatch(createNewBoard(userId, boardWorkspaceId, boardTitle)),
    getBoardWorkspace: (workspaceId, userId) => dispatch(getBoardWorkspace(workspaceId, userId)),
  }
}

export default connect(mapState, mapDispatch)(BoardSideDrawer);