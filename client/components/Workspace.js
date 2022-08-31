import React, { useEffect } from 'react'
import {connect} from 'react-redux'
import { getWorkspaces } from '../store/workspace';
import { Link } from 'react-router-dom';
import { WorkspaceSideDrawer } from './WorkspaceSideDrawer.js';
import Navbar from './Navbar'

// import Navbar from './Navbar';

/*
Workspace:
navbar-side content content
navbar-side content content
*/
// Display user's workspace (boards, etc.)
const Workspace = props => {
  const { user, getWorkspaces, workspaces } = props
  // const boards = workspace.boards;
  // console.log('Workspace, props:', props);

  useEffect(() => {
    getWorkspaces(user.id);
  }, [])

  // const displayWorkspace = (userId) => {
  //   const workspace = getWorkspace(userId);
  //   console.log('displayWorkspace, workspace:', workspace);
  // } 

  // console.log('Workspace, workspace:', workspace);

  if(workspaces.length === 0) {
    console.log('workspaces is empty, workspaces:', workspaces);
    return (
      <div>
        <h4>Loading...</h4>
      </div>
    );
  }

  console.log('Workspace, workspaces:', workspaces);


  return (
    <div className="workspace-layout">
      <Navbar user={user} />
      <WorkspaceSideDrawer />
      <div className="grid-board-links">
        <h4> Boards </h4>
        {
          workspaces[0].boards.map((board) => {
            return (
              <div className="board-link" key={board.id}>
                <Link to={`/board/${board.id}`}>{board.title}</Link>
              </div>
            )
          })
        }
      </div>
      
          
           
    </div>
  )
}

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    user: state.auth,
    workspaces: state.workspaces
  }
}

const mapDispatch = (dispatch) => {
  return {
    getWorkspaces: (userId) => dispatch(getWorkspaces(userId)),
  }
}

export default connect(mapState, mapDispatch)(Workspace)
