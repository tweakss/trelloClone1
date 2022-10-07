import React, { useState, useEffect } from 'react'
import {connect} from 'react-redux'
import { Link } from 'react-router-dom';
import { getBoard, getBoardMembers } from '../store/board';
import { getLists } from '../store/lists';
import { getWorkspaces } from '../store/workspace';
import Card from './Card';
import AddACard from './AddACard';
import ListTitle from './ListTitle';
import AddAList from './AddAList';
import Navbar from './Navbar';
import NavbarContent from './NavbarContent';
import BoardSideDrawer from './BoardSideDrawer';


const Board = (props) => {
  const { 
    board, getBoard, getBoardMembers, createNewBoard,
    user, workspaces, getWorkspaces,
    lists, listsState, getLists,
  } = props;
  // const boards = workspace.boards; // workspace is an array of workspaces and its boards

  const boardId = props.match.params.boardId;
  useEffect(() => {
    // console.log('Board, useEffect, boardId:', boardId);
    getBoard(boardId);
    getBoardMembers(boardId);
    getLists(boardId);
    getWorkspaces(user.id);
  }, [boardId]);

  if(Object.keys(board).length) {
    console.log("board length > 0", " board:", board);
    const gridBoardLists = document.querySelector("#grid-board-lists");
    console.log("gridBoardLists:", gridBoardLists);
  }
  let handleScroll;
  let gridBoardLists;
  const throttleMouseMove = (event) => {
    // console.log("gridBoardLists mouseMove, movement x,y:", event.movementX, event.movementY);
    if(!handleScroll) {
      return;
    }

    // console.log("throttleMouseMove");
    // const gridBoardLists = document.querySelector("#grid-board-lists");
    if(event.movementX > 0) {
      gridBoardLists.scrollBy(-30, 0);
    } else if(event.movementX < 0) {
      gridBoardLists.scrollBy(30, 0);
    }

    handleScroll = false;
    setTimeout(() => handleScroll = true, 30);
  }
  
  const mouseDownStartScroll = (event) => {
    // console.log("mouseDownStartScroll, event targ, currTarg:", event.target, event.currentTarget);

    if(event.target.className.includes("board-list-col")) {
      handleScroll = true;
      document.addEventListener("mousemove", throttleMouseMove);
      document.addEventListener("mouseup", mouseUpEndScroll);
    }
    
  }
  const mouseUpEndScroll = (event) => {
    // console.log("mouseUpEndScroll");

    handleScroll = false;
    document.removeEventListener("mousemove", throttleMouseMove);
    document.removeEventListener("mouseup", mouseUpEndScroll);
  }
  // Initial set up for scrolling whenever board state is assigned
  useEffect(() => {
    if(Object.keys(board).length) {
      gridBoardLists = document.querySelector("#grid-board-lists");
      gridBoardLists.addEventListener("mousedown", mouseDownStartScroll);
    }
  }, [board]);
  
    

   
  

  const [swapListTargetIdx, setSwapListTargetIdx] = useState({
    swapToIndex: null,
    currListIndex: null,
  });

  const handleSwapListTargetIdx = (swapToIndex, currListIndex) => {
    
    setSwapListTargetIdx({ swapToIndex, currListIndex });
  }

  

  console.log("Board RENDER, ");


  if(!board.id ) {
    // console.log('!board.id || !boards');
    return (
      <div>
        <h4>Loading boards...</h4>
      </div>
    );
  }

  return (
    <div id="grid-board">
      <Navbar user={user} />
      <BoardSideDrawer workspaceId={board.workspaceId} />
      <NavbarContent />

      
      <div id="grid-board-lists">
        {
          lists.map((list, listIndex) => {
            return (
              <div 
                key={list.id} 
                className={`board-list-col | usr-slct | idx${listIndex}`}
                data-list-index={`${listIndex}`}
                data-not-card={"1"}
                
              >
                <div className="board-list-bg | mgn-l-05rem br-05rem">
                  <div className="flex-board-list">
                    <ListTitle 
                      currList={list} currListIndex={listIndex} board={board} 
                      workspaces={workspaces}
                      swapListTargetPos={
                        swapListTargetIdx.swapToIndex === listIndex ? swapListTargetIdx.currListIndex + 1 : null 
                      }
                      handleSwapListTargetIdx={handleSwapListTargetIdx}
                    />
                    {
                      list.cards.map((card, cardIndex) => {
                        // console.log("Board, list.cards.map, card:", card);
                        return (
                          
                          <Card
                            key={card.id}
                            card={card}
                            cardIndex={cardIndex}
                            board={board}
                            list={list}
                            listIndex={listIndex}
                          />
                          
                        );
                      })
                    }
                    <AddACard list={list} listIndex={listIndex} user={user} board={board} />
                  </div>
                </div>
              </div>
            );
          }).concat(<AddAList key={"addAList"}/>)
        }
      </div>
  
    </div>
    
  );
}

const mapState = (state) => {
  return {
    board: state.board.board,
    lists: state.lists.lists,
    listsState: state.lists,
    user: state.auth,
    workspaces: state.workspaces
  }
};

const mapDispatch = (dispatch) => {
  return {
    getBoard: (boardId) => dispatch(getBoard(boardId)),
    getBoardMembers: (boardId) => dispatch(getBoardMembers(boardId)),
    getLists: (boardId) => dispatch(getLists(boardId)),
    getWorkspaces: (userId) => dispatch(getWorkspaces(userId)),
    createNewBoard: (userId, workspaceId, boardTitle) => dispatch(createNewBoard(userId, workspaceId, boardTitle)), 
  }
}

export default connect(mapState, mapDispatch)(Board);
