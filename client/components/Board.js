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

  const [addBoard, setAddBoard] = useState(false);
  const openAddBoard = () => {
    setAddBoard(true);
  }
  const closeAddBoard = () => {
    setAddBoard(false);
  }

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
                className={`flex-board-list idx${listIndex}`}
                data-list-index={`${listIndex}`}
                data-not-card={"1"}
              >
                <div>
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
