import React, { useState, useEffect } from 'react'
import {connect } from 'react-redux'
import { Link } from 'react-router-dom';
import { createNewBoard } from '../store/workspace';


const BoardSideDrawer = (props) => {
  const {
    user, workspaces, workspaceId,
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
      sideDrawer.style.width = '60px';
      // openCloseDrawerBtn.style.left = 'calc(30% - 8px)';
      gridBoard.style.gridTemplateColumns = '60px';
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

  const handleCreateNewBoard = () => {
    handleNewBoardModal();
    createNewBoard(user.id, workspaces.id, newBoardTitle);
  }

  
  // console.log('BoardSideDrawer, workspaces:', workspaces);

  return (
    <div className="board-side-drawer">
    {
      (open && workspaces.length) ? 
      <div>
        <div className="board-side-drawer-header">
          <span className="board-side-drawer-wkspce-title | mgn-05rem">
            {workspaces.find((workspace) => workspace.id === workspaceId).title}
          </span>
          <button
            className="board-side-drawer-close-btn | mgn-05rem" 
            type="button"
            onClick={handleDrawerOpenClose}
          >
            {`<<`}
          </button>
        </div>

        <div className="board-side-drawer-list-boards">
          <span className="board-side-drawer-list-boards-title | mgn-05rem">
            Your boards
          </span>
          <button 
            className="board-side-drawer-new-board-btn | mgn-05rem"
            type="button"
            onClick={handleNewBoardModal}
          >
            +
          </button>
        </div>
        <ul>
          {
            workspaces.find((workspace) => {
              return workspace.id === workspaceId;
            }).boards.map((board) => {
              return (
                <li key={board.id}>
                  <Link to={`/board/${board.id}`}>{board.title}</Link>
                </li>
              );
            })
          }
        </ul>
      </div> :
      <div className="board-side-drawer-closed">
        <button
          className="board-side-drawer-open | mgn-05rem" 
          type="button"
          onClick={handleDrawerOpenClose} 
        >
          {`>>`}
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
    board: state.board.board,
    user: state.auth,
    workspaces: state.workspaces
  }
}

const mapDispatch = (dispatch) => {
  return {
    createNewBoard: (userId, workspaceId, boardTitle) => dispatch(createNewBoard(userId, workspaceId, boardTitle)),
  }
}

export default connect(mapState, mapDispatch)(BoardSideDrawer);