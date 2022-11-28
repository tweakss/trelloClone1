import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { parseComment } from '../functions/utilityFunctions';
 
export const CardUserComment = React.memo((props) => {
  const {
    comment, commentIdx, getCardComments,
    deletePromptOpened, handleDeletePromptOpened,
    user, replyWriteACommentField,
    
  } = props;

  const [currComment, setCurrComment] = useState(comment);

  const [userComment, setUserComment] = useState(currComment.content);
  const handleUserComment = (event) => {
    setUserComment(event.target.value);
  }

  const submitUserComment = async(event) => {
    event.preventDefault();
    
    const txtareaHeight = document.querySelector(".card-user-comment-txtarea").style.height;
    // console.log("submitUserComment, txtareaHeight:", txtareaHeight);
    
    const { data: updatedComment } = await axios({
      method: 'put',
      url: `/api/comments/commentId/${currComment.id}`,
      data: {
        content: userComment,
        txtareaHeight,
        
      }
    });
    console.log("updatedComment:", updatedComment);
    setCurrComment(updatedComment);
    setDisplayComment(true);
  }

  useEffect(() => {
    setCurrComment(comment);
  }, [comment]);

  useEffect(() => {
    setUserComment(currComment.content);
  }, [currComment])
  

  const [displayComment, setDisplayComment] = useState(true);
  const closeDisplayComment = (event) => {
    setDisplayComment(false);
  }
  const openDisplayComment = (event) => {
    event.preventDefault();
    setDisplayComment(true);
    setUserComment(currComment.content);
  }
  
  const autoResizeTxtArea = (event) => {
    const txtArea = event.target;
    const offset = txtArea.offsetHeight - txtArea.clientHeight;
    txtArea.style.height = 'auto';
    txtArea.style.height = txtArea.scrollHeight + offset + 'px';

  }

  const [timeStamp, setTimeStamp] = useState("");
  useEffect(() => {

    const dateObj = new Date(currComment.updatedAt);
    const timeSplit = dateObj.toLocaleTimeString().split(" ");
    const amPmStr = timeSplit[1];
    const hrsMinsSecs = timeSplit[0].split(":");
    const time = `${hrsMinsSecs[0]}:${hrsMinsSecs[1] } ${amPmStr}`;
    
    const fullDateSplit = dateObj.toDateString().split(" ");
    const month = fullDateSplit[1];
    const day = fullDateSplit[2];
    const year = fullDateSplit[3];
    const monthAndDay = `${month} ${day}`;
    
    let timeStampToDisplay = `${monthAndDay} at ${time}`
    
    const updatedAt = Date.parse(currComment.updatedAt);
    const timeSinceInYrs = Math.round((Date.now() - updatedAt) / 31536000000);
    const timeSinceInSecs = Math.round((Date.now() - updatedAt) / 1000);
    // console.log("timeSinceInYrs:", timeSinceInYrs);
    if(timeSinceInYrs >= 1) {
      console.log("timeSinceInYrs >= 1")
      timeStampToDisplay = `${monthAndDay} ${year} at ${time}`;
    }

    if(timeSinceInSecs <= 59) {
      if(timeSinceInSecs <= 2) {
        timeStampToDisplay = "just now";
      } else {
        timeStampToDisplay = `${timeSinceInSecs} seconds ago`;
      }
      
    }
    
     
    setTimeStamp(timeStampToDisplay);
  }, [currComment])

  useEffect(() => {
    if(!displayComment) {
      // console.log("useEffect editDescription true, height:", card.txtareaHeight);
      const txtarea = document.querySelector(`.card-user-comment-txtarea[data-comment-idx='${commentIdx}']`);
      txtarea.style.height = currComment.txtareaHeight; //
      
      txtarea.focus();
      txtarea.setSelectionRange(txtarea.textLength + 1, txtarea.textLength);
    }
  }, [displayComment])

  const [deletePromptAboutToOpen, setDeletePromptAboutToOpen] = useState(false);
  const [openDeletePrompt, setOpenDeletePrompt] = useState(false);
  const handleOpenDeletePrompt = (event) => {
    // Trigger close delete prompt
    if(deletePromptOpened) {
      setDeletePromptAboutToOpen(true);
      handleDeletePromptOpened(false);
      return;
    }

    // Open delete prompt
    setOpenDeletePrompt(true);
    handleDeletePromptOpened(true);
  }
  useEffect(() => {
    // Close delete prompt
    if(!deletePromptOpened && openDeletePrompt) {
      console.log("useEffect setOpenDeletePrompt(false)")
      setOpenDeletePrompt(false);
    }
    
  }, [deletePromptOpened]);

  
  useEffect(() => {
    // Open current comment's prompt after closing other prompt
    if(!deletePromptOpened && deletePromptAboutToOpen) {
      setOpenDeletePrompt(true);
      handleDeletePromptOpened(true);
    }

    return function cleanUp() {
      setDeletePromptAboutToOpen(false);
    }
  }, [deletePromptOpened]);

  const deleteComment = async(event) => {
    const { data: response } = await axios({
      method: 'delete',
      url: `/api/comments/commentId/${currComment.id}`
    });

    console.log("deleteComment response:", response);
    getCardComments();
    
  }

  console.log(`CardUserComment `);

  return (
    <>
      { 
        displayComment ?
        <div className="card-user-comment">
          <div>
            <span className="card-user-comment-owner">
              {currComment.user.username}
            </span>
            <span className="card-user-comment-timestamp | fnt-sz-12px">
              {timeStamp}
            </span>
          </div>
          <p className="card-user-comment-display | br-025rem word-brk-all fnt-sz-14px">
            {
              parseComment(currComment.content).map((parsedStr) => parsedStr)
            }
          </p>
          <div className="card-user-comment-display-controls" >
            {
              comment.userId === user.id ?
              <button
                className="card-user-comment-edit-btn | bdr-none fnt-sz-12px"
                onClick={closeDisplayComment}
              >
                Edit
              </button> :
              <button
                className="card-user-comment-reply-btn | bdr-none fnt-sz-12px"
                onClick={(event) =>  replyWriteACommentField(comment.user.username, event)}
              >
                Reply
              </button>
            }
            
            <div className="card-user-comment-delete-btn-wrapper">
              <button
                className="card-user-comment-delete-btn | mgn-l-05rem bdr-none fnt-sz-12px"
                onClick={handleOpenDeletePrompt}
              >
                Delete
              </button>
              {
                openDeletePrompt ?
                <div className="card-user-comment-delete-prompt | br-025rem pdg-075rem">
                  <div className="card-user-comment-delete-prompt-title">
                    <span className="card-user-comment-delete-prompt-title-txt | menu-title-clr">
                      Delete Comment?
                    </span>

                    <button
                      className="card-user-comment-delete-prompt-close-btn | bdr-none bg-clr-transparent "
                      onClick={() => setOpenDeletePrompt(false)}
                    >
                      &times;
                    </button>
                    
                  </div>
                  <p>Are you sure you want to delete this comment?</p>
                  <div className="card-user-comment-delete-prompt-delete">
                    <button
                      className="card-user-comment-delete-prompt-delete-btn | bdr-none br-025rem "
                      onClick={deleteComment}
                    >
                      Delete Comment
                    </button>
                  </div>
                </div> : null
              }
            </div>
          </div>
          
          
        </div> :
        <form
          className="card-user-comment-form"
          onSubmit={submitUserComment}
        >
          <div className="card-user-comment-edit-section">
            <div>
              <span className="card-user-comment-owner">
                {currComment.user.username}
              </span>
              <span className="card-user-comment-timestamp | fnt-sz-12px">
                {timeStamp}
              </span>
            </div>
            <div className="card-user-comment-txtarea-wrapper | br-025rem">
              <textarea
                className="card-user-comment-txtarea | bdr-none pdg-4x8px fnt-sz-14px"
                value={userComment}
                onChange={handleUserComment}
                placeholder="You haven't typed anything!"
                onKeyDown={autoResizeTxtArea}
                data-comment-idx={`${commentIdx}`}
              >
              </textarea>

              <div className="card-user-comment-edit-controls | fnt-sz-14px">
                <button 
                  className="card-user-comment-save-btn | bdr-none br-025rem pdg-4x8px"
                >
                  Save
                </button>
                <button
                  className="card-user-comment-close-btn | bdr-none bg-clr-transparent"
                  onClick={openDisplayComment}
                >
                  
                </button>
              </div>
            </div>
          </div>
        </form>
      }
      
      
    </>
  )
});