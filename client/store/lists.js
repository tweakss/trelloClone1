import axios from 'axios';


const GET_LISTS = "GET_LISTS";
const SWAP_LIST_POSITIONS = "SWAP_LIST_POSITIONS";
const DRAG_OVER_CARDS_UP = "DRAG_OVER_CARDS_UP";
const DRAG_OVER_CARDS_DOWN = "DRAG_OVER_CARDS_DOWN";
const DROP_DRAGGED_CARD = "DROP_DRAGGED_CARD";

// const CREATE_NEW_LIST = "CREATE_NEW_LIST";
// const DELETE_LIST = "DELETE_LIST";
// const CREATE_CARD_AND_ADD_TO_LIST = "CREATE_CARD_AND_ADD_TO_LIST";
// const MOVE_CARD_TO_LIST = "MOVE_CARD_TO_LIST";
// const UPDATE_CARD_DESCRIPTION = "UPDATE_CARD_DESCRIPTION";
// const REMOVE_A_CARD = "REMOVE_A_CARD";

const _getLists = (lists) => {
  return {
    type: GET_LISTS,
    lists
  }
}

export const _swapListPositions = (listPositions) => {
  console.log("_swapListPositions");
  return {
    type: SWAP_LIST_POSITIONS,
    listPositions
  }
}

