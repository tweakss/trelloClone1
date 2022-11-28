import React, { useState, useEffect, } from 'react';
import { connect, useDispatch} from 'react-redux';
import { deleteList } from '../store/lists';
import { getBoard } from '../store/board';
import { swapListPositions } from '../store/lists';


const ListTitle = (props) => {
  const {
    board, workspaces, user, 
    currList, currListIndex, listsState, draggedCard,
    deleteList, getBoard, swapListPositions,
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
        console.log("handleListTitleDropdown, move-list true");
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
      console.log("handleListTitleDropdown, clicked outside of dropdown");
      
      setListTitleDropdown({
        ...listTitleDropdown,
        currDropdown: false,
        [listTitleDropdown.currDropdown]: false,
        isVisible: false,
      });
    }

  }

  const [selectListPosition, setSelectListPosition] = useState(`${currListIndex + 1}`);
  const handleSelectListPosition = (event) => {
    setSelectListPosition(event.target.value);
    console.log(`handleSelectListPosition, after setSelectListPosition, for list[${currListIndex}]`);
  }

  const handleSubmitListPosition = (event) => {
    event.preventDefault();
    console.log(`handleSubmitListPosition, list[${currListIndex}] selectListPosition`, selectListPosition);
    
    const swapToIndex = parseInt(selectListPosition, 10) - 1;
    handleSwapListTargetIdx(swapToIndex, currListIndex);
    swapListPositions(board.id, {
      currListId: currList.id,
      currListPosition: currListIndex + 1,
      swapToPosition: parseInt(selectListPosition, 10),
      swapToListId: listsState.lists[swapToIndex].id
    });
    
    setListTitleDropdown({
      currDropdown: false,
      listActionsDropdown: false,
      moveListDropdown: false,
      isVisible: false,
    });

    
    
  }

  useEffect(() => {
    // console.log("ListTitle useEffect, swapListTargetPos");
    if(swapListTargetPos) {
      console.log(`setting `, listsState.lists[currListIndex], "selectListPosition to:", swapListTargetPos);
      setSelectListPosition(swapListTargetPos);
      handleSwapListTargetIdx({ swapToIndex: null, currListIndex: null });
    }
  }, [swapListTargetPos])


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

    
    console.log("clicked outisde of listTitleDropdown")
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

  // const [listTitleRows, setListTitleRows] = useState(1);
  // const [prevScrollHeight, setPrevScrollHeight] = useState(0);
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
      console.log(`ListTitle useEffect ${currList.title} no cards`);
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

  // console.log("ListTitle render");


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
          <div className="list-title-dropdown">
            <form onSubmit={handleSubmitListPosition}>
              <div className="move-list">
                <div className="move-list-header" id="move-list-header">
                  <button
                    type="button"
                    onClick={handleMoveListBackBtn}
                  >
                    &lt;
                  </button>
                  <span>Move List</span>
                  <button
                    type="button"
                    onClick={handleListTitleDropdown}
                    className="move-list-header close-dropdown-btn"
                  >
                    &times;
                  </button>
                </div>

                <div className="move-list-board">
                  {/* <span>Board</span> */}
                  <label htmlFor="select-board">Board</label>
                  <select id="select-board">
                    {
                      workspaces.map((workspace) => {
                        return (
                          <optgroup key={workspace.id} label={workspace.title}>
                            {
                              workspace.boards.map((board) => {
                                return (
                                  <option key={board.id}>{board.title}</option>
                                )
                              })
                            }
                          </optgroup>
                        );

                        
                      })
                      
                    }
                  </select>
                  <label htmlFor="select-list-position">Position</label>
                  <select
                    id="select-list-position"
                    value={selectListPosition}
                    onChange={handleSelectListPosition}
                  >
                    {
                      listsState.lists.map((list, index) => {
                        return (
                          <option
                            key={list.id}
                            value={`${index + 1}`}
                          >
                            {currListIndex === index ? `${index + 1} (current)` : `${index + 1}`}
                          </option>
                        )
                      })
                    }
                  </select>
                  <button type="submit">Move</button>
                </div>
              </div>
            </form>
            
          </div> : null
        }
      </div>
      
      
    </div>
  );
}

const mapState = (state) => {
  return {
    board: state.board.board,
    listsState: state.lists,
    draggedCard: state.lists.draggedCard,
    workspaces: state.workspaces,
    user: state.auth,
  }
}

const mapDispatch = (dispatch) => {
  return {
    deleteList: (board, list) => dispatch(deleteList(board, list)),
    getBoard: (boardId, listPositions) => dispatch(getBoard(boardId, listPositions)),
    swapListPositions: (boardId, swapListsInfo) => dispatch(swapListPositions(boardId, swapListsInfo)),
  }
}

export default connect(mapState, mapDispatch)(ListTitle);

