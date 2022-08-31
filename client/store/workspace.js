import axios from 'axios'

/**
 * ACTION TYPES
 */
const GET_WORKSPACES = 'GET_WORKSPACES';


/**
 * ACTION CREATORS
 */
const _getWorkspaces = (workspaces) => {
  return {
    type: GET_WORKSPACES,
    workspaces
  }
};


/**
 * THUNK CREATORS
 */
export const getWorkspaces = (userId) => {
  return async (dispatch) => {
    const response = await axios.get(`/api/users/${userId}/workspaces`);
    const workspaces = response.data;
    // console.log("getWorkpsace thunk, workspaces:", workspaces);

    dispatch(_getWorkspaces(workspaces));
  }
}

export const createNewBoard = (userId, workspaceId, boardTitle) => {
  return async (dispatch) => {
    const updatedWorkspace = await axios.post(`/api/boards/newBoard/${userId}/${workspaceId}`, {
      title: boardTitle
    });
    console.log('createNewBoard, updatedWorkspace:', updatedWorkspace);
    
    const response = await axios.get(`/api/users/${userId}/workspace`);
    const workspace = response.data[0];

    dispatch(_getWorkspace(workspace));
  }
}


const initialState = [];

export default function workspacesReducer(state = initialState, action) {
  switch (action.type) {
    case GET_WORKSPACES: {
      return action.workspaces;
    }
    default: {
      return state;
    }
  }
}
