import axios from 'axios';


const GET_LISTS = "GET_LISTS";
// const SWAP_LIST_POSITIONS = "SWAP_LIST_POSITIONS";
const DRAG_OVER_CARDS_UP = "DRAG_OVER_CARDS_UP";
const DRAG_OVER_CARDS_DOWN = "DRAG_OVER_CARDS_DOWN";
const DROP_DRAGGED_CARD = "DROP_DRAGGED_CARD";
const UPDATE_CARD = "UPDATE_CARD";

const _getLists = (lists) => {
  return {
    type: GET_LISTS,
    lists
  }
}

// const _swapListPositions = (listPositions) => {
//   return {
//     type: SWAP_LIST_POSITIONS,
//     listPositions
//   }
// }

const _dropDraggedCard = (moveToListIndex, cardIndex) => {
  return {
    type: DROP_DRAGGED_CARD,
    moveToListIndex,
    cardIndex,
    // moveToCardIndex
  }
}

const _updateCard = (updatedCard, listIndex, cardId) => {
  return {
    type: UPDATE_CARD,
    updatedCard,
    listIndex, cardId
  }
}

export const getLists = (boardId) => {
  return async(dispatch) => {
    const { data: lists } = await axios({
      method: 'get',
      url: `/api/lists/boardId/${boardId}`,
    });
    
    dispatch(_getLists(lists));
  }
}

export const createNewList = (board, listTitle) => {
  console.log("createNewList listTitle:", listTitle);
  return async (dispatch) => {
    const { data: updatedLists } = await axios.post(`/api/lists/newList/${board.id}`, { title: listTitle });
    
    // console.log('createNewList, newList:', newList);
    // sortListsAndCards(updatedBoard);
    dispatch(_getLists(updatedLists));
  }
}

export const deleteList = (board, list) => {
  return async (dispatch) => {
    await axios.delete(`/api/lists/${board.id}/deleteList/${list.id}`);

    const { data: lists } = await axios({
      method: 'get',
      url: `/api/lists/boardId/${board.id}`,
    });
    // sortListsAndCards(updatedBoard);
    // console.log('deleteList, updatedBoard:', updatedBoard);
    dispatch(_getLists(lists));
  }
}

export const swapListPositions = (boardId, swapListsInfo) => {
  return async (dispatch) => {
    const { data: updatedLists} = await axios({
      method: 'put',
      url: `/api/lists/boardId/${boardId}/swapListPositions`,
      data: {
        swapListsInfo
      }
    });
    console.log("updatedLists from swapping:", updatedLists);
    // sortListsAndCards(board, listPositions);
    dispatch(_getLists(updatedLists));
  }
}

export const createCardAndAddToList = (list, cardTitle, user, board) => {
  return async (dispatch) => {
    const listId = list.id;
    
    const updatedList = await axios.post(`/api/lists/${listId}/newCard`, {
      title: cardTitle,
      creator: user.username,
      cardPosition: list.cards.length + 1
    });
    // console.log('createCardAndAddToList, updatedList:', updatedList);

    const boardId = board.id;
    const { data: lists } = await axios.get(`/api/lists/boardId/${boardId}`);
    // sortListsAndCards(updatedBoard);
    // console.log('createCardAndAddToList, updatedBoard:', updatedBoard);
    dispatch(_getLists(lists));
  }

}

// not using this?
export const moveCardToList = (moveCardsInfo) => {
  return async(dispatch) => {
    const { targetListId   } = moveCardsInfo;
    console.log("moveCardToList, targetListId:", targetListId, " cardId:", cardId, " boardId:", boardId);
    const response = await axios.put(`/api/lists/targetList/${targetListId}/moveCard/${cardId}`, {
      moveCardsInfo
    });
    // console.log("moveCardToList, response:", response);

    const { data: lists } = await axios.get(`/api/lists/boardId/${boardId}`);
    // sortListsAndCards(updatedBoard);
    // console.log('moveCardToList, updatedBoard:', updatedBoard);
    dispatch(_getLists(lists));
  }
}

export const updateCardTitle = (cardId, cardTitle, listIndex) => {
  return async(dispatch) => {
    const { data: updatedCard } = await axios({
      method: 'put',
      url: `/api/cards/card/${cardId}/updateTitle`,
      data: {
        title: cardTitle
      
      }
    });
    console.log("updateCardTitle thunk, updatedCard:", updatedCard);

    dispatch(_updateCard(updatedCard, listIndex, cardId));
  }
}

