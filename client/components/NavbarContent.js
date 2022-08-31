import React, { useEffect, useState, useRef } from 'react'
import {connect} from 'react-redux'
import { Link } from 'react-router-dom'
import { getBoardMembers, getUsersToInvite, addBoardMember, removeBoardMember } from '../store/board';

const NavbarContent = (props) => {
  const {
    user, board, members, toInvite,
    getBoardMembers, getUsersToInvite,

    boardState
  } = props;

  const [dropdown, setDropdown] = useState(false);
  useEffect(() => {
    if(dropdown) {
      // Need to handle when clicked inside the dropdown to not close the dropdown
      const closeDropdown = (event) => {
        // console.log("closeDropdown");
        if(!event.target.matches('.members-dropbtn')) {
          const dropdownContent = document.querySelector(".members-dropdown-content");
          if(dropdownContent.classList.contains("members-show")) {
            // window.removeEventListener("click", closeDropdown);
            dropdownContent.classList.remove("members-show");
            setDropdown((prev) => !prev);
          }
        }

        document.removeEventListener("click", closeDropdown);
      }
      // console.log("adding eventListener closeDropdown for members")
      document.addEventListener("click", closeDropdown);
    }
  }, [dropdown]);

  const handleMembersDropdown = (event) => {
    document.querySelector("#membersDropdown").classList.toggle("members-show");
    // console.log("handleMembersDropdown, members:", members);
    getBoardMembers(board.id);
    setDropdown((prev) => !prev); //removes the eventListeners also
  }

  const [inviteDropdown, setInviteDropdown] = useState(false);

  useEffect(() => {
    const closeDropdown = (event) => {
      // console.log("invite closeDropdown, event.target:", event.target);
      const inviteDropBtn = document.querySelector(".invite-dropbtn");
      if(event.target === inviteDropBtn) {
        // console.log("event.target === inviteDropBtn");
        window.removeEventListener("click", closeDropdown);
        return;
      }

      const inviteDropdownElem = document.querySelector(".invite-dropdown-content");
      if(inviteDropdownElem.contains(event.target) && event.target.classList.contains("button")) {
        // console.log("event.target is a button within invite-dropdown-content");
        window.removeEventListener("click", closeDropdown);
        handleInviteDropdown();
        setInviteInput("");
        return;
      }

      let clickedElem = event.target;
      while(clickedElem = clickedElem.parentElement) {
        // console.log("while clickedElem = clickedElem.parentElement", clickedElem, clickedElem.parentElement);
        if(clickedElem.className === inviteDropdownElem.className) {
          // console.log("clickedElem.className === inviteDropdownElem.className");
          return;
        }
      }
      // console.log("clicked outside of dropDown content");
      window.removeEventListener("click", closeDropdown);
      handleInviteDropdown();
      setInviteInput("");
      // console.log("closeDropdown end");
    }

    if(inviteDropdown) {
      window.addEventListener("click", closeDropdown);
      // console.log("window.addEventListener");
    } 
    // else {
    //   window.removeEventListener("click", closeDropdown);
    //   console.log("window.removeEventListener");
    // }
    
    
  }, [inviteDropdown])

  const [inviteInput, setInviteInput] = useState("");
  const handleInviteInput = (event) => {
    setInviteInput(event.target.value);
  };

  function handleInviteDropdown() {
    setInviteDropdown((prev) => !prev);
    // setInviteInput(""); // take this out?
    // console.log("handleInviteDropdown, right after setting inviteDropdown:", inviteDropdown);
  }

  const submitSendInvite = (inviteInput) => {
    const username = inviteInput;
    console.log("submitSendInvite, inviteInput:", inviteInput);
    addBoardMember(board.id, username);
  }


  useEffect(() => {
    const timeoutId = setTimeout(async() => {
      // console.log("inviteInput timeout, inviteInput:", inviteInput);
      if(inviteInput !== "") {
        getUsersToInvite(inviteInput);
      }
    }, 1000);

    return () => {
      clearTimeout(timeoutId);
    }
  }, [inviteInput])

  function autocomplete(inputElem, users) {
    // console.log("autocomplete, users:", users);
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    let currentFocus;
  
    /*Create autocomplete divs when someone writes in the text field:*/
      let container, item;
      // let val = inviteInput;
      let val = inputElem.value;
  
      /*close any already open lists of autocompleted values*/
      closeAllLists();
      if (!val) { return false; }
      currentFocus = -1;
      /*create a DIV element that will contain the items (values):*/
      container = document.createElement("DIV");
      container.setAttribute("id", inputElem.id + "autocomplete-list");
      container.setAttribute("class", "autocomplete-items");
      /*append the DIV element as a child of the autocomplete container:*/
      inputElem.parentNode.appendChild(container);
      /*for each item in the array...*/
      for (let i = 0; i < users.length; i++) {
        // console.log(`autocomplete for loop, users[${i}]:`, users[i].username);
        /*check if the item starts with the same letters as the text field value:*/
        if (users[i].username.substr(0, val.length).toUpperCase() == val.toUpperCase()) {
          /*create a DIV element for each matching element:*/
          item = document.createElement("DIV");
          /*make the matching letters bold:*/
          item.innerHTML = "<strong>" + users[i].username.substr(0, val.length) + "</strong>";
          item.innerHTML += users[i].username.substr(val.length);
          /*insert a input field that will hold the current array item's value:*/
          item.innerHTML += "<input type='hidden' value='" + users[i].username + "'>";
          /*execute a function when someone clicks on the item value (DIV element):*/
          item.addEventListener("click", function(event) {
            event.stopPropagation();
            const clickedItemInput = event.target.getElementsByTagName("input");
            if(clickedItemInput.length > 0) {
              console.log("clicked on div, input elem, value:", clickedItemInput[0].value);
              setInviteInput(clickedItemInput[0].value);
            } else {
              console.log("Clicked on strong elem, event.target:", event.target.parentNode.getElementsByTagName("input")[0].value);
              setInviteInput(event.target.parentNode.getElementsByTagName("input")[0].value);
            }
            // console.log("After clicking on item from autocomplete, event.target:", clickedItemInput);
            // console.log("After clicking on item from autocomplete inputElem.getElementsByTagName('input'):", inputElem.getElementsByTagName("input"));
            /*insert the value for the autocomplete text field:*/
            // inputElem.value = this.getElementsByTagName("input")[0].value;
            // setInviteInput(inputElem.getElementsByTagName("input")[0].value);
            // console.log("inputElem.value:", inputElem.value);
            /*close the list of autocompleted values,
            (or any other open lists of autocompleted values:*/
            closeAllLists();
          });
          container.appendChild(item);
        }
      }
  
    /*execute a function presses a key on the keyboard:*/
    inputElem.addEventListener("keydown", function(e) {
      var x = document.getElementById(inputElem.id + "autocomplete-list");
      if (x) x = x.getElementsByTagName("div");
      if (e.keyCode == 40) {
        /*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
        currentFocus++;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 38) { //up
        /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
        currentFocus--;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 13) {
        /*If the ENTER key is pressed, prevent the form from being submitted,*/
        e.preventDefault();
        if (currentFocus > -1) {
          /*and simulate a click on the "active" item:*/
          if (x) x[currentFocus].click();
        }
      }
    });
    function addActive(x) {
      /*a function to classify an item as "active":*/
      if (!x) return false;
      /*start by removing the "active" class on all items:*/
      removeActive(x);
      if (currentFocus >= x.length) currentFocus = 0;
      if (currentFocus < 0) currentFocus = (x.length - 1);
      /*add class "autocomplete-active":*/
      x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
      /*a function to remove the "active" class from all autocomplete items:*/
      for (var i = 0; i < x.length; i++) {
        x[i].classList.remove("autocomplete-active");
      }
    }
    function closeAllLists(elmnt) {
      /*close all autocomplete lists in the document,
      except the one passed as an argument:*/
      var x = document.getElementsByClassName("autocomplete-items");
      // console.log("closeAllLists, x:", x, "elmnt:", elmnt);
      for (var i = 0; i < x.length; i++) {
        // console.log("for loop, i:", i);
        if (elmnt != x[i] && elmnt != inputElem) {
          // console.log("x[i]:",  x[i], "x[i].parentNode:", x[i].parentNode);
          const removed = x[i].parentNode.removeChild(x[i]);
          // console.log("removed:", removed);
        }
      }
      // console.log("closed all lists");
    }
    function closeListenerAndLists(event) {
      // console.log("clicked on document and closeAllLists, event.target:", e.target);
      closeAllLists(event.target);
      document.removeEventListener("click", closeListenerAndLists);
    }
  
    document.addEventListener("click", closeListenerAndLists); //adds an eventListener everytime toInvite changes
    // console.log("added document eventListener");
  } //end of autocomplete

  useEffect(() => {
    
    if(toInvite.length > 0) {
      // console.log("just before autcomplete");
      autocomplete(document.getElementById("myInput"), toInvite);
    }
    
  }, [toInvite])
  


  // console.log("NavbarContent, inviteDropdown:", inviteDropdown);

  return (
    <div id="board-navbar">
      <h3>{board.title}</h3>

      <div className="members-dropdown">
        <button onClick={handleMembersDropdown} className="members-dropbtn">
          Members
        </button>
        
        <div id="membersDropdown" className="members-dropdown-content">
          {
            members.map((member) => {
              return (
                <div key={member.id}>
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
        </div>
      </div>
      
      <div className="invite-dropdown">
        <button
          type="button"
          onClick={handleInviteDropdown}
          className="invite-dropbtn"
        >
          Invite
        </button>
        <div id="inviteDropdown" className="invite-dropdown-content">
          {
            inviteDropdown ?
            <form className="autocomplete-form" autoComplete="off" >
              <div
                className="autocomplete"
                style={{width: '300px'}}
              >
                <input
                  id="myInput" type="text" name="myCountry"
                  placeholder="Email address or username"
                  value={inviteInput}
                  onChange={handleInviteInput}
                >
                </input>
                <button
                  type="button"
                  className="invite-dropdown submit button"
                  onClick={() => submitSendInvite(inviteInput)}
                >
                  Send Invite
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
    user: state.auth,
    board: state.board.board,
    workspace: state.workspace,
    members: state.board.members,
    toInvite: state.board.toInvite,

    boardState: state.board
  }
}

const mapDispatch = (dispatch) => {
  return {
    getBoardMembers: (boardId) => dispatch(getBoardMembers(boardId)),
    getUsersToInvite: (usernameOrEmail) => dispatch(getUsersToInvite(usernameOrEmail)),
    // addBoardMember: (boardId, username) => dispatch(addBoardMember(boardId, username)),
  }
}

export default connect (mapState, mapDispatch)(NavbarContent);