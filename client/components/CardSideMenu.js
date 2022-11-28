import React, { useState, useEffect } from 'react';
import {connect} from 'react-redux';
import axios from 'axios';
import { removeACard, moveCardToList } from '../store/lists';

const CardSideMenu = (props) => {
  const {
    openSideMenu, setOpenSideMenu, setCardTitle,
    currList, currLists, currCard, cardIndex, currBoard, workspaces,
    removeACard, moveCardToList,
  } = props;

  const [deleteCardPrompt, setDeleteCardPrompt] = useState(false);
  const handleDeleteCardPrompt = (event) => {
    setDeleteCardPrompt((prev) => !prev);

    // Close other menus
    setMoveCardMenu(false);
  }

  const handleDeleteCard = (event) => {
    removeACard(currList.id, currCard.id, currBoard.id);
  }

  const [moveCardMenu, setMoveCardMenu] = useState(false);
  
  const [selectedBoardLists, setSelectedBoardLists] = useState([]);
  const getLists = async(boardId) => {
    const { data: lists } = await axios({
      method: 'get',
      url: `/api/lists/boardId/${boardId}`,
    });
    console.log("CardSideMenu, getLists:", lists)
    return lists;
  }
  useEffect(() => {
    if(openSideMenu) {
      (
        async() => {
          const lists = await getLists(currBoard.id);
          setSelectedBoardLists(lists);
        }
      )();
      
      // getLists(currBoard.id); // get lists for local state
      
    }
  }, [openSideMenu]);

  const [selectBoard, setSelectBoard] = useState(currBoard.title);
  const handleSelectBoard = (event) => {
    // console.log("handleSelectBoard, event.target:", event.target.selectedOptions[0].dataset.boardId);
    const boardId = event.target.selectedOptions[0].dataset.boardId;
    (
      async() => {
        const lists = await getLists(boardId);
        setSelectedBoardLists(lists);
        setSelectedList(lists[0]);
        setSelectList(lists[0].title);
        setSelectPosition(lists[0].cards.length + 1);
      }
    )();
    
    setSelectBoard(event.target.value);

  }

  const [selectedList, setSelectedList] = useState(currList);

  const [selectList, setSelectList] = useState(currList.title);
  const handleSelectList = (event) => {
    console.log("handleSelectList, selectedIndex:", event.target.selectedIndex, " selectedBoardLists:", selectedBoardLists[event.target.selectedIndex] )
    setSelectedList(selectedBoardLists[event.target.selectedIndex]);
    setSelectPosition(selectedBoardLists[event.target.selectedIndex].cards.length + 1);
    setSelectList(event.target.value);
  }

  const [selectPosition, setSelectPosition] = useState(`${cardIndex + 1}`);
  const handleSelectPosition = (event) => {
    setSelectPosition(event.target.value);
  }

  const submitMoveCard = async(event) => {
    event.preventDefault();
    // Need origListId, targetListId, targetCardPos
    const origListId = currList.id;
    const targetListId = selectedList.id;
    const targetPosition = selectPosition;
    // const cardId = currCard.id;
    // console.log("submitMoveCard, origListId:", origListId, " targetListId:", targetListId, " targetCardPos:", targetPosition);

    if(origListId !== targetListId) {
      const targetCardsToMove = selectedList.cards.filter((card, index) => {
        return (index >= (targetPosition - 1) && card.id !== currCard.id);
      });
      const origCardsToMove = currList.cards.filter((card, index) => {
        return index > currCard.cardPosition - 1;
      })
      // console.log("submitMoveCard, targCardsToMove:", targetCardsToMove, " origCardsToMove:", origCardsToMove);
      
      const response = await axios.put(`/api/lists/targetList/${targetListId}/moveCard/${currCard.id}`, {
        origListId, targetListId, targetPosition,
        targetCardsToMove, origCardsToMove
      });
      console.log("submitMoveCard origList !== targetList, response:", response);
    } else {
      const targetCardId = currList.cards[targetPosition - 1].id;
      // console.log("targetCardId:", targetCardId);
      const response = await axios.put(`/api/lists/moveCardInCurrList/card/${currCard.id}`, {
        targetCardId, targetPosition
      });
      console.log("submitMoveCard origList === targetList, response:", response);
    }
    
    
    window.location.reload();
  }

  const closeSideMenu = (event) => {
    setOpenSideMenu(false);
    setCardTitle(currCard.title);
    setSelectBoard(currBoard.title);
    setDeleteCardPrompt(false);
    setMoveCardMenu(false);
    
  }


  // console.log("CardSideMenu RENDER, selectList:", selectList, " currList:", currList, " selectPosition:", selectPosition, selectList === currList.title)

  return (
    <>
    {
      openSideMenu ?
      <div className="card-side-menu">
        
        <div className="card-side-menu-backdrop" onClick={closeSideMenu}>
          
        </div>
        <div className="card-side-menu-actions">
          <button
            className="card-side-menu-del-btn | bdr-none br-025rem pdg-4x8px fnt-sz-14px"
            onClick={handleDeleteCardPrompt}
          >
            Delete this card
          </button>

          {
            deleteCardPrompt ?
            <div className="card-side-menu-del-prompt | br-025rem pdg-075rem ">
              <div className="card-side-menu-del-prompt-title">
                <span 
                  className="card-side-menu-del-prompt-title-txt | menu-title-clr"
                >
                  Are you sure?
                </span>
                
              </div>
              
              <div className="card-side-menu-del-prompt-yes-no">
                <button 
                  className="card-side-menu-del-prompt-yes-btn | bdr-none br-025rem"
                  onClick={handleDeleteCard}
                >
                  Yes
                </button>
                <button
                  className="card-side-menu-del-prompt-no-btn | bdr-none br-025rem"
                  onClick={() => setDeleteCardPrompt(false)}
                >
                  No
                </button>
              </div>
            </div> : null
          }

          <button
            className="card-side-menu-move-btn | bdr-none br-025rem pdg-4x8px fnt-sz-14px"
            onClick={() => setMoveCardMenu((prev) => !prev)}
          >
            Move
          </button>
          
          
            {
              moveCardMenu ?
              <div className="card-side-menu-move-card | br-025rem pdg-075rem">
                <div className= "card-side-menu-move-card-title">
                  <span 
                    className="card-side-menu-move-card-title-txt | menu-title-clr"
                  >
                    Move Card
                  </span>
                  <button
                    className="card-side-menu-move-card-close-btn | bdr-none bg-clr-transparent"
                    onClick={() => setMoveCardMenu(false)}
                  >
                    &times;
                  </button>
                </div>
                <h5 className="card-side-menu-move-card-select-h5">Select destination</h5>
                <form onSubmit={submitMoveCard}>
                  <label 
                    htmlFor="card-side-menu-select-board"
                    className="card-side-menu-select-board-label | fnt-sz-14px label-clr "
                  >
                    Board
                  </label>
                  <div>
                    <select
                      id="card-side-menu-select-board" 
                      className="card-side-menu-move-card-select-board"
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
                                    >
                                      {currBoard.id === board.id ? `${board.title} (current)` : `${board.title}`}
                                    </option>
                                  )
                                })
                              }
                            </optgroup>
                          );

                          
                        })
                        
                      }
                    </select>
                  </div>
                  <label 
                    htmlFor="card-side-menu-select-list"
                    className="card-side-menu-select-list-label | fnt-sz-14px label-clr"
                  >
                    List
                  </label>
                  <div>
                    <select
                      id="card-side-menu-select-list"
                      className="card-side-menu-move-card-select-list"
                      value={selectList}
                      onChange={handleSelectList}
                    >
                      {
                        selectedBoardLists.map((list, index) => {
                          return (
                            <option
                              key={list.id}
                              value={list.title}
                            >
                              {currList.id === list.id ? `${list.title} (current)` : `${list.title}`}
                            </option>
                          )
                        })
                      }
                    </select>
                  </div>

                  <label
                    htmlFor="card-side-menu-select-position"
                    className="card-side-menu-select-position-label | fnt-sz-14px label-clr"
                  >
                    Position
                  </label>
                  <div>
                    <select
                      id="card-side-menu-select-position"
                      className="card-side-menu-move-card-select-position"
                      value={selectPosition}
                      onChange={handleSelectPosition}
                    >
                      {
                        selectedList.cards.map((card, index) => {
                          return (
                            <option
                              key={card.id}
                              value={`${index + 1}`}
                            >
                              {cardIndex === index ? `${index + 1} (current)` : `${index + 1}`}
                            </option>
                          );
                
                        })
                          
                        
                      }

                      {
                        currList.cards.length > 1 ?
                        <option 
                        key={"lastPos"} 
                        value={`${selectedList.cards.length + 1}`}
                      >
                        {`${selectedList.cards.length + 1}`}
                      </option> : null
                      }
                      
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="card-side-menu-move-card-submit-btn | bdr-none br-025rem pdg-4x8px fnt-sz-14px"
                  >
                    Move
                  </button>
                </form>
              </div> : null
            }
          

        </div>
        
      </div> : null
      
    }

    
    </>
  );
}

const mapState = (state) => {
  return {
    workspaces: state.workspaces,
  }
}

const mapDispatch = (dispatch) => {
  return {
    removeACard: (currListId, cardId, boardId) => dispatch(removeACard(currListId, cardId, boardId)),
    moveCardToList: (moveCardInfo) => dispatch(moveCardToList(moveCardInfo)),
  }
}

export default connect(mapState, mapDispatch)(CardSideMenu);
