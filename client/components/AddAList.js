import React, { useState, useEffect } from 'react';
import {connect} from 'react-redux';
import { createNewList } from '../store/lists';


export const AddAList = (props) => {
  const {
    createNewList,
  } = props;
  const board = props.board.board;

  const [newList, setNewList] = useState(false);
  const handleNewList = () => {
    setNewList((prev) => !prev);
  }

  const [listTitle, setListTitle] = useState('');
  const handleListTitle = (event) => {
    setListTitle(event.target.value);
  }

  const handleCreateNewList = () => {
    createNewList(board, listTitle);
    setListTitle('');
  }

  const closeAddList = (event) => {
    const clickedElem = event.target;
    // console.log("closeAddList, event.target:", clickedElem);
    const addListTxtField = document.querySelector(".add-list-input");
    
    if(clickedElem !== addListTxtField) {
      // console.log("clickedElem !== addListTxtField");
      // document.removeEventListener("click", closeAddList);
      setNewList(false);
    }
  }

  useEffect(() => {
    if(newList) {
      document.addEventListener("click", closeAddList);
    } else {
      setListTitle("");
    }

    return function cleanUp() {
      document.removeEventListener("click", closeAddList);
    }
  }, [newList])

  

  // console.log('AddAList, newList:', newList);

  return (
    <div>
      {
        newList ?
        <div className="add-list-wrapper newlist mgn-l-05rem">
          <input
            className="add-list-input"
            type="text"
            value={listTitle}
            onChange={handleListTitle}>
          </input>
          <div>
            <button type="button" onClick={handleCreateNewList}>Add list</button>
            <button type="button" onClick={handleNewList}>x</button>
          </div>
        </div> :
        <div className="add-list-wrapper mgn-l-05rem">
          <button
            className="add-list btn | usr-slct"
            type="button"
            onClick={handleNewList}
          >
            Add another list
          </button>
        </div>
      }
      
    </div>
    
  )
}

const mapState = (state) => {
  return {
    board: state.board,
  }
}

const mapDispatch = (dispatch) => {
  return {
    createNewList: (board, listTitle) => dispatch(createNewList(board, listTitle))
  }
}

export default connect(mapState, mapDispatch)(AddAList);