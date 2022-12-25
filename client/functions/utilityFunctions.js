import React from 'react';
import axios from 'axios';

// Used in: CardUserComment.js
export const parseComment = (strToParse) => {
  let str = strToParse;
  const parsedStrs = [];
  let currStr = "";
  let count = 0;
  let atSign = 0;

  for(let i = 0; i < str.length; i++) {
    if(str[i] == " ") {
      if(count >= 3 && currStr[0] === "@") {
        parsedStrs.push(
          (
            <span key={i} className="card-user-comment-at | br-05rem">
              {currStr}
            </span>
          )
        );
      } else {
        parsedStrs.push(currStr);
      }
      
      parsedStrs.push(" ");
      atSign = 0;
      currStr = "";
      continue;
    } else if(str[i] === "@") {
      atSign += 1;
      if(atSign > 1) {
        if(count >= 3 && currStr[0] === "@") {
          parsedStrs.push(
            (
              <span key={i} className="card-user-comment-at | br-05rem">
                {currStr}
              </span>
            )
          );
        } else {
          parsedStrs.push(currStr);
        }

        currStr = "";
      }
    } 

    currStr += str[i];
    if(atSign) {
      count++;
    }
    // console.log("currStr:", currStr);
  }

  // To take care of the last currStr
  if(atSign >= 1) {
    if(count >= 3 && currStr[0] === "@") {
      parsedStrs.push(
        (
          <span key={i} className="card-user-comment-at | br-05rem">
            {currStr}
          </span>
        )
      );
    } else {
      parsedStrs.push(currStr);
    }
  } else {
    parsedStrs.push(currStr);
  }
  
  // console.log("str:", str);
  // console.log("parsedStrs:", parsedStrs);

  return parsedStrs;
}

// Get lists of a board, doesn't change redux state
export const getLists = async(boardId) => {
  const { data: lists } = await axios({
    method: 'get',
    url: `/api/lists/boardId/${boardId}`,
  });
  // console.log("cardSideMenu getLists:", lists)
  return lists;
}