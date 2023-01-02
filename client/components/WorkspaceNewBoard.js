import React, { useEffect, useState } from 'react'
import {connect, useDispatch} from 'react-redux'
import history from '../history';
import { createNewBoardInOwnWrkspce } from "../store/workspace";
import { createNewBoard } from "../store/board";


const WorkspaceNewBoard = (props) => {
  const {
    boardWorkspace, 
    createNewBoard, createNewBoardInOwnWrkspce, 
    workspaces, user,
  } = props;
  const dispatch = useDispatch();

  const [newBoardMenu, setNewBoardMenu] = useState(false);
  const handleNewBoardMenu = (event) => {
    // console.log("handleNewBoardMenu, event.target:", event.target);
    setNewBoardMenu((prev) => !prev);
    
  }
  
  const handleCloseNewBoardMenu = (event) => {
    setNewBoardMenu(false);
    setBoardTitle("");
  }

  
  const mouseOverCreateNewBoard = (event) => {
    // console.log("mouseOverCreateNewBoard")
    const createNewBoardElem = document.querySelector(`.workspaces-display-create-board.new-board.wkspce${boardWorkspace.id}`);
    createNewBoardElem.style.backgroundColor = "rgba(161, 206, 202, 0.6)";
    createNewBoardElem.style.cursor = "pointer";
  }
  const mouseOutCreateNewBoard = (event) => {
    // console.log("mouseOutCreateNewBoard")
    const createNewBoardElem = document.querySelector(`.workspaces-display-create-board.new-board.wkspce${boardWorkspace.id}`);
    createNewBoardElem.style.backgroundColor = "";
    
    if(newBoardMenu) {
      const newBoardMenuElem = document.querySelector(`.workspaces-display.new-board.menu.wkspce${boardWorkspace.id}`);
      newBoardMenuElem.style.cursor = "auto";
    }
    
  }

  const mouseOverNewBoardMenu = (event) => {
    // console.log("mouseOverNewBoardMenu stop propagation")
    event.stopPropagation();
  }
  const onClickNewBoardMenu = (event) => {
    // console.log("onClickNewBoardMenu stop propagation");
    event.stopPropagation();
  }

  const handleClickedOutsideOfMenu = (event) => {
    // console.log("handleClickedOutsideOfMenu, event.target.classList:", event.target.classList.contains("new-board"), event.target);
    const clickedElem = event.target;
    const clickedElemClasses = clickedElem.classList;
    if(clickedElemClasses.item(1) === "new-board" ) {
      // console.log("clicked a newBoard ")
      if(!clickedElemClasses.contains(`wkspce${boardWorkspace.id}`)) {
        // console.log("clicked a newboard, but not original newboard, last class:", clickedElemClasses.item(clickedElemClasses.length - 1));
        setNewBoardMenu(false);
      }
    } else {
      // conssole.log("clicked not newBoard")
      setNewBoardMenu(false);
    }
  }

  useEffect(() => {
    if(newBoardMenu) {
      // console.log("useEffect WorkspaceNewBoard adding doc eventListener")
      document.addEventListener("click", handleClickedOutsideOfMenu);

      return function cleanUp() {
        // console.log("cleaning up newBoardMenu doc eventListener ")
        document.removeEventListener("click", handleClickedOutsideOfMenu);
      }
    }
    
  },[newBoardMenu]);

  const [boardTitle, setBoardTitle] = useState("");
  const handleBoardTitle = (event) => {
    setBoardTitle(event.target.value);
  }

  const [selectWorkspace, setSelectWorkspace] = useState(boardWorkspace.title);

  const handleSelectWorkspace = (event) => {
    // console.log("handleSelectWorkspace, event.target.selectedOptions:", event.target.selectedOptions);
    setSelectWorkspace(event.target.value);
  }
  
  const [submittedNewBoard, setSubmittedNewBoard] = useState(false);

  const submitCreateBoard = async(event) => {
    event.preventDefault();
    // console.log("submitCreateBoard, ")
    const selectElem = document.querySelector("#create-board-select-workspace");
    const selectedWorkspaceId = selectElem.selectedOptions[0].dataset.workspaceId;
    
    let response;
    if(user.id === workspaces[0].owner) {
      response = await createNewBoardInOwnWrkspce(user.id, selectedWorkspaceId, boardTitle);
    } else {
      response = await createNewBoard(user.id, selectedWorkspaceId, boardTitle);
    }

    setSubmittedNewBoard(true);
    setBoardTitle("");
    setNewBoardMenu(false);
  }

  useEffect(() => {
    if(submittedNewBoard) {
      const lastBoard = boardWorkspace.boards[boardWorkspace.boards.length - 1];
      history.push(`/board/${lastBoard.id}`);
    }
  }, [submittedNewBoard])


  // console.log("WorkspaceNewBoard, ", ` boardWorkspace:`, boardWorkspace, " submittedNewBoard:", submittedNewBoard);

  return (
    <div
      className={`workspaces-display-create-board new-board wkspce${boardWorkspace.id} | br-025rem`}
      onClick={handleNewBoardMenu}
      onMouseOver={mouseOverCreateNewBoard}
      onMouseOut={mouseOutCreateNewBoard}
    >
      <span 
        className={`workspaces-display new-board txt wkspce${boardWorkspace.id}`}
      >
        Create new board
      </span>
    
      {
        newBoardMenu ? 
        
        <div 
          className={`workspaces-display new-board menu wkspce${boardWorkspace.id} | br-025rem pdg-075rem`}
          onMouseOver={mouseOverNewBoardMenu}
          onClick={onClickNewBoardMenu}
        >
          <div className={`workspaces-display new-board menu-title wkspce${boardWorkspace.id}`}>
            <span
              className={`create-board-txt new-board wkspce${boardWorkspace.id} | menu-title-clr`}
            >
              Create board
            </span>
            <button
              className={`workspaces-display new-board menu-close-btn wkspce${boardWorkspace.id} | bdr-none bg-clr-transparent`}
              onClick={handleCloseNewBoardMenu}
            >
              &times;
            </button>
          </div>
          
          <div className={`workspaces-display new-board menu-board-title-input wkspce${boardWorkspace.id}`}>
            <form
              onSubmit={submitCreateBoard}
            >
              <label htmlFor="board-title-input">Board title</label>
              <input
                id="board-title-input"
                type="text"
                value={boardTitle}
                onChange={handleBoardTitle}
              >
              </input>

              <label 
                htmlFor="create-board-select-workspace"
              >
                Workspace
              </label>
              <select
                id="create-board-select-workspace"
                value={selectWorkspace}
                onChange={handleSelectWorkspace}
              >
                {
                  workspaces.map((workspace) => {
                    return (
                      <option key={workspace.id}
                        value={workspace.title}
                        data-workspace-id={workspace.id}
                      >
                        {workspace.title}
                      </option>
                    )
                  })
                }
              </select>

              {
                boardTitle.length > 0 ?
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
    
    
    
    
  );
}

const mapState = (state) => {
  return {
    workspaces: state.workspaces.workspaces,
    // submittedNewBoard: state.workspaces.submittedNewBoard,
    user: state.auth.user,
  }
}

const mapDispatch = (dispatch) => {
  return {
    createNewBoard: (userId, workspaceId, boardTitle) => dispatch(createNewBoard(userId, workspaceId, boardTitle)),
    createNewBoardInOwnWrkspce: (userId, workspaceId, boardTitle) => dispatch(createNewBoardInOwnWrkspce(userId, workspaceId, boardTitle)),
  }
}


export default connect(mapState, mapDispatch)(WorkspaceNewBoard);