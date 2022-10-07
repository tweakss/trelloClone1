import React, { useState, useEffect, useCallback } from 'react';
import {connect, useDispatch} from 'react-redux';
import { 
  updateCardDescription, removeACard, moveCardToList,
  dropDraggedCard,
} from '../store/lists';


const Card = (props) => {
  const {
    card, draggedCard, cardIndex, list, listIndex, lists, 
    board, 
    updateCardDescription, removeACard, moveCardToList,
    dropDraggedCard,
  } = props;
  const dispatch = useDispatch();

  const [cardTitle, setCardTitle] = useState('');
  const handleCardTitle = (event) => {
    setCardTitle(event.target.value);
  }
  const [cardDescription, setCardDescription] = useState('');
  const handleCardDescription = (event) => {
    setCardDescription(event.target.value);
  }

  const [open, setOpen] = useState(false);
  const handleOpen = (card) => {
    // console.log('handleOpen, card', card);
    setOpen(true);
    setCardDescription(card.description);
    setCardTitle(card.title);
    // console.log("handleOpen, open:", open);
    
  }
  const handleClose = () => {
    console.log("Card, handleClose");
    setOpen(false);
    // controller.abort();
  }

  const submitCardDescription = (card, event) => {
    event.preventDefault()
    // console.log('submitCardDescription, cardDescription:', cardDescription);
    // console.log('submitCardDescription, card:', card);
    updateCardDescription(card, cardDescription, board);
    window.removeEventListener("click", clickedOutsideOfModal);
    handleClose();
    // console.log("end of submitCardDescription");
  }

  useEffect(() => {
    if(open) {
      console.log("useEffect, open:", open);
      const cardModalCloseBtn = document.querySelector("#card-modal-closeBtn");
      // const cardModal = document.getElementById("card-modal-content");
      // const controller = new AbortController();

      cardModalCloseBtn.addEventListener("click", (event) => {
        // console.log("cardModalCloseBtn");
        window.removeEventListener("click", clickedOutsideOfModal);
        handleClose();
        // controller.abort();
      });

      window.addEventListener("click", clickedOutsideOfModal);
    }
  }, [open]);

  const clickedOutsideOfModal = useCallback((event) => {
    const cardModalContent = document.getElementById("card-modal-content");

    let elem = event.target;
    console.log('window clicked, event.target:', elem);
    // console.log("cardModalContent:", cardModalContent);
    if(elem.id === cardModalContent.id) {
      return;
    }

    while(elem = elem.parentElement) {
      // console.log("elem:", elem, elem.id);
      if(elem.id === cardModalContent.id) {
        console.log("elem == cardModal");
        return;
      }
    
    }
    window.removeEventListener("click", clickedOutsideOfModal);
    handleClose();
  }, [open]);

  
  const cardBtnTitleDragStart = (event) => {
    console.log("Card dragStartHandler event.target:", event.target, " list.cards[cardIndex]:", list.cards[cardIndex]);

    event.target.style.opacity = .5;
    // event.dataTransfer.setData("text/plain", event.target.id);
    event.dataTransfer.setData("text/plain", event.target.className);
    event.dataTransfer.setData("draggedCardId", `${card.id}`);
    event.dataTransfer.setData("draggedListIndex", event.target.dataset.listIndex);
    event.dataTransfer.effectAllowed = "move";

    dispatch({
      type: "DRAGGED_START",
      draggedCard: {
        card: list.cards[cardIndex],
        leaveCardIndex: cardIndex,
        leaveListIndex: listIndex,
        enterListIndex: listIndex,
        origListIndex: listIndex,
        origCardIndex: cardIndex,
        // fillerIndex: null,
      },
      // draggedListIndex: listIndex,
      // draggedCardIndex: cardIndex

    });


  }

  // useEffect(() => {
  //   console.log("useEffect draggedCard.enterListIndex");
  //   if(draggedCard.enterListIndex !== draggedCard.origListIndex) {
  //     console.log("draggedCard.enterListIndex !== draggedCard.origListIndex");
  //     const cardBtnSpace = document.querySelector(`.list${listIndex}-card-${cardIndex}.card-btn-space`);
  //     cardBtnSpace.style.display = "none";
  //     // const cardDiv = document.querySelector(`.list${listIndex}-card-${cardIndex}`);
  //     // cardDiv.style.display = "none";
      
      
  //   }
  // }, [draggedCard.enterListIndex])

  const [draggedCardSpace, setDraggedCardSpace] = useState(false);
  const cardBtnTitleDrag = (event) => {
    // console.log("cardBtnTitleDrag");
  
    if(lists[listIndex].cards[cardIndex].id !== "filler") {
      console.log("cardBtnTitleDrag, dispatching DRAGGING_SET_FILLER");
      dispatch({
        type:"DRAGGING_SET_FILLER",
        listIndex,
        cardIndex,
        // fillerIndex: cardIndex
      })
    }
    // setDraggedCardSpace(true);
  }

  const cardBtnTitleDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    console.log("cardBtnTitleDragOver event.target:", event.target); // what you're dragging over
    

    const eventClientHeight = parseInt(event.target.clientHeight, 10);
    const dropTargetListIndex = listIndex;
    console.log("cardBtnTitleDragOver leaveListIndex:", draggedCard.leaveListIndex, "event.offsetY:", event.offsetY, "cardIndex:", cardIndex, "eventClientHeight:", eventClientHeight);
    if(draggedCard.leaveListIndex !== dropTargetListIndex) {
      console.log("draggedCard.leaveListIndex !== dropTargetListIndex");

      if( (event.offsetY <= Math.floor(eventClientHeight/2) )  ) {
        console.log(`event.offsetY <= eventClientHeight/2 `);
        
        dispatch({ 
          type: "DRAG_OVER_CARDS_UP_DIFF_LIST",
          dropTargetCardIndex: cardIndex,
          dropTargetListIndex: listIndex
        })
        
        
      } else if( (event.offsetY > Math.floor(eventClientHeight/2) )  ) {
        console.log(`event.offsetY > Math.floor(eventClientHeight/2) `);
        
        dispatch({ 
          type: "DRAG_OVER_CARDS_DOWN_DIFF_LIST",
          dropTargetCardIndex: cardIndex,
          dropTargetListIndex: listIndex
        })

      }

    } else {
      // if(draggedCard.card.listId === list.cards[cardIndex].listId) {
      console.log(`draggedCard.leaveListIndex ${draggedCard.leaveListIndex} === dropTargetListIndex ${dropTargetListIndex}`);
      if( (event.offsetY <= Math.floor(eventClientHeight/2) ) && (draggedCard.leaveCardIndex > cardIndex) ) {
        console.log(`event.offsetY <= eventClientHeight/2 && (draggedCard.leaveCardIndex > cardIndex)`);
        console.log("cardBtnTitleDragOver before DRAG_OVER_CARDS_UP, cards:", lists[listIndex].cards)
        dispatch({ 
          type: "DRAG_OVER_CARDS_UP",
          dropTargetCardIndex: cardIndex,
          dropTargetListIndex: listIndex
        })
        
        
      } else if( (event.offsetY > Math.floor(eventClientHeight/2) ) && (draggedCard.leaveCardIndex < cardIndex) ) {
        console.log(`event.offsetY > Math.floor(eventClientHeight/2) && (draggedCard.leaveCardIndex < cardIndex)`);
        dispatch({ 
          type: "DRAG_OVER_CARDS_DOWN",
          dropTargetCardIndex: cardIndex,
          dropTargetListIndex: listIndex
        })

      } 
      // else {
      //   console.log("NOT TOP OR BOTTOM same list, offsetY:", event.offsetY);
      // }
    }
    
  }

  const cardBtnTitleDragEnter = (event) => {
    event.preventDefault();
    console.log("cardBtnTitleDragEnter event.target:", event.target);
    
    // if (event.target.id === `list${listIndex}-card-${cardIndex}`) {
    //   event.target.style.background = "purple";
    // }

    dispatch({ type: "UPDATE_ENTER_LIST_INDEX", enterListIndex: listIndex });
    
    if(listIndex !== draggedCard.leaveListIndex) {
      dispatch({ type: "ENTER_DIFF_LIST_REMOVE_FILLER" })
    }
  }
  
  const cardBtnTitleDragLeave = (event) => {
    console.log("cardBtnTitleDragLeave, event.target:", event.target);

    // if (event.target.id === `list${listIndex}-card-${cardIndex}`) {
    //   event.target.style.background = "";
    // }



    dispatch({
      type: "UPDATE_DRAGGED_LEAVE_INDEXES",
      leaveCardIndex: cardIndex,
      leaveListIndex: listIndex,
    });

    
  }

  const cardBtnTitleDragEnd = (event) => {
    console.log("cardBtnTitleDragEnd");
    setDraggedCardSpace(false);
    event.target.style.opacity = "";
  }

  // const cardSpaceDragOver = (event) => {
  //   event.preventDefault();
  //   // console.log("cardSpaceDragOver");
  // }
  // const cardSpaceDragEnter = (event) => {
  //   event.preventDefault();
  //   // console.log("cardSpaceDragEnter");
  // }

  

  useEffect(() => {
    // const cardBtnWrapper = document.querySelector(`#list${listIndex}-card-${cardIndex}`);
    const cardBtnTitle = document.querySelector(`.card-btn-title.list-${listIndex}-card-${cardIndex}`);
    cardBtnTitle.addEventListener("dragstart", cardBtnTitleDragStart);
    cardBtnTitle.addEventListener("drag", cardBtnTitleDrag);
    cardBtnTitle.addEventListener("dragover", cardBtnTitleDragOver);
    cardBtnTitle.addEventListener("dragenter", cardBtnTitleDragEnter);
    cardBtnTitle.addEventListener("dragleave", cardBtnTitleDragLeave);
    cardBtnTitle.addEventListener("dragend", cardBtnTitleDragEnd);
    // cardBtnTitle.addEventListener("drop", cardBtnTitleDrop);

    // const cardSpace = document.querySelector(`.list${listIndex}-card-${cardIndex}.card-btn-space`);
    // cardSpace.addEventListener("dragover", cardSpaceDragOver);
    // cardSpace.addEventListener("dragenter", cardSpaceDragEnter);

    return function cleanUp() {
      cardBtnTitle.removeEventListener("dragstart", cardBtnTitleDragStart);
      cardBtnTitle.removeEventListener("drag", cardBtnTitleDrag);
      cardBtnTitle.removeEventListener("dragover", cardBtnTitleDragOver);
      cardBtnTitle.removeEventListener("dragenter", cardBtnTitleDragEnter);
      cardBtnTitle.removeEventListener("dragleave", cardBtnTitleDragLeave);
      cardBtnTitle.removeEventListener("dragend", cardBtnTitleDragEnd);
      // cardBtnTitle.removeEventListener("drop", cardBtnTitleDrop);

      // cardSpace.removeEventListener("dragover", cardSpaceDragOver);
      // cardSpace.removeEventListener("dragenter", cardSpaceDragEnter);

    }
  });

  const docDragEnter = (event) => {
    event.preventDefault();
  }
  const docDragOver = (event) => {
    event.preventDefault();
    // console.log("docDragOver, event.target:", event.target, "draggedCard.enterListIndex:", draggedCard.enterListIndex);

    // if(event.target.dataset.listIndex && event.target.dataset.notCard) {
    //   console.log("event.target.dataset.listIndex && event.target.dataset.notCard")
    //   const targetListIndex = event.target.dataset.listIndex;
    //   const targetBoardList = document.querySelector(`.flex-board-list.idx${targetListIndex}`);

    // }
    
    
  }
  const docHandleCardDrop = (event) => {
    event.preventDefault();
    console.log("docHandleCardDrop, currList:", lists[listIndex], "cardIndex:", cardIndex, "event.target:", event.target);

    // if(!event.target.className.includes("card-btn-title")) {
    //   const cardFillerIndex = lists[listIndex].cards.findIndex((card) => card.title === "filler");
    //   console.log("cardFillerIndex:", cardFillerIndex);
    //   dispatch({
    //     type: "DROP_DRAGGED_TO_FILLER",
    //     cardFillerIndex,
    //     currListIndex: listIndex
    //   });
    // } 

    event.target.style.background = "";
    
    const draggedListIndex = parseInt(event.dataTransfer.getData("draggedListIndex"), 10);
    const moveToListIndex = listIndex; 
    
    const targetListCardToIndex = {}
      const targetListCards = list.cards;
      targetListCards.forEach((card, index) => {
        if(index === cardIndex) {
          targetListCardToIndex[draggedCard.card.id] = index;
        } else {
          targetListCardToIndex[card.id] = index
        }
      }); 
    
    if(moveToListIndex === draggedListIndex) {
      dropDraggedCard({ 
        targetListCardToIndex,
        moveToListIndex, cardIndex, 
        // moveToCardIndex
      });
    } else {
      const draggedListCardToIndex = {};
      const draggedListCards = lists[draggedListIndex].cards;
      draggedListCards.forEach((card, index) => {
        if(index === draggedCard.origCardIndex) {
          return;
        }
        draggedListCardToIndex[card.id] = index;
      });

      dropDraggedCard({ 
        targetListCardToIndex, draggedListCardToIndex,
        moveToListIndex, cardIndex,
        // moveToCardIndex,
        draggedCardId: draggedCard.card.id,
        listId: list.id, draggedListId: lists[draggedListIndex].id,
        cardGoingToDiffList: true
      });
    }
    
    
    

    
  }
  useEffect(() => {
    // if(list.cards[cardIndex].title === "filler")
    if(card.title === "filler") {
      console.log("useEffect isFiller, adding eventListeners");
      document.addEventListener("dragenter", docDragEnter);
      document.addEventListener("dragover", docDragOver);
      document.addEventListener("drop", docHandleCardDrop);

      return function cleanUp() {
        document.removeEventListener("dragenter", docDragEnter);
        document.removeEventListener("dragover", docDragOver);
        document.removeEventListener("drop", docHandleCardDrop);
      }
    }
  })

  

  
  

  
  console.log('Card RENDER');

  
  return (
    <div className={`list${listIndex}-card-${cardIndex}`}>
      <div 
        className="card-btn-wrapper | mgn-l-05rem bg-clr-transparent"
        data-list-index={`${listIndex}`}
        data-card-index={`${cardIndex}`}
      >
        <button
          type="button"
          // className={`list${listIndex} card-${cardIndex} btn`}
          className={`card-btn-title list-${listIndex}-card-${cardIndex} | bdr-none br-025rem`}
          draggable="true"
          onClick={() => handleOpen(card)}
          data-list-index={`${listIndex}`}
          data-card-index={`${cardIndex}`}
        >
          {card.title}
        </button>

        <button
          type="button"
          className="card-btn-rmv | usr-slct"
          onClick={() => removeACard(list.id, card.id, board.id)}
        >
          &times;
        </button>
      </div>


      {
        open ?
        <div id="card-modal">
          <dialog id="card-modal-content" open={open ? "open" : null}>
            <div id="card-modal-close">
              <div id="card-modal-closeBtn">&times;</div>
            </div>
            <form onSubmit={(event) => submitCardDescription(card, event)}>
              <input
                className="card-title"
                type="text"
                value={cardTitle}
                onChange={handleCardTitle}
                autoFocus 
              >
              </input>

              <label htmlFor="card-description">Description:</label>
              <textarea 
                id="card-description"
                name="cardDescription"
                rows="5" cols="33"
                value={cardDescription}
                onChange={handleCardDescription}
                placeholder="Add a more detailed description..."
              >
              </textarea>

              <button
                type="submit"
              >
                Save Description
              </button>
            </form>
          </dialog>
        </div> : null
      }
        


      
    </div>
  )
}

const mapState = (state) => {
  return {
    lists: state.lists.lists,
    draggedCard: state.lists.draggedCard,
  }
}

const mapDispatch = (dispatch) => {
  return {
    updateCardDescription: (card, cardDescription, board) => dispatch(updateCardDescription(card, cardDescription, board)),
    removeACard: (listId, cardId, boardId) => dispatch(removeACard(listId, cardId, boardId)),
    moveCardToList: (moveCardsInfo) => dispatch(moveCardToList(moveCardsInfo)),
    dropDraggedCard: (dropInfo) => dispatch(dropDraggedCard(dropInfo)),
  }
}

export default connect(mapState, mapDispatch)(Card);