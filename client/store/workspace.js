import axios from 'axios'

/**
 * ACTION TYPES
 */
const GET_WORKSPACES = 'GET_WORKSPACES';
const GET_BOARDS_MEMBER_OF = 'GET_BOARDS_MEMBER_OF';
const ADD_WORKSPACE = 'ADD_WORKSPACE';
const ADD_BOARD = 'ADD_BOARD';
const DELETE_BOARD = 'DELETE_BOARD';


/**
 * ACTION CREATORS
 */
const _getWorkspaces = (workspaces) => {
  return {
    type: GET_WORKSPACES,
    workspaces
  }
};

const _getBoardsMemberOf = (workspaces) => {
  return {
    type: GET_BOARDS_MEMBER_OF,
    workspaces
  }
}

const _addWorkspace = (newWorkspace) => {
  return {
    type: ADD_WORKSPACE,
    newWorkspace
  }
}

const _createNewBoard = (updatedWorkspace) => {
  return {
    type: ADD_BOARD,
    updatedWorkspace
  }
}

const _deleteBoard = (currWorkspaceIndex, boardId) => {
  return {
    type: DELETE_BOARD,
    currWorkspaceIndex,
    boardId
  }
}


/**
 * THUNK CREATORS
 */
export const getWorkspaces = (userId) => {
  return async (dispatch) => {
    const response = await axios.get(`/api/users/userId/${userId}/workspaces`);
    const workspaces = response.data;
    console.log("getWorkpsace thunk, workspaces:", workspaces);

    return dispatch(_getWorkspaces(workspaces));
  }
}

export const getBoardsMemberOf = (userId) => {
  return async(dispatch) => {
    const { data: workspaces } = await axios({
      method: 'get',
      url: `/api/workspaces/user/${userId}/boards/memberOf`,
    });
    console.log("getBoardMembersOf thunk, workspaces:", workspaces);

    dispatch(_getBoardsMemberOf(workspaces));
  }
}

export const addWorkspace = (userId, workspaceName) => {
  return async (dispatch) => {
    const { data: newWorkspace } = await axios({
      method: 'post',
      url: `/api/workspaces/newWorkspace/user/${userId}`,
      data: {
        title: workspaceName,
        owner: userId
      }
    });
    console.log("addWorkspace thunk, newWorkspace:", newWorkspace);

    dispatch(_addWorkspace(newWorkspace));
  }
}

export const createNewBoard = (userId, workspaceId, boardTitle) => {
  console.log("createNewBoard thunk userId, workspaceId, boardTitle:", userId, workspaceId, boardTitle);
  return async (dispatch) => {
    const { data: updatedWorkspace } = await axios.post(`/api/boards/newBoard/user/${userId}/workspace/${workspaceId}`, {
      title: boardTitle
    });
    console.log('createNewBoard, updatedWorkspace:', updatedWorkspace);

    dispatch(_createNewBoard(updatedWorkspace));
    // const { data: response } = await axios.get(`/api/users/userId/${userId}/workspaces`);
    // const workspaces = response;

    // dispatch(_getWorkspaces(workspaces)); // need to change this?
  }
}

export const deleteABoard = (currWorkspaceIndex, boardId) => {
  return async(dispatch) => {
    const { data: response } = await axios({
      method: 'delete',
      url: `/api/boards/board/${boardId}`
    });
    // console.log("deleteABoard thunk, response:", response);

    dispatch(_deleteBoard(currWorkspaceIndex, boardId));
  }
}


const initialState = {
  workspaces: [],
  submittedNewBoard: 0,
};

// const initialState = [];

export default function workspacesReducer(state = initialState, action) {
  switch (action.type) {
    case GET_WORKSPACES: {
      return { ...state, workspaces: action.workspaces };
      // return action.workspaces;
    }
    case ADD_WORKSPACE: {
      return { ...state, workspaces: [ ...state.workspaces, action.newWorkspace ] }
    }
    case "SUBMIT_NEW_BOARD_REDIRECT": {
      return { ...state, submittedNewBoard: action.boardWorkspaceId }
    }
    case ADD_BOARD: {
      const updatedWorkspaceId = action.updatedWorkspace.id;
      const newWorkspaces = [ ...state.workspaces ];
      const workspaceIdx = newWorkspaces.findIndex((workspace) => workspace.id === updatedWorkspaceId);
      newWorkspaces.splice(workspaceIdx, 1, action.updatedWorkspace);

      return { ...state, workspaces: newWorkspaces };
    }
    case DELETE_BOARD: {
      const currWorkspace = state.workspaces[action.currWorkspaceIndex]
      const newCurrWorkspace = { ...currWorkspace };
      const newBoards = [ ...newCurrWorkspace.boards ];
      const deletedBoardIndex = newBoards.findIndex((board) => board.id === action.boardId)
      newBoards.splice(deletedBoardIndex, 1);
      newCurrWorkspace.boards = newBoards;

      const newWorkspaces = [ ...state.workspaces ];
      newWorkspaces.splice(action.currWorkspaceIndex, 1, newCurrWorkspace);
      return { ...state, workspaces: newWorkspaces };
      
    }
    case GET_BOARDS_MEMBER_OF: {
      return { ...state, workspaces: [ ...state.workspaces, ...action.workspaces ]}
    }
    default: {
      return state;
    }
  }
}