const _dropDraggedCard = (moveToListIndex, cardIndex) => {
  return {
    type: DROP_DRAGGED_CARD,
    moveToListIndex,
    cardIndex,
    // moveToCardIndex
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


// const _createNewList = (lists) => {
//   return {
//     type: CREATE_NEW_LIST,
//     lists
//   }
// }

// const _deleteList = (lists) => {
//   return {
//     type: DELETE_LIST,
//     lists
//   }
  
// }

// const _createCardAndAddToList = (lists) => {
//   return {
//     type: CREATE_CARD_AND_ADD_TO_LIST,
//     lists
//   }
// }

// const _moveCardToList = (lists) => {
//   return {
//     type: MOVE_CARD_TO_LIST,
//     lists
//   }
// }

// const _updateCardDescription = (lists) => {
//   return {
//     type: UPDATE_CARD_DESCRIPTION,
//     lists
//   }
// }

// const _removeACard = (lists) => {
//   return {
//     type: REMOVE_A_CARD,
//     lists
//   }
// }


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

export const moveCardToList = (moveCardsInfo) => {
  return async(dispatch) => {
    const { moveToListId, draggedCardId, boardId } = moveCardsInfo;
    console.log("moveCardToList, moveToListId:", moveToListId, " draggedCardId:", draggedCardId, " boardId:", boardId);
    const response = await axios.put(`/api/lists/${moveToListId}/moveCard/${draggedCardId}`, {
      moveCardsInfo
    });
    // console.log("moveCardToList, response:", response);

    const { data: lists } = await axios.get(`/api/lists/boardId/${boardId}`);
    // sortListsAndCards(updatedBoard);
    // console.log('moveCardToList, updatedBoard:', updatedBoard);
    dispatch(_getLists(lists));
  }
}

export const updateCardDescription = (card, cardDescription, board) => {
  return async (dispatch) => {
    const cardId = card.id;
    // console.log('updateCardDescription, cardId, cardDescription:', cardId, cardDescription);
    const cardUpdated = await axios.put(`/api/cards/${cardId}/description`, {description: cardDescription});
    // console.log('cardUpdated:', cardUpdated);

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

const inititalState = {
  lists: [],
  draggedCard: {},
  // enterListIndex: null
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
      if(newCards[action.dropTargetCardIndex].id !== "filler") {
        newCards[action.dropTargetCardIndex + 1] = newCards[action.dropTargetCardIndex];
      }
      
      newCards[action.dropTargetCardIndex] = { 
        id: "filler",
        title: "filler",
        // listId: newList.id,
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
        // draggedCard: { ...state.draggedCard, cardIndex: action.dropTargetCardIndex } 
      };
    }
    case DRAG_OVER_CARDS_DOWN: {
      const currList = state.lists[action.dropTargetListIndex];
      // const dropTarget = currList[action.dropTargetCardIndex]; // needed?
      const newList = { ...currList };
      const newCards = [ ...currList.cards ];
      if(newCards[action.dropTargetCardIndex].id !== "filler") {
        newCards[action.dropTargetCardIndex - 1] = newCards[action.dropTargetCardIndex];
      }
      newCards[action.dropTargetCardIndex] = {
        id: "filler",
        title: "filler",
        // listId: newList.id,
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
      // console.log("DRAG_OVER_CARDS_UP_DIFF_LIST currList.cards:", currList.cards);
      let newCards;
      if(state.fillerToRemove ) {
        newCards = targetList.cards.filter((card, index) => {
          // console.log("DRAG_OVER_CARDS_UP a new card:", card);
          return index !== state.fillerToRemove
        });
        // console.log("DRAG_OVER_CARDS_UP, fillerToRemove true, newCards:", newCards);
      } else {
        newCards = [ ...targetList.cards ];
      }
      if(newCards[action.dropTargetCardIndex].id !== "filler") {
        newCards.splice(action.dropTargetCardIndex, 0, { id: "filler", title: "filler" });
      }

      newList.cards = newCards;
      const newLists = state.lists.map((list, index) => {
        if(index === action.dropTargetListIndex) {
          return newList;
        }
        return list;
      });

      if(state.fillerToRemove) {
        return { ...state, lists: newLists, fillerToRemove: null }
      }
      return { ...state, lists: newLists };
    }
    case "DRAG_OVER_CARDS_DOWN_DIFF_LIST": {
      const targetList = state.lists[action.dropTargetListIndex];
      const newList = { ...targetList };
      const newCards = [ ...targetList.cards ];
      if( (action.dropTargetCardIndex === newCards.length - 1) && (newCards[action.dropTargetCardIndex].id !== "filler") ) {
        newCards.splice(action.dropTargetCardIndex + 1, 0, { id: "filler", title: "filler" })
      } else if( (action.dropTargetCardIndex !== newCards.length - 1) ) {
        if(newCards[action.dropTargetCardIndex + 1].id !== "filler") {
          newCards.splice(action.dropTargetCardIndex + 1, 0, { id: "filler", title: "filler" });
        }
        
      }

      newList.cards = newCards;
      const newLists = state.lists.map((list, index) => {
        if(index === action.dropTargetListIndex) {
          return newList;
        }
        return list;
      });

      return { ...state, lists: newLists, fillerToRemove: action.dropTargetCardIndex + 1 };
    }
    case "DRAGGED_START": {
      // const currList = state.lists[action.draggedListIndex];
      // const newList = { ...currList };
      // const newCards = [ ...currList.cards ];
      // newCards[action.draggedCardIndex] = { id: "filler", title: "filler" };

      // newList.cards = newCards;
      // const newLists = state.lists.map((list, index) => {
      //   if(index === action.draggedListIndex) {
      //     return newList;
      //   }
      //   return list;
      // });

      return { ...state, draggedCard: action.draggedCard }
    }
    case "DRAGGING_SET_FILLER": {
      const currList = state.lists[action.listIndex];
      const newList = { ...currList };
      const newCards = [ ...currList.cards ];
      newCards[action.cardIndex] = { id: "filler", title: "filler" };

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
      return { 
        ...state,
        draggedCard: { 
          ...state.draggedCard,
          leaveCardIndex: action.leaveCardIndex,
          leaveListIndex: action.leaveListIndex
        }
      }
    }
    case "UPDATE_ENTER_LIST_INDEX": {
      return {
        ...state,
        draggedCard: { 
          ...state.draggedCard,
          enterListIndex: action.enterListIndex,
        }
      }
    }
    case "ENTER_DIFF_LIST_REMOVE_FILLER": {
      // const origList = state.lists[state.draggedCard.origListIndex];
      // const newList = { ...origList };
      // const newCards = origList.cards.filter((card) => {
      //   return card.id !== state.draggedCard.card.id;
      // })
      // console.log("ENTER_DIFF_LIST_REMOVE_FILLER reducer", "\nleaveListIndex:", state.draggedCard.leaveListIndex )
      const leaveList = state.lists[state.draggedCard.leaveListIndex];
      const newList = { ...leaveList };
      let newCards;
      // if(state.draggedCard.leaveListIndex === state.draggedCard.origListIndex) {
      //   newCards = leaveList.cards.filter((card) => {
      //     return card.id !== state.draggedCard.card.id;
      //   });
      // } else {
      //   newCards = leaveList.cards.filter((card) => {
      //     return card.id !== "filler";
      //   });
      // }
      newCards = leaveList.cards.filter((card) => {
        return card.id !== "filler";
      });
      
      newList.cards = newCards;
      const newLists = state.lists.map((list, index) => {
        if(index === state.draggedCard.leaveListIndex) {
          return newList;
        }
        return list;
      });
      
      return { ...state, lists: newLists };
    }
    case "CREATE_FILLER_FOR_NO_CARDS": {
      const newList = { ...state.lists[action.dropTargetListIndex] };
      const newCards = [{ id: 'filler', title: 'filler' }];
      newList.cards = newCards;

      const newLists = state.lists.map((list, index) => {
        if(index === action.dropTargetListIndex) {
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
    // case CREATE_NEW_LIST: {
    //   return { ...state, lists: action.lists }
    // }
    // case DELETE_LIST: {
    //   return { ...state, lists: action.lists }
    // }
    // case CREATE_CARD_AND_ADD_TO_LIST: {
    //   return { ...state, lists: action.lists }
    // }
    // case MOVE_CARD_TO_LIST: {
    //   return { ...state, lists: action.lists }
    // }
    // case UPDATE_CARD_DESCRIPTION: {
    //   return { ...state, lists: action.lists }
    // }
    // case REMOVE_A_CARD: {
    //   return { ...state, lists: action.lists }
    // } 
    default: {
      return state;
    }
  }
}