export const updateCardDescription = (card, cardDescription, board, txtareaHeight) => {
  // console.log('updateCardDescription, card:', card, "cardDescription:", cardDescription);
  return async (dispatch) => {
    const cardId = card.id;
    const { data: cardUpdated } = await axios.put(`/api/cards/${cardId}/description`, {
      description: cardDescription,
      txtareaHeight
    });
    console.log('updateCardDescription thunk, cardUpdated:', cardUpdated);

    const boardId = board.id;
    const { data: lists } = await axios.get(`/api/lists/boardId/${boardId}`);
    // sortListsAndCards(updatedBoard);
    // console.log('updateCardDescription, updatedBoard:', updatedBoard);
    dispatch(_getLists(lists));
  }
}

export const removeACard = (listId, cardId, boardId) => {
  return async(dispatch) => {
    const response = await axios.delete(`/api/lists/${listId}/removeCard/${cardId}`);
    console.log("removeACard, response:", response);

    const { data: lists } = await axios.get(`/api/lists/boardId/${boardId}`);
    // sortListsAndCards(updatedBoard);
    // console.log('removeACard, updatedBoard:', updatedBoard);
    dispatch(_getLists(lists));
  }
}

export const dropDraggedCard = (dropInfo) => {
  console.log("dropDraggedCard thunk, dropInfo.targetListCardToIndex:", dropInfo.targetListCardToIndex);
  return async(dispatch) => {
    const response = await axios({
      method: 'put',
      url: '/api/lists/dropDraggedCard',
      data: {
        targetListCardToIndex: dropInfo.targetListCardToIndex,
        draggedListCardToIndex: dropInfo.draggedListCardToIndex ? dropInfo.draggedListCardToIndex: null,
        draggedCardId: dropInfo.draggedCardId ? dropInfo.draggedCardId : null,
        listId: dropInfo.listId ? dropInfo.listId: null,
        draggedListId: dropInfo.draggedListId ? dropInfo.draggedListId : null,
        cardGoingToDiffList: dropInfo.cardGoingToDiffList ? dropInfo.cardGoingToDiffList : false
      }
    })

    // dispatch(_dropDraggedCard(dropInfo.moveToListIndex, dropInfo.moveToCardIndex));
    dispatch(_dropDraggedCard(dropInfo.moveToListIndex, dropInfo.cardIndex));
  }
}

const inititalState = {
  lists: [],
  draggedCard: {},
  fillerIndex: null,
  leftCurrList: false,
}

