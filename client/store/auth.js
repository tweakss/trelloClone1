import axios from 'axios'
import history from '../history'

const TOKEN = 'token'

/**
 * ACTION TYPES
 */
const SET_AUTH = 'SET_AUTH';
const VALIDATE_USERNAME = 'VALIDATE_USERNAME';

/**
 * ACTION CREATORS
 */
const setAuth = auth => ({type: SET_AUTH, auth})

const _validateUsername = (user) => {
  return {
    type: VALIDATE_USERNAME,
    user
  }
}

/**
 * THUNK CREATORS
 */
export const me = () => async dispatch => {
  const token = window.localStorage.getItem(TOKEN)
  if (token) {
    const res = await axios.get('/auth/me', {
      headers: {
        authorization: token
      }
    })
    
    const user = res.data;
    return dispatch(setAuth({user}))
  }
}

export const authenticate = (username, password, email, method) => async dispatch => {
  try {
    const res = await axios.post(`/auth/${method}`, {username, password, email})
    window.localStorage.setItem(TOKEN, res.data.token)
    dispatch(me());
  } catch (authError) {
    // console.log("authenticate thunk, authError:", authError.response)
    return dispatch(setAuth({error: authError}))
  }
}

export const logout = () => {
  window.localStorage.removeItem(TOKEN)
  history.push('/login')
  return {
    type: SET_AUTH,
    auth: {}
  }
}

export const validateUsername = (username) => {
  return async(dispatch) => {
    try {
      const { data: user } = await axios({
        method: 'get',
        url: `/auth/username/${username}/validate`
      });
      // console.log("validateUsername, response:", user);
      dispatch(_validateUsername(user));
      return user;
    } catch(err) {
      // console.log("validateUsername, err:", err, " err.response:", err.response);
      dispatch(setAuth({
        error: err,
      }))
    }
    

    
  }
}

/**
 * REDUCER
 */
export default function(state = {}, action) {
  switch (action.type) {
    case SET_AUTH:
      if(action.auth.error) {
        return { ...state, error: action.auth.error }
      } else if(action.auth.user) {
        return { user: action.auth.user }
      }
    case VALIDATE_USERNAME: {
      return { userExists: action.user }
    }
    case "CLEAR_AUTH_STATE": {
      return {};
    }
    default:
      return state
  }
}
