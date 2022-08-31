import React, { useState, useEffect } from 'react';
import {connect} from 'react-redux';
import { createCardAndAddToList, moveCardToList } from '../store/lists';


const AddACard = (props) => {
  // console.log("AddACard, beginning");
  const {
    list, listIndex, user, board,
    createCardAndAddToList, moveCardToList,
  } = props;
  
  const [cardTitle, setCardTitle] = useState('');
  const handleCardTitle = (event) => {
    setCardTitle(event.target.value);
  }

  const [addCard, setAddCard] = useState(false);
  const handleAddCard = () => {
    setAddCard((prev) => !prev);
    //Add a new card to the list, title only
    if(cardTitle !== '') {
      // console.log('cardTitle not empty');
      createCardAndAddToList(list, cardTitle, user, board);
    } 
  }

  useEffect(() => {
    if(addCard) {
      // console.log("addCard true");
      const addCardTxtField = document.querySelector(".add-card.txt-field");

      const closeAddCard = (event) => {
        const clickedElem = event.target;
        // console.log("closeAddCard, event.target:", clickedElem);
        
        if(clickedElem !== addCardTxtField) {
          // console.log("JUST BEFORE REMOVING WINDOW EVENTLISTENER");
          window.removeEventListener("click", closeAddCard);
          setAddCard(false);
        }
      }

      window.addEventListener("click", closeAddCard);
    } else {
      setCardTitle("");
    }
  }, [addCard]);

  const addACardBtnDragOver = (event) => {
    event.preventDefault();
    
  }
  // const addACardBtnDragEnter = (event) => {
  //   event.preventDefault();
  //   event.dataTransfer.dropEffect = "move";
  // }
  // const addACardBtnDrop = (event) => {
  //   const draggedCardId = event.dataTransfer.getData("draggedCardId");
  //   moveCardToList(list.id, draggedCardId, board.id);

  //   event.preventDefault();
  // }
  // useEffect(() => {
  //   const addACardBtn = document.querySelector(`#list${listIndex}`);
  //   addACardBtn.addEventListener("dragover", addACardBtnDragOver);
  //   addACardBtn.addEventListener("dragenter", addACardBtnDragEnter);
  //   addACardBtn.addEventListener("drop", addACardBtnDrop);
  // }, []);


  // console.log('AddACard, cardTitle:', cardTitle);


  if(!addCard) {
    return (
      <div
        id={`list${listIndex}`}
        data-list-index={`${listIndex}`}
        data-not-card={"1"}
      >
        <button
          className={`list${listIndex} add-a-card btn`}
          type="button"
          onClick={handleAddCard}
          data-list-index={`${listIndex}`}
          data-not-card={"1"}
        >
          Add a card
        </button>
      </div>
    )
  }


  return (
    <div>
      <textarea
        className="add-card txt-field"
        value={cardTitle}
        onChange={handleCardTitle}
        placeholder="Enter a title for this card..."
      >
      </textarea>
      <div>
        <button type="button" onClick={handleAddCard}>Add a card</button>
      </div>
      
    </div>
  )
}

const mapDispatch = (dispatch) => {
  return {
    createCardAndAddToList: (list, cardTitle, user, board) => dispatch(createCardAndAddToList(list, cardTitle, user, board)),
    moveCardToList: (listId, cardId, boardId) => dispatch(moveCardToList(listId, cardId, boardId)),
  }
}

export default connect(null, mapDispatch)(AddACard);