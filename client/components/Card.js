import React, { useState, useEffect, useCallback } from 'react';
import {connect, useDispatch} from 'react-redux';
import { 
  dropDraggedCard, updateCardTitle
} from '../store/lists';
import CardModal from './CardModal';
import CardSideMenu from './CardSideMenu';


const Card = (props) => {
  const {
    card, draggedCard, cardIndex, list, listIndex, lists, listsState,
    board, 
    dropDraggedCard, updateCardTitle
  } = props;
  const dispatch = useDispatch();

  const [openCard, setOpenCard] = useState(false);
  const handleOpenCard = (event) => {
    // console.log('handleOpenCard, card', card);import axios from 'axios';
    setOpenCard(true);
  }


  // Drag and drop cards section
  const cardBtnTitleDragStart = (event) => {
    // console.log("Card dragStartHandler");

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
      
      // listIndex,
      // cardIndex,
    });


  }

  const cardBtnTitleDrag = (event) => {
    console.log("cardBtnTitleDrag");
  
    if(lists[listIndex].cards[cardIndex].id !== "filler") {
      console.log("cardBtnTitleDrag, dispatching DRAGGING_SET_FILLER");
      dispatch({
        type:"DRAGGING_SET_FILLER",
        listIndex,
        cardIndex,
        // fillerIndex: cardIndex
      })
    }

    const cardBtnTitle = document.querySelector(`.filler`);
    cardBtnTitle.style.backgroundColor = "#A5AEB6";
    
  }

  const cardBtnTitleDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    // console.log("cardBtnTitleDragOver event.target:", event.target); // what you're dragging over
    

    const eventClientHeight = parseInt(event.target.clientHeight, 10);
    const dropTargetListIndex = listIndex;
    // console.log("cardBtnTitleDragOver leaveListIndex:", draggedCard.leaveListIndex, "event.offsetY:", event.offsetY, "cardIndex:", cardIndex, "eventClientHeight:", eventClientHeight);
    if(draggedCard.leaveListIndex !== dropTargetListIndex) {
      // console.log("draggedCard.leaveListIndex !== dropTargetListIndex");
      
      if(list.cards[0].id === "filler" && list.cards.length === 1) {
        console.log("list.cards.length === 1 && list.cards[0].id === filler")
        return;
      }

      if( (event.offsetY <= Math.floor(eventClientHeight/2) )  ) {
        // console.log(`event.offsetY <= eventClientHeight/2 UP_DIFF_LIST, event.target:`, event.target);
        
        dispatch({ 
          type: "DRAG_OVER_CARDS_UP_DIFF_LIST",
          dropTargetCardIndex: cardIndex,
          dropTargetListIndex: listIndex
        })
        
        const cardBtnTitle = document.querySelector(`.filler`);
        cardBtnTitle.style.backgroundColor = "#A5AEB6";
      } else if( (event.offsetY > Math.floor(eventClientHeight/2) )  ) {
        // console.log(`event.offsetY > Math.floor(eventClientHeight/2) DOWN_DIFF_LIST`);
        
        dispatch({ 
          type: "DRAG_OVER_CARDS_DOWN_DIFF_LIST",
          dropTargetCardIndex: cardIndex,
          dropTargetListIndex: listIndex
        })
        
        const cardBtnTitle = document.querySelector(`.filler`);
        cardBtnTitle.style.backgroundColor = "#A5AEB6";
      }

    } else {
      // if(draggedCard.card.listId === list.cards[cardIndex].listId) {
      // console.log(`draggedCard.leaveListIndex ${draggedCard.leaveListIndex} === dropTargetListIndex ${dropTargetListIndex}`);
      if( (event.offsetY <= Math.floor(eventClientHeight/2) ) && (draggedCard.leaveCardIndex > cardIndex) ) {
        // console.log(`event.offsetY <= eventClientHeight/2 && (draggedCard.leaveCardIndex > cardIndex)`);
        // console.log("cardBtnTitleDragOver before DRAG_OVER_CARDS_UP, cards:", lists[listIndex].cards)
        
        dispatch({ 
          type: "DRAG_OVER_CARDS_UP",
          dropTargetCardIndex: cardIndex,
          dropTargetListIndex: listIndex
        });
        
        const cardBtnTitle = document.querySelector(`.card-btn-title.list-${listIndex}-card-${cardIndex}`);
        cardBtnTitle.style.backgroundColor = "#A5AEB6";
        
      } else if( (event.offsetY > Math.floor(eventClientHeight/2) ) && (draggedCard.leaveCardIndex < cardIndex) ) {
        // console.log(`event.offsetY > Math.floor(eventClientHeight/2) && (draggedCard.leaveCardIndex < cardIndex)`);
        dispatch({ 
          type: "DRAG_OVER_CARDS_DOWN",
          dropTargetCardIndex: cardIndex,
          dropTargetListIndex: listIndex
        })

        const cardBtnTitle = document.querySelector(`.card-btn-title.list-${listIndex}-card-${cardIndex}`);
        cardBtnTitle.style.backgroundColor = "#A5AEB6";

      } 
      // else if(listsState.fillerIndex !== null) {
      //   console.log("REMOVING FILLERS FROM DRAG DIFF LIST");
      //   dispatch({
      //     type: "DRAG_IN_OUT_RMV_FILLER",
      //     listIndex
      //   })
      // }
    }
    
  }

  const cardBtnTitleDragEnter = (event) => {
    event.preventDefault();
    // console.log("cardBtnTitleDragEnter event.target:", event.target);
    
    dispatch({ 
      type: "UPDATE_ENTER_LIST_INDEX",
      enterListIndex: listIndex,
      
    });
    
    if(listIndex !== draggedCard.leaveListIndex) {
      dispatch({ type: "ENTER_DIFF_LIST_REMOVE_FILLER" })
    }
    
  }
  
  const cardBtnTitleDragLeave = (event) => {
    // console.log("cardBtnTitleDragLeave, event.target:", event.target);
    
    dispatch({
      type: "UPDATE_DRAGGED_LEAVE_INDEXES",
      leaveCardIndex: cardIndex,
      leaveListIndex: listIndex,
      
    });

  }

  // const cardBtnTitleDragEnd = (event) => {
  //   console.log("cardBtnTitleDragEnd");
  //   // setDraggedCardSpace(false);
  //   // event.target.style.opacity = "";
  // }

  useEffect(() => {
    const cardBtnTitle = document.querySelector(`.card-btn-title.list-${listIndex}-card-${cardIndex}`);
    cardBtnTitle.addEventListener("dragstart", cardBtnTitleDragStart);
    cardBtnTitle.addEventListener("drag", cardBtnTitleDrag);
    cardBtnTitle.addEventListener("dragover", cardBtnTitleDragOver);
    cardBtnTitle.addEventListener("dragenter", cardBtnTitleDragEnter);
    cardBtnTitle.addEventListener("dragleave", cardBtnTitleDragLeave);
    // cardBtnTitle.addEventListener("dragend", cardBtnTitleDragEnd);
    // cardBtnTitle.addEventListener("drop", cardBtnTitleDrop);

    return function cleanUp() {
      cardBtnTitle.removeEventListener("dragstart", cardBtnTitleDragStart);
      cardBtnTitle.removeEventListener("drag", cardBtnTitleDrag);
      cardBtnTitle.removeEventListener("dragover", cardBtnTitleDragOver);
      cardBtnTitle.removeEventListener("dragenter", cardBtnTitleDragEnter);
      cardBtnTitle.removeEventListener("dragleave", cardBtnTitleDragLeave);
      // cardBtnTitle.removeEventListener("dragend", cardBtnTitleDragEnd);
      // cardBtnTitle.removeEventListener("drop", cardBtnTitleDrop);

    }
  });

  const docDragEnter = (event) => {
    event.preventDefault();
    // console.log("docDragEnter, event.target:", event.target);
  }
  const docDragOver = (event) => {
    event.preventDefault();
    // console.log("docDragOver, event.target:", event.target, "draggedCard.enterListIndex:", draggedCard.enterListIndex);

  }
  const docHandleCardDrop = (event) => {
    event.preventDefault();
    console.log("docHandleCardDrop, event.target:", event.target);

    

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
    if(card.title === "") {
      // console.log("useEffect isFiller, adding eventListeners");
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
  // End of drag and drop cards section
  
  const [openSideMenu, setOpenSideMenu] = useState(false);
  const handleCardSideMenu = (event) => {
    event.stopPropagation();
    setOpenSideMenu(true);
    
  }

  const [cardTitle, setCardTitle] = useState(card.title);
  const handleCardTitle = (event) => {
    setCardTitle(event.target.value);
  }

  const submitCardTitle = async(event) => {
    event.preventDefault();

    updateCardTitle(card.id, cardTitle, listIndex);
    setOpenSideMenu(false);
  }

  useEffect(() => {
    if(openSideMenu) {
      const cardBtnTitleHeight = document.querySelector(`.card-btn-title.list-${listIndex}-card-${cardIndex}`).offsetHeight;
      const cardBtnTitleWidth = document.querySelector(`.card-btn-title.list-${listIndex}-card-${cardIndex}`).offsetWidth;

      const bdrAndPdg = 4;
      const initialTxtareaHeight = 38;
      const cardBtnTxtarea = document.querySelector(".card-btn-txtarea");
      if(parseInt(cardBtnTitleHeight, 10) + bdrAndPdg === initialTxtareaHeight) {
        cardBtnTxtarea.style.height = `${parseInt(cardBtnTitleHeight, 10) * 3 + bdrAndPdg}px`;
      } else {
        cardBtnTxtarea.style.height = `${parseInt(cardBtnTitleHeight, 10) + bdrAndPdg}px`;
      }

      // cardBtnTxtarea.style.height = `${parseInt(cardBtnTitleHeight, 10) }px`;
      
      cardBtnTxtarea.style.width = cardBtnTitleWidth + "px";

      cardBtnTxtarea.focus();
      cardBtnTxtarea.setSelectionRange(cardBtnTxtarea.textLength + 1, cardBtnTxtarea.textLength);

    }
  }, [openSideMenu])

  const autoResizeTxtArea = (event) => {
    const txtArea = event.target;
    const offset = txtArea.offsetHeight - txtArea.clientHeight;
    const defaultHeight = 106; // cardBtnTitleHeight * 3 + bdrAndPdg

    if(parseInt(txtArea.scrollHeight, 10) + offset !== defaultHeight) {
      txtArea.style.height = 'auto';
    } else {
      return;
    }
    
    txtArea.style.height = txtArea.scrollHeight + offset + 'px';

  }


  // console.log('Card RENDER');
  
  return (
    <div className={`card-btn-wrapper list${listIndex}-card-${cardIndex}`}>
      <CardSideMenu
        openSideMenu={openSideMenu} setOpenSideMenu={setOpenSideMenu}
        setCardTitle={setCardTitle} currList={list} currBoard={board}
        currCard={card} cardIndex={cardIndex} currLists={lists}
      />
      
      {
        openSideMenu ?
        <div className="card-btn-edit-title | mgn-l-05rem">
          <textarea 
            className="card-btn-txtarea | br-025rem"
            value={cardTitle}
            onChange={handleCardTitle}
            onKeyDown={autoResizeTxtArea}
          >
          </textarea>
          <div>
            <button
              className="card-btn-submit-btn | bdr-none br-025rem pdg-4x8px fnt-sz-14px"
              onClick={submitCardTitle}
            >
              Save
            </button>
          </div>
          
        </div> : null
      }

      {      
        card.title !== "" ? 
        <div
          className={`card-btn-title list-${listIndex}-card-${cardIndex} | mgn-l-05rem bdr-none br-025rem  `}
          draggable="true"
          onClick={handleOpenCard}
          data-list-index={`${listIndex}`}
          data-card-index={`${cardIndex}`}
        >
          <p className="card-btn-title-txt">{card.title}</p>
          
          
          <div className="card-btn-rmv-wrapper">
            <button
              type="button"
              className="card-btn-rmv | bdr-none br-025rem bg-clr-transparent usr-slct"
              onClick={handleCardSideMenu}
            >
            </button>
            
          </div>
        </div> :
        <div
          className={`card-btn-title list-${listIndex}-card-${cardIndex} filler | mgn-l-05rem bdr-none br-025rem  `}
          draggable="true"
          data-list-index={`${listIndex}`}
          data-card-index={`${cardIndex}`}
        >
          {card.title}
          
          <div className="card-btn-rmv-wrapper | ">
            <button
              type="button"
              className="card-btn-rmv | bdr-none br-025rem bg-clr-transparent usr-slct"
            >
            
            </button>
          </div>    
        </div>

      }

      <CardModal 
        card={card} openCard={openCard} setOpenCard={setOpenCard}
        board={board} list={list} listIndex={listIndex}
      />

            
    </div>
  )
}

const mapState = (state) => {
  return {
    lists: state.lists.lists,
    draggedCard: state.lists.draggedCard,
    listsState: state.lists,
  }
}

const mapDispatch = (dispatch) => {
  return {
    dropDraggedCard: (dropInfo) => dispatch(dropDraggedCard(dropInfo)),
    updateCardTitle: (cardId, cardTitle, listIndex) => dispatch(updateCardTitle(cardId, cardTitle, listIndex)),
  }
}

export default connect(mapState, mapDispatch)(Card);