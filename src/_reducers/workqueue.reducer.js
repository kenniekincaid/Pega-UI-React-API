import { actionTypes } from "../_actions";

const initialWorkQueueState = {
  workList: [],
  workQueues: {}
};

/**
 * Redux reducers.
 * Used to update state in the store after actions are issued.
 */
export function workqueue(state = initialWorkQueueState, action) {
  switch (action.type) {
    case actionTypes.WORKLIST_SUCCESS:
      return {
        ...state,
        workList: action.worklist.pxResults
      };
    case actionTypes.WORKQUEUE_REQUEST:
      return state;
    case actionTypes.WORKQUEUE_SUCCESS:
      return {
        ...state,
        workQueues: {
          ...state.workQueues,
          [action.basketId]: action.workqueue.pxResults.reverse()
        }
      };
    case actionTypes.WORKQUEUE_FAILURE:
      return state;
    default:
      return state;
  }
}
