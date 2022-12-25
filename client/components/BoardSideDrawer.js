import React, { useState, useEffect } from 'react'
import {connect } from 'react-redux'
import { Link } from 'react-router-dom';
import { createNewBoard } from '../store/workspace';
import BoardSideDrawerBoardLink from './BoardSideDrawerBoardLink';

const BoardSideDrawer = (props) => {
  const {
    user, currBoard, workspaces, boardWorkspaceId,
    createNewBoard
  } = props;
  
  
  const localStorage = window.localStorage;
  const [open, setOpen] = useState(parseInt(localStorage.getItem("sideDrawerOpen"), 10));
  
  useEffect(() => {
    const sideDrawer = document.querySelector('.board-side-drawer');
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

  const [newBoardTitle, setNewBoardTitle] = useState("");
  const handleNewBoardTitle = (event) => {
    setNewBoardTitle(event.target.value);
  }

  const currWorkspaceIndex = workspaces.findIndex((workspace) => workspace.id === boardWorkspaceId);
  const boardWorkspace = workspaces[currWorkspaceIndex];
  const handleCreateNewBoard = () => {
    handleNewBoardModal();
    createNewBoard(user.id, boardWorkspace.id, newBoardTitle);
  }

  
  
  // console.log('BoardSideDrawer, workspaces:', workspaces, " boardWorkspaceId:", boardWorkspaceId, " boardWorkspace:", boardWorkspace);

  return (
    <div className="board-side-drawer">
    {
      (open && workspaces.length) ? 
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
                    boardIndex={index} currBoard={currBoard}
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
    {
      newBoardModal ? 
      <div id="new-board-modal">
        <dialog id="new-board-modal-content" open={newBoardModal ? "open" : null} >
          <div id="new-board-modal-header">
            <button
              id="new-board-modal-closeBtn"
              type="button"
              onClick={handleNewBoardModal}
            >
              &times;
            </button>
          </div>

          <label className="board-title-label" htmlFor="new-board-title">Board Title</label>
          <input
            id="new-board-title"
            type="text"
            value={newBoardTitle}
            onChange={handleNewBoardTitle}
          >
          </input>

          <div>
            <button
              type="button"
              id="create-board-btn"
              onClick={handleCreateNewBoard}
            >
              Create Board
            </button>
          </div>
        </dialog>
      </div>: null
    }
     
    
    </div>
  );
}

const mapState = (state) => {
  return {
    currBoard: state.board.board,
    user: state.auth.user,
    workspaces: state.workspaces.workspaces
  }
}

const mapDispatch = (dispatch) => {
  return {
    createNewBoard: (userId, boardWorkspaceId, boardTitle) => dispatch(createNewBoard(userId, boardWorkspaceId, boardTitle)),
  }
}

export default connect(mapState, mapDispatch)(BoardSideDrawer);