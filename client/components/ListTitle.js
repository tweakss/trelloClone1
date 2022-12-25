import React, { useState, useEffect, } from 'react';
import { connect, useDispatch} from 'react-redux';
import ListTitleMoveList from './ListTitleMoveList';
import { deleteList } from '../store/lists';
import { getBoard } from '../store/board';
import { updateListTitle } from '../store/lists';



const ListTitle = (props) => {
  const {
    board, workspaces, user, 
    currList, currListIndex, listsState, draggedCard, lists,
    deleteList, getBoard, swapListPositions, updateListTitle,
    swapListTargetPos, handleSwapListTargetIdx,
  } = props;
  const dispatch = useDispatch();

  const [listTitle, setListTitle] = useState(currList.title);
  const handleListTitle = (event) => {
    setListTitle(event.target.value);
  };

  const [listTitleDropdown, setListTitleDropdown] = useState({
    isVisible: false,
    currDropdown: false,
    listActionsDropdown: false,
    moveListDropdown: false,
  });
  const handleListTitleDropdown = (event) => {
    // Handles dropdown visibility when clicking on listTitle handle and also for 
    // listActions
    const clickedElem = event.target.className;
    
    if(clickedElem.includes("list-title-handle-dropdown")) {
      if( (listTitleDropdown.currDropdown !== "listActionsDropdown") && listTitleDropdown.currDropdown ) {
        setListTitleDropdown({
          [listTitleDropdown.currDropdown]: false,
          currDropdown: "listActionsDropdown",
          listActionsDropdown: true,
          isVisible: true
        });
      } else {
        if(listTitleDropdown.listActionsDropdown) {
          setListTitleDropdown({
            ...listTitleDropdown,
            currDropdown: false,
            listActionsDropdown: false,
            isVisible: false, 
          });
        } else {
          setListTitleDropdown({
            ...listTitleDropdown,
            currDropdown: "listActionsDropdown",
            listActionsDropdown: true,
            isVisible: true, 
          });
        }
        
      }
    } else if(clickedElem.includes("list-actions")) {
      if(clickedElem.includes("close-dropdown-btn")) {
        setListTitleDropdown({
          [listTitleDropdown.currDropdown]: false,
          currDropdown: false,
          listActionsDropdown: false,
          isVisible: false,
        });
      } else if(clickedElem.includes("move-list")) {
        // console.log("handleListTitleDropdown, move-list true");
        setListTitleDropdown({
          ...listTitleDropdown,
          currDropdown: "moveListDropdown",
          listActionsDropdown: false,
          moveListDropdown: true,
          isVisible: true,
        });

      } 
      
    } else {
      // clicked outside of the dropdown then close whichever dropdown is opened
      // console.log("handleListTitleDropdown, clicked outside of dropdown");
      
      setListTitleDropdown({
        ...listTitleDropdown,
        currDropdown: false,
        [listTitleDropdown.currDropdown]: false,
        isVisible: false,
      });
    }

  }

  const handleMoveListBackBtn = (event) => {
    // Goes back to listActions
    setListTitleDropdown({
      ...listTitleDropdown,
      moveListDropdown: false,
      listActionsDropdown: true,
      currDropdown: "listActionsDropdown",
    });
  }
  

 
  const closeListTitleDropdown = (event) => {
    let clicked = event.target;
    if(clicked.className.includes(`list-title-handle-dropdown idx${currListIndex}`)) {
      console.log("closeListTitleDropdown, clicked list-title handle");
      return;
    } else if(clicked.className.includes("close-dropdown-btn")) {
      console.log("clicked close-dropdown-btn");
    }
    
    while(clicked = clicked.parentElement) {
      // console.log("clicked", clicked, " parentNode:", clicked.parentNode);
      
      //If clicked on any other part of the dropdown then do nothing
      if(clicked.className.includes("list-title-dropdown")) {
        // console.log("inside a list-title dropdown")
        return;
      }
    }

    
    // console.log("clicked outisde of listTitleDropdown")
    handleListTitleDropdown(event);
  }

  // const [deleteListPrompt, setDeleteListPrompt] = useState(false);
  const handleDeleteListPrompt = () => {
    // console.log("handleDeleteListPrompt");
    const deleteListPrompt = document.querySelector(`.delete-list-prompt.idx${currListIndex}`);
    deleteListPrompt.showModal();
    // setDeleteListPrompt((prev) => !prev);
  }

  const handleDeleteListYes = () => {
    console.log("handleDeleteListYes");
    deleteList(board, currList);
  }

  

  useEffect(() => {
    // As long as a dropdown is visible an eventListener is set
    if(listTitleDropdown.isVisible) {
      document.addEventListener("click", closeListTitleDropdown);
      // console.log("useEffect listActionsDropdown, added event listener closeListTitleDropdown");
    }

    return function cleanUp() {
      document.removeEventListener("click", closeListTitleDropdown);
    }
  }, [listTitleDropdown.isVisible]);

  useEffect(() => {
    const listTitleElem = document.querySelector(`.list-title-input.idx${currListIndex}`);
    // listTitleElem.style.height = "auto";
    // console.log("listTitleElem computed height:", window.getComputedStyle(listTitleElem).height, " scrollHeight:", listTitleElem.scrollHeight);
    listTitleElem.style.height = listTitleElem.scrollHeight + "px";
    // console.log("After listTitleElem computed height:", listTitleElem.style.height, " scrollHeight:", listTitleElem.scrollHeight);


  }, [listTitle]);

  const boardListDragEnter = (event) => {
    event.preventDefault();
    console.log("boardListDragEnter, event.target:", event.target);
    
    if(currListIndex !== draggedCard.leaveListIndex) {
      dispatch({ type: "ENTER_DIFF_LIST_REMOVE_FILLER" })
    }
  }
  const boardListDragOver = (event) => {
    event.preventDefault();
    console.log("boardListDragOver, event.target:", event.target);
    // create a filler card in the empty list
    dispatch({
      type: "CREATE_FILLER_FOR_NO_CARDS",
      dropTargetListIndex: currListIndex
    });

    const cardBtnTitle = document.querySelector(`.filler`);
    cardBtnTitle.style.backgroundColor = "#A5AEB6";
  }
  const boardListDragLeave = (event) => {
    console.log("boardListDragLeave event.target:", event.target);
    dispatch({
      type: "UPDATE_DRAGGED_LEAVE_INDEXES",
      leaveCardIndex: null,
      leaveListIndex: currListIndex,
    });
  }
  const boardListCardDrop = (event) => {
    event.preventDefault();
    console.log("boardListCardDrop, event.target:", event.target);
  }
  useEffect(() => {
    if(currList.cards.length === 0) {
      // console.log(`ListTitle useEffect ${currList.title} no cards`);
      const boardList = document.querySelector(`.flex-board-list.idx${currListIndex}`);
      
      boardList.addEventListener("dragenter", boardListDragEnter);
      boardList.addEventListener("dragover", boardListDragOver);
      boardList.addEventListener("dragleave", boardListDragLeave);
      boardList.addEventListener("drop", boardListCardDrop);

      return function cleanUp() {
        boardList.removeEventListener("dragenter", boardListDragEnter);
        boardList.removeEventListener("dragover", boardListDragOver);
        boardList.removeEventListener("dragleave", boardListDragLeave);
        boardList.removeEventListener("drop", boardListCardDrop);
      }
    }
  })

  const submitListTitle = (event) => {
    // console.log("submitListTitle, event.target:", event.target);
    updateListTitle(currList.id, listTitle, currListIndex);

    if(event.target.classList[0] !== "list-title-input") {
      setListTitleFocused(false);
    }
    
  }

  const [listTitleFocused, setListTitleFocused] = useState(false);
  const onClickListTitle = (event) => {
    event.stopPropagation();
    // console.log("onClickListTitle, activeElement:", document.activeElement);
    setListTitleFocused(true);
  }

  useEffect(() => {
    if(listTitle.length > 0 && listTitleFocused) {
      document.addEventListener("click", submitListTitle);

      return function cleanUp() {
        document.removeEventListener("click", submitListTitle);
      }
    }
  }, [listTitle, listTitleFocused]);


  console.log("ListTitle render, listTitle:", listTitle, " listTitleFocused:", listTitleFocused);


  return (
    <div
      className={`list-title wrapper | mgn-l-05rem | idx${currListIndex}`}
      data-list-index={`${currListIndex}`}
      data-not-card={"1"}
    >
      <textarea
        className={`list-title-input | bg-clr-transparent bdr-none | idx${currListIndex}`}
        rows="1" cols="10"
        value={listTitle}
        onChange={handleListTitle}
        onClick={onClickListTitle}
        data-list-index={`${currListIndex}`}
        data-not-card={"1"}
        
      >
      </textarea>
      
      <div className='list-title-handle-dropdown-wrapper'>
        <button
          className={`list-title-handle-dropdown | bg-clr-transparent br-025rem bdr-none usr-slct | idx${currListIndex}`}
          type="button"
          onClick={handleListTitleDropdown}
        >
        </button>       

        {
          listTitleDropdown.listActionsDropdown ?
          <div className="list-title-dropdown">
            <div className="list-actions">
              <div className="list-actions-header">
                <span>List Actions</span>
                <button 
                  className="list-actions-header close-dropdown-btn"
                  onClick={handleListTitleDropdown}
                >
                  &times;
                </button>
              </div>
              <div className="list-actions-delete-list">
                <button 
                  className="list-actions-delete-list btn"
                  onClick={handleDeleteListPrompt}
                >
                  Delete List
                </button>
              </div>
              <div className="list-actions-move-list">
                <button
                  className="list-actions-move-list btn"
                  onClick={handleListTitleDropdown}
                >
                  Move List
                </button>
                
              </div>
              
            </div>
            
          </div> : null
        }

        {
          
          <div className="list-title-dropdown">
            <dialog className={`delete-list-prompt idx${currListIndex}`}>
              <p>Delete the list: {listTitle}?</p>
              <form method="dialog">
                <button 
                  type="submit"
                  onClick={handleDeleteListYes}
                >
                  Yes
                </button>
                <button
                  type="submit"
                >
                  No
                </button>
              </form>
            </dialog>
          </div> 
        }

        {
          listTitleDropdown.moveListDropdown ?
          <ListTitleMoveList
            currListIndex={currListIndex} currList={currList}
            workspaces={workspaces} currLists={lists} board={board}
            handleListTitleDropdown={handleListTitleDropdown}
            setListTitleDropdown={setListTitleDropdown}
            handleMoveListBackBtn={handleMoveListBackBtn}
          /> : null
        }
      </div>
      
      
    </div>
  );
}

const mapState = (state) => {
  return {
    board: state.board.board,
    listsState: state.lists,
    lists: state.lists.lists,
    draggedCard: state.lists.draggedCard,
    workspaces: state.workspaces.workspaces,
    user: state.auth.user,
  }
}

const mapDispatch = (dispatch) => {
  return {
    deleteList: (board, list) => dispatch(deleteList(board, list)),
    getBoard: (boardId, listPositions) => dispatch(getBoard(boardId, listPositions)),
    updateListTitle: (listId, newListTitle, currListIndex) => dispatch(updateListTitle(listId, newListTitle, currListIndex)),
  }
}

export default connect(mapState, mapDispatch)(ListTitle);

