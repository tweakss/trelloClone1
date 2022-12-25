import React, { useEffect, useState, useRef } from 'react'
import {connect, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { 
  getUsersToInvite, addBoardMember, 
  removeBoardMember 
} from '../store/board';

const NavbarContent = (props) => {
  const {
    user, board, members, toInvite,
    getUsersToInvite, addBoardMember, removeBoardMember,
    errorMsg,

    boardState
  } = props;
  const dispatch = useDispatch();

  const [membersDropdown, setMembersDropdown] = useState(false);
  const closeMembersDropdown = (event) => {
    let clicked = event.target;
    //If clicked on any other part of the dropdown then do nothing
    while(clicked = clicked.parentElement) {
      if(clicked.className.includes("members-dropdown")) {
        // console.log("clicked within members-dropdown");
        return;
      }
    }
    
    setMembersDropdown((prev) => !prev);
  }

  useEffect(() => {
    if(membersDropdown) {
      document.addEventListener("click", closeMembersDropdown);
    }
    
    return function cleanUp() {
      document.removeEventListener("click", closeMembersDropdown);
    }
  }, [membersDropdown]);

  const handleMembersDropdown = (event) => {
    // if(!membersDropdown) {
    //   getBoardMembers(board.id);
    // }
    
    setMembersDropdown((prev) => !prev); 
  }

  const [inviteDropdown, setInviteDropdown] = useState(false);
  const handleShareDropdown = () => {
    // console.log("handleShareDropdown");
    setInviteDropdown((prev) => !prev);
  }

  // const closeInviteDropdown = (event) => {
  //   let clickedElem = event.target;
  //   while((clickedElem = clickedElem.parentElement) ) {
  //     if(clickedElem.className.includes("share-board")) {
  //       return;
  //     }
  //   }
  //   console.log("clicked outside of inviteDropdown");
  //   setInviteDropdown(false);
  //   setInviteInput("");
  // }

  // const [wasInsideShareDropdown, setWasInsideShareDropdown] = useState(false);
  let wasInsideShareDropdown = false;
  const mouseDownEvent = (event) => {
    // console.log("mouseDownEvent event.target:", event.target);
    let clickedElem = event.target;
    while((clickedElem = clickedElem.parentElement) ) {
      if(clickedElem.className.includes("share-board")) {
        // setWasInsideShareDropdown(true);
        wasInsideShareDropdown = true;
        return;
      }
    }
  }
  const mouseUpEvent = (event) => {
    // console.log("mouseUpEvent event.target:", event.target, " wasInsideShareDropdown:", wasInsideShareDropdown);
    let clickedElem = event.target;
    while((clickedElem = clickedElem.parentElement) ) {
      if(clickedElem.className.includes("share-board")) {
        return;
      }
    }

    // console.log("clicked outside of inviteDropdown, wasInsideShareDropdown:", wasInsideShareDropdown);
    if(wasInsideShareDropdown) {
      // console.log("wasInsideShareDropdown");
      wasInsideShareDropdown = false;
      return;
    } else {
      // console.log("else wasInsideShareDropdown");
      setInviteDropdown(false);
      setInviteInput("");
      // setWasInsideShareDropdown(false);
    }
    
    
  }
  
  useEffect(() => {
    if(inviteDropdown) {
      // document.addEventListener("click", closeInviteDropdown);
      document.addEventListener("mousedown", mouseDownEvent);
      document.addEventListener("mouseup", mouseUpEvent);
    } 
  
    
    return function cleanUp() {
      // console.log("shareDropdown cleanup");
      // document.removeEventListener("click", closeInviteDropdown);
      document.removeEventListener("mousedown", mouseDownEvent);
      document.removeEventListener("mouseup", mouseUpEvent);
    }
  }, [inviteDropdown])

  const [inviteInput, setInviteInput] = useState("");
  const showError = () => {

  }
  
  const handleInviteInput = (event) => {
    const shareBoardInput = event.target;
    const shareBoardErrMsg = document.querySelector(".share-board-err-msg");
    if(shareBoardInput.validity.valid) {
      shareBoardErrMsg.textContent = ""; // Reset the content of the message
      // emailError.className = "error"; // Reset the visual state of the message
    } else {
      if(shareBoardInput.validity.valueMissing) {
        shareBoardErrMsg.textContent = "Please enter an email address";
      } else if(shareBoardInput.validity.typeMismatch) {
        shareBoardErrMsg.textContent = "Not a valid email address"
      }
      
    }
    setInviteInput(event.target.value);
  };

  

  const submitShareBoard = () => {
    const shareBoardInput = document.querySelector("#share-board-input-email");
    const shareBoardErrMsg = document.querySelector(".share-board-err-msg");
    if(shareBoardInput.validity.valueMissing) {
      return;
    } else if(shareBoardInput.validity.typeMismatch) {
      shareBoardErrMsg.textContent = "Not a valid email address";
      return;
    }

    const emailAddr = inviteInput;
    console.log("submitShareBoard, inviteInput:", inviteInput);
    addBoardMember(board.id, emailAddr);

    // setInviteDropdown(false);
    // setInviteInput("");
  
  }

  useEffect(() => {
    if(errorMsg) {
      // console.log("useEffect errorMsg:", errorMsg);
      const shareBoardErrMsg = document.querySelector(".share-board-err-msg");
      shareBoardErrMsg.textContent = errorMsg;
      dispatch({ type: "SET_ERROR_MSG", errorMsg: null });
    }
  }, [errorMsg])


  
  // console.log("NavbarContent, inviteDropdown:", inviteDropdown, " wasInsideShareDropdown:", wasInsideShareDropdown);

  return (
    <div id="board-navbar">
      <h3 className="board-navbar-h3">{board.title}</h3>
      <span>|</span>

      <div className="members-dropdown">
        <button onClick={handleMembersDropdown} className="members-dropdown-btn br-5px pdg-05em">
          Members
        </button>
        
        {
          membersDropdown ? 
          <div id="membersDropdown" className="members-dropdown-content">
            {
              members.map((member) => {
                return (
                  <div key={member.id} className={`members-dropdown member`}>
                    <button type="button">{member.username}</button>
                    <button 
                      type="button"
                      onClick={() => removeBoardMember(board.id, member.username)}
                    >
                      &times;
                    </button>
                  </div>
                )
              })
            }
          </div> : null
        }
      </div>
      
      <div className="share-board">
        <button
          type="button"
          onClick={handleShareDropdown}
          className="share-board-btn br-5px pdg-05em"
        >
          Share
        </button>
        <div className="share-board-content">
          {
            inviteDropdown ?
            <form className="share-board-form" noValidate >
              <div
                className="share-board-input-wrapper"
              >
                <input
                  id="share-board-input-email" 
                  type="email" 
                  placeholder="Enter an email address"
                  value={inviteInput}
                  onChange={handleInviteInput}
                  required
                >
                </input>
                <span className="share-board-err-msg" >Please enter an email address</span>
                <button
                  type="button"
                  className="share-submit-btn"
                  onClick={submitShareBoard}
                >
                  Share
                </button>
              </div>
            </form> : null
          }
          
        </div>
      </div>
      

      
      
    </div>
  );
}

const mapState = (state) => {
  return {
    user: state.auth.user,
    board: state.board.board,
    members: state.board.members,
    toInvite: state.board.toInvite,
    errorMsg: state.board.errorMsg,

    boardState: state.board
  }
}

const mapDispatch = (dispatch) => {
  return {
    getUsersToInvite: (usernameOrEmail) => dispatch(getUsersToInvite(usernameOrEmail)),
    addBoardMember: (boardId, emailAddr) => dispatch(addBoardMember(boardId, emailAddr)),
    removeBoardMember: (boardId, username) => dispatch(removeBoardMember(boardId, username)),
  }
}

export default connect (mapState, mapDispatch)(NavbarContent);