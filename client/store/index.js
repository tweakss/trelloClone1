import {createStore, combineReducers, applyMiddleware} from 'redux'
import {createLogger} from 'redux-logger'
import thunkMiddleware from 'redux-thunk'
import {composeWithDevTools} from 'redux-devtools-extension'
import authReducer from './auth'
import workspacesReducer from './workspace';
import boardReducer from './board';
import listsReducer from './lists';
import commentsReducer from './comments';

const reducer = combineReducers({
  auth: authReducer,
  workspaces: workspacesReducer, 
  board: boardReducer,
  lists: listsReducer,
  comments: commentsReducer,
})
const middleware = composeWithDevTools(
  applyMiddleware(thunkMiddleware, createLogger({collapsed: true}))
)
const store = createStore(reducer, middleware)

export default store
export * from './auth'
