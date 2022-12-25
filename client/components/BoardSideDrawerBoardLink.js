import React, { useState, useEffect } from 'react'
import {connect } from 'react-redux'
import { Link } from 'react-router-dom';
import { deleteABoard } from '../store/workspace';

const BoardSideDrawerBoardLink = (props) => {
  const {
    board, boardIndex, currWorkspaceIndex, currBoard,
    deleteABoard
  } = props;

  const [deleteBoardMenu, setDeleteBoardMenu] = useState(false);
  const handleDeleteBoardMenu = () => {
    // Close every other menu that is opened
    if(deleteConfirm) {
      setDeleteConfirm(false);
    }
    
    setDeleteBoardMenu((prev) => !prev);
  }

  const closeDeleteBoardMenu = () => {
    const actionsBtn = document.querySelector(`.board-side-drawer-board-link-actions-btn.idx${boardIndex}`);
    actionsBtn.style.visibility = "hidden";
    setDeleteBoardMenu(false);
  }

  const handleClickedOutsideOfDeleteBoardMenu = (event) => {
    // console.log("clickedOutsideOfDeleteBoardMenu, event.target:", event.target)
    const clickedElem = event.target;
    if(!clickedElem.className.includes("board-side-drawer-board-link-delete-board-menu")) {
      const actionsBtn = document.querySelector(`.board-side-drawer-board-link-actions-btn.idx${boardIndex}`);
      actionsBtn.style.visibility = "hidden";
      setDeleteBoardMenu(false);
    }
  }

  useEffect(() => {
    // Close current deleteBoardMenu and open the other deleteBoardMenu
    if(deleteBoardMenu) {
      document.addEventListener("click", handleClickedOutsideOfDeleteBoardMenu);

      return function cleanUp() {
        document.removeEventListener("click", handleClickedOutsideOfDeleteBoardMenu);
      }
    }
  }, [deleteBoardMenu])

  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const closeDeleteConfirm = () => {
    const actionsBtn = document.querySelector(`.board-side-drawer-board-link-actions-btn.idx${boardIndex}`);
    actionsBtn.style.visibility = "hidden";
    setDeleteConfirm(false);
    setDeleteBoardMenu(false);
  }

  const backDeleteConfirm = () => {
    setDeleteConfirm(false);

  }

  const handleDeleteABoard = () => {
    deleteABoard(currWorkspaceIndex, board.id);
    if(board.id === currBoard.id) {
      window.location.assign(`/workspace`);
    }
    
    handleDeleteBoardMenu();
    
  }

  const mouseOverBoardLink = () => {
    // console.log("mouseOverBoardLink, event.target:", event.target);
    const actionsBtn = document.querySelector(`.board-side-drawer-board-link-actions-btn.idx${boardIndex}`);
    actionsBtn.style.visibility = "visible";

    const boardLinkContainer = document.querySelector(`.board-side-drawer-board-link-container.idx${boardIndex}`);
    boardLinkContainer.style.backgroundColor = "#E5F0EB";
  }

  const mouseOutBoardLink = () => {
    const actionsBtn = document.querySelector(`.board-side-drawer-board-link-actions-btn.idx${boardIndex}`);
    actionsBtn.style.visibility = "hidden";

    const boardLinkContainer = document.querySelector(`.board-side-drawer-board-link-container.idx${boardIndex}`);
    boardLinkContainer.style.backgroundColor = "";
  }

  const mouseOutDelBoardMenu = (event) => {
    event.stopPropagation();
  }

  // console.log("BoardSideDrawerBoardLink, deleteBoardMenu:", deleteBoardMenu, " deleteConfirm:", deleteConfirm);

  return (
    <div
      className={`board-side-drawer-board-link-container idx${boardIndex}`}
      onMouseOver={mouseOverBoardLink}
      onMouseOut={mouseOutBoardLink}
    >
      <Link 
        to={`/board/${board.id}`}
        className="board-side-drawer-board-link"
      >
        {board.title}
      </Link>
      <div className="board-side-drawer-board-link-actions-btn-wrapper">
        <button
          className={`board-side-drawer-board-link-actions-btn idx${boardIndex} | bg-clr-transparent br-025rem bdr-none usr-slct`}
          onClick={handleDeleteBoardMenu}
        >
        </button>
        
        {
          deleteBoardMenu ?
          <div 
            className="board-side-drawer-board-link-delete-board-menu-wrapper | br-025rem"
            onMouseOut={mouseOutDelBoardMenu}
          >
            {
              deleteConfirm ?
              <>
                <div className="board-side-drawer-board-link-delete-board-menu-confirm-title-wrapper">
                  <div className="board-side-drawer-board-link-delete-board-menu-confirm-title">
                    <button className="board-side-drawer-board-link-delete-board-menu-confirm-title-left | bdr-none bg-clr-transparent menu-title-clr"
                      onClick={backDeleteConfirm}
                    >

                    </button>
                    <span className="board-side-drawer-board-link-delete-board-menu-confirm-title-txt | menu-title-clr"
                    >
                      Delete board?
                    </span>
                    <button
                      className="board-side-drawer-board-link-delete-board-menu-confirm-close-btn | bdr-none bg-clr-transparent"
                      onClick={closeDeleteConfirm}
                    >
                      &times;
                    </button>
                  </div>
                </div>

                <div className="board-side-drawer-board-link-delete-board-menu-confirm-delete">
                  <p className="board-side-drawer-board-link-delete-board-menu-confirm-delete-txt">
                    Deleting a board means it's gone forever.
                  </p>
                  <button className="board-side-drawer-board-link-delete-board-menu-confirm-delete-btn | bdr-none br-025rem"
                    onClick={handleDeleteABoard}
                  >
                    Delete
                  </button>
                </div>
              </> :
              <>
                <div className="board-side-drawer-board-link-delete-board-menu-title-wrapper">
                  <div className="board-side-drawer-board-link-delete-board-menu-title">
                    <span
                      className="board-side-drawer-board-link-delete-board-menu-title-txt | menu-title-clr"
                    >
                      {board.title}
                    </span>
                    <button
                      className="board-side-drawer-board-link-delete-board-menu-title-close-btn | bdr-none bg-clr-transparent"
                      onClick={closeDeleteBoardMenu}
                    >
                      &times;
                    </button>
                  </div>
                </div>
                <div className="board-side-drawer-board-link-delete-board-menu-actions">
                  <div className="board-side-drawer-board-link-delete-board-menu-actions-del">
                    <button className="board-side-drawer-board-link-delete-board-menu-actions-del-btn | bdr-none bg-clr-transparent"
                      onClick={() => setDeleteConfirm(true)}
                    >
                      Delete Board
                    </button>
                    <button className="board-side-drawer-board-link-delete-board-menu-actions-del-btn-right | bdr-none bg-clr-transparent">
                      
                    </button>
                  </div>
                </div>
                
              </>
            }
            
            
            
          </div> : null
            
        }
        
      </div>
      
    </div>
  )
}

const mapDispatch = (dispatch) => {
  return {
    deleteABoard: (currWorkspaceIndex, boardId) => dispatch(deleteABoard(currWorkspaceIndex, boardId)),
  }
}

export default connect(null, mapDispatch)(BoardSideDrawerBoardLink);