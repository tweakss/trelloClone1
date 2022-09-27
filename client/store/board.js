import axios from 'axios'


// Functions used for below
// const sortListsAndCards = (board, listPositions) => {
//   console.log("At sortListsAndCards, listPositions:", listPositions);
//   const sortedLists = board.lists.sort((list1, list2) => {
//     return list1.id - list2.id;
//   });
  
//   sortedLists.forEach((list) => {
//     list.cards.sort((card1, card2) => {
//       return card1.id - card2.id;
//     })
//   });
//   // console.log("after regular sort, sortedLists:", sortedLists);

//   if(listPositions) {
//     const currListPositionIndex = listPositions.currListPosition - 1;
//     const moveToIndex = parseInt(listPositions.moveTo, 10) - 1;
//     console.log("listPositions currListPositionIndex:", currListPositionIndex, " moveToIndex:", moveToIndex);
//     const temp = sortedLists[currListPositionIndex];
//     sortedLists[currListPositionIndex] = sortedLists[moveToIndex];
//     // console.log("after first swap sortedLists:", sortedLists);
//     sortedLists[moveToIndex] = temp;
//   }
//   console.log("sortListsAndCards sortedLists:", sortedLists);
// }

/**
 * ACTION TYPES
 */
const GET_BOARD = 'GET_BOARD';
const GET_BOARD_MEMBERS = "GET_BOARD_MEMBERS";
const ADD_BOARD_MEMBER = "ADD_BOARD_MEMBER";
const GET_USER_TO_INVITE = "GET_USER_TO_INVITE";
const SET_ERROR_MSG = "SET_ERROR_MSG";

/**
 * ACTION CREATORS
 */
const _getBoard = (board, listPositions) => {
  return {
    type: GET_BOARD,
    board,
    listPositions
  }
};

const _getBoardMembers = (members) => {
  return {
    type: GET_BOARD_MEMBERS,
    members
  }
}

const _getUsersToInvite = (users) => {
  return {
    type: GET_USER_TO_INVITE,
    users
  }
}

const _setErrorMsg = (errorMsg) => {
  return {
    type: SET_ERROR_MSG,
    errorMsg
  }
}



/**
 * THUNK CREATORS
 */
export const getBoard = (boardId) => {
  return async (dispatch) => {
    const { data: board } = await axios.get(`/api/boards/${boardId}`);
    // console.log('getBoard thunk, board:', board);
    dispatch(_getBoard(board));
  }
}

export const getBoardMembers = (boardId) => {
  return async (dispatch) => {
    const { data: members } = await axios.get(`/api/boards/${boardId}/members`);
    // console.log("getBoardMembers thunk, members:", members);
    dispatch(_getBoardMembers(members));
  }
}

export const addBoardMember = (boardId, emailAddr) => {
  return async (dispatch) => {
    const username = emailAddr.split("@")[0];
    console.log("addBoardMembers thunk, username:", username, " boardId:", boardId);
    // const response = await axios.put(`/api/boards/${boardId}/addMember/${username}`);
    const { data: response } = await axios.put(`/api/boards/${boardId}/addMember/${emailAddr}`);
    console.log("addBoardMember thunk, response:", response);

    if(typeof response === "string") {
      dispatch(_setErrorMsg(response));
    } else {
      const { data: members } = await axios.get(`/api/boards/${boardId}/members`);
      dispatch(_getBoardMembers(members));
    }
    
  }
}

export const removeBoardMember = (boardId, username) => {
  return async(dispatch) => {
    const response = await axios.delete(`/api/boards/${boardId}/removeMember/${username}`);
    console.log("removeBoardMember thunk, response", response);

    const { data: members } = await axios.get(`/api/boards/${boardId}/members`);
    dispatch(_getBoardMembers(members));
  }
  
}

export const getUsersToInvite = (usernameOrEmail) => {
  return async (dispatch, getState) => {
    const { data: users } = await axios.get(`/api/users/getUserBy/${usernameOrEmail}`);
    // console.log("getUserToInvite thunk, users:", users);
    
    dispatch(_getUsersToInvite(users));
  }
}



const initialState = {
  board: {},
  members: [],
  guests: [],
  toInvite: [],
  errorMsg: null
};

export default function boardReducer(state = initialState, action) {
  switch(action.type) {
    case GET_BOARD: {
      // if(action.listPositions) {

      // } else {

      // }
      return { ...state, board: action.board };
    }
    case GET_BOARD_MEMBERS: {
      return { ...state, members: action.members };
    }
    case GET_USER_TO_INVITE: {
      return { ...state, toInvite: action.users };
    }
    case SET_ERROR_MSG: {
      return { ...state, errorMsg: action.errorMsg };
    }
    default: {
      return state;
    }
  }
}
