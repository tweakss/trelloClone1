import React, { useState, useEffect, } from 'react';
import { connect, useDispatch} from 'react-redux';
import { moveList } from '../store/lists';
import { getLists } from '../functions/utilityFunctions';

const ListTitleMoveList = (props) => {
  const {
    currListIndex, currList,
    workspaces, currLists, board,
    handleListTitleDropdown, setListTitleDropdown, handleMoveListBackBtn,
    moveList,
  } = props;

  const [selectBoard, setSelectBoard] = useState(board.title);
  const [selectedBoardId, setSelectedBoardId] = useState(board.id);
  const [selectedBoardLists, setSelectedBoardLists] = useState(currLists)
  
  const handleSelectBoard = (event) => {
    // console.log("handleSelectBoard, selectedBoardId:", event.target.selectedOptions[0].dataset.boardId);
    const boardId = event.target.selectedOptions[0].dataset.boardId;
    setSelectedBoardId(boardId);
    ( async() => {
        const lists = await getLists(boardId);
        console.log("getLists:", lists);

        setSelectedBoardLists(lists);
        setSelectListPosition("1"); 
      }
    )();

    setSelectBoard(event.target.value);
  }
  
  const [selectListPosition, setSelectListPosition] = useState(`${currListIndex + 1}`);
  const handleSelectListPosition = (event) => {
    setSelectListPosition(event.target.value);
    // console.log(`handleSelectListPosition, after setSelectListPosition, for list[${currListIndex}]`);
  }
  
  const handleSubmitListPosition = (event) => {
    event.preventDefault();
    console.log(`handleSubmitListPosition, selectedBoardId`, selectedBoardId, typeof selectedBoardId, " selectedBoardLists:", selectedBoardLists);
    if(selectListPosition === `${currListIndex + 1}` && board.id === selectedBoardId) {
      return;
    }

    let targetListIndex = parseInt(selectListPosition, 10) - 1;
    // console.log("targetListIndex:", targetListIndex)
    
    // Map the listIds to adjust to indexes here
    let targetListsToAdjust = {};
    if(board.id !== selectedBoardId) {
      selectedBoardLists.forEach((list, index) => {
        if(targetListIndex === selectedBoardLists.length) {
          targetListsToAdjust[list.id] = index;
        } else if(index >= targetListIndex) {
          targetListsToAdjust[list.id] = index + 1;
        }
      });
    }
    // console.log("targetListsToAdjust:", targetListsToAdjust);
    
    moveList(board.id, {
      currListId: currList.id,
      currListPosition: currListIndex + 1,
      targetListPosition: parseInt(selectListPosition, 10),
      targetListId: selectedBoardLists[targetListIndex] ? selectedBoardLists[targetListIndex].id : 0,
      targetBoardId: selectedBoardId,
      targetListsToAdjust
    });
    
    setListTitleDropdown({
      currDropdown: false,
      listActionsDropdown: false,
      moveListDropdown: false,
      isVisible: false,
    });
  }
  
  // console.log("ListTitleMoveList render")
  
  return (
    <div className="list-title-dropdown-move-list">
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

          <div className="move-list-select-">
            {/* <span>Board</span> */}
            <label htmlFor="select-board">Board</label>
            <select 
              id="select-board"
              className="move-list-select-board"
              value={selectBoard}
              onChange={handleSelectBoard}
            >
              {
                workspaces.map((workspace) => {
                  return (
                    <optgroup key={workspace.id} label={workspace.title}>
                      {
                        workspace.boards.map((board) => {
                          return (
                            <option key={board.id}
                              value={board.title}
                              data-board-id={board.id}
                            >{board.title}</option>
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
              className="move-list-select-list"
              value={selectListPosition}
              onChange={handleSelectListPosition}
            >
              {
                selectedBoardLists.map((list, index) => {
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

              {
                board.id !== selectedBoardId ?
                <option key={"lastPos"}
                  value={`${selectedBoardLists.length + 1}`}
                >
                  {`${selectedBoardLists.length + 1}`}
                </option> : null
              }
            </select>
            <div className="move-list-submit-btn-container">
              <button
                className="move-list-submit-btn" 
                type="submit"
              >
                Move
              </button>
            </div>
            
          </div>
        </div>
      </form>
            
    </div>

  )
}


const mapDispatch = (dispatch) => {
  return {
    moveList: (boardId, moveListInfo) => dispatch(moveList(boardId, moveListInfo)),
  }
}

export default connect(null, mapDispatch)(ListTitleMoveList);