import React, { useState, useEffect, useCallback } from 'react';
import {connect} from 'react-redux';
import axios from 'axios';
import { updateCardDescription, updateCardTitle } from '../store/lists';
import { CardUserComment } from './CardUserComment';

const CardModal = (props) => {
  const {
    card, openCard, setOpenCard, 
    board, user, list, listIndex,
    updateCardDescription, updateCardTitle, 
  } = props;

  const [getComments, setGetComments] = useState([]);
  
  
  const getCardComments = async() => {
    const { data: comments } = await axios({
      method: 'get',
      url: `/api/comments/cardId/${card.id}/comments`,
    });
    console.log("getCardComments comments:", comments);

    setGetComments(comments);
  }
  const memoGetCardComments = useCallback(getCardComments, [openCard]);

  useEffect(() => { 
    if(openCard) {
      console.log("CardModal useEffect getCardComments for card:", card.title);
      
      getCardComments();
    }
    
    
  }, [openCard]);

  const [cardTitle, setCardTitle] = useState(card.title);
  const handleCardTitle = (event) => {
    setCardTitle(event.target.value);
  }
  const [cardDescription, setCardDescription] = useState(card.description);
  const handleCardDescription = (event) => {
    setCardDescription(event.target.value);
  }
  const [cardComment, setCardComment] = useState("");
  const handleCardComment = (event) => {
    setCardComment(event.target.value);
  }

  const closeCardModal = (event) => {
    updateCardTitle(card.id, cardTitle, listIndex);

    setOpenCard(false);
    setCardDescription(card.description);
    setCardTitle(card.title);
    closeEditDescription();
  }
  
  const submitCardDescription = (event) => {
    event.preventDefault();
    // console.log("submitCardDesription, cardDescription:", cardDescription);
    
    const txtareaHeight = document.querySelector(".card-description-edit-txtarea").style.height;
    // console.log("txtareaHeight:", txtareaHeight);
    updateCardDescription(card, cardDescription, board, txtareaHeight);
    setEditDescription(false);

    if(cardDescription.length === 0) {
      // console.log("submitCardDescription, setShowDescription to false")
      setShowDescription(false);
    } else {
      // console.log("submitCardDescription, setShowDescription to true")
      setShowDescription(true);
    }
  }


  const autoResizeTxtArea = (event) => {
    const txtArea = event.target;
    const offset = txtArea.offsetHeight - txtArea.clientHeight;
    txtArea.style.height = 'auto';
    txtArea.style.height = txtArea.scrollHeight + offset + 'px';

  }

  const [editDescription, setEditDescription] = useState(false);
  const closeEditDescription = (event) => {
    console.log("closeEditDescription");
    setEditDescription(false);
    if(card.description.length > 0) {
      setCardDescription(card.description);
    }
    
  }
  const openEditDescription = (event) => {
    setEditDescription(true);
  }
  useEffect(() => {
    if(editDescription) {
      // console.log("useEffect editDescription true, height:", card.txtareaHeight);
      const txtarea = document.querySelector(".card-description-edit-txtarea");
      txtarea.style.height = `${parseInt(card.txtareaHeight, 10) + 8}px`;
      
      txtarea.focus();
      txtarea.setSelectionRange(txtarea.textLength + 1, txtarea.textLength)
      
      // console.log("getSelection:", window.getSelection())
      
    }
  }, [editDescription]);

  const [showDescription, setShowDescription] = useState(false);
  useEffect(() => {
    if(card.description.length > 0) {
      setShowDescription(true);
    }
    
  }, [])

  const [writeAComment, setWriteAComment] = useState(false);
  const showWriteACommentField = (event) => {
    setWriteAComment(true);
  }

  // const [replyComment, setReplyComment] = useState(false);
  // const [isReplyComment, setIsReplyComment] = useState(false);
  const [commentReplier, setCommentReplier] = useState("");
  // memo this?
  const replyWriteACommentField = (commentUsername, event) => {
    console.log("replyWriteACommentField, commentUsername:", commentUsername);
    setCardComment(`@${commentUsername} `);
    setWriteAComment(true);
  }
  const memoReplyWriteACommentField = useCallback(replyWriteACommentField, [card]);

  useEffect(() => {
    // console.log("useEffect saveBtn disabled");
    let saveBtn;
    if(writeAComment && cardComment.length === 0) {
      saveBtn = document.querySelector(".card-activity-txtarea-save");
      saveBtn.setAttribute("disabled", "");
      document.querySelector(".card-activity-txtarea").focus();
    } else if(writeAComment && cardComment.length >= 1) {
      // console.log("cardComment.length === 1")
      const txtarea = document.querySelector(".card-activity-txtarea");
      txtarea.focus();
      txtarea.setSelectionRange(txtarea.textLength + 1, txtarea.textLength);
      
      saveBtn = document.querySelector(".card-activity-txtarea-save");
      saveBtn.removeAttribute("disabled");
    }

    
  }, [writeAComment, cardComment]);

  const submitNewComment = async(event) => {
    event.preventDefault();
  
    const { data: newComment } = await axios({
      method: 'post',
      url: `/api/comments/cardId/${card.id}/userId/${user.id}/newComment`,
      data: {
        content: cardComment,
      }
    });
    console.log("submitNewComment, newComment:", newComment);
    const newGetComments = [ newComment, ...getComments ];
    console.log("newGetComments:", newGetComments); 
    setGetComments(newGetComments);
    setCardComment("");
    setWriteAComment(false);
    
  }

  let mouseLeftTxtArea = false;
  const mouseLeaveTxtArea = (event) => {
    // console.log("mouseLeaveTxtArea, event.target:", event.target);
    mouseLeftTxtArea = true;
  }

  const closeCommentDescription = (event) => {
    // console.log("closeCommentDescription, event.target:", event.target);
    let clicked = event.target;
    if(clicked.className.includes("card-description-empty")) {
      // console.log("clicked includes card-description-empty:", clicked);
      return;
    }
    
    while(clicked) {
      if(clicked.tagName === "TEXTAREA" || clicked.tagName === "INPUT") {
        // console.log("clicked on a txtarea || input")
        return;
      }
      if(clicked.className === "card-description-edit-section") {
        break;
      }

      if(!clicked.className.includes("card-description-edit")) {
        // console.log("!clicked.className.includes(card-description-edit)")
        if(mouseLeftTxtArea) {
          mouseLeftTxtArea = false;
          return;
        }

        setEditDescription(false);
        break;
      }

      clicked = clicked.parentElement;
    }
    // console.log("closeCommentDescription, clicked:", clicked);
    if(!clicked.className.includes("card-activity-txtarea") && cardComment.length === 0) {
      // console.log("!clicked.className.includes(card-activity-txtarea)");
      setCardComment("");
      setWriteAComment(false);
    }
    
  }
  useEffect(() => {
    // console.log("useEffect closeCommentDescription");
    let cardModal, cardDescriptionEdit;
    if(writeAComment || editDescription) {
      // console.log("addEventListener closeCommentDescription");
      cardModal = document.querySelector(".card-modal");
      cardModal.addEventListener("click", closeCommentDescription);
      
      if(editDescription) {
        cardDescriptionEdit = document.querySelector(".card-description-edit-txtarea");
        cardDescriptionEdit.addEventListener("mouseleave", mouseLeaveTxtArea)
      }
      
    }

    if(cardModal && cardDescriptionEdit) {
      return function cleanUp() {
        cardModal.removeEventListener("click", closeCommentDescription);
        cardDescriptionEdit.removeEventListener("mouseleave", mouseLeaveTxtArea)
      }
    } else if(cardModal) {
      return function cleanUp() {
        cardModal.removeEventListener("click", closeCommentDescription);
      }
    }
    
  }, [writeAComment, editDescription, cardComment]);

  const [deletePromptOpened, setDeletePromptOpened] = useState(false);
  const handleDeletePromptOpened = (deletePromptOpenedState) => {
    if(deletePromptOpenedState === false) {
      setDeletePromptOpened(false);
    } else if(deletePromptOpenedState === true) {
      setDeletePromptOpened(true);
    }
    
  }
  const memoHandleDeletePromptOpened = useCallback(handleDeletePromptOpened, [deletePromptOpened]);

  


  // console.log("CardModal, ");

  return (
    <>
      {
        openCard ?
        <div className="card-modal-backdrop">
          
          <div className="card-modal | br-025rem">
            <button 
              className="card-modal-close-btn | bdr-none br-05rem mgn-05rem"
              onClick={closeCardModal}
            >

            </button>
            <div className="card-modal-title | ">
              <span className="card-modal-title-icon"></span>
              <form className="card-modal-form-title">
                <input
                  className="card-modal-title-input | bdr-none bg-clr-transparent "
                  type="text"
                  value={cardTitle}
                  onChange={handleCardTitle}
                    
                  >
                  </input>
              </form>
              <div className="card-modal-under-title">
                <p className="card-modal-in-list">
                  in list
                  <button className="card-modal-in-list-btn">
                    {list.title}
                  </button>
                </p>
              </div>
            </div>
              
            <div className="card-modal-grid">
              <div className="card-description-wrapper | mgn-l-1rem">
                <form
                  className="card-description-form"
                  onSubmit={submitCardDescription}
                >
                  <div className="card-description-heading |">
                    <span className="card-description-icon"></span>
                    <p className="card-description-label">Description</p>
                  </div>  
                  
                  {
                    
                    editDescription ? 
                    <div className="card-description-edit-section">
                      <textarea
                        className="card-description-edit-txtarea | bdr-none br-025rem pdg-8x12px fnt-sz-14px "
                        value={cardDescription}
                        onChange={handleCardDescription}
                        placeholder="Add a more detailed description..."
                        onKeyDown={autoResizeTxtArea}
                        
                      >
                      </textarea>
                      <div className="card-description-edit-handles">
                        <button
                          className="card-description-edit-submit | bdr-none br-025rem pdg-4x8px"
                          type="submit"
                        >
                          Save
                        </button>
                        <button
                          className="card-description-edit-cancel | bg-clr-transparent bdr-none br-025rem pdg-4x8px"
                          onClick={closeEditDescription}
                        >
                          Cancel
                        </button>
                      </div>
                    </div> :
                    ( 
                      showDescription ? 
                      <div className="card-description-show | word-brk-all">
                        <p 
                          className="pdg-4x8px fnt-sz-14px"
                          onClick={openEditDescription}
                        >
                          {card.description}
                        </p>
    
                      </div> :
                      <div 
                        className="card-description-empty | br-025rem"
                        onClick={openEditDescription}
                      >
                        <p className="card-description-empty-txt | pdg-4x8px">
                          Add a more detailed description...
                        </p>
                      </div>
                    )
                  }

    
                </form>
              </div>
              <div className="card-activity-wrapper | mgn-l-1rem">
                <div className="card-activity-heading |">
                  <span className="card-activity-icon"></span>
                  <p className="card-activity-label">Activity</p>
                </div>
                
                <form
                  className="card-activity-form"
                  onSubmit={submitNewComment}
                  // data-create-comment="1"
                >
                  
                  {
                    writeAComment ?
                    <div className="card-activity-edit-section">
                      <textarea
                        className="card-activity-txtarea | bdr-none br-025rem pdg-8x12px fnt-sz-14px"
                        value={cardComment}
                        onChange={handleCardComment}
                        placeholder="Write a comment..."
                        onKeyDown={autoResizeTxtArea}
                      >
                      </textarea>
                      <div className="card-activity-txtarea-controls">
                        <button 
                          className="card-activity-txtarea-save | bdr-none br-025rem pdg-4x8px fnt-sz-14px"
                        >
                          Save
                        </button>
                      </div>
                    </div> :
                    <textarea
                      className="card-activity-before-edit | bdr-none br-025rem pdg-8x12px fnt-sz-14px"
                      placeholder="Write a comment..."
                      onClick={showWriteACommentField}
                      readOnly
                    >
                    </textarea>
                  }

                </form>
              </div>
              <div className="card-user-comment-grid-area | mgn-l-1rem">
                <div className="card-user-comment-wrapper">
                  { 
                    getComments.length ?
                    getComments.map((comment, index) => {
                      return (
                        <CardUserComment key={comment.id} 
                          comment={comment} commentIdx={index}
                          deletePromptOpened={deletePromptOpened}
                          handleDeletePromptOpened={memoHandleDeletePromptOpened}
                          getCardComments={memoGetCardComments}
                          user={user} replyWriteACommentField={memoReplyWriteACommentField}
                          // isReplyComment={isReplyComment}
                        />
                      );
                    }) : null

                    
                  }
                </div>
                               
              </div>

              <div className="card-side-menu-wrapper" >
                <button className="testButton" onClick={() => console.log("item")}>sideMenu item</button>
                {/* <button className="testButton" onClick={() => console.log("item")}>item</button>
                <button className="testButton" onClick={() => console.log("item")}>item</button>
                <button className="testButton" onClick={() => console.log("item")}>item</button>
                <button className="testButton" onClick={() => console.log("item")}>item</button>
                <button className="testButton" onClick={() => console.log("item")}>item</button>
                <button className="testButton" onClick={() => console.log("item")}>item</button>
                <button className="testButton" onClick={() => console.log("item")}>item</button>
                <button className="testButton" onClick={() => console.log("item")}>item</button>
                <button className="testButton" onClick={() => console.log("item")}>item</button>
                <button className="testButton" onClick={() => console.log("item")}>item</button>
                <button className="testButton" onClick={() => console.log("item")}>item</button>
                <button className="testButton" onClick={() => console.log("item")}>item</button>
                <button className="testButton" onClick={() => console.log("item")}>item</button>
                <button className="testButton" onClick={() => console.log("item")}>item</button>
                <button className="testButton" onClick={() => console.log("item")}>item</button>
                <button className="testButton" onClick={() => console.log("item")}>item</button>
                <button className="testButton" onClick={() => console.log("item")}>item</button> */}
              </div>

            </div>
            
            
          </div>
        
        </div> : null
      }
      

    </>
  )
}

const mapState = (state) => {
  return {
    user: state.auth.user,
    // lists: state.lists.lists,
  }
}

const mapDispatch = (dispatch) => {
  return {
    updateCardDescription: (card, cardDescription, board, txtareaHeight) => dispatch(updateCardDescription(card, cardDescription, board, txtareaHeight)),
    updateCardTitle: (cardId, cardTitle, listIndex) => dispatch(updateCardTitle(cardId, cardTitle, listIndex)),
  }
}

export default connect(mapState, mapDispatch)(CardModal);