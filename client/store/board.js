import axios from 'axios'


/**
 * ACTION TYPES
 */
const GET_BOARD = 'GET_BOARD';
const GET_BOARD_MEMBERS = "GET_BOARD_MEMBERS";
const ADD_BOARD_MEMBER = "ADD_BOARD_MEMBER";
const ADD_BOARD = "ADD_BOARD";
const DELETE_A_BOARD = 'DELETE_A_BOARD';
const GET_USER_TO_INVITE = "GET_USER_TO_INVITE";
const SET_ERROR_MSG = "SET_ERROR_MSG";
const GET_BOARD_WORKSPACE = "GET_BOARD_WORKSPACE";

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

const _getBoardWorkspace = (workspace) => {
  return {
    type: GET_BOARD_WORKSPACE,
    workspace
  }
}

const _createNewBoard = (updatedWorkspace) => {
  return {
    type: ADD_BOARD,
    updatedWorkspace
  }
}

const _deleteABoard = (currWorkspaceIndex, boardId) => {
  return {
    type: DELETE_A_BOARD,
    currWorkspaceIndex, // don't need this?
    boardId
  }
}


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
    // console.log("addBoardMembers thunk, username:", username, " boardId:", boardId);
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

export const getBoardWorkspace = (workspaceId, userId) => {
  return async(dispatch) => {
    const { data: workspace } = await axios({
      method: 'get',
      url: `/api/boards/workspace/${workspaceId}/user/${userId}`
    });
    // console.log("getBoardWorkspace thunk, response:", workspace);

    dispatch(_getBoardWorkspace(workspace));
  }
}

export const createNewBoard = (userId, workspaceId, boardTitle) => {
  // console.log("createNewBoard thunk userId, workspaceId, boardTitle:", userId, workspaceId, boardTitle);
  return async (dispatch) => {
    const { data: updatedWorkspace } = await axios.post(`/api/boards/newBoard/user/${userId}/workspace/${workspaceId}`, {
      title: boardTitle
    });
    // console.log('createNewBoard, updatedWorkspace:', updatedWorkspace);

    dispatch(_createNewBoard(updatedWorkspace))
    return updatedWorkspace;
  }
}

export const deleteABoard = (currWorkspaceIndex, boardId) => {
  return async(dispatch) => {
    const { data: response } = await axios({
      method: 'delete',
      url: `/api/boards/board/${boardId}`
    });
    // console.log("deleteABoard thunk, response:", response);

    dispatch(_deleteABoard(currWorkspaceIndex, boardId));
  }
}


const initialState = {
  board: {},
  members: [],
  guests: [],
  toInvite: [],
  errorMsg: null,
  workspace: {}
};

export default function boardReducer(state = initialState, action) {
  switch(action.type) {
    case GET_BOARD: {
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
    case GET_BOARD_WORKSPACE: {
      return { ...state, workspace: action.workspace };
    }
    case ADD_BOARD: {
      return { ...state, workspace: action.updatedWorkspace };
    }
    case DELETE_A_BOARD: {
      const currWorkspace = state.workspace;
      const newCurrWorkspace = { ...currWorkspace };
      const newBoards = [ ...newCurrWorkspace.boards ];
      const deletedBoardIndex = newBoards.findIndex((board) => board.id === action.boardId)
      newBoards.splice(deletedBoardIndex, 1);
      newCurrWorkspace.boards = newBoards;

      return { ...state, workspace: newCurrWorkspace };
      
    }
    default: {
      return state;
    }
  }
}
