import axios from 'axios';


const GET_COMMENTS = "GET_COMMENTS";
const CREATE_COMMENT = "CREATE_COMMENT";
const UPDATE_COMMENT = "UPDATE_COMMENT";
const DELETE_COMMENT = "DELETE_COMMENT";

// const _getComments = (comments) => {
//   return {
//     type: GET_COMMENTS,
//     comments
//   }
// }

// const _createComment = (newComment) => {
//   return {
//     type: CREATE_COMMENT,
//     newComment
//   }
// }

// const _updateComment = () => {

// }

// export const getCardComments = (cardId) => {
//   return async(dispatch) => {
//     const { data: comments } = await axios({
//       method: 'get',
//       url: `/api/comments/cardId/${cardId}/comments`,
//     });
//     // console.log("getCardComments thunk, comments:", comments);

//     dispatch(_getComments(comments));
//   }
// }

// export const createCardComment = (cardId, userId, cardComment) => {
//   return async(dispatch) => {
//     const { data: newComment } = await axios({
//       method: 'post',
//       url: `/api/comments/cardId/${cardId}/userId/${userId}/newComment`,
//       data: {
//         content: cardComment
//       }
//     });
//     // console.log("createCardComment thunk, response:", newComment);

//     dispatch(_createComment(newComment))
//   }
// }

// export const updateCardComment = (commentId, cardComment) => {
//   return async(dispatch) => {
//     const { data: updatedComment } = await axios({
//       method: 'put',
//       url: `/api/comments/commentId/${commentId}`,
//       data: {
//         content: cardComment
//       }
//     });
//     console.log("updateCardComment thunk, response:", updatedComment);

//     //dispatch
//   }
// }

const inititalState = {
  comments: [],
  
}

export default function commentsReducer(state = inititalState, action) {
  switch(action.type) {
    case GET_COMMENTS: {
      return { ...state, comments: action.comments };
    }
    case CREATE_COMMENT: {
      const newComments = [ ...state.comments, action.newComment ];
      return { ...state, comments: newComments };
    }
    default: {
      return state;
    }
  }
}
