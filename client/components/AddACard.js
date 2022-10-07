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
    // console.log("handleAddCard");
    setAddCard((prev) => !prev);
    
    if(cardTitle !== '') {
      // console.log('cardTitle not empty');
      createCardAndAddToList(list, cardTitle, user, board);
    } 
  }

  const closeAddCard = (event) => {
    const clickedElem = event.target;
    // console.log("closeAddCard, event.target:", clickedElem);
    
    const addCardTxtField = document.querySelector(".add-card-txt-area");
    if(clickedElem !== addCardTxtField) {
      setAddCard(false);
    }
  }

  useEffect(() => {
    if(addCard) {
      document.addEventListener("click", closeAddCard);
    } 
    else {
      setCardTitle("");
    }

    return function cleanUp() {
      document.removeEventListener("click", closeAddCard);
    }
  }, [addCard]);

  
  const autoGrowTxtArea = (event) => {
    const txtAreaElem = event.target;
    if(txtAreaElem.scrollHeight > txtAreaElem.clientHeight) {
      txtAreaElem.style.height = `${txtAreaElem.scrollHeight}px`;
    } else if(txtAreaElem.scrollHeight === txtAreaElem.clientHeight) {
      const currHeight = parseInt(txtAreaElem.style.height, 10);
      txtAreaElem.style.height = `calc(${currHeight}px - 1.5em)`;
    }

    
  }

  // console.log('AddACard, cardTitle:', cardTitle);


  if(!addCard) {
    return (
      <div
        id={`list${listIndex}`}
        data-list-index={`${listIndex}`}
        data-not-card={"1"}
      >
        <button
          className="add-card-btn | mgn-l-05rem usr-slct"
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
        className="add-card-txt-area mgn-l-05rem"
        value={cardTitle}
        onChange={handleCardTitle}
        placeholder="Enter a title for this card..."
        onKeyDown={autoGrowTxtArea}
      >
      </textarea>
      <div>
        <button
          type="button"
          className="add-card-btn mgn-l-05rem"
          onClick={handleAddCard}
        >
          Add a card
        </button>
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