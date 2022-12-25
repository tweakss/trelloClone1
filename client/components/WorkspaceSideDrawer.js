import React, { useState, useEffect } from 'react'
import { addWorkspace } from '../store/workspace';
import {connect} from 'react-redux'


const WorkspaceSideDrawer = (props) => {
  const {
    user, addWorkspace,
  } = props;

  const [addWorkspacePrompt, setAddWorkspacePrompt] = useState(false);

  const [workspaceName, setWorkspaceName] = useState("");
  const handleWorkspaceName = (event) => {
    setWorkspaceName(event.target.value);
  }

  const submitWorkspaceDetails = (event) => {
    event.preventDefault();
    addWorkspace(user.id, workspaceName);
    setAddWorkspacePrompt(false); 
  }

  // console.log("WorkspaceSideDrawer");

  return (
    <div className="workspace-side-drawer">
      <div className="workspace-side-drawer-title">
        <span>Workspaces</span>
        <button
          className="add-workspace-btn | bdr-none bg-clr-transparent "
          onClick={() => setAddWorkspacePrompt(true)}
        >
          +
        </button>
      </div>

      <div className="workspace-side-drawer-contents">

      </div>

      {
        addWorkspacePrompt ? 
        <div className="add-workspace-backdrop">
          <div className="add-workspace-modal | ">
            <button
              className="add-workspace-modal-close-btn | bdr-none bg-clr-transparent pdg-8x12px"
              onClick={() => setAddWorkspacePrompt(false)}
            >
              &times;
            </button>
            <div className="add-workspace-form-section">
              <h3
                className="add-workspace-form-h3"
              >
                Let's build a Workspace
              </h3>
              <form
                onSubmit={submitWorkspaceDetails}
              >
                <label 
                  htmlFor="add-workspace-input"
                  className="add-workspace-input-label"
                >
                  Workspace name
                </label>
                <input
                  id="add-workspace-input"
                  type="text"
                  value={workspaceName}
                  onChange={handleWorkspaceName}
                >

                </input>
                {
                  workspaceName.length > 0 ?
                  <div>
                    <button
                      className="add-workspace-submit-btn | bdr-none br-025rem"
                      type="submit"
                    >
                      Continue
                    </button>
                  </div> :
                  <div>
                    <button
                      className="add-workspace-submit-btn-disabled | bdr-none br-025rem"
                      type="submit"
                      disabled
                    >
                      Continue
                    </button>
                  </div>
                }
                

              </form>
            </div>

            <div className="add-workspace-right-half">
              
            </div>
          </div>
        </div> : null
      }
      

    </div>
  );
}

const mapState = (state) => {
  return {
    user: state.auth.user,
  }
}

const mapDispatch = (dispatch) => {
  return {
    addWorkspace: (userId, workspaceName) => dispatch(addWorkspace(userId, workspaceName)),
  }
}

export default connect(mapState, mapDispatch)(WorkspaceSideDrawer);