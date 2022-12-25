import React, { useEffect, useState } from 'react'
import {connect} from 'react-redux'
import { getWorkspaces, getBoardsMemberOf } from '../store/workspace';
import { Link } from 'react-router-dom';
import WorkspaceSideDrawer from './WorkspaceSideDrawer.js';
import WorkspaceNewBoard from './WorkspaceNewBoard';
import Navbar from './Navbar'

// Display user's workspace (boards, etc.)
const Workspace = props => {
  const { 
    user, workspaces,
    getWorkspaces, getBoardsMemberOf
  } = props

  useEffect(() => {
    (async() => {
      const response = await getWorkspaces(user.id);
      getBoardsMemberOf(user.id);
    })();
    
  }, [])
  
  if(workspaces.length === 0) {
    console.log('workspaces is empty, workspaces:', workspaces);
    return (
      <div>
        <h4>Loading...</h4>
      </div>
    );
  }

  console.log('Workspace, user:', user);


  return (
    <div className="workspace-layout-grid">
      <Navbar user={user} />
      <div className="navbar-filler"></div>
      <WorkspaceSideDrawer />
      <div className="workspaces-display-section |">
        <h3>YOUR WORKSPACES</h3>
        <div className="workspaces-display-wrapper">
          {
            workspaces.map((workspace) => {
              return (
                <div key={workspace.id} className="workspaces-display-container"> 
                  <div className="workspaces-display-header">
                    <h4>{workspace.title}</h4>
                  </div>
                  <div className="workspaces-display-boards">
                    {
                      workspace.boards.map((board) => {
                        return (
                          <div
                            key={board.id}
                            className="workspaces-display-board-item | br-025rem pdg-075rem"
                          >
                            <div className="workspaces-display-board-link-container">
                              <Link 
                                to={`/board/${board.id}`}
                                className="workspaces-display-board-link"
                              >
                                {board.title}
                              </Link>
                            </div>
                          </div>  
                        )
                      }).concat(
                        <WorkspaceNewBoard key={"createNewBoard"}
                          boardWorkspace={workspace}
                        />
                      )
                    }
                  </div>
                </div>
              )
            })
          }
        </div>
      </div>

           
    </div>
  )
}

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    user: state.auth.user,
    workspaces: state.workspaces.workspaces,
  }
}

const mapDispatch = (dispatch) => {
  return {
    getWorkspaces: (userId) => dispatch(getWorkspaces(userId)),
    getBoardsMemberOf: (userId) => dispatch(getBoardsMemberOf(userId)), 
  }
}

export default connect(mapState, mapDispatch)(Workspace)
