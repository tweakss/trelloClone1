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

  useEffect(() => {
    if(newList) {
      const addListTxtField = document.querySelector(".add-list.txt-field");
      const addListButton = document.querySelector(".add-list.btn");

      const closeAddList = (event) => {
        const clickedElem = event.target;
        // console.log("closeAddList, event.target:", clickedElem);
        
        if(clickedElem !== addListTxtField) {
          // console.log("clickedElem !== addListTxtField");
          window.removeEventListener("click", closeAddList);
          setNewList(false);
        }
      }

      window.addEventListener("click", closeAddList);
    } else {
      setListTitle("");
    }
  }, [newList])

  

  // console.log('AddAList, newList:', newList);

  return (
    <div>
      {
        newList ?
        <div>
          <input
            className="add-list txt-field"
            type="text"
            value={listTitle}
            onChange={handleListTitle}>
          </input>
          <div>
            <button type="button" onClick={handleCreateNewList}>Add list</button>
            <button type="button" onClick={handleNewList}>x</button>
          </div>
        </div> :
        <button
          className="add-list btn"
          type="button"
          onClick={handleNewList}
        >
          Add another list
        </button>
        
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