export default function listsReducer(state = inititalState, action) {
  switch(action.type) {
    case GET_LISTS: {
      
      return { ...state, lists: action.lists }
    }
    case DRAG_OVER_CARDS_UP: {
      const currList = state.lists[action.dropTargetListIndex];
      const newList = { ...currList };
      const newCards = [ ...currList.cards ];

      if(newCards[action.dropTargetCardIndex + 1].id !== "filler" ) {
        const filteredCards = newCards.filter((card) => {
          return card.id !== "filler";
        });

        filteredCards.splice(action.dropTargetCardIndex, 0, { 
          id: "filler",
          title: "",
          description: ""
        });
        

        newList.cards = filteredCards;
        const newLists = state.lists.map((list, index) => {
          if(index === action.dropTargetListIndex) {
            return newList;
          }
          return list;
        });

        return { 
          ...state, 
          lists: newLists,
        };
      }

      if(newCards[action.dropTargetCardIndex].id !== "filler") {
        newCards[action.dropTargetCardIndex + 1] = newCards[action.dropTargetCardIndex];
      }
      
      newCards[action.dropTargetCardIndex] = { 
        id: "filler",
        title: "",
        description: "",
      };
      
      newList.cards = newCards;
      const newLists = state.lists.map((list, index) => {
        if(index === action.dropTargetListIndex) {
          return newList;
        }
        return list;
      });

      
      return { 
        ...state, 
        lists: newLists, 
      };
    }
    case DRAG_OVER_CARDS_DOWN: {
      const currList = state.lists[action.dropTargetListIndex];
      const newList = { ...currList };
      let newCards = [ ...currList.cards ];

      if(newCards[action.dropTargetCardIndex - 1].id !== "filler") {
        const filteredCards = newCards.filter((card) => {
          return card.id !== "filler";
        });
        
        filteredCards.splice(action.dropTargetCardIndex, 0, { 
          id: "filler",
          title: "",
          description: ""
        });
        
        newList.cards = filteredCards;
        const newLists = state.lists.map((list, index) => {
          if(index === action.dropTargetListIndex) {
            return newList;
          }
          return list;
        });

        return { 
          ...state, 
          lists: newLists,
        };
      }

      if(newCards[action.dropTargetCardIndex].id !== "filler") {
        newCards[action.dropTargetCardIndex - 1] = newCards[action.dropTargetCardIndex];
      }
      newCards[action.dropTargetCardIndex] = {
        id: "filler",
        title: "",
        description: "",
      };

      newList.cards = newCards;
      const newLists = state.lists.map((list, index) => {
        if(index === action.dropTargetListIndex) {
          return newList;
        }
        return list;
      });

      return { ...state, lists: newLists };
    }
    case "DRAG_OVER_CARDS_UP_DIFF_LIST": {
      const targetList = state.lists[action.dropTargetListIndex];
      const newList = { ...targetList };
      // const newCards = [ ...targetList.cards ];
      // console.log("DRAG_OVER_CARDS_UP_DIFF_LIST targetList:", targetList);

      let newCards;
      let removedFiller = false;
      if(state.fillerIndex !== null) {
        newCards = targetList.cards.filter((card, index) => {
          return card.id !== "filler"
        });
        removedFiller = true;
      } else {
        newCards = [ ...targetList.cards ];
      }

      // const newCards = [ ...targetList.cards ];
      // console.log("newCards:", newCards);
      let dropTargetCardIndex = action.dropTargetCardIndex;
      if(action.dropTargetCardIndex === newCards.length) {
        // console.log("action.dropTargetCardIndex === newCards.length, action.dropTargetCardIndex:", action.dropTargetCardIndex, " newCards.length:", newCards.length)
        dropTargetCardIndex = action.dropTargetCardIndex - 1;
      }

      // console.log("before adding filler dropTargetCardIndex:", dropTargetCardIndex)
      if(newCards[dropTargetCardIndex].id !== "filler") {
        console.log("dropTargetCard not filler, dropTargetCardIndex:", dropTargetCardIndex)
        newCards.splice(dropTargetCardIndex, 0, { id: "filler", title: "", description: "", });
      }

      newList.cards = newCards;
      const newLists = state.lists.map((list, index) => {
        if(index === action.dropTargetListIndex) {
          return newList;
        }
        return list;
      });

      if(removedFiller) {
        return { ...state, lists: newLists, fillerIndex: null }
      }

      return { ...state, lists: newLists, fillerIndex: dropTargetCardIndex };
    }
    case "DRAG_OVER_CARDS_DOWN_DIFF_LIST": {
      const targetList = state.lists[action.dropTargetListIndex];
      const newList = { ...targetList };
      
      // let newCards;
      // let removedFiller = false;
      // if(state.fillerIndex !== null) {
      //   newCards = targetList.cards.filter((card, index) => {
      //     console.log("DRAG_OVER_CARDS_DOWN_DIFF_LIST fillerIndex !== null");
      //     return index !== state.fillerIndex
      //   });
      //   removedFiller = true;
      //   // console.log("DRAG_OVER_CARDS_UP, fillerIndex true, newCards:", newCards);
      // } else {
      //   newCards = [ ...targetList.cards ];
      // }

      // console.log("DRAG_OVER_CARDS_DOWN_DIFF_LIST after filter, newCards:", newCards);
      // newCards.splice(action.dropTargetCardIndex + 1, 0, { id: "filler", title: "filler", description: "", });

      const newCards = [ ...targetList.cards ];
      if( (action.dropTargetCardIndex === newCards.length - 1) && (newCards[action.dropTargetCardIndex].id !== "filler") ) {
        newCards.splice(action.dropTargetCardIndex + 1, 0, { id: "filler", title: "", description: "", })
      } else if( (action.dropTargetCardIndex !== newCards.length - 1) ) {
        if(newCards[action.dropTargetCardIndex + 1].id !== "filler") {
          newCards.splice(action.dropTargetCardIndex + 1, 0, { id: "filler", title: "", description: "", });
        }
        
      }
      


      newList.cards = newCards;
      const newLists = state.lists.map((list, index) => {
        if(index === action.dropTargetListIndex) {
          return newList;
        }
        return list;
      });

      // if(removedFiller) {
      //   return { ...state, lists: newLists, fillerIndex: null }
      // }

      return { ...state, lists: newLists, fillerIndex: action.dropTargetCardIndex + 1 };
    }
    case "DRAGGED_START": {
      return { ...state, draggedCard: action.draggedCard }
    }
    case "DRAGGING_SET_FILLER": {
      const currList = state.lists[action.listIndex];
      const newList = { ...currList };
      const newCards = [ ...currList.cards ];
      newCards[action.cardIndex] = { id: "filler", title: "", description: "", };

      newList.cards = newCards;
      const newLists = state.lists.map((list, index) => {
        if(index === action.listIndex) {
          return newList;
        }
        return list;
      });

      return {
        ...state,
        lists: newLists,
        // draggedCard: { ...state.draggedCard, fillerIndex: action.fillerIndex }
      };
    }
    case "DROP_DRAGGED_CARD": {
      const currList = state.lists[action.moveToListIndex];
      const newList = { ...currList };
      const newCards = [ ...currList.cards ];
      // const cardFillerIndex = currList.cards.findIndex((card) => card.title === "filler");
      // newCards[cardFillerIndex] = state.draggedCard.card;
      newCards[action.cardIndex] = state.draggedCard.card;
      // newCards[action.moveToCardIndex] = state.draggedCard.card;

      newList.cards = newCards;
      const newLists = state.lists.map((list, index) => {
        if(index === action.moveToListIndex) {
          return newList;
        }
        return list;
      });

      return { ...state, lists: newLists };

    }
    case "DROP_DRAGGED_TO_FILLER": {
      const currList = state.lists[action.currListIndex];
      const newList = { ...currList };
      const newCards = [ ...currList.cards ];
      newCards[action.cardFillerIndex] = state.draggedCard.card;

      newList.cards = newCards;
      const newLists = state.lists.map((list, index) => {
        if(index === action.currListIndex) {
          return newList;
        }
        return list;
      })

      return { ...state, lists: newLists };
    }
    case "UPDATE_DRAGGED_LEAVE_INDEXES": {
      // if(state.draggedCard.enterListIndex !== action.leaveListIndex) {
      //   return { 
      //     ...state,
      //     draggedCard: { 
      //       ...state.draggedCard,
      //       leaveCardIndex: action.leaveCardIndex,
      //       // leaveListIndex: action.leaveListIndex
      //     },
          
      //   }
      // }
      
      return { 
        ...state,
        draggedCard: { 
          ...state.draggedCard,
          leaveCardIndex: action.leaveCardIndex,
          leaveListIndex: action.leaveListIndex
        },
        leftCurrList: true
      }
    }
    case "UPDATE_ENTER_LIST_INDEX": {
      return {
        ...state,
        draggedCard: { 
          ...state.draggedCard,
          enterListIndex: action.enterListIndex,
        },
        leftCurrList: false,
      }
    }
    
    case "ENTER_DIFF_LIST_REMOVE_FILLER": {
      
      const leaveList = state.lists[state.draggedCard.leaveListIndex];
      const newLeaveList = { ...leaveList };
      let newCards;
      
      newCards = leaveList.cards.filter((card) => {
        return card.id !== "filler";
      });
      
      newLeaveList.cards = newCards;
      const newLists = state.lists.map((list, index) => {
        if(index === state.draggedCard.leaveListIndex) {
          return newLeaveList;
        }
        return list;
      });
      
      return { ...state, lists: newLists, fillerIndex: null };
    }
    case "CREATE_FILLER_FOR_NO_CARDS": {
      const newList = { ...state.lists[action.dropTargetListIndex] };
      const newCards = [{ id: 'filler', title: '', description: '' }];
      newList.cards = newCards;

      const newLists = state.lists.map((list, index) => {
        if(index === action.dropTargetListIndex) {
          return newList;
        }
        return list;
      });

      return { ...state, lists: newLists };
    }
    case UPDATE_CARD: {
      const newList = { ...state.lists[action.listIndex] };
      const newCards = state.lists[action.listIndex].cards.map((card) => {
        if(card.id === action.cardId) {
          return action.updatedCard;
        }

        return card;
      });
      newList.cards = newCards;

      const newLists = state.lists.map((list, index) => {
        if(index === action.listIndex) {
          return newList;
        }

        return list;
      });

      return { ...state, lists: newLists };
    }
    // case SWAP_LIST_POSITIONS: {
    //   const listPositions = action.listPositions;
    //   const newLists = new Array(state.lists.length);
    //   state.lists.forEach((list) => {
    //     const index = listPositions.get(list.id);
    //     newLists[index] = list;
    //   });
    //   // console.log("listsReducer newLists:", newLists);
    //   return { ...state, lists: newLists, listPositions }
    // }
    
    default: {
      return state;
    }
  }
}