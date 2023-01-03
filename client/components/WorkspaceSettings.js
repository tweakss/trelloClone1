import React, { useEffect, useState } from 'react';
import {connect, useDispatch} from 'react-redux';
import axios from 'axios';
import { deleteWorkspace } from '../store/workspace';
import Navbar from './Navbar';
import WorkspaceSettingsSideDrawer from './WorkspaceSettingsSideDrawer';

const WorkspaceSettings = (props) => {
  const {
    deleteWorkspace,
    user,
  } = props;
  const currWorkspaceId = props.match.params.workspaceId;
  const match = props.match;

  const [currWorkspace, setCurrWorkspace] = useState({});
  useEffect(() => {
    ( async() => {
      const { data: workspace } = await axios({
        method: 'get',
        url: `/api/workspaces/workspace/${currWorkspaceId}`
      })
      setCurrWorkspace(workspace);
    })();

  }, []);

  const [deleteWkspcePrompt, setDeleteWkspcePrompt] = useState(false);
  const handleDeleteWkspcePrompt = () => {
    setDeleteWkspcePrompt((prev) => !prev);
  }

  const [wkspceName, setWkspceName] = useState("");
  const handleWkspceName = (event) => {
    setWkspceName(event.target.value);
  }

  const handleCloseDeleteWkspcePrompt = () => {
    setDeleteWkspcePrompt(false);
    setWkspceName("");
  }
  

  const submitDeleteWorkspace = async(event) => {
    event.preventDefault();
    const response = await deleteWorkspace(currWorkspace.id);
    console.log("submitDeleteWorkspace response:", response);

    window.location.assign(`/workspaces`);

    // handleCloseDeleteWkspcePrompt();
  }


  console.log("WorkspaceSettings, currWorkspace:", currWorkspace, " props.match:", props.match);

  return (
    <div className="workspace-settings-layout-grid">
      <Navbar user={user} />
      <WorkspaceSettingsSideDrawer currWorkspace={currWorkspace}
        match={match}
      />
      <div className="workspace-settings-wrapper">
        <div className="workspace-settings-header-wrapper">
          <h2 className="workspace-settings-header">
            {`${currWorkspace.title}`}
          </h2>
          
        </div>
        <hr className="workspace-settings-header-btm-hr"/>
      
        <div className="workspace-settings-container">
          <div className="workspace-settings">
            <div>
              <h4 className="workspace-settings-title">
                Settings
              </h4>
            </div>
            

            <div className="workspace-settings-del-wkspce-wrapper">
              {
                user.id === currWorkspace.owner ?
                <button
                  className="workspace-settings-del-wkspce-btn | bdr-none bg-clr-transparent"
                  onClick={handleDeleteWkspcePrompt}
                >
                  Delete this Workspace?
                </button> :
                <div>
                  <span>Cannot delete this workspace, you are not the owner.</span>
                </div>
              }
              
              {
                deleteWkspcePrompt ?
                <div className="workspace-settings-del-wkspce-modal-wrapper | br-025rem pdg-075rem">
                  <div className={`workspace-settings-del-wkspce-title`}>
                    <span
                      className={`workspace-settings-del-wkspce-title-txt | menu-title-clr`}
                    >
                      Delete Workspace?
                    </span>
                    <button
                      className={`workspaces-settings-del-wkspce-close-btn | bdr-none bg-clr-transparent`}
                      onClick={handleCloseDeleteWkspcePrompt}
                    >
                      &times;
                    </button>
                  </div>

                  <div className={`workspace-settings-del-wkspce-input-wrapper`}>
                    <h3 className="workspace-settings-del-wkspce-h3">
                      {`Enter the Workspace name "${currWorkspace.title}" to delete`}
                    </h3>
                    <p className="fnt-sz-14px">
                      Things to know:
                    </p>
                    <ul className="workspace-settings-del-wkspce-ul">
                      <li>This is permanent and can't be undone.</li>
                      <li>All boards in this Workspace will be gone.</li>
                    </ul>
                    <form
                      onSubmit={submitDeleteWorkspace}
                    >
                      <label htmlFor="wkspce-title-input"
                        className="workspace-settings-del-wkspce-input-label"
                      >
                        Enter the Workspace name to delete
                      </label>
                      <input
                        id="wkspce-title-input"
                        className="workspace-settings-del-wkspce-input | br-025rem"
                        type="text"
                        value={wkspceName}
                        onChange={handleWkspceName}
                      >
                      </input>

                      {
                        wkspceName === currWorkspace.title ?
                        <button
                          type="submit"
                          className="workspace-settings-del-wkspce-submit-btn | bdr-none br-025rem"
                        >
                          Delete Workspace
                        </button> :
                        <button
                          disabled
                          className="workspace-settings-del-wkspce-submit-btn-disabled | bdr-none br-025rem"
                        >
                          Delete Workspace
                        </button>
                      }
                      
                    </form>
                  </div>
                </div> : null
              }
              
              
              
            </div>
          </div>
          
        </div>

        
        
        
      </div>
    </div>
  )
}

const mapState = (state) => {
  return {
    user: state.auth.user,
  }
}

const mapDispatch = (dispatch) => {
  return {
    deleteWorkspace: (workspaceId) => dispatch(deleteWorkspace(workspaceId)),
  }
}

export default connect(mapState, mapDispatch)(WorkspaceSettings);